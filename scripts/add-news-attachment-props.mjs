// お知らせDBに添付ファイル用のプロパティ（添付ファイルURL / 添付ファイル名）を追加する。
// 既にある場合はそのまま。実行: node scripts/add-news-attachment-props.mjs
import { Client } from "@notionhq/client";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envContent = readFileSync(join(__dirname, "../.env.local"), "utf-8");
const env = {};
for (const line of envContent.split("\n")) {
  const [key, ...vals] = line.split("=");
  if (key && vals.length) env[key.trim()] = vals.join("=").trim();
}

const notion = new Client({ auth: env.NOTION_API_KEY, notionVersion: "2022-06-28" });

await notion.request({
  path: `databases/${env.NOTION_NEWS_DB_ID}`,
  method: "patch",
  body: {
    properties: {
      添付ファイルURL: { url: {} },
      添付ファイル名: { rich_text: {} },
    },
  },
});

console.log("お知らせDBに「添付ファイルURL」「添付ファイル名」を追加しました。");
