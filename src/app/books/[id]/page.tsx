import { getBookById } from "@/lib/books";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const revalidate = 60;

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = await getBookById(parseInt(id));

  if (!book) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-16 pb-24 bg-background">
      {/* Navigation Breadcrumb */}
      <nav className="bg-wakaba/20 border-b border-border py-4">
        <div className="container mx-auto px-6">
          <ul className="flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] text-accent/40 uppercase font-serif">
            <li>
              <Link href="/" className="hover:text-accent transition-colors">トップ</Link>
            </li>
            <ChevronRight size={10} className="text-accent/20" />
            <li>
              <Link href="/books" className="hover:text-accent transition-colors">書籍案内</Link>
            </li>
            <ChevronRight size={10} className="text-accent/20" />
            <li className="text-accent/60 truncate max-w-[200px] md:max-w-none">
              {book.title}
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <section className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-16 lg:gap-24 max-w-6xl mx-auto">
          {/* Left: Book Cover Image */}
          <div className="w-full md:w-2/5 lg:w-1/3 shrink-0">
            <div className={`aspect-[2/3] w-full bg-wakaba/20 flex items-center justify-center shadow-2xl border border-accent/10 relative overflow-hidden group`}>
              {book.image ? (
                <img src={book.image} alt={book.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div className="p-12 text-center relative z-10">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-accent/40 mb-4 block font-serif font-bold">{book.category}</span>
                  <h1 className="text-2xl font-serif font-bold mb-2 leading-tight text-foreground">{book.title}</h1>
                  <p className="text-sm text-accent/60 font-serif italic">{book.author}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Book Details */}
          <div className="flex-1 max-w-2xl">
            <div className="mb-12">
              <span className="text-[11px] font-bold tracking-[0.3em] text-accent/50 uppercase mb-6 block font-serif">{book.category}</span>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-8 text-foreground tracking-tight leading-[1.1]">{book.title}</h1>
              <p className="text-2xl text-accent/70 mb-10 font-serif italic border-l-4 border-accent/20 pl-6">{book.author}</p>
            </div>

            <div className="space-y-12 text-foreground/80 leading-relaxed font-serif">
              <div className="whitespace-pre-wrap text-lg md:text-xl">
                {book.fullDescription}
              </div>

              {/* Specs Table */}
              <div className="pt-12 border-t border-accent/10">
                <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-accent/30 mb-8 font-serif">Specifications</h2>
                <dl className="grid grid-cols-[100px_1fr] gap-y-6 text-sm">
                  <dt className="text-accent/40 font-serif font-bold uppercase tracking-widest text-[9px]">著者</dt>
                  <dd className="text-foreground/70">{book.author}</dd>
                  <dt className="text-accent/40 font-serif font-bold uppercase tracking-widest text-[9px]">刊行日</dt>
                  <dd className="text-foreground/70 font-serif">{book.date}</dd>
                  <dt className="text-accent/40 font-serif font-bold uppercase tracking-widest text-[9px]">定価</dt>
                  <dd className="text-foreground/70 font-serif">{book.price}</dd>
                  <dt className="text-accent/40 font-serif font-bold uppercase tracking-widest text-[9px]">ISBN</dt>
                  <dd className="font-serif text-accent/60 tracking-wider">{book.isbn}</dd>
                  <dt className="text-accent/40 font-serif font-bold uppercase tracking-widest text-[9px]">頁数</dt>
                  <dd className="text-foreground/70 font-serif tabular-nums">{book.pages} ページ</dd>
                </dl>
              </div>

              {/* Purchase Button */}
              <div className="pt-12 flex flex-col sm:flex-row gap-6">
                <a 
                  href="https://www.kinokuniya.co.jp/disp/CSfDispListPage_001.jsp?qsd=true&ptk=01&publisher-key=%E8%90%8C%E6%9B%B8%E6%88%BF"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-wakaba-base text-accent border border-accent/10 px-12 py-5 rounded-none font-bold tracking-[0.2em] text-[11px] uppercase hover:bg-wakaba-hover hover:border-accent/30 transition-all font-serif shadow-sm text-center"
                >
                  購入する（紀伊國屋書店）
                </a>
                <Link 
                  href="/contact" 
                  className="border border-accent/20 text-accent/60 px-12 py-5 rounded-none font-bold tracking-[0.2em] text-[11px] uppercase hover:bg-wakaba-hover hover:text-accent transition-all font-serif text-center"
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
           <Link href="/books" className="inline-block text-base font-serif font-bold tracking-[0.5em] uppercase border-b-2 border-accent/10 pb-3 text-accent/50 hover:text-accent hover:border-accent/40 transition-all">
             書籍案内へ戻る
           </Link>
        </div>
      </section>
    </div>
  );
}
