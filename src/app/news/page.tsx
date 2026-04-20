import { getNews } from "@/lib/news";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

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

      {/* 3. News List */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="divide-y divide-accent/5 border-t border-accent/5">
              {news.map((item, index) => (
                <Link key={item.id || index} href={`/news/${item.slug}`} className="group block">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12 py-10 transition-all">
                    <div className="flex items-center gap-6 md:w-48 shrink-0">
                      <span className="text-[11px] text-accent/50 font-mono tabular-nums leading-none tracking-wider">
                        {item.date ? item.date.replace(/-/g, '.') : ''}
                      </span>
                      <span className="text-[9px] uppercase tracking-[0.2em] border border-accent/20 text-accent/60 px-3 py-1 font-bold font-serif transition-colors group-hover:bg-wakaba-hover group-hover:text-accent">
                        {item.category}
                      </span>
                    </div>
                    
                    <span className="text-lg md:text-xl text-foreground group-hover:text-accent transition-colors flex-1 leading-snug font-serif">
                      {item.important && <span className="text-accent font-bold mr-2">【重要】</span>}
                      {item.title}
                    </span>

                    <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                      <ChevronRight size={20} className="text-accent/30" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
