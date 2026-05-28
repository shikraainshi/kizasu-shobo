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

  // Close menu on navigation
  useEffect(() => {
    setSearchQuery('');
    setIsMenuOpen(false);
  }, [pathname]);

  // Handle body scroll lock
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

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
    { href: "/for-bookstores", label: "書店様へ" },
  ];

  return (
    <>
      <header className="sticky top-0 z-[50] w-full border-b border-border bg-background/95 backdrop-blur-md">
        <div className="container mx-auto h-20 md:h-24 px-4 md:px-6 flex justify-between items-center">
          {/* Left: Logo */}
          <div className="flex justify-start">
            <Link href="/" className="flex items-center gap-3 md:gap-4 group">
              <img 
                src={logoSrc}
                alt="萌書房ロゴ" 
                className="h-10 md:h-14 w-auto object-contain transition-opacity duration-300 group-hover:opacity-80"
              />
              <div className="flex flex-col justify-center">
                <span className="text-[9px] md:text-[11px] uppercase tracking-[0.4em] text-accent/60 font-serif font-bold leading-none mb-1 md:mb-1.5 ml-0.5 md:ml-1 text-left">
                  {subTitle}
                </span>
                <span className="text-xl md:text-3xl font-serif font-bold tracking-[0.2em] text-foreground leading-none text-left">
                  {mainTitle}
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center gap-10 text-[15px] font-medium tracking-[0.05em] text-foreground/80 font-serif">
            {navLinks.slice(0, 4).map((link) => (
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
              onClick={() => setIsMenuOpen(true)}
              aria-label="メニューを開く"
            >
              <Menu size={32} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay - Outside Header */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-[9999] lg:hidden">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            
            {/* Menu Content */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-background border-l border-border shadow-2xl flex flex-col"
            >
              {/* Close Button Header */}
              <div className="h-20 md:h-24 flex items-center justify-end px-6 border-b border-border/50">
                <button 
                  onClick={() => setIsMenuOpen(false)} 
                  className="p-2 text-accent"
                  aria-label="メニューを閉じる"
                >
                  <X size={36} />
                </button>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto px-8 py-10 flex flex-col gap-10">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="flex flex-col gap-4">
                  <div className="relative flex items-center border border-accent/20 focus-within:border-accent transition-all bg-wakaba/20">
                    <Search size={20} className="absolute left-4 text-accent/40" />
                    <input 
                      type="text" 
                      placeholder="書籍を検索" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full py-4 pl-12 pr-4 text-base font-serif text-foreground placeholder:text-accent/30 focus:outline-none bg-transparent"
                    />
                  </div>
                  <button type="submit" className="bg-accent text-white text-sm font-bold py-4 font-serif uppercase tracking-[0.2em] shadow-md active:scale-[0.98] transition-transform">
                    検索する
                  </button>
                </form>

                {/* Mobile Nav Links */}
                <nav className="flex flex-col">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.href} 
                      href={link.href}
                      className="text-xl font-serif font-medium text-foreground/90 border-b border-border/50 py-5 hover:text-accent transition-colors flex justify-between items-center group"
                    >
                      {link.label}
                      <span className="text-accent/20 group-hover:text-accent transition-colors">→</span>
                    </Link>
                  ))}
                </nav>

                {/* Mobile Social & Info */}
                <div className="mt-auto pt-10 border-t border-border/50 flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-serif text-accent/40 uppercase tracking-[0.3em] font-bold">Follow Us</span>
                    <div className="h-[1px] flex-1 bg-accent/10"></div>
                  </div>
                  <a 
                    href="https://www.instagram.com/kawaberi_bookandcafe/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 text-accent/70 hover:text-accent transition-colors"
                  >
                    <div className="p-3 border border-accent/10 rounded-full bg-wakaba/10">
                      <Instagram size={24} />
                    </div>
                    <span className="font-serif font-medium">Instagram</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
