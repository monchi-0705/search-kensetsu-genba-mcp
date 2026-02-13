import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  searchConstructionSite,
  searchSiteCompanies,
} from "./tools/search-site.js";
import { getGeminiConfig } from "./tools/config.js";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "search-kensetsu-genba",
    version: "1.0.0",
  });

  server.tool(
    "search_construction_site",
    "建築現場名から現場情報を検索・整理します。正式名称、元請け、関連会社、住所、規模、工期などを返します。通称・略称での検索も可能です。",
    {
      site_name: z
        .string()
        .describe("建築現場名（通称・略称でもOK）"),
    },
    async ({ site_name }) => {
      try {
        const result = await searchConstructionSite(site_name);
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: "text" as const,
              text: `エラーが発生しました: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "search_site_companies",
    "建築現場に関わる会社の詳細情報を検索します。元請け・サブコン・設計事務所など関連会社の一覧を返します。",
    {
      site_name: z
        .string()
        .describe("建築現場名"),
    },
    async ({ site_name }) => {
      try {
        const result = await searchSiteCompanies(site_name);
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: "text" as const,
              text: `エラーが発生しました: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "get_gemini_config",
    "Gemini API の設定状態を確認します。APIキーが設定済みかどうか、使用モデルなどを返します。",
    {},
    async () => {
      const config = getGeminiConfig();
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(config, null, 2),
          },
        ],
      };
    }
  );

  return server;
}
