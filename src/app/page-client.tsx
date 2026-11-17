'use client';

import { useState } from 'react';
import { Book } from "@/lib/books";
import { News } from "@/lib/notion-service";
import Link from "next/link";
import { motion } from 'framer-motion';
import { getCategoryColor } from "@/lib/category-colors";
import LatestBookCarousel from "./_components/LatestBookCarousel";

interface HomeClientProps {
  latestBooks: Book[];
  featuredBooks: Book[];
  newArrivals: Book[];
  initialNews: News[];
}

export default function HomeClient({ latestBooks, featuredBooks, newArrivals, initialNews }: HomeClientProps) {
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
              src="/topphoto.jpg" 
              alt="萌書房の原風景" 
              className="w-full h-full object-cover object-center max-md:object-[85%_center] grayscale-[0.1] brightness-110 opacity-60 blur-[2px] contrast-[0.95]"
            />
          </motion.div>
          {/* Subtle gradient overlay to help text legibility */}
          <div className="absolute inset-0 bg-gradient-to-l from-black/30 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-white/10 pointer-events-none" />
        </div>

        <div className="relative z-10 w-full px-6 sm:pl-12 sm:pr-24 md:pl-24 md:pr-48 lg:pl-32 lg:pr-64 flex justify-center sm:justify-end">
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
          >
            <div className="flex flex-col items-start gap-10 sm:gap-16 md:gap-20 [writing-mode:vertical-rl] h-[600px] xs:h-[800px] sm:h-[900px] md:h-[650px]">
              <span className="text-2xl xs:text-3xl sm:text-4xl md:text-2xl lg:text-3xl font-serif font-medium text-white tracking-[0.3em] pt-4 md:pt-8 whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                まだ言葉にならない思考を、
              </span>
              <h1 className="text-5xl xs:text-6xl sm:text-7xl md:text-6xl lg:text-7xl font-serif font-bold text-white tracking-[0.5em] leading-none drop-shadow-[0_4px_25px_rgba(0,0,0,0.6)] whitespace-nowrap pt-48 xs:pt-64 sm:pt-80 md:pt-48 ml-0">
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

      {/* 2. 新着書籍 */}
      <section className="py-16 md:py-32 bg-background relative overflow-hidden border-y border-accent/5">
        <div className="absolute top-20 left-[-5%] w-[30%] h-[30%] bg-accent/[0.01] rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-20 right-[-5%] w-[30%] h-[30%] bg-accent/[0.02] rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-[1260px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
          <div className="flex flex-col mb-24 items-center">
            <h2 className="text-3xl font-serif font-bold text-foreground tracking-widest relative">
              新着書籍
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-[1.5px] bg-accent/40"></div>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 lg:gap-32">
            {newArrivals.map((book, i) => {
              return (
                <div key={i} className={`group relative px-8 lg:px-12 py-4 lg:py-8 transition-all duration-500 ease-out hover:-translate-y-2 border border-border/40 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02),0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.12),0_18px_36px_-18px_rgba(0,0,0,0.08)] ${book.color && !book.color.startsWith('#') ? book.color : 'bg-stone-800'}`} style={book.color && book.color.startsWith('#') ? { backgroundColor: book.color } : {}}>
                  <div className="absolute top-4 right-4 text-[8px] font-serif font-bold tracking-[0.2em] text-white/40 uppercase">New</div>
                  <div className="flex flex-row gap-6 lg:gap-12 items-start relative">
                    <div className="relative w-32 sm:w-40 lg:w-48 shrink-0 -mt-12 lg:-mt-20 -ml-4 lg:-ml-8 drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)] group-hover:drop-shadow-[0_35px_60px_rgba(0,0,0,0.4)] transition-all duration-700">
                      <Link href={`/books/${book.id}`} className="block relative aspect-[2/3] transition-all duration-700">
                        {book.image && <img
                          src={book.image}
                          alt={book.title}
                          className="w-full h-full object-contain grayscale-[0.1] group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-105"
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
          <div className="mt-20 flex justify-end">
            <Link href="/books" className="inline-flex items-center gap-4 border-b border-accent/30 pb-3 text-sm tracking-[0.2em] text-accent/60 font-serif transition hover:gap-6 hover:text-accent hover:border-accent">
              刊行書籍一覧へ
              <span>›</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. 注目の書籍 */}
      <LatestBookCarousel
        books={featuredBooks}
        title="注目の書籍"
        footerHref="/books"
        footerLabel="刊行書籍一覧へ"
      />

      {/* 4. お知らせ */}
      <section className="py-16 md:py-32 bg-background border-t border-accent/5">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex flex-col mb-20 items-center">
            <h2 className="text-3xl font-serif font-bold text-foreground tracking-widest relative">
              お知らせ
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-[1.5px] bg-accent/40"></div>
            </h2>
          </div>

          <div className="divide-y divide-accent/5">
            {initialNews.slice(0, 5).map((item, index) => {
              const href = item.category === '新刊情報'
                ? (item.relatedUrl1 ? `/books/${item.relatedUrl1}` : null)
                : `/news/${item.slug}`;
              const inner = (
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-10">
                  <div className="flex items-center md:w-56 shrink-0 gap-8">
                    <span className="text-sm text-accent/40 font-serif leading-none tracking-wider font-bold w-20">
                      {item.date.replace(/-/g, '.')}
                    </span>
                    <div className="w-24 flex justify-start">
                      <span className={`text-[9px] tracking-[0.1em] border px-2 py-0.5 font-bold font-serif w-full text-center truncate ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <span className={`text-base text-foreground flex-1 leading-snug font-serif ${href ? 'group-hover:text-accent transition-colors' : ''}`}>
                    {item.important && <span className="text-accent font-bold mr-2">【重要】</span>}
                    {item.title}
                  </span>
                </div>
              );
              return href ? (
                <Link key={index} href={href} className="group block py-5 first:pt-0 last:pb-0">
                  {inner}
                </Link>
              ) : (
                <div key={index} className="block py-5 first:pt-0 last:pb-0">
                  {inner}
                </div>
              );
            })}
          </div>
          <div className="mt-12 flex justify-end">
            <Link href="/news" className="inline-flex items-center gap-4 border-b border-accent/30 pb-3 text-sm tracking-[0.2em] text-accent/60 font-serif transition hover:gap-6 hover:text-accent hover:border-accent">
              お知らせ一覧を見る
              <span>›</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. 哲学・コンセプト */}
      <section className="relative overflow-hidden bg-[#fbfcf8] py-16 md:py-28 border-t border-accent/5">
        {/* 背景の淡いグリーン */}
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#edf6df] via-[#f7fbef] to-transparent" />
        <div className="absolute right-[15%] top-64 h-32 w-32 rounded-full bg-[#cfe4ad]/30" />
        {/* 左側の散らし装飾 */}
        <div className="absolute left-[4%] top-12 h-20 w-20 rounded-full bg-[#dcecc5]/40 blur-lg" />
        <div className="absolute left-[12%] bottom-16 h-28 w-28 rounded-full bg-[#c8e0a0]/30 blur-xl" />
        <div className="absolute left-[2%] top-1/2 h-14 w-14 rounded-full bg-[#b7d58b]/25 blur-md" />
        <div className="absolute left-[18%] top-8 h-10 w-10 rounded-full bg-[#cfe4ad]/35 blur-sm" />
        <div className="absolute left-[8%] bottom-8 h-8 w-8 rounded-full bg-[#9ab673]/20 blur-sm" />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 md:grid-cols-2 md:px-12">
          {/* 左：若葉イラスト */}
          <div className="flex items-center justify-center md:justify-end md:pr-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: "easeOut" }}
            >
              <svg width="260" height="340" viewBox="0 0 260 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-70">
                {/* ── 棚板 ── */}
                <rect x="36" y="296" width="188" height="5" rx="1" fill="#b8a880" fillOpacity="0.35" stroke="#8a7a60" strokeWidth="0.5" strokeOpacity="0.3"/>

                {/* ── 本A（左・やや低め） ── */}
                {/* スパイン */}
                <rect x="44" y="224" width="14" height="72" rx="1" fill="#8fa878" fillOpacity="0.45" stroke="#6a8a58" strokeWidth="0.7"/>
                {/* 表紙 */}
                <rect x="58" y="224" width="40" height="72" rx="1" fill="#d4e8c4" fillOpacity="0.28" stroke="#7a9e5f" strokeWidth="0.7"/>
                {/* ページの小口（右端） */}
                <rect x="98" y="226" width="3" height="68" rx="0.5" fill="#e8e0d0" fillOpacity="0.5" stroke="#b0a888" strokeWidth="0.4"/>
                {/* ページ線 */}
                <line x1="98" y1="232" x2="101" y2="232" stroke="#b0a888" strokeWidth="0.3" strokeOpacity="0.6"/>
                <line x1="98" y1="240" x2="101" y2="240" stroke="#b0a888" strokeWidth="0.3" strokeOpacity="0.6"/>
                <line x1="98" y1="248" x2="101" y2="248" stroke="#b0a888" strokeWidth="0.3" strokeOpacity="0.6"/>
                <line x1="98" y1="256" x2="101" y2="256" stroke="#b0a888" strokeWidth="0.3" strokeOpacity="0.6"/>
                <line x1="98" y1="264" x2="101" y2="264" stroke="#b0a888" strokeWidth="0.3" strokeOpacity="0.6"/>
                <line x1="98" y1="272" x2="101" y2="272" stroke="#b0a888" strokeWidth="0.3" strokeOpacity="0.6"/>
                <line x1="98" y1="280" x2="101" y2="280" stroke="#b0a888" strokeWidth="0.3" strokeOpacity="0.6"/>
                <line x1="98" y1="288" x2="101" y2="288" stroke="#b0a888" strokeWidth="0.3" strokeOpacity="0.6"/>

                {/* ── 本B（中央・一番背が高い・ここから芽） ── */}
                <rect x="106" y="200" width="16" height="96" rx="1" fill="#7a9e5f" fillOpacity="0.5" stroke="#5a7e45" strokeWidth="0.7"/>
                <rect x="122" y="200" width="46" height="96" rx="1" fill="#e8f0e0" fillOpacity="0.28" stroke="#7a9e5f" strokeWidth="0.7"/>
                <rect x="168" y="202" width="3" height="92" rx="0.5" fill="#e8e0d0" fillOpacity="0.5" stroke="#b0a888" strokeWidth="0.4"/>
                <line x1="168" y1="210" x2="171" y2="210" stroke="#b0a888" strokeWidth="0.3" strokeOpacity="0.6"/>
                <line x1="168" y1="220" x2="171" y2="220" stroke="#b0a888" strokeWidth="0.3" strokeOpacity="0.6"/>
                <line x1="168" y1="230" x2="171" y2="230" stroke="#b0a888" strokeWidth="0.3" strokeOpacity="0.6"/>
                <line x1="168" y1="240" x2="171" y2="240" stroke="#b0a888" strokeWidth="0.3" strokeOpacity="0.6"/>
                <line x1="168" y1="250" x2="171" y2="250" stroke="#b0a888" strokeWidth="0.3" strokeOpacity="0.6"/>
                <line x1="168" y1="260" x2="171" y2="260" stroke="#b0a888" strokeWidth="0.3" strokeOpacity="0.6"/>
                <line x1="168" y1="270" x2="171" y2="270" stroke="#b0a888" strokeWidth="0.3" strokeOpacity="0.6"/>
                <line x1="168" y1="280" x2="171" y2="280" stroke="#b0a888" strokeWidth="0.3" strokeOpacity="0.6"/>
                <line x1="168" y1="288" x2="171" y2="288" stroke="#b0a888" strokeWidth="0.3" strokeOpacity="0.6"/>

                {/* ── 本C（右・中程度） ── */}
                <rect x="176" y="216" width="13" height="80" rx="1" fill="#a89870" fillOpacity="0.4" stroke="#8a7a50" strokeWidth="0.7"/>
                <rect x="189" y="216" width="40" height="80" rx="1" fill="#f0e8d4" fillOpacity="0.24" stroke="#a89870" strokeWidth="0.7"/>
                <rect x="229" y="218" width="3" height="76" rx="0.5" fill="#e8e0d0" fillOpacity="0.45" stroke="#b0a888" strokeWidth="0.4"/>

                {/* ── 茎（本Bの天辺から伸びる） ── */}
                <path d="M114 200 C113 165 111 125 108 85 C105 48 106 22 110 4" stroke="#7a9e5f" strokeWidth="1.4" strokeLinecap="round"/>

                {/* ── 葉 ── */}
                {/* 右 大葉 */}
                <path d="M112 168 C136 152 164 140 176 116 C188 92 176 64 154 62 C132 60 112 86 112 168Z" fill="#9ab673" fillOpacity="0.26" stroke="#7a9e5f" strokeWidth="0.9" strokeOpacity="0.55"/>
                <path d="M112 168 C130 138 146 106 154 62" stroke="#7a9e5f" strokeWidth="0.6" strokeOpacity="0.4" strokeLinecap="round"/>
                {/* 左 大葉 */}
                <path d="M110 148 C84 134 52 128 38 104 C24 80 38 52 62 52 C86 52 108 76 110 148Z" fill="#9ab673" fillOpacity="0.22" stroke="#7a9e5f" strokeWidth="0.9" strokeOpacity="0.5"/>
                <path d="M110 148 C94 118 74 84 62 52" stroke="#7a9e5f" strokeWidth="0.6" strokeOpacity="0.4" strokeLinecap="round"/>
                {/* 右 小葉 */}
                <path d="M111 86 C130 74 150 62 156 44 C162 26 152 8 136 10 C120 12 110 30 111 86Z" fill="#b7d58b" fillOpacity="0.28" stroke="#7a9e5f" strokeWidth="0.75" strokeOpacity="0.45"/>
                <path d="M111 86 C124 60 134 32 136 10" stroke="#7a9e5f" strokeWidth="0.5" strokeOpacity="0.38" strokeLinecap="round"/>
                {/* 左 小葉 */}
                <path d="M108 106 C88 94 64 88 54 68 C44 48 56 28 74 30 C92 32 108 54 108 106Z" fill="#b7d58b" fillOpacity="0.24" stroke="#7a9e5f" strokeWidth="0.75" strokeOpacity="0.45"/>

                {/* 先端のつぼみ */}
                <circle cx="110" cy="4" r="3.5" fill="#b7d58b" fillOpacity="0.6"/>
                <circle cx="110" cy="4" r="1.8" fill="#7a9e5f" fillOpacity="0.75"/>
              </svg>
            </motion.div>
          </div>

          {/* 右：本文 */}
          <div className="font-serif text-[15px] leading-[2.4] tracking-[0.08em] text-stone-700 md:pt-24">
            <p>
              2001年1月、新世紀への移行と軌を一にするかのように、
              それまで流布・通用し、人々の信頼を得ていた価値観あるいは技術が、
              急激な変容を迫られるようになりました。
            </p>

            <p className="mt-8">
              小社はそのような時代状況の下、古都奈良の地に産声を上げました。
              「萌」という字のごとく、芽生えつつある新たなる思想を、
              「本」を通して世に問うていきます。
            </p>

            <Link
              href="/about"
              className="mt-12 inline-flex items-center gap-4 border-b border-[#9ab673] pb-3 text-sm tracking-[0.2em] text-[#5f7f4f] transition hover:gap-6"
            >
              萌書房について詳しく見る
              <span>›</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
