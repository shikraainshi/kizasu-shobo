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
  relatedUrl1?: string;
  relatedUrl2?: string;
  urlLabel1?: string;
  urlLabel2?: string;
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
    let allResults: any[] = [];
    let hasMore = true;
    let nextCursor: string | undefined = undefined;

    // Notion API handles max 100 per request, so we loop to get more
    // Updated: Using direct request to avoid potential SDK version conflicts
    while (hasMore && allResults.length < 1000) {
      const response: any = await notion.request({
        path: `databases/${NOTION_BOOKS_DB_ID}/query`,
        method: "post",
        body: {
          page_size: 100,
          start_cursor: nextCursor,
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

      allResults = [...allResults, ...response.results];
      hasMore = response.has_more;
      nextCursor = response.next_cursor || undefined;
    }

    const books = allResults.map((page: any) => {
      const props = page.properties;
      
      const getProp = (name: string, id: string) => {
        if (props[name]) return props[name];
        const propById = Object.values(props).find((p: any) => p.id === id || p.id === decodeURIComponent(id));
        if (propById) return propById as any;
        return null;
      };

      const titleProp = getProp("書籍名", "title");
      const title = titleProp?.title?.[0]?.plain_text || "";

      const idProp = getProp("id", "kQ%3ED");
      const rawId = idProp?.rich_text?.[0]?.plain_text || "0";

      const featuredProp = getProp("注目表示", "H%7B%7Cu");
      const featured = featuredProp?.checkbox || false;

      const publicProp = getProp("公開", "cI%5CF");
      const isPublic = publicProp?.checkbox ?? true;

      const authorProp = getProp("著者名", "UI%7BT");
      const author = authorProp?.rich_text?.[0]?.plain_text || "";

      const categoryProp = getProp("カテゴリー", "MQkM");
      const category = categoryProp?.select?.name || "";

      const dateProp = getProp("刊行日", "D~da");
      const date = dateProp?.rich_text?.[0]?.plain_text || dateProp?.date?.start || "";

      const descProp = getProp("概要", "JM%7CP");
      const description = descProp?.rich_text?.[0]?.plain_text || "";

      // Debug: Log all property names for the first book to see what's available
      if (allResults.indexOf(page) === 0) {
        console.log("Notion Page Properties:", Object.keys(props));
        console.log("Full Description Prop:", props["詳細説明"] || props["B%5Emb"]);
      }

      const fullDescProp = getProp("詳細説明", "B%5Emb");
      const fullDescription = fullDescProp?.rich_text?.[0]?.plain_text || "";

      const priceProp = getProp("価格", "%40Lv%5B");
      const price = priceProp?.rich_text?.[0]?.plain_text || "";

      const isbnProp = getProp("ISBN", "_D%3D%3A");
      const isbn = isbnProp?.rich_text?.[0]?.plain_text || "";

      const pagesProp = getProp("ページ数", "uNuk");
      const pages = pagesProp?.rich_text?.[0]?.plain_text || "";

      const colorProp = getProp("背景色", "MGGs");
      const color = colorProp?.rich_text?.[0]?.plain_text || "";

      const imageProp = getProp("書影", "mWz%3B");
      let imageUrl = "";

      if (imageProp) {
        if (imageProp.type === "files" && imageProp.files?.length > 0) {
          // Notion アップロードファイルはプロキシ経由で提供
          imageUrl = `/api/book-image/${page.id}`;
        } else if (imageProp.type === "rich_text" && imageProp.rich_text?.length > 0) {
          imageUrl = imageProp.rich_text[0].plain_text || "";
        } else if (imageProp.type === "url") {
          imageUrl = imageProp.url || "";
        }
      }

      if (imageUrl && !imageUrl.startsWith("http") && !imageUrl.startsWith("/")) {
        imageUrl = `/${imageUrl}`;
      }

      return {
        id: parseInt(rawId, 10),
        title,
        author,
        category,
        date,
        description,
        fullDescription,
        price,
        isbn,
        pages,
        color,
        image: imageUrl,
        featured,
        isPublic,
        notionPageId: page.id,
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

      // 関連URL①: 既存フィールド（ID or 旧名「関連URL」or 新名「関連URL①」）
      const relatedUrl1Prop = getPropValue("v%3BeQ") || props["関連URL①"] || props["関連URL"];
      // 関連URL②・URL表示①②: 名前で探す
      const relatedUrl2Prop = props["関連URL②"];
      const urlLabel1Prop = props["URL表示①"];
      const urlLabel2Prop = props["URL表示②"];

      return {
        id: page.id,
        slug: slug || page.id,
        title: getPropValue("title")?.title?.[0]?.plain_text || "",
        date: getPropValue("LHW%3F")?.date?.start || "",
        content: getPropValue("Ztt%5D")?.rich_text?.[0]?.plain_text || "",
        category: getPropValue("py%7DA")?.select?.name || "",
        important: getPropValue("~tyZ")?.checkbox || false,
        relatedUrl1: relatedUrl1Prop?.url || relatedUrl1Prop?.rich_text?.[0]?.plain_text || "",
        relatedUrl2: relatedUrl2Prop?.url || relatedUrl2Prop?.rich_text?.[0]?.plain_text || "",
        urlLabel1: urlLabel1Prop?.rich_text?.[0]?.plain_text || "",
        urlLabel2: urlLabel2Prop?.rich_text?.[0]?.plain_text || "",
      };
    });
  } catch (error) {
    console.error("Error fetching news from Notion:", error);
    return newsData as News[];
  }
}
