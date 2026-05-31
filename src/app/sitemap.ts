import { MetadataRoute } from "next";
import { getBooks } from "@/lib/books";
import { getNews } from "@/lib/news";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://kizasu-shobo.jp";

  // 1. 静的ルート
  const staticRoutes = [
    "",
    "/about",
    "/books",
    "/cafe",
    "/contact",
    "/for-bookstores",
    "/news",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // 2. 書籍詳細ページ (動的)
  const books = await getBooks();
  const bookRoutes = books.map((book) => ({
    url: `${baseUrl}/books/${book.id}`,
    lastModified: new Date(), // 本来はデータの更新日があればそれが望ましい
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // 3. ニュース詳細ページ (動的)
  const news = await getNews();
  const newsRoutes = news.map((item) => ({
    url: `${baseUrl}/news/${item.slug}`,
    lastModified: new Date(item.date),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...bookRoutes, ...newsRoutes];
}
