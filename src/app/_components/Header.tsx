'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Instagram, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Clear search input on navigation and close menu
  useEffect(() => {
    setSearchQuery('');
    setIsMenuOpen(false);
  }, [pathname]);

  const logoSrc = "/kizasu-logo-ogp.jpg";
  const mainTitle = "萌書房";
  const subTitle = "Kizasu Shobo";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/books?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { href: "/about", label: "萌書房について" },
    { href: "/books", label: "書籍案内" },
    { href: "/news", label: "お知らせ" },
    { href: "/contact", label: "お問い合わせ" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md">
      <div className="container mx-auto h-20 md:h-24 px-4 md:px-6 flex justify-between items-center">
        {/* Left: Logo with Typography */}
        <div className="flex justify-start">
          <Link href="/" className="flex items-center gap-3 md:gap-4 group">
            <img 
              src={logoSrc}
              alt="萌書房ロゴ" 
              className="h-10 md:h-14 w-auto object-contain transition-opacity duration-300 group-hover:opacity-80"
            />
            <div className="flex flex-col justify-center">
              <span className="text-[9px] md:text-[11px] uppercase tracking-[0.4em] text-accent/60 font-serif font-bold leading-none mb-1 md:mb-1.5 ml-0.5 md:ml-1">
                {subTitle}
              </span>
              <span className="text-xl md:text-3xl font-serif font-bold tracking-[0.2em] text-foreground leading-none">
                {mainTitle}
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Navigation (Desktop) */}
        <nav className="hidden lg:flex items-center gap-10 text-[15px] font-medium tracking-[0.05em] text-foreground/80 font-serif">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="px-3 py-1.5 rounded-none hover:bg-wakaba-hover hover:text-accent transition-all duration-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Buttons & Hamburger */}
        <div className="flex items-center justify-end gap-4 md:gap-10">
          {/* Social & Search Unit (Desktop) */}
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
                  className="bg-wakaba/10 py-2 pl-9 pr-4 text-sm font-serif text-foreground placeholder:text-accent/30 focus:outline-none focus:bg-wakaba/30 transition-all w-40 xl:w-52"
                />
              </div>
              <button type="submit" className="bg-accent/5 text-accent text-[11px] font-bold px-4 py-2 border-l border-accent/10 hover:bg-wakaba-hover transition-all font-serif uppercase tracking-wider">
                検索
              </button>
            </form>
          </div>

          <Link href="/for-bookstores" className="hidden sm:block text-[10px] md:text-[12px] font-bold tracking-[0.2em] uppercase px-6 md:px-10 py-2 md:py-3 bg-wakaba-base text-accent border border-accent/10 hover:bg-wakaba-hover hover:border-accent/20 transition-all font-serif whitespace-nowrap shadow-sm">
            書店様へ
          </Link>

          {/* Hamburger Button */}
          <button 
            className="lg:hidden p-2 text-accent"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="メニューを開く"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 top-20 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-20 bottom-0 w-[80%] max-w-sm bg-background border-l border-border z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-8 flex flex-col gap-10">
                {/* Search in Mobile Menu */}
                <form onSubmit={handleSearch} className="flex flex-col gap-3">
                  <div className="relative flex items-center border border-accent/10 focus-within:border-accent/30 transition-all">
                    <Search size={16} className="absolute left-3 text-accent/30" />
                    <input 
                      type="text" 
                      placeholder="書籍を検索" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-wakaba/10 py-3 pl-10 pr-4 text-sm font-serif text-foreground placeholder:text-accent/30 focus:outline-none w-full"
                    />
                  </div>
                  <button type="submit" className="bg-accent text-white text-xs font-bold py-3 font-serif uppercase tracking-[0.2em]">
                    検索する
                  </button>
                </form>

                {/* Nav Links in Mobile Menu */}
                <nav className="flex flex-col gap-6">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.href} 
                      href={link.href}
                      className="text-lg font-serif font-medium text-foreground/80 hover:text-accent border-b border-accent/5 pb-4 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link 
                    href="/for-bookstores"
                    className="text-lg font-serif font-medium text-foreground/80 hover:text-accent border-b border-accent/5 pb-4 transition-colors"
                  >
                    書店様へ
                  </Link>
                </nav>

                {/* Social in Mobile Menu */}
                <div className="flex items-center gap-4 mt-auto">
                  <span className="text-xs font-serif text-accent/40 uppercase tracking-widest">Follow Us</span>
                  <a 
                    href="https://www.instagram.com/kawaberi_bookandcafe/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-accent/60 hover:text-accent transition-colors p-2 border border-accent/10 rounded-full"
                    aria-label="Instagram"
                  >
                    <Instagram size={20} />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
