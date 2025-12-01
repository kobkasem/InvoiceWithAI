# ✅ Signature Detection by AI

## How It Works

The AI automatically detects signatures in two sections:

1. **Received By Signature** - AI checks "RECEIVED BY" section for handwriting
2. **Delivered By Signature** - AI checks "DELIVERED BY" section for handwriting

The AI will return:
- **"Yes"** - If handwriting/signature is clearly detected
- **"No"** - If no signature or only printed text

The **"Has Signatures"** field is automatically set to **"Yes"** if **either** signature is detected.

---

## Frontend Display

### Invoice Upload (AI Extraction)
- Fields are **read-only** - showing what AI detected
- "Received By Signature (AI Detected)" - displays Yes/No
- "Delivered By Signature (AI Detected)" - displays Yes/No
- "Has Signatures (Auto)" - automatically computed

### Manual Entry
- You can manually enter "Yes" or "No" for each signature field
- "Has Signatures" auto-updates based on your input

---

## AI Prompt Instructions

The AI is instructed to:
1. Look VERY CAREFULLY for handwriting/signature
2. Distinguish between handwritten signatures and printed text
3. Return "Yes" only if signature is clearly visible
4. Return "No" if absent or only printed text

---

## Database Fields

- `received_by_signature` - VARCHAR(10) - "Yes" or "No"
- `delivered_by_signature` - VARCHAR(10) - "Yes" or "No"
- `has_signatures` - VARCHAR(10) - "Yes" if either is "Yes", otherwise "No"

---

## Example

If invoice has:
- ✅ Signature in "RECEIVED BY" section
- ❌ No signature in "DELIVERED BY" section

Result:
- `received_by_signature` = "Yes"
- `delivered_by_signature` = "No"
- `has_signatures` = "Yes" (because received_by_signature is "Yes")

---

## Testing

1. Upload an invoice with signatures
2. AI will automatically detect and set:
   - Received By Signature: Yes/No
   - Delivered By Signature: Yes/No
   - Has Signatures: Auto-computed

Done! 🎉



