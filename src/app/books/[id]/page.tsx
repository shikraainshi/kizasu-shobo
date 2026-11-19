import { getBookById, getPurchaseUrl } from "@/lib/books";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, FileText } from "lucide-react";
import { getErrataForBook, type ErrataDoc } from "@/lib/errata";

export const dynamic = 'force-dynamic';

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = await getBookById(parseInt(id));

  if (!book) {
    notFound();
  }

  const purchaseUrl = getPurchaseUrl(book.isbn);

  let errata: ErrataDoc[] = [];
  try {
    errata = await getErrataForBook(book.title);
  } catch (error) {
    console.error("Failed to load errata for book:", error);
  }

  return (
    <div className="flex flex-col gap-16 pb-24 bg-background">
      {/* Navigation Breadcrumb */}
      <nav className="bg-wakaba/20 border-b border-border py-4">
        <div className="container mx-auto px-6">
          <ul className="flex items-center gap-3 text-xs font-bold tracking-[0.1em] text-accent/80 uppercase font-serif">
            <li>
              <Link href="/" className="hover:text-accent transition-colors">トップ</Link>
            </li>
            <ChevronRight size={10} className="text-accent/50" />
            <li>
              <Link href="/books" className="hover:text-accent transition-colors">書籍案内</Link>
            </li>
            <ChevronRight size={10} className="text-accent/50" />
            <li className="text-accent/60 truncate max-w-[200px] md:max-w-none">
              {book.title}
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <section className="container mx-auto px-6 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 lg:gap-24 max-w-6xl mx-auto">
          {/* Left: Book Cover Image */}
          <div className="w-full md:w-1/2 lg:w-[45%] shrink-0">
            <div className="w-full max-w-[500px] mx-auto shadow-2xl border border-accent/10 overflow-hidden group">
              {book.image ? (
                <img src={book.image} alt={book.title} className="w-full h-auto block transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div className="aspect-[2/3] bg-wakaba/20 flex items-center justify-center p-12 text-center">
                  <span className="text-xs uppercase tracking-[0.1em] text-accent/80 mb-4 block font-serif font-bold">{book.category}</span>
                  <h1 className="text-2xl font-serif font-bold mb-2 leading-tight text-foreground">{book.title}</h1>
                  <p className="text-sm text-accent/60 font-serif">{book.author}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Book Details */}
          <div className="flex-1 max-w-2xl">
            <div className="mb-12">
              <span className="text-[13px] font-bold tracking-[0.15em] text-accent/80 uppercase mb-6 block font-serif">{book.category}</span>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-8 text-foreground tracking-tight leading-[1.1]">{book.title}</h1>
              <p className="text-xl md:text-2xl text-accent/70 mb-10 font-serif border-l-4 border-accent/20 pl-6">{book.author}</p>
              
              {/* DEBUG MARKER */}
              <div className="hidden">PAGE_UPDATED_V1</div>

              {/* 詳細説明 (Notionの「詳細説明」カラム) */}
              {book.fullDescription ? (
                <div className="mt-12 whitespace-pre-wrap text-base md:text-lg leading-relaxed text-foreground/90 font-serif">
                  {book.fullDescription}
                </div>
              ) : (
                <div className="mt-12 text-sm text-accent/50 font-serif">
                  ※詳細説明は準備中です。
                </div>
              )}
            </div>

            <div className="space-y-12 text-foreground/80 leading-relaxed font-serif">
              {/* Main Summary / Description */}
              {book.description && (
                <div className="whitespace-pre-wrap text-lg md:text-xl border-l-2 border-accent/10 pl-6 text-accent/80">
                  {book.description}
                </div>
              )}

              {/* Specs Table */}
              <div className="pt-12 border-t border-accent/10">
                <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-accent/50 mb-8 font-serif">Specifications</h2>
                <dl className="grid grid-cols-[100px_1fr] gap-y-6 text-sm">
                  <dt className="text-accent/80 font-serif font-bold uppercase tracking-widest text-xs">著者</dt>
                  <dd className="text-foreground/70">{book.author}</dd>
                  <dt className="text-accent/80 font-serif font-bold uppercase tracking-widest text-xs">刊行日</dt>
                  <dd className="text-foreground/70 font-serif">{book.date}</dd>
                  <dt className="text-accent/80 font-serif font-bold uppercase tracking-widest text-xs">定価</dt>
                  <dd className="text-foreground/70 font-serif">{book.price}</dd>
                  <dt className="text-accent/80 font-serif font-bold uppercase tracking-widest text-xs">ISBN</dt>
                  <dd className="font-serif text-accent/60 tracking-wider">{book.isbn}</dd>
                  <dt className="text-accent/80 font-serif font-bold uppercase tracking-widest text-xs">頁数</dt>
                  <dd className="text-foreground/70 font-serif tabular-nums">{book.pages} ページ</dd>
                </dl>
              </div>

              {/ディケンズ全集/.test(book.title) && (
                <Link
                  href="/dickens"
                  className="inline-flex items-center gap-1 text-sm text-accent underline underline-offset-4 decoration-accent/40 hover:decoration-accent"
                >
                  ディケンズ全集 特集ページ（全巻構成・組見本）
                  <ChevronRight size={14} />
                </Link>
              )}

              {(book.series ?? "").includes("叢書シェリング入門") && (
                <Link
                  href="/schelling"
                  className="inline-flex items-center gap-1 text-sm text-accent underline underline-offset-4 decoration-accent/40 hover:decoration-accent"
                >
                  叢書シェリング入門 特集ページ（シリーズ一覧・関連書）
                  <ChevronRight size={14} />
                </Link>
              )}

              {/* 正誤表 */}
              {errata.length > 0 && (
                <div className="pt-12 border-t border-accent/10">
                  <h2 className="text-sm font-bold tracking-[0.1em] text-accent/70 mb-6 font-serif">正誤表</h2>
                  <ul className="space-y-3">
                    {errata.map((item) => (
                      <li key={item.id}>
                        <a
                          href={item.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-4 border border-accent/20 px-5 py-4 hover:bg-wakaba/10 hover:border-accent/40 transition-colors"
                        >
                          <FileText size={20} className="shrink-0 text-accent/80 group-hover:text-accent transition-colors" />
                          <span className="flex-1 text-sm text-foreground group-hover:text-accent transition-colors">
                            正誤表を見る（PDF）
                          </span>
                          <span className="shrink-0 text-xs text-foreground/70 tabular-nums">
                            {item.updatedAt.replace(/-/g, ".")} 更新
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Purchase Button */}
              <div className="pt-12 flex flex-col sm:flex-row gap-6">
                {purchaseUrl && (
                  <a
                    href={purchaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-wakaba-base text-accent border border-accent/10 px-12 py-5 rounded-none font-bold tracking-[0.1em] text-[13px] uppercase hover:bg-wakaba-hover hover:border-accent/30 transition-all font-serif shadow-sm text-center"
                  >
                    購入する（外部リンク）
                  </a>
                )}
                <Link
                  href="/contact" 
                  className="border border-accent/20 text-accent/60 px-12 py-5 rounded-none font-bold tracking-[0.1em] text-[13px] uppercase hover:bg-wakaba-hover hover:text-accent transition-all font-serif text-center"
                >
                  公費購入・お問い合わせ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Related Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center">
           <Link href="/books" className="inline-block text-base font-serif font-bold tracking-[0.15em] uppercase border-b-2 border-accent/10 pb-3 text-accent/80 hover:text-accent hover:border-accent/40 transition-all">
             書籍案内へ戻る
           </Link>
        </div>
      </section>
    </div>
  );
}
