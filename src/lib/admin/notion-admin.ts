import { notion, NOTION_BOOKS_DB_ID, NOTION_NEWS_DB_ID } from "@/lib/notion";
import { getBooksFromNotionAdmin } from "@/lib/notion-service";
import { getNews, getNewsBySlug } from "@/lib/news";
import { Book } from "@/lib/books";
import { News } from "@/lib/notion-service";
import type { BookInput, NewsInput } from "@/lib/admin/types";

export type { BookInput, NewsInput } from "@/lib/admin/types";

function richText(value: string | undefined | null) {
  const v = (value || "").trim();
  return { rich_text: v ? [{ type: "text", text: { content: v } }] : [] };
}

function titleProp(value: string) {
  return { title: [{ type: "text", text: { content: value } }] };
}

function selectProp(value: string | undefined | null) {
  return { select: value ? { name: value } : null };
}

function checkboxProp(value: boolean) {
  return { checkbox: value };
}

function urlProp(value: string | undefined | null) {
  return { url: value?.trim() || null };
}

function dateProp(value: string | undefined | null) {
  return { date: value ? { start: value } : null };
}

// ---------- Books ----------

export async function getAllBooksForAdmin(): Promise<Book[]> {
  const books = await getBooksFromNotionAdmin();
  return [...books].sort((a, b) => b.id - a.id);
}

export async function getBookForAdmin(pageId: string): Promise<Book | undefined> {
  const books = await getBooksFromNotionAdmin();
  return books.find((b) => b.notionPageId === pageId);
}

async function getNextBookId(): Promise<number> {
  const books = await getBooksFromNotionAdmin();
  const maxId = books.reduce((max, b) => (Number.isFinite(b.id) && b.id > max ? b.id : max), 0);
  return maxId + 1;
}

function bookProperties(input: Partial<BookInput>, includeAll: boolean): Record<string, any> {
  const props: Record<string, any> = {};

  if (includeAll || input.title !== undefined) props["書籍名"] = titleProp(input.title || "");
  if (includeAll || input.author !== undefined) props["著者名"] = richText(input.author);
  if (includeAll || input.authorKana !== undefined) props["著者名カナ"] = richText(input.authorKana);
  if (includeAll || input.category !== undefined) props["カテゴリ"] = selectProp(input.category);
  if (includeAll || input.pubDate !== undefined) props["刊行日"] = richText(input.pubDate);
  if (includeAll || input.price !== undefined) props["価格"] = richText(input.price);
  if (includeAll || input.pages !== undefined) props["ページ数"] = richText(input.pages);
  if (includeAll || input.isbn !== undefined) props["ISBN"] = richText(input.isbn);
  if (includeAll || input.description !== undefined) props["概要"] = richText(input.description);
  if (includeAll || input.fullDescription !== undefined) props["詳細説明"] = richText(input.fullDescription);
  if (includeAll || input.color !== undefined) props["背景色"] = richText(input.color);
  if (includeAll || input.isPublic !== undefined) props["公開"] = checkboxProp(!!input.isPublic);
  if (includeAll || input.featured !== undefined) props["注目表示"] = checkboxProp(!!input.featured);
  if (includeAll || input.seriesName !== undefined) props["シリーズ名"] = richText(input.seriesName);
  if (includeAll || input.seriesVolume !== undefined) props["シリーズ巻次"] = richText(input.seriesVolume);
  if (includeAll || input.titleVolume !== undefined) props["書名巻次"] = richText(input.titleVolume);
  if (includeAll || input.titleKana !== undefined) props["書名カナ"] = richText(input.titleKana);
  if (includeAll || input.slug !== undefined) props["slug"] = richText(input.slug);
  if (includeAll || input.url1 !== undefined) props["URL①"] = urlProp(input.url1);
  if (includeAll || input.url2 !== undefined) props["URL②"] = urlProp(input.url2);
  if (includeAll || input.url3 !== undefined) props["URL③"] = urlProp(input.url3);

  return props;
}

async function uploadBookCover(pageId: string, image: File): Promise<void> {
  const upload = await notion.fileUploads.create({
    mode: "single_part",
    filename: image.name,
    content_type: image.type,
  });

  await notion.fileUploads.send({
    file_upload_id: upload.id,
    file: { filename: image.name, data: image },
  });

  await notion.request({
    path: `pages/${pageId}`,
    method: "patch",
    body: {
      properties: {
        書影: {
          files: [
            {
              type: "file_upload",
              file_upload: { id: upload.id },
              name: image.name,
            },
          ],
        },
      },
    },
  });
}

export async function createBook(input: BookInput, image?: File | null): Promise<{ pageId: string; id: number }> {
  const id = await getNextBookId();
  const properties = {
    ...bookProperties(input, true),
    id: richText(String(id)),
  };

  const page: any = await notion.request({
    path: "pages",
    method: "post",
    body: {
      parent: { database_id: NOTION_BOOKS_DB_ID },
      properties,
    },
  });

  if (image && image.size > 0) {
    await uploadBookCover(page.id, image);
  }

  return { pageId: page.id, id };
}

export async function updateBook(pageId: string, input: Partial<BookInput>, image?: File | null): Promise<void> {
  const properties = bookProperties(input, false);

  await notion.request({
    path: `pages/${pageId}`,
    method: "patch",
    body: { properties },
  });

  if (image && image.size > 0) {
    await uploadBookCover(pageId, image);
  }
}

// ---------- News ----------

export async function getAllNewsForAdmin(): Promise<News[]> {
  return getNews();
}

export async function getNewsForAdmin(pageId: string): Promise<News | undefined> {
  return getNewsBySlug(pageId);
}

function newsProperties(input: Partial<NewsInput>, includeAll: boolean): Record<string, any> {
  const props: Record<string, any> = {};

  if (includeAll || input.title !== undefined) props["タイトル"] = titleProp(input.title || "");
  if (includeAll || input.date !== undefined) props["日付"] = dateProp(input.date);
  if (includeAll || input.category !== undefined) props["カテゴリ"] = selectProp(input.category);
  if (includeAll || input.important !== undefined) props["重要フラグ"] = checkboxProp(!!input.important);
  if (includeAll || input.content !== undefined) props["本文"] = richText(input.content);
  if (includeAll || input.relatedUrl1 !== undefined) props["関連URL①"] = urlProp(input.relatedUrl1);
  if (includeAll || input.relatedUrl2 !== undefined) props["関連URL②"] = urlProp(input.relatedUrl2);
  if (includeAll || input.urlLabel1 !== undefined) props["URL表示①"] = richText(input.urlLabel1);
  if (includeAll || input.urlLabel2 !== undefined) props["URL表示②"] = richText(input.urlLabel2);
  if (includeAll || input.slug !== undefined) props["slug"] = richText(input.slug);

  return props;
}

export async function createNews(input: NewsInput): Promise<{ pageId: string }> {
  const page: any = await notion.request({
    path: "pages",
    method: "post",
    body: {
      parent: { database_id: NOTION_NEWS_DB_ID },
      properties: newsProperties(input, true),
    },
  });

  return { pageId: page.id };
}

export async function updateNews(pageId: string, input: Partial<NewsInput>): Promise<void> {
  await notion.request({
    path: `pages/${pageId}`,
    method: "patch",
    body: { properties: newsProperties(input, false) },
  });
}
