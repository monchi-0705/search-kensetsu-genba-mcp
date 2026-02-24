import { searchWithGrounding } from "../gemini/client.js";
import type {
  ConstructionSiteInfo,
  SiteCompaniesResult,
} from "../types.js";

export async function searchConstructionSite(
  siteName: string
): Promise<ConstructionSiteInfo> {
  const prompt = `あなたは建築・建設業界の専門家です。以下の建築現場・建設プロジェクトについて、Google検索で最新情報を調べて、正確な情報を提供してください。

検索対象: 「${siteName}」

以下の項目について、できる限り詳しく調べてください：

1. **正式名称**: プロジェクトの正式名称
2. **別名・エイリアス**: 通称、略称、旧名称、仮称など（複数ある場合はすべて列挙）
3. **元請け（ゼネコン）**: 施工を担当するゼネコン名
4. **関連会社一覧**: 設計事務所、施工会社（JV含む）、サブコン、デベロッパー、コンサルタントなど
5. **住所情報**: 建設地の住所
6. **用途・規模**: 建物の用途、階数（地上・地下）、高さ、延床面積など
7. **工期**: 着工日〜竣工予定日
8. **その他特記事項**: 特徴的な工法、環境配慮、受賞歴など
9. **出典となるWebサイト: **

回答は以下のJSON形式で返してください（JSON以外のテキストは含めないでください）：
{
  "officialName": "正式名称",
  "aliases": ["別名1", "別名2"],
  "generalContractor": "元請けゼネコン名",
  "relatedCompanies": [
    {"name": "会社名", "role": "役割（設計/施工/デベロッパーなど）", "details": "補足情報"}
  ],
  "address": "住所",
  "usage": "用途（オフィス、商業施設、住宅など）",
  "scale": "規模（階数、高さ、延床面積など）",
  "constructionPeriod": "着工〜竣工予定",
  "sources": "出典となるWebサイト",
  "notes": "その他特記事項"
}`;

  const { text, sources } = await searchWithGrounding(prompt);

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return {
      officialName: siteName,
      aliases: [],
      generalContractor: "情報なし",
      relatedCompanies: [],
      address: "情報なし",
      usage: "情報なし",
      scale: "情報なし",
      constructionPeriod: "情報なし",
      notes: `Gemini からの応答をパースできませんでした。\n\n生の応答:\n${text}`,
      sources,
    };
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      officialName: parsed.officialName || siteName,
      aliases: parsed.aliases || [],
      generalContractor: parsed.generalContractor || "情報なし",
      relatedCompanies: (parsed.relatedCompanies || []).map((c: any) => ({
        name: c.name || "",
        role: c.role || "",
        details: c.details || "",
      })),
      address: parsed.address || "情報なし",
      usage: parsed.usage || "情報なし",
      scale: parsed.scale || "情報なし",
      constructionPeriod: parsed.constructionPeriod || "情報なし",
      notes: parsed.notes || "",
      sources,
    };
  } catch {
    return {
      officialName: siteName,
      aliases: [],
      generalContractor: "情報なし",
      relatedCompanies: [],
      address: "情報なし",
      usage: "情報なし",
      scale: "情報なし",
      constructionPeriod: "情報なし",
      notes: `JSON パースエラー。\n\n生の応答:\n${text}`,
      sources,
    };
  }
}

export async function searchSiteCompanies(
  siteName: string
): Promise<SiteCompaniesResult> {
  const prompt = `あなたは建築・建設業界の専門家です。以下の建築現場・建設プロジェクトに関わる会社について、Google検索で最新情報を調べて、できる限り詳しく教えてください。

検索対象: 「${siteName}」

以下の情報を調べてください：

1. **元請け（ゼネコン）**: メインの施工会社の詳細情報
2. **関連会社一覧**: このプロジェクトに関わるすべての会社
   - デベロッパー（事業主）
   - 設計事務所（意匠設計、構造設計、設備設計）
   - 施工会社（元請け、JVパートナー）
   - サブコン（電気、空調、衛生、エレベーターなど）
   - PM/CM会社
   - その他関連会社

回答は以下のJSON形式で返してください（JSON以外のテキストは含めないでください）：
{
  "siteName": "プロジェクト正式名称",
  "generalContractor": {
    "name": "元請けゼネコン名",
    "details": "ゼネコンについての詳細（JV構成など）"
  },
  "companies": [
    {"name": "会社名", "role": "役割", "details": "補足情報"}
  ]
}`;

  const { text, sources } = await searchWithGrounding(prompt);

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return {
      siteName,
      generalContractor: { name: "情報なし", details: "" },
      companies: [],
      sources,
    };
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      siteName: parsed.siteName || siteName,
      generalContractor: {
        name: parsed.generalContractor?.name || "情報なし",
        details: parsed.generalContractor?.details || "",
      },
      companies: (parsed.companies || []).map((c: any) => ({
        name: c.name || "",
        role: c.role || "",
        details: c.details || "",
      })),
      sources,
    };
  } catch {
    return {
      siteName,
      generalContractor: { name: "情報なし", details: "" },
      companies: [],
      sources,
    };
  }
}
