import { Client } from "@notionhq/client";

if (!process.env.NOTION_API_KEY) {
  console.warn("Missing NOTION_API_KEY environment variable");
}

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
  notionVersion: "2022-06-28",
});

export const NOTION_BOOKS_DB_ID = process.env.NOTION_BOOKS_DB_ID || "";
export const NOTION_NEWS_DB_ID = process.env.NOTION_NEWS_DB_ID || "";
