'use client';

import { useState, useMemo, Suspense, useEffect } from "react";
import { Book } from "@/lib/books";
import Link from "next/link";
import { ChevronDown, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";

const CATEGORIES = [
  "すべて", 
  "哲学・思想", 
  "社会・教育", 
  "芸術", 
  "政治・法律", 
  "経済・経営", 
  "小説・評論・エッセイ"
];

type SortOption = "date-desc" | "date-asc" | "title";

interface BooksClientProps {
  initialBooks: Book[];
}

function BooksContent({ initialBooks }: BooksClientProps) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const [selectedCategory, setSelectedCategory] = useState("すべて");
  const [sortOption, setSortOption] = useState<SortOption>("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // 1. Filter and Sort logic
  const filteredAndSortedBooks = useMemo(() => {
    let filtered = [...initialBooks];

    // Category filter
    if (selectedCategory !== "すべて") {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    // Search query filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(lowerQuery) ||
        book.author.toLowerCase().includes(lowerQuery) ||
        book.description.toLowerCase().includes(lowerQuery) ||
        book.fullDescription.toLowerCase().includes(lowerQuery)
      );
    }

    return filtered.sort((a, b) => {
      switch (sortOption) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "title":
          return a.title.localeCompare(b.title, 'ja');
        default:
          return 0;
      }
    });
  }, [initialBooks, selectedCategory, sortOption, searchQuery]);

  // 2. Pagination logic
  const totalPages = Math.ceil(filteredAndSortedBooks.length / itemsPerPage);
  const currentBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedBooks.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedBooks, currentPage, itemsPerPage]);

  // Reset to page 1 when category, sort, or search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortOption, searchQuery]);

  return (
    <div className="flex flex-col gap-12 pb-24 bg-background">
      {/* Page Header */}
      <section className="bg-wakaba/30 py-24 border-b border-border">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-serif font-bold text-center text-foreground tracking-[0.2em]">
            {searchQuery ? "検索結果" : "書籍案内"}
          </h1>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto w-full px-10 md:px-20 lg:px-32">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="flex-1">
            {searchQuery ? (
              <div className="flex flex-col items-start gap-2 font-serif">
                <div className="flex items-center gap-2 text-accent/60">
                  <Search size={16} />
                  <span>検索条件: <span className="text-accent font-bold">「{searchQuery}」</span></span>
                </div>
                <p className="text-sm text-accent/40">
                  {filteredAndSortedBooks.length}件見つかりました
                </p>
              </div>
            ) : (
              <div className="flex overflow-x-auto pb-2 gap-1.5 no-scrollbar max-w-full">
                {CATEGORIES.map((cat) => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap px-5 py-2 text-[11px] font-serif transition-all border ${
                      selectedCategory === cat 
                      ? "bg-accent text-white border-accent font-bold" 
                      : "bg-wakaba/10 text-accent/60 border-transparent hover:border-accent/20 hover:text-accent"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative inline-block group shrink-0">
            <select 
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="appearance-none bg-background border border-accent/20 px-4 py-2 pr-10 text-[10px] font-serif font-bold uppercase tracking-widest text-accent focus:outline-none focus:border-accent transition-all cursor-pointer rounded-none min-w-[200px]"
            >
              <option value="date-desc">出版年月日の新しい順</option>
              <option value="date-asc">出版年月日の古い順</option>
              <option value="title">タイトル</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-accent/40 group-hover:text-accent">
              <ChevronDown size={14} />
            </div>
          </div>
        </div>

        <div className="min-h-[600px] w-full border-t border-l border-border">
          {currentBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {currentBooks.map((book, index) => (
                <Link 
                  key={`${book.id}-${index}`} 
                  href={`/books/${book.id}`} 
                  className="group cursor-pointer bg-background p-10 h-full transition-colors hover:bg-wakaba/10 flex flex-col border-r border-b border-border"
                >
                  {/* 1. 書影 */}
                  <div className={`aspect-[2/3] w-full max-w-[150px] mx-auto mb-8 bg-wakaba/5 flex items-center justify-center transition-all duration-500 group-hover:shadow-lg border border-border/40 overflow-hidden relative shadow-md`}>
                    {book.image ? (
                      <img src={book.image} alt={book.title} className="absolute inset-0 w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" />
                    ) : (
                      <div className="p-6 text-center relative z-10">
                        <span className="text-[9px] uppercase tracking-[0.2em] text-accent/50 mb-2 block font-serif font-bold">{book.category}</span>
                        <h3 className="text-base font-serif font-bold mb-1 leading-tight text-foreground">{book.title}</h3>
                        <p className="text-[10px] text-accent/50 font-serif">{book.author}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col space-y-4">
                    {/* カテゴリ */}
                    <div>
                      <div className="inline-block px-2.5 py-1 bg-accent text-white text-[9px] font-bold tracking-[0.2em] leading-none uppercase">
                        {book.category}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col">
                      {/* 2. タイトル */}
                      <h3 className="text-lg font-serif font-bold text-foreground group-hover:text-accent transition-colors leading-relaxed h-[5.5rem] line-clamp-3 mb-2">
                        {book.title}
                      </h3>

                      {/* 3. 著者 */}
                      <div className="flex items-start gap-1 border-t border-accent/5 pt-2 h-[3.5rem]">
                        <p className="text-[13px] text-accent/70 font-serif flex-1 line-clamp-2">
                          {book.author}
                        </p>
                        <span className="text-[11px] text-muted-foreground shrink-0 mt-0.5 italic">著者</span>
                      </div>
                    </div>

                    {/* 4. 刊行日・金額（右寄せ・縦並び） */}
                    <div className="flex flex-col items-end gap-1.5 text-[12px] font-serif tracking-wider border-t border-border/60 pt-3 mt-auto w-full">
                      <span className="text-accent/80 font-bold text-right w-full">{book.date}</span>
                      <div className="text-accent/60 font-bold bg-wakaba/30 pl-2 pr-0 rounded-sm">
                        {book.price}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-background w-full py-40 flex flex-col items-center justify-center border-b border-r border-border">
              <p className="text-accent/40 font-serif italic text-lg tracking-wider">該当する書籍がありません。</p>
              <button 
                onClick={() => {
                  setSelectedCategory("すべて");
                  if (searchQuery) {
                    window.location.href = "/books";
                  }
                }}
                className="mt-6 text-[10px] font-serif font-bold uppercase tracking-[0.2em] text-accent border-b border-accent/30 pb-1 hover:text-accent/60 hover:border-accent/10 transition-all"
              >
                {searchQuery ? "すべての書籍を表示" : "すべての書籍を表示"}
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center pt-16">
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button 
                  key={pageNum}
                  onClick={() => {
                    setCurrentPage(pageNum);
                    window.scrollTo({ top: 0, behavior: 'instant' });
                  }}
                  className={`w-10 h-10 flex items-center justify-center border font-bold font-serif transition-all text-xs ${
                    currentPage === pageNum
                    ? "border-accent bg-accent text-white"
                    : "border-accent/10 text-accent/40 hover:border-accent/40 hover:text-accent hover:bg-wakaba/20"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default function BooksClient({ initialBooks }: BooksClientProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BooksContent initialBooks={initialBooks} />
    </Suspense>
  );
}
