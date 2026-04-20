import { notion, NOTION_BOOKS_DB_ID, NOTION_NEWS_DB_ID } from "./notion";
import { Book } from "./books";
import booksData from "@/data/books.json";
import newsData from "@/data/news.json";

// News Interface (based on data/news.json)
export interface News {
  id: string;
  slug: string;
  title: string;
  date: string;
  content: string;
  category: string;
  important: boolean;
  relatedUrl?: string;
}

/**
 * Fetch all books from Notion
 */
export async function getBooksFromNotion(): Promise<Book[]> {
  if (!NOTION_BOOKS_DB_ID) {
    console.warn("NOTION_BOOKS_DB_ID is not defined. Using local JSON data.");
    return booksData as Book[];
  }

  try {
    const response: any = await notion.request({
      path: `databases/${NOTION_BOOKS_DB_ID}/query`,
      method: "post",
      body: {
        page_size: 100,
        sorts: [
          {
            property: "H%7B%7Cu", // "注目表示"
            direction: "descending",
          },
          {
            property: "kQ%3ED", // "id"
            direction: "descending",
          },
        ],
      },
    });

    const books = response.results.map((page: any) => {
      const props = page.properties;
      
      const getPropValue = (id: string, name?: string) => {
        let prop = Object.values(props).find((p: any) => p.id === id) as any;
        if (prop) return prop;
        if (name && props[name]) return props[name];
        const key = Object.keys(props).find(k => props[k].id === id);
        return key ? props[key] : null;
      };

      const rawId = getPropValue("kQ%3ED", "id")?.rich_text?.[0]?.plain_text || "0";
      const featured = getPropValue("H%7B%7Cu", "注目表示")?.checkbox || false;
      const isPublic = getPropValue("cI%5CF", "公開")?.checkbox ?? true;

      const imagePath = getPropValue("mWz%3B", "書影")?.rich_text?.[0]?.plain_text || "";
      const formattedImage = imagePath && !imagePath.startsWith("http") && !imagePath.startsWith("/") 
        ? `/${imagePath}` 
        : imagePath;

      return {
        id: parseInt(rawId, 10),
        title: getPropValue("title", "書籍名")?.title?.[0]?.plain_text || "",
        author: getPropValue("UI%7BT", "著者名")?.rich_text?.[0]?.plain_text || "",
        category: getPropValue("MQkM", "カテゴリー")?.select?.name || "",
        date: getPropValue("D~da", "刊行日")?.rich_text?.[0]?.plain_text || "",
        description: getPropValue("JM%7CP", "概要")?.rich_text?.[0]?.plain_text || "",
        fullDescription: getPropValue("B%5Emb", "詳細説明")?.rich_text?.[0]?.plain_text || "",
        price: getPropValue("%40Lv%5B", "価格")?.rich_text?.[0]?.plain_text || "",
        isbn: getPropValue("_D%3D%3A", "ISBN")?.rich_text?.[0]?.plain_text || "",
        pages: getPropValue("uNuk", "ページ数")?.rich_text?.[0]?.plain_text || "",
        color: getPropValue("MGGs", "背景色")?.rich_text?.[0]?.plain_text || "",
        image: formattedImage,
        featured: featured,
        isPublic: isPublic,
      };

    });

    const publicBooks = books.filter((b: any) => b.isPublic);
    return publicBooks;
  } catch (error) {
    console.error("Error fetching books from Notion:", error);
    return booksData as Book[];
  }
}

/**
 * Fetch all news from Notion
 */
export async function getNewsFromNotion(): Promise<News[]> {
  if (!NOTION_NEWS_DB_ID) {
    console.warn("NOTION_NEWS_DB_ID is not defined. Using local JSON data.");
    return newsData as News[];
  }

  try {
    const response: any = await notion.request({
      path: `databases/${NOTION_NEWS_DB_ID}/query`,
      method: "post",
      body: {
        sorts: [
          {
            property: "LHW%3F", // "日時" ID
            direction: "descending",
          },
        ],
      },
    });

    return response.results.map((page: any) => {
      const props = page.properties;
      const getPropValue = (id: string) => {
        const prop = Object.values(props).find((p: any) => p.id === id) as any;
        return prop;
      };

      const slug = getPropValue("jn%7Cd")?.rich_text?.[0]?.plain_text;
      
      // 関連URLをIDまたは名前で探す
      const relatedUrlProp = getPropValue("v%3BeQ") || props["関連URL"];

      return {
        id: page.id,
        slug: slug || page.id,
        title: getPropValue("title")?.title?.[0]?.plain_text || "",
        date: getPropValue("LHW%3F")?.date?.start || "",
        content: getPropValue("Ztt%5D")?.rich_text?.[0]?.plain_text || "",
        category: getPropValue("py%7DA")?.select?.name || "",
        important: getPropValue("~tyZ")?.checkbox || false,
        relatedUrl: relatedUrlProp?.url || "",
      };
    });
  } catch (error) {
    console.error("Error fetching news from Notion:", error);
    return newsData as News[];
  }
}
