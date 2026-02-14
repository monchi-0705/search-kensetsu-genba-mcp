# search-kensetsu-genba-mcp

建築現場名を入力すると、Gemini 2.5 Flash の Google Search grounding 機能を使って現場情報を自動収集・整理する MCP サーバーです。

## 提供ツール

### `search_construction_site`（メインツール）

建築現場名から総合的な現場情報を検索・整理します。通称・略称での検索にも対応しています。

**入力**: `{ site_name: "虎ノ門ヒルズ ステーションタワー" }`

**出力**:
- 正式名称
- 別名・エイリアス（通称、略称、旧名称など）
- 元請け（ゼネコン）
- 関連会社一覧（設計事務所、施工会社、サブコンなど）
- 住所情報
- 用途・規模（階数、延床面積など）
- 工期（着工〜竣工予定）
- その他特記事項
- 情報ソース URL 一覧

### `search_site_companies`（関連会社詳細検索）

建築現場に関わる会社の詳細情報に特化した検索を行います。

**入力**: `{ site_name: "虎ノ門ヒルズ ステーションタワー" }`

**出力**:
- 元請けゼネコンの詳細（JV 構成など）
- デベロッパー（事業主）
- 設計事務所（意匠・構造・設備）
- 施工会社（JV パートナー含む）
- サブコン（電気、空調、衛生、エレベーターなど）
- PM/CM 会社

### `get_gemini_config`（設定確認）

Gemini API の設定状態を確認します。API キーが設定済みかどうか、使用モデル名を返します。

## セットアップ

### 1. ビルド

```bash
cd search-kensetsu-genba-mcp
npm install
npm run build
```

### 2. Gemini API キーの取得

[Google AI Studio](https://aistudio.google.com/apikey) から API キーを取得してください。

### 3. Claude Desktop に設定

`~/Library/Application Support/Claude/claude_desktop_config.json` に以下を追加:

```json
{
  "mcpServers": {
    "search-kensetsu-genba": {
      "command": "node",
      "args": ["/Users/ksato/workspace/mcp/search-kensetsu-genba-mcp/bin/cli.js"],
      "env": {
        "GEMINI_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## 技術構成

- **Gemini 2.5 Flash** + Google Search grounding で最新の建設プロジェクト情報を取得
- **@modelcontextprotocol/sdk** による MCP サーバー実装（stdio トランスポート）
- **esbuild** で単一ファイルにバンドル（`bin/cli.js`）
- **zod** による入力バリデーション
