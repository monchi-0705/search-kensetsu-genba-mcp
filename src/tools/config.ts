import { isApiKeyConfigured, getModelName } from "../gemini/client.js";
import type { GeminiConfig } from "../types.js";

export function getGeminiConfig(): GeminiConfig {
  return {
    apiKeyConfigured: isApiKeyConfigured(),
    model: getModelName(),
  };
}
