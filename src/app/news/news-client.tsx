'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { News } from '@/lib/notion-service';
import { getCategoryColor } from '@/lib/category-colors';

const TABS = ['すべて', '新刊情報', 'メディア掲載', 'イベント', 'お知らせ'];

function getHref(item: News): string | null {
  if (item.category === '新刊情報') {
    return item.relatedUrl1 ? `/books/${item.relatedUrl1}` : null;
  }
  return `/news/${item.slug}`;
}

export default function NewsClient({ news }: { news: News[] }) {
  const [activeTab, setActiveTab] = useState('すべて');

  const filtered = activeTab === 'すべて' ? news : news.filter((item) => item.category === activeTab);

  return (
    <>
      {/* Tabs */}
      <div className="border-b border-accent/10 mb-2">
        <div className="max-w-4xl mx-auto px-6 flex gap-0 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 px-5 py-4 text-xs font-bold tracking-[0.2em] font-serif border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-accent text-accent'
                  : 'border-transparent text-accent/40 hover:text-accent/70'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {filtered.length === 0 ? (
              <p className="text-center text-accent/40 font-serif py-20 tracking-widest">該当するお知らせはありません</p>
            ) : (
              <div className="divide-y divide-accent/5 border-t border-accent/5">
                {filtered.map((item, index) => {
                  const href = getHref(item);
                  const inner = (
                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12 py-10 transition-all">
                      <div className="flex items-center gap-6 md:w-48 shrink-0">
                        <span className="text-[11px] text-accent/50 font-mono tabular-nums leading-none tracking-wider">
                          {item.date ? item.date.replace(/-/g, '.') : ''}
                        </span>
                        <span className={`text-[9px] tracking-[0.15em] border px-3 py-1 font-bold font-serif ${getCategoryColor(item.category)}`}>
                          {item.category}
                        </span>
                      </div>

                      <span className="text-sm md:text-base text-foreground group-hover:text-accent transition-colors flex-1 leading-snug font-serif">
                        {item.important && <span className="text-accent font-bold mr-2">【重要】</span>}
                        {item.title}
                      </span>

                      {href && (
                        <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                          <ChevronRight size={20} className="text-accent/30" />
                        </div>
                      )}
                    </div>
                  );
                  return href ? (
                    <Link key={item.id || index} href={href} className="group block">
                      {inner}
                    </Link>
                  ) : (
                    <div key={item.id || index} className="group block">
                      {inner}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
