/*
  This code sample shows Prebuilt Receipt operations with the Azure AI Document Intelligence client library. 

  To learn more, please visit the documentation - Quickstart: Document Intelligence (formerly Form Recognizer) SDKs
  https://learn.microsoft.com/azure/ai-services/document-intelligence/quickstarts/get-started-sdks-rest-api?pivots=programming-language-javascript
*/

"use server";

const DocumentIntelligence =
    require("@azure-rest/ai-document-intelligence").default,
  {
    getLongRunningPoller,
    isUnexpected,
  } = require("@azure-rest/ai-document-intelligence");

/*
  Remember to remove the key from your code when you're done, and never post it publicly. For production, use
  secure methods to store and access your credentials. For more information, see 
  https://docs.microsoft.com/en-us/azure/cognitive-services/cognitive-services-security?tabs=command-line%2Ccsharp#environment-variables-and-application-configuration
*/
const key = process.env.OCR_API_KEY;
const endpoint = process.env.OCR_ENDPOINT;

export async function ocrProvider(imageData: Buffer | Blob | File) {
  console.log("OCR Sample");
  const client = DocumentIntelligence(endpoint, { key: key });

  // Convert input to base64
  let base64Source: string;
  if (imageData instanceof File || imageData instanceof Blob) {
    const buffer = await imageData.arrayBuffer();
    base64Source = Buffer.from(buffer).toString("base64");
  } else if (imageData == null) {
    throw new Error("Image is null");
  } else {
    throw new Error("Invalid input type");
  }

  const initialResponse = await client
    .path("/documentModels/{modelId}:analyze", "prebuilt-receipt")
    .post({
      contentType: "application/json",
      body: {
        base64Source,
      },
    });

  if (isUnexpected(initialResponse)) {
    throw initialResponse.body.error;
  }

  const poller = getLongRunningPoller(client, initialResponse);
  const analyzeResult = (await poller.pollUntilDone()).body.analyzeResult;

  const documents = analyzeResult?.documents;
  const result = documents && documents[0];

  if (result) {
    const MerchantName = result.fields.MerchantName;
    const Items = result.fields.Items;
    const Total = result.fields.Total;
    console.log("=== Receipt Information ===");
    console.log("Type:", result.docType);
    console.log("Merchant:", MerchantName && MerchantName.valueString);

    console.log("Items:");
    for (const { valueObject: item } of (Items && Items.valueArray) || []) {
      const Description = item.Description;
      const TotalPrice = item.TotalPrice;

      console.log("- Description:", Description && Description.valueString);
      console.log(
        "  Total Price:",
        TotalPrice && TotalPrice.valueCurrency.amount
      );
    }

    console.log("Total:", Total && Total.valueCurrency.amount);
  } else {
    throw new Error("Expected at least one receipt in the result.");
  }
}

export async function ocrSample() {
  console.log("OCR Sample");
  const receiptURL =
    "https://raw.githubusercontent.com/Azure/azure-sdk-for-python/main/sdk/formrecognizer/azure-ai-formrecognizer/tests/sample_forms/receipt/contoso-receipt.png";
  const client = DocumentIntelligence(endpoint, { key: key });
  const initialResponse = await client
    .path("/documentModels/{modelId}:analyze", "prebuilt-receipt")
    .post({
      contentType: "application/json",
      body: {
        urlSource: receiptURL,
      },
    });

  if (isUnexpected(initialResponse)) {
    throw initialResponse.body.error;
  }

  const poller = getLongRunningPoller(client, initialResponse);
  const analyzeResult = (await poller.pollUntilDone()).body.analyzeResult;

  const documents = analyzeResult?.documents;
  const result = documents && documents[0];

  if (result) {
    const MerchantName = result.fields.MerchantName;
    const Items = result.fields.Items;
    const Total = result.fields.Total;
    console.log("=== Receipt Information ===");
    console.log("Type:", result.docType);
    console.log("Merchant:", MerchantName && MerchantName.valueString);

    console.log("Items:");
    for (const { valueObject: item } of (Items && Items.valueArray) || []) {
      const Description = item.Description;
      const TotalPrice = item.TotalPrice;

      console.log("- Description:", Description && Description.valueString);
      console.log(
        "  Total Price:",
        TotalPrice && TotalPrice.valueCurrency.amount
      );
    }

    console.log("Total:", Total && Total.valueCurrency.amount);
  } else {
    throw new Error("Expected at least one receipt in the result.");
  }
}

// main().catch((err) => {
//   console.error("The sample encountered an error:", err);
// });
