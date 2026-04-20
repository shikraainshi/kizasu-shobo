'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Instagram } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');

  // Clear search input on navigation
  useEffect(() => {
    setSearchQuery('');
  }, [pathname]);

  const logoSrc = "/kizasu-logo-ogp.jpg";
  const mainTitle = "萌書房";
  const subTitle = "Kizasu Shobo";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/books?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md">
      <div className="container mx-auto h-24 px-6 flex justify-between items-center">
        {/* Left: Logo with Typography */}
        <div className="flex justify-start">
          <Link href="/" className="flex items-center gap-4 group">
            <img 
              src={logoSrc}
              alt="萌書房ロゴ" 
              className="h-14 w-auto object-contain transition-opacity duration-300 group-hover:opacity-80"
            />
            <div className="flex flex-col justify-center">
              <span className="text-[11px] uppercase tracking-[0.4em] text-accent/60 font-serif font-bold leading-none mb-1.5 ml-1">
                {subTitle}
              </span>
              <span className="text-2xl md:text-3xl font-serif font-bold tracking-[0.2em] text-foreground leading-none">
                {mainTitle}
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Navigation */}
        <nav className="hidden lg:flex items-center gap-10 text-[15px] font-medium tracking-[0.05em] text-foreground/80 font-serif">
          <Link href="/about" className="px-3 py-1.5 rounded-none hover:bg-wakaba-hover hover:text-accent transition-all duration-300">萌書房について</Link>
          <Link href="/books" className="px-3 py-1.5 rounded-none hover:bg-wakaba-hover hover:text-accent transition-all duration-300">書籍案内</Link>
          <Link href="/news" className="px-3 py-1.5 rounded-none hover:bg-wakaba-hover hover:text-accent transition-all duration-300">お知らせ</Link>
          <Link href="/contact" className="px-3 py-1.5 rounded-none hover:bg-wakaba-hover hover:text-accent transition-all duration-300">お問い合わせ</Link>
        </nav>

        {/* Right: Buttons */}
        <div className="flex items-center justify-end gap-10">
          {/* Social & Search Unit */}
          <div className="hidden xl:flex items-center gap-6">
            <a 
              href="https://www.instagram.com/kawaberi_bookandcafe/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent/40 hover:text-accent transition-colors p-2"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>

            <form onSubmit={handleSearch} className="flex items-center border border-accent/10 focus-within:border-accent/30 transition-all">
              <div className="relative flex items-center">
                <Search size={14} className="absolute left-3 text-accent/30" />
                <input 
                  type="text" 
                  placeholder="書籍を検索" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-wakaba/10 py-2 pl-9 pr-4 text-sm font-serif text-foreground placeholder:text-accent/30 focus:outline-none focus:bg-wakaba/30 transition-all w-52"
                />
              </div>
              <button type="submit" className="bg-accent/5 text-accent text-[11px] font-bold px-4 py-2 border-l border-accent/10 hover:bg-wakaba-hover transition-all font-serif uppercase tracking-wider">
                検索
              </button>
            </form>
          </div>

          <Link href="/for-bookstores" className="text-[12px] font-bold tracking-[0.2em] uppercase px-10 py-3 bg-wakaba-base text-accent border border-accent/10 hover:bg-wakaba-hover hover:border-accent/20 transition-all font-serif whitespace-nowrap shadow-sm">
            書店様へ
          </Link>
        </div>
      </div>
    </header>
  );
}
