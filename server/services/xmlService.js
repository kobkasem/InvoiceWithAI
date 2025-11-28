const { Builder } = require("xml2js");

function buildXml(data) {
  const builder = new Builder({
    xmldec: { version: "1.0", encoding: "UTF-8" },
    renderOpts: { pretty: true, indent: "  ", newline: "\n" },
  });

  const xmlObject = {
    invoice: {
      e_tax_status: data.e_tax_status || "",
      invoice_number: data.invoice_number || "",
      cust_code: data.cust_code || "",
      pages: data.pages || "",
      currency: data.currency || "",
      payment_method: data.payment_method || "",
      net_total: data.net_total || "",
      delivery_instructions: data.delivery_instructions || "",
      payment_received_by: data.payment_received_by || "",
      has_signatures: data.has_signatures || "",
    },
  };

  return builder.buildObject(xmlObject);
}

module.exports = { buildXml };
