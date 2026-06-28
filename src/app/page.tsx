import { getLatestBooks, getFeaturedBooks, getNewArrivals } from "@/lib/books";
import { getLatestNews } from "@/lib/news";
import HomeClient from "./page-client";

export const revalidate = 60;

export default async function Home() {
  const [latestBooks, featuredBooks, newArrivals, news] = await Promise.all([
    getLatestBooks(8),
    getFeaturedBooks(5),
    getNewArrivals(2),
    getLatestNews(5)
  ]);

  return <HomeClient latestBooks={latestBooks} featuredBooks={featuredBooks} newArrivals={newArrivals} initialNews={news} />;
}
