import { News, getNewsFromNotion } from "./notion-service";

/**
 * 全てのお知らせを取得する関数 (Notion対応)
 */
export async function getNews(): Promise<News[]> {
  return await getNewsFromNotion();
}

/**
 * 最新のお知らせを取得する関数
 * @param limit 取得する件数
 */
export async function getLatestNews(limit?: number): Promise<News[]> {
  const news = await getNews();
  // 日付の降順（新しい順）に並べ替えて返す
  const sorted = [...news].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return limit ? sorted.slice(0, limit) : sorted;
}

/**
 * slugを指定してお知らせを取得する関数
 * @param slug お知らせのslugまたはNotionのページID
 */
export async function getNewsBySlug(slug: string): Promise<News | undefined> {
  const news = await getNews();
  return news.find((item) => item.slug === slug || item.id === slug);
}
