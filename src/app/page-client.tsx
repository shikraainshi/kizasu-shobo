'use client';

import { useState } from 'react';
import { Book } from "@/lib/books";
import { News } from "@/lib/notion-service";
import Link from "next/link";
import { motion } from 'framer-motion';

interface HomeClientProps {
  latestBooks: Book[];
  featuredBooks: Book[];
  initialNews: News[];
}

export default function HomeClient({ latestBooks, featuredBooks, initialNews }: HomeClientProps) {
  const [activeTab, setActiveTab] = useState("すべて");
  const [newsTab, setNewsTab] = useState("お知らせ");
  
  const CATEGORIES = ["すべて", "思想・哲学", "歴史", "社会・政治", "文学・論集"];

  return (
    <main className="min-h-screen bg-background">
      {/* 1. Hero Vision Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden border-b border-accent/5">
        <div className="absolute inset-0 z-0">
          <motion.div 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            className="w-full h-full"
          >
            <img 
              src="/sky_background.jpg" 
              alt="萌書房の原風景" 
              className="w-full h-full object-cover grayscale-[0.3] brightness-90 contrast-[1.05]"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/10" />
        </div>

        <div className="relative z-10 w-full pl-12 pr-24 md:pl-24 md:pr-48 lg:pl-32 lg:pr-64 flex justify-end">
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
          >
            <div className="flex flex-col items-start gap-10 md:gap-20 [writing-mode:vertical-rl] h-[450px] md:h-[600px]">
              <span className="text-lg md:text-2xl lg:text-3xl font-serif font-medium text-white/90 tracking-[0.3em] pt-4 md:pt-8 whitespace-nowrap">
                まだ言葉にならない思考を、
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white tracking-[0.5em] leading-none drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)] whitespace-nowrap pt-24 md:pt-32">
                かたちにする。
              </h1>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-white/60 to-transparent" />
        </motion.div>
      </section>

      {/* 2. 話題の本 */}
      <section className="py-32 bg-[#f2f0ed] relative overflow-hidden border-y border-accent/5">
        <div className="absolute top-20 left-[-5%] w-[30%] h-[30%] bg-accent/[0.01] rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-20 right-[-5%] w-[30%] h-[30%] bg-accent/[0.02] rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-[1260px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
          <div className="flex flex-col mb-24 items-center">
            <h2 className="text-3xl font-serif font-bold text-foreground tracking-widest relative">
              注目の書籍
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-[1.5px] bg-accent/40"></div>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 lg:gap-32">
            {featuredBooks.map((book, i) => {
              return (
                <div key={i} className={`group relative px-8 lg:px-12 py-4 lg:py-8 transition-all duration-500 ease-out hover:-translate-y-2 border border-border/40 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02),0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.12),0_18px_36px_-18px_rgba(0,0,0,0.08)] ${book.color && !book.color.startsWith('#') ? book.color : 'bg-stone-800'}`} style={book.color && book.color.startsWith('#') ? { backgroundColor: book.color } : {}}>
                  <div className="absolute top-4 right-4 text-[8px] font-serif font-bold tracking-[0.2em] text-white/20 uppercase">Recommend</div>
                  <div className="flex flex-row gap-6 lg:gap-12 items-start relative">
                    <div className="relative w-32 sm:w-40 lg:w-48 shrink-0 -mt-12 lg:-mt-20 -ml-4 lg:-ml-8 drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)] group-hover:drop-shadow-[0_35px_60px_rgba(0,0,0,0.4)] transition-all duration-700">
                      <Link href={`/books/${book.id}`} className="block relative aspect-[3/4] overflow-hidden transition-all duration-700">
                        {book.image && <img 
                          src={book.image} 
                          alt={book.title} 
                          className="w-full h-full object-cover grayscale-[0.1] group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-105" 
                        />}
                      </Link>
                    </div>
                    <div className="flex-1 space-y-3 pl-4 lg:pl-6 relative">
                      <div className="absolute left-0 top-1 w-[2px] h-10 bg-white/30 group-hover:h-14 group-hover:bg-white/60 transition-all duration-500"></div>
                      <div className="space-y-2 text-left">
                        <div className="inline-block text-[10px] font-bold tracking-[0.4em] text-white/60 uppercase font-serif mb-1">
                          {book.category}
                        </div>
                        <h3 className="text-lg lg:text-2xl font-serif font-bold text-white group-hover:text-white/80 transition-colors duration-500 line-clamp-2 leading-snug">
                          <Link href={`/books/${book.id}`}>{book.title}</Link>
                        </h3>
                        <div className="flex items-center justify-start gap-3 py-1">
                          <p className="text-xs text-white/80 font-serif italic">
                            {book.author} <span className="text-[9px] text-white/50 not-italic ml-0.5">著</span>
                          </p>
                        </div>
                      </div>
                      <p className="text-[11px] text-white/90 leading-relaxed font-serif line-clamp-3 lg:line-clamp-4 text-left">
                        {book.description}
                      </p>
                      <div className="pt-2 flex justify-start">
                        <Link href={`/books/${book.id}`} className="text-[9px] font-bold text-white/70 uppercase tracking-[0.3em] font-serif border-b border-white/20 hover:border-white hover:text-white transition-all">詳細を見る</Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. お知らせ & イベント */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="flex items-center gap-6 mb-6 border-b border-border">
            <button 
              onClick={() => setNewsTab("お知らせ")}
              className={`pb-3 text-base font-serif font-bold tracking-widest transition-all relative ${
                newsTab === "お知らせ" ? "text-accent" : "text-accent/30 hover:text-accent/60"
              }`}
            >
              お知らせ
              {newsTab === "お知らせ" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent" />}
            </button>
            <button 
              onClick={() => setNewsTab("イベント")}
              className={`pb-3 text-base font-serif font-bold tracking-widest transition-all relative ${
                newsTab === "イベント" ? "text-accent" : "text-accent/30 hover:text-accent/60"
              }`}
            >
              イベント
              {newsTab === "イベント" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent" />}
            </button>
          </div>

          <div className="divide-y divide-accent/5">
            {initialNews.slice(0, 5).map((item, index) => (
              <Link key={index} href={`/news/${item.slug}`} className="group block py-5 first:pt-0 last:pb-0">
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-10">
                  <div className="flex items-center md:w-56 shrink-0 gap-8">
                    <span className="text-sm text-accent/40 font-serif leading-none tracking-wider font-bold w-20">
                      {item.date.replace(/-/g, '.')}
                    </span>
                    <div className="w-24 flex justify-start">
                      <span className="text-[9px] uppercase tracking-[0.1em] bg-accent/5 text-accent border border-accent/10 px-2 py-0.5 font-bold font-serif w-full text-center truncate">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <span className="text-base text-foreground group-hover:text-accent transition-colors flex-1 leading-snug font-serif">
                    {item.important && <span className="text-accent font-bold mr-2">【重要】</span>}
                    {item.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 哲学・コンセプト */}
      <section className="py-40 bg-wakaba/5 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 relative">
            {/* 左側：画像 */}
            <div className="w-full md:w-1/2 relative md:-mt-24">
              <div className="aspect-video bg-wakaba/10 overflow-hidden border border-border">
                 <div className="w-full h-full bg-[url('/sky_background.jpg')] bg-cover bg-center grayscale-[0.4] opacity-70" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 border-r border-b border-accent/10 -z-10" />
            </div>

            {/* 右側：コンテンツ */}
            <div className="flex-1 flex flex-col gap-8 md:gap-24 md:pl-8">
              <h3 className="text-3xl md:text-5xl font-serif font-bold text-accent tracking-[0.3em] z-20">
                「芽生え。」
              </h3>

              <div className="space-y-4 text-foreground/80 text-sm leading-relaxed font-serif max-w-lg">
                <p>
                  いまだ明確な輪郭を結ばないものの、芽生えつつある新世紀の思想を、出版ということを通して世に問い、その強度が増していくことに貢献したいと考えております。
                </p>
                <p>
                  2001年、奈良の地で産声を上げた萌書房は、新しい時代の兆しを支え続けます。
                </p>
              </div>
              <div className="mt-0 md:-mt-4 flex justify-start md:pl-96">
                <Link href="/about" className="group flex items-center gap-4">
                  <span className="text-[12px] font-bold tracking-[0.5em] uppercase text-accent/80 font-serif group-hover:text-accent transition-colors">萌書房について</span>
                  <div className="w-12 h-[1px] bg-accent/30 group-hover:w-16 group-hover:bg-accent transition-all duration-500" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
