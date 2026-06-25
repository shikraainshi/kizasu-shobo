import { getNews } from "@/lib/news";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import NewsClient from "./news-client";

export const revalidate = 60;

export default async function NewsListPage() {
  const news = await getNews();

  return (
    <main className="min-h-screen bg-background">
      {/* 1. Breadcrumbs */}
      <nav className="bg-wakaba/20 border-b border-border py-4">
        <div className="container mx-auto px-6">
          <ul className="flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] text-accent/40 uppercase font-serif">
            <li>
              <Link href="/" className="hover:text-accent transition-colors">トップ</Link>
            </li>
            <ChevronRight size={10} className="text-accent/20" />
            <li className="text-accent/60">お知らせ一覧</li>
          </ul>
        </div>
      </nav>

      {/* 2. Page Header */}
      <header className="bg-wakaba/30 py-24 border-b border-border">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-serif font-bold text-center text-foreground tracking-[0.2em]">お知らせ一覧</h1>
        </div>
      </header>

      {/* 3. Tabs + News List */}
      <NewsClient news={news} />
    </main>
  );
}
