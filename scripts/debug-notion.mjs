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

console.log("API KEY:", env.NOTION_API_KEY ? "set" : "MISSING");
console.log("DB ID:", env.NOTION_NEWS_DB_ID);

const notion = new Client({ auth: env.NOTION_API_KEY, notionVersion: "2022-06-28" });

// 既存ページからプロパティ名を確認
const res = await notion.request({
  path: `databases/${env.NOTION_NEWS_DB_ID}/query`,
  method: "post",
  body: { page_size: 1 },
});
const page = res.results[0];
if (page) {
  console.log("\n=== Page properties (name -> type, id) ===");
  for (const [name, prop] of Object.entries(page.properties)) {
    console.log(`  "${name}" [${prop.type}] id=${prop.id}`);
    if (prop.type === "select") console.log(`    value: ${prop.select?.name}`);
    if (prop.type === "title") console.log(`    value: ${prop.title?.[0]?.plain_text}`);
    if (prop.type === "date") console.log(`    value: ${prop.date?.start}`);
  }
} else {
  console.log("No pages in DB - trying schema...");
  const dbFull = await notion.request({
    path: `databases/${env.NOTION_NEWS_DB_ID}`,
    method: "get",
    body: {},
  });
  if (dbFull.properties) {
    for (const [name, prop] of Object.entries(dbFull.properties)) {
      console.log(`  "${name}" [${prop.type}] id=${prop.id}`);
      if (prop.type === "select") console.log("    options:", prop.select.options.map(o => o.name));
    }
  }
}
