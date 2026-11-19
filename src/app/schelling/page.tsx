import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getBooks, type Book } from "@/lib/books";

export const revalidate = 60;

const SERIES_NAME = "叢書シェリング入門";

export const metadata: Metadata = {
  title: SERIES_NAME,
  description:
    "萌書房のシリーズ「叢書シェリング入門」と、シェリングに関する関連書の特集ページです。",
  alternates: { canonical: "/schelling" },
  openGraph: {
    title: `${SERIES_NAME} | 萌書房`,
    description: "萌書房のシリーズ「叢書シェリング入門」と、シェリングに関する関連書の特集ページです。",
    url: "/schelling",
  },
};

/** 「叢書シェリング入門　3」→ 3 */
function seriesNumber(book: Book): number {
  const m = (book.series ?? "").normalize("NFKC").match(/(\d+)\s*$/);
  return m ? parseInt(m[1], 10) : 999;
}

function formatMonth(date: string): string {
  const m = date.match(/(\d{4})\D*(\d{1,2})/);
  return m ? `${m[1]}年${parseInt(m[2], 10)}月` : "";
}

function Cover({ book }: { book: Book }) {
  return (
    <div className="aspect-[2/3] bg-wakaba/20 border border-border/60 shadow-sm overflow-hidden flex items-center justify-center">
      {book.image ? (
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <span className="p-3 text-xs text-center text-accent/80">{book.title}</span>
      )}
    </div>
  );
}

export default async function SchellingPage() {
  let books: Book[] = [];
  try {
    books = (await getBooks()).filter((b) => b.isPublic !== false);
  } catch (error) {
    console.error("Failed to load Schelling books:", error);
  }

  const seriesBooks = books
    .filter((b) => (b.series ?? "").includes(SERIES_NAME))
    .sort((a, b) => seriesNumber(a) - seriesNumber(b) || a.id - b.id);

  // 関連書：書名・副題・詳細説明にシェリングを含み、叢書に入っていないもの（新しい順）
  const related = books
    .filter((b) => !(b.series ?? "").includes(SERIES_NAME))
    .filter((b) => /シェリング/.test(`${b.title} ${b.description} ${b.fullDescription}`))
    .sort((a, b) => b.id - a.id);

  return (
    <main className="min-h-screen bg-background font-serif">
      {/* Breadcrumbs */}
      <nav className="bg-wakaba/20 border-b border-border py-4">
        <div className="container mx-auto px-6">
          <ul className="flex items-center gap-3 text-xs font-bold tracking-[0.1em] text-accent/80">
            <li>
              <Link href="/" className="hover:text-accent transition-colors">トップ</Link>
            </li>
            <ChevronRight size={10} className="text-accent/50" />
            <li>
              <Link href="/books" className="hover:text-accent transition-colors">書籍案内</Link>
            </li>
            <ChevronRight size={10} className="text-accent/50" />
            <li className="text-accent/60">{SERIES_NAME}</li>
          </ul>
        </div>
      </nav>

      {/* Page Header */}
      <header className="bg-wakaba/30 py-20 md:py-24 border-b border-border">
        <div className="container mx-auto px-6 text-center">
          <p className="text-xs font-bold tracking-[0.15em] text-accent/80 mb-4">F・W・J・シェリング</p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-[0.2em] mb-8">{SERIES_NAME}</h1>
          <p className="text-[15px] md:text-base leading-[2] text-foreground/80">
            シェリング没後150年を記念して刊行を始めたシリーズです。
            {seriesBooks.length > 0 && (
              <>
                <br className="md:hidden" />
                既刊{seriesBooks.length}冊。
              </>
            )}
          </p>
        </div>
      </header>

      {/* 叢書の一覧 */}
      {seriesBooks.length > 0 && (
        <section className="py-16 md:py-20 border-b border-border">
          <div className="container mx-auto px-6 max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-[0.1em] mb-10">シリーズ一覧</h2>
            <ol className="divide-y divide-accent/10 border-y border-accent/10">
              {seriesBooks.map((book) => {
                const num = seriesNumber(book);
                return (
                  <li key={book.id}>
                    <Link
                      href={`/books/${book.id}`}
                      className="group grid grid-cols-[88px_1fr] sm:grid-cols-[112px_1fr] gap-5 sm:gap-8 py-7 items-start"
                    >
                      <Cover book={book} />
                      <div className="min-w-0">
                        {num !== 999 && (
                          <p className="text-xs font-bold tracking-[0.15em] text-accent/80 mb-2">第{num}巻</p>
                        )}
                        <h3 className="text-lg md:text-xl font-bold leading-snug text-foreground group-hover:text-accent transition-colors">
                          {book.title}
                        </h3>
                        {book.description && (
                          <p className="mt-1 text-[15px] text-foreground/80">―― {book.description}</p>
                        )}
                        <p className="mt-3 text-sm text-foreground/70">
                          {book.author}
                          {formatMonth(book.date) && <span className="ml-3 tabular-nums">{formatMonth(book.date)}</span>}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      )}

      {/* 関連書 */}
      {related.length > 0 && (
        <section className="py-16 md:py-20 border-b border-border">
          <div className="container mx-auto px-6 max-w-6xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-[0.1em] mb-10">関連書</h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-10">
              {related.map((book) => (
                <li key={book.id}>
                  <Link href={`/books/${book.id}`} className="group block">
                    <Cover book={book} />
                    <p className="mt-3 text-sm font-bold leading-snug text-foreground group-hover:text-accent transition-colors">
                      {book.title}
                    </p>
                    <p className="mt-1 text-xs text-foreground/70">{book.author}</p>
                    <p className="mt-0.5 text-xs text-foreground/70 tabular-nums">{formatMonth(book.date)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* シェリングについて */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6 max-w-4xl space-y-16">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-[0.1em] mb-8">
              シェリングについて
            </h2>
            <p className="text-[15px] md:text-base leading-[2.1] text-foreground/85">
              フリードリヒ・ヴィルヘルム・ヨーゼフ・シェリング（Friedrich Wilhelm Joseph Schelling
              1775-1854）は，フィヒテ，ヘーゲルと並ぶドイツ観念論を代表する哲学者。南ドイツ・ヴュルテンベルクのレオンベルクに生まれ，テュービンゲン神学校ではヘーゲル，ヘルダーリンと学んだ。早熟の天才として知られ，23歳でイェーナ大学に招かれて以降，自然哲学，超越論的観念論，同一哲学，芸術哲学と次々に思索を展開。『人間的自由の本質』（自由論，1809年）で悪と自由の問題に踏み込み，後期には神話の哲学・啓示の哲学を講じた。1841年にはヘーゲル亡き後のベルリン大学に招聘されている。1854年，スイスのバート・ラガーツで没。
            </p>
            <p className="mt-6 text-[15px] md:text-base leading-[2.1] text-foreground/85">
              本叢書は，処女作『悪の起源論』から，自然哲学，『自由論』，芸術哲学，神話論，そしてスピノザ主義との関わりまで，シェリングの多面的な思索に，それぞれの主題から分け入るための入門シリーズです。
            </p>
          </div>

          <div className="text-center pt-8">
            <Link
              href="/books"
              className="inline-block text-base font-bold tracking-[0.15em] border-b-2 border-accent/10 pb-3 text-accent/80 hover:text-accent hover:border-accent/40 transition-all"
            >
              書籍案内へ
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
