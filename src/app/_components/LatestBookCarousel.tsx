'use client';

import { useState, useEffect } from 'react';
import { Book } from '@/lib/books';
import Link from 'next/link';
import { MoveLeft, MoveRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LatestBookCarouselProps {
  books: Book[];
  title?: string;
  footerHref?: string;
  footerLabel?: string;
}

export default function LatestBookCarousel({ books, title, footerHref, footerLabel }: LatestBookCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dims, setDims] = useState({ active: 200, inactive: 120 });

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1024) {
        setDims({ active: 320, inactive: 210 });
      } else if (window.innerWidth >= 640) {
        setDims({ active: 240, inactive: 140 });
      } else {
        setDims({ active: 200, inactive: 120 });
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const nextBook = () => {
    setCurrentIndex((prev) => (prev + 1) % books.length);
  };

  const prevBook = () => {
    setCurrentIndex((prev) => (prev - 1 + books.length) % books.length);
  };

  const activeWidth = dims.active;
  const inactiveWidth = dims.inactive;
  const gap = 20;
  const offset = 10;

  const currentBook = books[currentIndex];

  return (
    <section className="relative w-full bg-[#f2f0ed] pt-6 pb-8 md:pt-8 md:pb-14 border-y border-accent/5 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        {title && (
          <div className="flex flex-col mb-10 items-center pt-6">
            <h2 className="text-3xl font-serif font-bold text-foreground tracking-widest relative">
              {title}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-[1.5px] bg-accent/40" />
            </h2>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

          {/* Left: Book Info — fixed width */}
          <div className="w-full lg:w-[660px] lg:shrink-0 flex flex-col pt-4 min-h-[200px] lg:min-h-[320px] lg:pl-48">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] uppercase tracking-[0.4em] text-accent/60 font-serif font-bold">
                    {currentBook.category}
                  </span>
                  <h2 className="text-xl md:text-2xl xl:text-3xl font-serif font-bold text-foreground leading-tight tracking-tight">
                    {currentBook.title}
                  </h2>
                  <p className="text-sm text-accent/70 font-serif italic border-l border-accent/20 pl-4 mt-0.5">
                    {currentBook.author}
                  </p>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed font-serif">
                  {currentBook.description}
                </p>

                <div className="mt-2">
                  <Link
                    href={`/books/${currentBook.id}`}
                    className="group relative inline-block overflow-hidden border border-accent/20 px-6 py-2.5 rounded-none font-serif font-bold text-[8px] tracking-[0.2em] uppercase transition-all hover:bg-wakaba-hover hover:border-accent/40 text-accent"
                  >
                    <span className="relative z-10">詳細を見る</span>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Sliding track — left clipped, right overflows */}
          <div className="flex-1 flex flex-col gap-4 min-w-0 lg:pl-20 w-full">
            {/* overflow: hidden on left only via padding-right + margin-right trick */}
            <div
              className="overflow-hidden py-6 md:py-8"
              style={{ paddingRight: '9999px', marginRight: '-9999px' }}
            >
              <div
                className="flex items-end"
                style={{
                  gap: `${gap}px`,
                  transform: `translateX(calc(${offset}px - ${currentIndex * (inactiveWidth + gap)}px))`,
                  transition: 'transform 0.8s cubic-bezier(0.16,1,0.3,1)',
                }}
              >
                {books.map((book, index) => {
                  const isActive = index === currentIndex;
                  return (
                    <motion.div
                      key={book.id}
                      animate={{
                        width: isActive ? activeWidth : inactiveWidth,
                        opacity: isActive ? 1 : 0.5,
                      }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="shrink-0 cursor-pointer"
                      onClick={() => {
                        if (isActive) return;
                        setCurrentIndex(index);
                      }}
                    >
                      <div className={`w-full overflow-hidden border transition-all duration-700 bg-wakaba/10
                        ${isActive ? 'border-accent/20 shadow-2xl' : 'border-transparent shadow-sm'}`}
                      >
                        {book.image ? (
                          <img
                            src={book.image}
                            alt={book.title}
                            className="w-full h-auto block"
                          />
                        ) : (
                          <div className="aspect-[2/3] flex items-center justify-center p-3">
                            <h3 className={`${isActive ? 'text-base' : 'text-[9px]'} font-serif font-bold leading-tight text-foreground text-center`}>
                              {book.title}
                            </h3>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-6" style={{ paddingLeft: `${offset}px` }}>
              <button
                type="button"
                onClick={prevBook}
                className="group flex items-center justify-center w-12 h-12 border border-accent/20 text-accent/50 hover:text-accent hover:border-accent bg-background hover:bg-wakaba-hover transition-all duration-200"
                aria-label="前の本へ"
              >
                <MoveLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-200" />
              </button>

              <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.25em] text-accent/40">
                <span className="text-accent font-bold text-sm">{(currentIndex + 1).toString().padStart(2, '0')}</span>
                <div className="w-8 h-[1px] bg-accent/20" />
                <span>{books.length.toString().padStart(2, '0')}</span>
              </div>

              <button
                type="button"
                onClick={nextBook}
                className="group flex items-center justify-center w-12 h-12 border border-accent/20 text-accent/50 hover:text-accent hover:border-accent bg-background hover:bg-wakaba-hover transition-all duration-200"
                aria-label="次の本へ"
              >
                <MoveRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>

        </div>

        {footerHref && (
          <div className="mt-8 flex justify-end">
            <Link href={footerHref} className="inline-flex items-center gap-4 border-b border-accent/30 pb-3 text-sm tracking-[0.2em] text-accent/60 font-serif transition hover:gap-6 hover:text-accent hover:border-accent">
              {footerLabel ?? '一覧へ'}
              <span>›</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
