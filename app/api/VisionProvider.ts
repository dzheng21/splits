"use server";

import axios from "axios";
import { receiptExtractionPrompt } from "./utils";

interface ApiResponse {
  choices?: { message?: { content?: string } }[];
}

// function parseGpt4oResponse(apiResponse: ApiResponse) {
//   try {
//     const content = apiResponse?.choices?.[0]?.message?.content;
//     if (!content) {
//       console.log("No content in GPT-4 response");
//       return null;
//     }

//     // If content is just a simple string without JSON markers, return it as is
//     if (!content.includes("{")) {
//       return content;
//     }

//     // Try to extract JSON content, handling both markdown-fenced and raw JSON
//     let jsonContent = content;
//     if (content.includes("```")) {
//       jsonContent = content.replace(/```json|```/g, "").trim();
//     }

//     // Clean up any trailing truncated properties
//     jsonContent = jsonContent.replace(/,\s*"[^"]*"\s*$/, ""); // Remove incomplete last property
//     jsonContent = jsonContent.replace(/,\s*$/, ""); // Remove trailing comma

//     // Ensure the JSON is properly closed
//     let depth = 0;
//     let inString = false;
//     let escape = false;

//     for (let i = 0; i < jsonContent.length; i++) {
//       const char = jsonContent[i];
//       if (escape) {
//         escape = false;
//         continue;
//       }
//       if (char === "\\") {
//         escape = true;
//         continue;
//       }
//       if (char === '"' && !escape) {
//         inString = !inString;
//         continue;
//       }
//       if (!inString) {
//         if (char === "{" || char === "[") depth++;
//         if (char === "}" || char === "]") depth--;
//       }
//     }

//     // Close any unclosed brackets/braces
//     while (depth > 0) {
//       jsonContent += "}";
//       depth--;
//     }

//     try {
//       const parsed = JSON.parse(jsonContent);
//       return parsed;
//     } catch (parseError) {
//       console.log(
//         "Failed to parse as JSON, checking if it's a partial valid response"
//       );

//       // If we have line_items or vendor_info, it might be a valid partial response
//       if (
//         jsonContent.includes('"line_items"') ||
//         jsonContent.includes('"vendor_info"')
//       ) {
//         try {
//           // Try to extract just the valid part up to the last complete item
//           const validPart = jsonContent.replace(/,\s*[^,}]*$/, "}");
//           const parsed = JSON.parse(validPart);
//           if (parsed.line_items || parsed.vendor_info) {
//             console.log("Successfully parsed partial response");
//             return parsed;
//           }
//         } catch (e) {
//           console.log("Failed to parse partial response:", e);
//         }
//       }

//       return jsonContent; // Return the cleaned content as a fallback
//     }
//   } catch (e) {
//     console.log("Error processing GPT-4 response:", (e as Error).message);
//     return null;
//   }
// }

function parseGpt4oResponse(apiResponse: ApiResponse) {
  try {
    const content = apiResponse?.choices?.[0]?.message?.content;
    if (!content) {
      console.log("No content in GPT-4 response");
      return null;
    }

    // If content is just a string without JSON markers, return it as is
    if (!content.includes("{")) {
      console.log("Content is not JSON:", content);
      return content;
    }

    console.log("Content is JSON (most likely):", content);

    // Try to extract JSON content from markdown code blocks if present
    let jsonContent = content;
    if (content.includes("```")) {
      jsonContent = content.replace(/```json\s*|\s*```/g, "").trim();
    }

    // First try to parse as complete JSON
    try {
      const parsed = JSON.parse(jsonContent);
      if (parsed.vendor_info || parsed.line_items) {
        return parsed;
      }
    } catch (parseError) {
      console.log(
        "Failed to parse complete JSON, attempting to handle truncation"
      );
    }

    // If we get here, the JSON might be truncated
    // Find the last complete object structure
    const vendorMatch = jsonContent.match(/"vendor_info"\s*:\s*({[^}]+})/);
    const lineItemsMatch = jsonContent.match(
      /"line_items"\s*:\s*\[(.*?)(?:\]|$)/s
    );

    const partialResult: any = {};

    // Extract vendor info if available
    if (vendorMatch) {
      try {
        partialResult.vendor_info = JSON.parse(vendorMatch[1]);
      } catch (e) {
        console.log("Failed to parse vendor_info");
      }
    }

    // Extract line items if available
    if (lineItemsMatch) {
      try {
        // Split by closing braces and filter for complete items
        const items = lineItemsMatch[1]
          .split(/},?\s*/)
          .filter(
            (item) =>
              item.includes('"item_name"') &&
              item.includes('"subtotal"') &&
              item.includes('"unit_price"')
          )
          .map((item) => {
            // Clean and complete each item object
            const cleanItem = item.trim();
            const itemToProcess = cleanItem.endsWith("}")
              ? cleanItem
              : cleanItem + "}";
            try {
              return JSON.parse(itemToProcess);
            } catch {
              return null;
            }
          })
          .filter(
            (item): item is { item_name: string; subtotal: number } =>
              item !== null &&
              typeof item.item_name === "string" &&
              typeof item.subtotal === "number"
          );

        if (items.length > 0) {
          partialResult.line_items = items;
        }
      } catch (e) {
        console.log("Failed to parse line_items:", e);
      }
    }

    // Return partial result if we have any valid data
    if (Object.keys(partialResult).length > 0) {
      return partialResult;
    }

    throw new Error("Failed to parse receipt data");
  } catch (e) {
    console.error("Error processing GPT-4 response:", e);
    throw e;
  }
}

export default async function gpt4oProvider(base64File: string) {
  const payload = {
    messages: [
      {
        role: "system",
        content: [
          {
            type: "text",
            text: receiptExtractionPrompt,
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64File}`,
            },
          },
        ],
      },
    ],
    temperature: 0.7,
    top_p: 0.95,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 800,
    stop: null,
    stream: false,
  };

  const config = {
    method: "post",
    url: process.env.GPT4O_ENDPOINT || "YOUR_API_URL",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.GPT4O_API_KEY || "YOUR_API_KEY",
    },
    data: JSON.stringify(payload),
  };

  try {
    const response = await axios.request(config);
    console.log(response.data);
    const parsed = parseGpt4oResponse(response.data);
    return { success: true, data: parsed };
  } catch (error) {
    console.error("Error in gpt4oProvider:", error);
    return {
      success: false,
      error: (error as Error).message || "Failed to process receipt",
    };
  }
}
