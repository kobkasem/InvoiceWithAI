const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function extractInvoiceData(filePath, fileType, promptText) {
  try {
    let imageBase64;
    let isPdf = false;

    if (fileType === "image") {
      // Read image file and convert to base64
      const imageBuffer = fs.readFileSync(filePath);
      imageBase64 = imageBuffer.toString("base64");
    } else if (fileType === "pdf") {
      // For PDF, try to extract text first
      // Note: GPT-4 Vision can handle PDFs, but for better results,
      // you might want to convert PDF pages to images using pdf2pic
      try {
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);

        // If PDF has text, we can try text extraction
        // But for vision API, we need to convert to image
        // For now, return an error suggesting image conversion
        throw new Error(
          "PDF files need to be converted to images for best results. Please convert your PDF to an image (PNG/JPEG) and upload that instead. Alternatively, use manual entry."
        );
      } catch (pdfError) {
        throw new Error(
          "PDF processing requires image conversion. Please convert PDF to image format (PNG/JPEG) or use manual entry."
        );
      }
    }

    // Parse prompt text (should be JSON)
    let promptInstructions;
    try {
      const promptData =
        typeof promptText === "string" ? JSON.parse(promptText) : promptText;
      promptInstructions = promptData.instructions || promptText;
    } catch (e) {
      promptInstructions = promptText;
    }

    // Call OpenAI Vision API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: promptInstructions,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      max_tokens: 3000,
      response_format: { type: "json_object" },
    });

    const extractedText = response.choices[0].message.content;

    // Try to parse JSON from response
    let extractedData;
    try {
      // Try to extract JSON from the response (handle markdown code blocks)
      let jsonString = extractedText.trim();

      // Remove markdown code blocks if present
      if (jsonString.startsWith("```json")) {
        jsonString = jsonString
          .replace(/^```json\s*/, "")
          .replace(/\s*```$/, "");
      } else if (jsonString.startsWith("```")) {
        jsonString = jsonString.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }

      // Try to find JSON object in the text
      const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0]);
      } else {
        extractedData = JSON.parse(jsonString);
      }

      // Ensure all required fields exist
      const requiredFields = [
        "e_tax_status",
        "invoice_number",
        "cust_code",
        "pages",
        "currency",
        "payment_method",
        "net_total",
        "delivery_instructions",
        "payment_received_by",
        "has_signatures",
      ];

      // Initialize missing fields with empty strings
      for (const field of requiredFields) {
        if (!(field in extractedData)) {
          extractedData[field] = "";
        }
      }

      // Remove corner_number if it exists (we don't use it anymore)
      if ("corner_number" in extractedData) {
        delete extractedData.corner_number;
      }
    } catch (e) {
      console.error("JSON parsing error:", e);
      console.error("Raw response:", extractedText);
      // If parsing fails, create structured object from text
      extractedData = parseTextToJson(extractedText);
    }

    return {
      success: true,
      data: extractedData,
      raw_response: extractedText,
    };
  } catch (error) {
    console.error("AI extraction error:", error);
    return {
      success: false,
      error: error.message,
      data: null,
    };
  }
}

function parseTextToJson(text) {
  // Try to extract key-value pairs from text
  const data = {};
  const lines = text.split("\n");

  for (const line of lines) {
    const match = line.match(/([^:：]+)[:：]\s*(.+)/);
    if (match) {
      const key = match[1].trim().toLowerCase().replace(/\s+/g, "_");
      const value = match[2].trim();
      data[key] = value;
    }
  }

  // Map common fields
  const fieldMapping = {
    e_tax_status: ["e-tax", "e_tax", "etax"],
    invoice_number: ["invoice number", "invoice_no", "invoice"],
    cust_code: ["cust code", "customer code", "cust_code"],
    pages: ["pages", "page"],
    currency: ["currency"],
    payment_method: ["payment method", "payment_method"],
    net_total: ["net total", "total", "net_total", "amount"],
    delivery_instructions: ["delivery instructions", "delivery"],
    payment_received_by: ["payment received by", "payment_received"],
    has_signatures: ["signatures", "signature", "has_signatures"],
  };

  const result = {};
  for (const [standardKey, variations] of Object.entries(fieldMapping)) {
    for (const [key, value] of Object.entries(data)) {
      if (variations.some((v) => key.includes(v))) {
        result[standardKey] = value;
        break;
      }
    }
  }

  return result;
}

module.exports = { extractInvoiceData };
