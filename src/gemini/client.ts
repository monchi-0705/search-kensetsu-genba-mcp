import { GoogleGenerativeAI } from "@google/generative-ai";
import type { SourceInfo } from "../types.js";

const MODEL_NAME = "gemini-2.5-flash";

function getClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY が設定されていません。環境変数 GEMINI_API_KEY を設定してください。"
    );
  }
  return new GoogleGenerativeAI(apiKey);
}

export function isApiKeyConfigured(): boolean {
  return !!process.env.GEMINI_API_KEY;
}

export function getModelName(): string {
  return MODEL_NAME;
}

export async function searchWithGrounding(
  prompt: string
): Promise<{ text: string; sources: SourceInfo[] }> {
  const client = getClient();
  const model = client.getGenerativeModel({
    model: MODEL_NAME,
    tools: [{ googleSearch: {} } as any],
  });

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  const sources: SourceInfo[] = [];
  const candidate = response.candidates?.[0];
  const groundingMetadata = candidate?.groundingMetadata as any;

  if (groundingMetadata?.groundingChunks) {
    for (const chunk of groundingMetadata.groundingChunks) {
      if (chunk.web) {
        sources.push({
          title: chunk.web.title || "",
          url: chunk.web.uri || "",
        });
      }
    }
  }

  return { text, sources };
}
