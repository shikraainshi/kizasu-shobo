import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, FileText } from "lucide-react";
import { getAllErrata, type ErrataDoc } from "@/lib/errata";
import { getBooks, type Book } from "@/lib/books";
import { titleKey } from "@/lib/errata-format";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "正誤表",
  description: "萌書房の既刊書籍の正誤表（PDF）を掲載しています。",
};

function formatDate(date: string): string {
  return date.replace(/-/g, ".");
}

export default async function ErrataPage() {
  let errata: ErrataDoc[] = [];
  try {
    errata = (await getAllErrata()).filter((e) => e.pdfUrl);
  } catch (error) {
    console.error("Failed to load errata:", error);
  }

  // 書名が一致する書籍があれば、書影・著者・書籍ページへのリンクを出す
  let booksByTitle = new Map<string, Book>();
  try {
    const books = await getBooks();
    booksByTitle = new Map(books.filter((b) => b.title).map((b) => [titleKey(b.title), b]));
  } catch (error) {
    console.error("Failed to load books for errata:", error);
  }

  // 書名順（シリーズの巻が続けて並ぶ）
  const items = errata
    .map((item) => ({ item, book: booksByTitle.get(titleKey(item.bookTitle)) }))
    .sort((a, b) =>
      titleKey(a.item.bookTitle).localeCompare(titleKey(b.item.bookTitle), "ja", { numeric: true }),
    );

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
              <p>「正誤表」ボタンを押すと閲覧／ダウンロードできます。</p>
            </div>

            {items.length === 0 ? (
              <p className="text-center text-accent/40 font-serif py-20 tracking-widest border-t border-accent/5">
                現在掲載している正誤表はありません
              </p>
            ) : (
              <ul className="divide-y divide-accent/10 border-y border-accent/10">
                {items.map(({ item, book }) => (
                  <li key={item.id} className="flex items-center gap-5 py-6 px-2 font-serif">
                    {/* 書影 */}
                    <div className="shrink-0 w-14 h-20 flex items-center justify-center" aria-hidden="true">
                      {book?.image ? (
                        <img
                          src={book.image}
                          alt=""
                          className="max-w-full max-h-full w-auto h-auto border border-border/40 shadow-sm"
                        />
                      ) : (
                        <span className="w-full h-full flex items-center justify-center bg-wakaba/10 border border-border/40">
                          <FileText size={20} className="text-accent/40" />
                        </span>
                      )}
                    </div>

                    {/* 書名・著者 */}
                    <div className="flex-1 min-w-0">
                      <p className="text-base md:text-lg font-bold text-foreground leading-snug">
                        『{item.bookTitle.trim()}』
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-foreground/60">
                        {book?.author && <span>{book.author}</span>}
                        {book && (
                          <Link href={`/books/${book.id}`} className="text-accent/70 underline underline-offset-2 hover:text-accent">
                            書籍の詳細
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* 正誤表ボタン＋更新日 */}
                    <div className="shrink-0 flex flex-col items-center gap-2">
                      <a
                        href={item.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 min-w-[6rem] md:min-w-[7.5rem] px-4 md:px-5 py-3 text-sm font-bold tracking-[0.15em] border border-accent/40 text-accent bg-wakaba/10 hover:bg-accent hover:text-white hover:border-accent transition-colors"
                      >
                        <FileText size={16} />
                        正誤表
                      </a>
                      <span className="text-xs text-foreground/60 tabular-nums">
                        {formatDate(item.updatedAt)} 更新
                      </span>
                    </div>
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
