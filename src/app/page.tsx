import { getLatestBooks, getFeaturedBooks } from "@/lib/books";
import { getLatestNews } from "@/lib/news";
import HomeClient from "./page-client";

export const revalidate = 60;

export default async function Home() {
  const [latestBooks, featuredBooks, news] = await Promise.all([
    getLatestBooks(8),
    getFeaturedBooks(2),
    getLatestNews(5)
  ]);

  return <HomeClient latestBooks={latestBooks} featuredBooks={featuredBooks} initialNews={news} />;
}
