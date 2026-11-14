import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, FileText } from "lucide-react";
import { ERRATA } from "@/data/errata";

export const metadata: Metadata = {
  title: "正誤表",
  description: "萌書房の既刊書籍の正誤表（PDF）を掲載しています。",
};

function formatDate(date: string): string {
  return date.replace(/-/g, ".");
}

export default function ErrataPage() {
  const errata = [...ERRATA].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <main className="min-h-screen bg-background">
      {/* Breadcrumbs */}
      <nav className="bg-wakaba/20 border-b border-border py-4">
        <div className="container mx-auto px-6">
          <ul className="flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] text-accent/40 uppercase font-serif">
            <li>
              <Link href="/" className="hover:text-accent transition-colors">トップ</Link>
            </li>
            <ChevronRight size={10} className="text-accent/20" />
            <li className="text-accent/60">正誤表</li>
          </ul>
        </div>
      </nav>

      {/* Page Header */}
      <header className="bg-wakaba/30 py-24 border-b border-border">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-serif font-bold text-center text-foreground tracking-[0.2em]">正誤表</h1>
        </div>
      </header>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12 font-serif text-[15px] leading-[2.2] tracking-[0.05em] text-foreground/80">
              <p>既刊の正誤表をPDF形式で掲載しています。</p>
              <p>書籍のタイトルをクリックすると閲覧／ダウンロードできます。</p>
            </div>

            {errata.length === 0 ? (
              <p className="text-center text-accent/40 font-serif py-20 tracking-widest border-t border-accent/5">
                現在掲載している正誤表はありません
              </p>
            ) : (
              <ul className="divide-y divide-accent/10 border-y border-accent/10">
                {errata.map((item) => (
                  <li key={`${item.bookTitle}-${item.pdfUrl}`}>
                    <a
                      href={item.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 py-6 px-2 font-serif hover:bg-wakaba/10 transition-colors"
                    >
                      <FileText size={20} className="shrink-0 text-accent/40 group-hover:text-accent transition-colors" />
                      <span className="flex-1 text-sm md:text-base text-foreground leading-relaxed group-hover:text-accent transition-colors">
                        『{item.bookTitle}』正誤表
                        <span className="text-foreground/60 text-xs md:text-sm ml-1">
                          （{formatDate(item.updatedAt)}更新）
                        </span>
                      </span>
                      <span className="shrink-0 text-[10px] font-bold tracking-[0.2em] border border-accent/30 text-accent/70 px-2 py-0.5">
                        PDF
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
