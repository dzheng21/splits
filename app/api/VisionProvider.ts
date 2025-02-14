"use server";

import axios from "axios";
import { receiptExtractionPrompt } from "./utils";

interface ApiResponse {
  choices?: { message?: { content?: string } }[];
}

function parseGpt4oResponse(apiResponse: ApiResponse) {
  try {
    const content = apiResponse?.choices?.[0]?.message?.content;
    if (!content) {
      console.log("No content in GPT-4 response");
      return null;
    }

    // If content is just a simple string without JSON markers, return it as is
    if (!content.includes("{")) {
      return content;
    }

    // Try to extract JSON content, handling both markdown-fenced and raw JSON
    let jsonContent = content;
    if (content.includes("```")) {
      jsonContent = content.replace(/```json|```/g, "").trim();
    }

    // Clean up any trailing truncated properties
    jsonContent = jsonContent.replace(/,\s*"[^"]*"\s*$/, ""); // Remove incomplete last property
    jsonContent = jsonContent.replace(/,\s*$/, ""); // Remove trailing comma

    // Ensure the JSON is properly closed
    let depth = 0;
    let inString = false;
    let escape = false;

    for (let i = 0; i < jsonContent.length; i++) {
      const char = jsonContent[i];
      if (escape) {
        escape = false;
        continue;
      }
      if (char === "\\") {
        escape = true;
        continue;
      }
      if (char === '"' && !escape) {
        inString = !inString;
        continue;
      }
      if (!inString) {
        if (char === "{" || char === "[") depth++;
        if (char === "}" || char === "]") depth--;
      }
    }

    // Close any unclosed brackets/braces
    while (depth > 0) {
      jsonContent += "}";
      depth--;
    }

    try {
      const parsed = JSON.parse(jsonContent);
      return parsed;
    } catch (parseError) {
      console.log(
        "Failed to parse as JSON, checking if it's a partial valid response"
      );

      // If we have line_items or vendor_info, it might be a valid partial response
      if (
        jsonContent.includes('"line_items"') ||
        jsonContent.includes('"vendor_info"')
      ) {
        try {
          // Try to extract just the valid part up to the last complete item
          const validPart = jsonContent.replace(/,\s*[^,}]*$/, "}");
          const parsed = JSON.parse(validPart);
          if (parsed.line_items || parsed.vendor_info) {
            console.log("Successfully parsed partial response");
            return parsed;
          }
        } catch (e) {
          console.log("Failed to parse partial response:", e);
        }
      }

      return jsonContent; // Return the cleaned content as a fallback
    }
  } catch (e) {
    console.log("Error processing GPT-4 response:", (e as Error).message);
    return null;
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
              url: `data:image/png;base64,${base64File}`,
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
