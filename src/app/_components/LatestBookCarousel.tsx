'use client';

import { useState } from 'react';
import { Book } from '@/lib/books';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MoveLeft, MoveRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LatestBookCarouselProps {
  books: Book[];
}

export default function LatestBookCarousel({ books }: LatestBookCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const nextBook = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % books.length);
  };

  const prevBook = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + books.length) % books.length);
  };

  const handleBookClick = (index: number, id: number) => {
    if (index === currentIndex) {
      router.push(`/books/${id}`);
    } else {
      setCurrentIndex(index);
    }
  };

  const activeWidth = 280; // さらにコンパクトに
  const inactiveWidth = 140; // さらにコンパクトに
  const gap = 20; // 余白をさらに詰める
  const offset = 60;

  const currentBook = books[currentIndex];

  return (
    <section className="relative w-full bg-background overflow-hidden pt-8 pb-4 md:pt-10 md:pb-6 border-b border-border">
      
      <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Book Info (2/5) */}
          <div className="lg:col-span-2 min-h-[300px] flex flex-col pt-8">
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
                
                <p className="text-xs text-muted-foreground leading-relaxed max-w-sm font-serif">
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

          {/* Right Column: Carousel Track (3/5) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* Carousel Area */}
            <div className="relative overflow-hidden -mr-6 md:-mr-12 lg:-mr-24 py-8">
              <div 
                className="flex transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] items-center"
                style={{ 
                  gap: `${gap}px`,
                  transform: `translateX(calc(${offset}px - ${currentIndex * (inactiveWidth + gap)}px))` 
                }}
              >
                {books.map((book, index) => {
                  const isActive = index === currentIndex;
                  return (
                    <motion.div
                      key={book.id}
                      animate={{
                        width: isActive ? activeWidth : inactiveWidth,
                        opacity: isActive ? 1 : 0.6,
                        zIndex: isActive ? 10 : 0
                      }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className={`shrink-0 aspect-[2/3] cursor-pointer`}
                      onClick={() => handleBookClick(index, book.id)}
                    >
                      <div className={`w-full h-full bg-wakaba/30 flex items-center justify-center text-center border relative group overflow-hidden transition-all duration-700 
                        ${isActive 
                          ? 'border-accent/20 shadow-xl' 
                          : 'border-transparent'
                        }`}
                      >
                        {book.image ? (
                          <img 
                            src={book.image} 
                            alt={book.title} 
                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700`}
                          />
                        ) : (
                          <div className="p-3 relative z-10">
                            <h3 className={`${isActive ? 'text-base md:text-lg' : 'text-[9px]'} font-serif font-bold mb-1 leading-tight text-foreground`}>
                              {book.title}
                            </h3>
                          </div>
                        )}
                        {!isActive && (
                          <div className="absolute inset-0 bg-wakaba/10 opacity-20 transition-opacity duration-300 z-20" />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Persistent Navigation */}
            <div className="flex items-center justify-end gap-8 pr-6 md:pr-12 lg:pr-24">
              <div className="flex items-center gap-3">
                <button 
                  type="button"
                  onClick={prevBook}
                  className="group flex items-center justify-center w-9 h-9 border border-accent/10 text-accent/40 hover:text-accent hover:border-accent hover:bg-wakaba-hover transition-all duration-300 bg-background"
                  aria-label="前の本へ"
                >
                  <MoveLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-300 stroke-[1.5px]" />
                </button>
                <button 
                  type="button"
                  onClick={nextBook}
                  className="group flex items-center justify-center w-9 h-9 border border-accent/10 text-accent/40 hover:text-accent hover:border-accent hover:bg-wakaba-hover transition-all duration-300 bg-background"
                  aria-label="次の本へ"
                >
                  <MoveRight size={14} className="group-hover:translate-x-1 transition-transform duration-300 stroke-[1.5px]" />
                </button>
              </div>

              <div className="flex flex-col items-end">
                <div className="flex items-center gap-3 font-mono text-[8px] tracking-[0.3em] text-accent/40 uppercase">
                  <span className="text-accent font-bold">{(currentIndex + 1).toString().padStart(2, '0')}</span>
                  <div className="w-6 h-[1px] bg-accent/20"></div>
                  <span>{books.length.toString().padStart(2, '0')}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
