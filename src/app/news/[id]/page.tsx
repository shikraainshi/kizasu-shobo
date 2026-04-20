import { getNewsBySlug } from "@/lib/news";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const revalidate = 60;

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;
  const newsItem = await getNewsBySlug(slug);

  if (!newsItem) {
    notFound();
  }

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
            <li>
              <Link href="/news" className="hover:text-accent transition-colors">お知らせ</Link>
            </li>
            <ChevronRight size={10} className="text-accent/20" />
            <li className="text-accent/60 truncate max-w-[200px] md:max-w-none">
              {newsItem.title}
            </li>
          </ul>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-16 md:py-24 max-w-4xl">
        <div className="bg-background">
          
          {/* 2. News Header */}
          <header className="mb-16 border-b border-accent/10 pb-12">
            <div className="flex items-center gap-6 mb-8">
              <time className="text-sm font-mono text-accent/40 tracking-wider">
                {newsItem.date.replace(/-/g, '.')}
              </time>
              <span className="text-[10px] uppercase tracking-[0.2em] border border-accent/20 text-accent/60 px-4 py-1.5 font-bold font-serif">
                {newsItem.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground leading-tight tracking-tight">
              {newsItem.important && <span className="text-accent mr-3">【重要】</span>}
              {newsItem.title}
            </h1>
          </header>

          {/* 3. Main Content */}
          <section className="max-w-none font-serif text-lg leading-relaxed text-foreground/80 mb-20 whitespace-pre-wrap space-y-8">
            <div>{newsItem.content}</div>
            
            {newsItem.relatedUrl && (
              <div className="pt-2">
                <a 
                  href={newsItem.relatedUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-accent/60 border-b border-accent/10 pb-0.5 hover:border-accent hover:text-accent/70 transition-all font-serif"
                >
                  <span className="text-sm break-all">{newsItem.relatedUrl}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </a>
              </div>
            )}
          </section>

          {/* 4. Back Button */}
          <div className="flex justify-center mt-48">
            <Link 
              href="/news" 
              className="inline-block text-base font-serif font-bold tracking-[0.5em] uppercase border-b-2 border-accent/10 pb-3 text-accent/50 hover:text-accent hover:border-accent/40 transition-all"
            >
              お知らせ一覧に戻る
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
