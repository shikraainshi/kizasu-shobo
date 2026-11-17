'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { News } from '@/lib/notion-service';
import { getCategoryColor } from '@/lib/category-colors';

const ALL = 'すべて';
const CATEGORIES = ['新刊情報', 'メディア掲載', 'イベント', 'お知らせ'];
const PAGE_SIZE = 20;

function getHref(item: News): string | null {
  if (item.category === '新刊情報') {
    return item.relatedUrl1 ? `/books/${item.relatedUrl1}` : null;
  }
  return `/news/${item.slug}`;
}

function getYear(date: string): string {
  const match = date.match(/^(\d{4})/);
  return match ? match[1] : '';
}

export default function NewsClient({ news: allNews }: { news: News[] }) {
  // タイトルが空の行（Notion の空ページなど）は出さない
  const news = useMemo(() => allNews.filter((item) => item.title.trim()), [allNews]);
  const [activeTab, setActiveTab] = useState(ALL);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // お知らせが1件以上あるカテゴリだけタブに出す
  const tabs = useMemo(
    () => [ALL, ...CATEGORIES.filter((c) => news.some((item) => item.category === c))],
    [news],
  );

  const filtered = activeTab === ALL ? news : news.filter((item) => item.category === activeTab);
  const visible = filtered.slice(0, visibleCount);
  const remaining = filtered.length - visible.length;

  // 年ごとにまとめる（並び順は受け取った順＝新しい順のまま）
  const groups: { year: string; items: News[] }[] = [];
  for (const item of visible) {
    const year = getYear(item.date);
    const last = groups[groups.length - 1];
    if (last && last.year === year) {
      last.items.push(item);
    } else {
      groups.push({ year, items: [item] });
    }
  }

  const selectTab = (tab: string) => {
    setActiveTab(tab);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <>
      {/* Tabs */}
      {tabs.length > 2 && (
        <div className="border-b border-accent/10 mb-2">
          <div className="max-w-4xl mx-auto px-6 flex gap-0 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => selectTab(tab)}
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
      )}

      {/* List */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {filtered.length === 0 ? (
              <p className="text-center text-accent/40 font-serif py-20 tracking-widest">該当するお知らせはありません</p>
            ) : (
              <div className="space-y-14">
                {groups.map((group) => (
                  <div key={group.year || 'unknown'}>
                    {group.year && (
                      <h2 className="text-lg font-serif font-bold text-accent/70 tracking-[0.2em] mb-2">
                        {group.year}年
                      </h2>
                    )}
                    <div className="divide-y divide-accent/5 border-t border-accent/10">
                      {group.items.map((item, index) => {
                        const href = getHref(item);
                        const inner = (
                          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-12 py-5 transition-all">
                            <div className="flex items-center gap-6 md:w-48 shrink-0">
                              <span className="text-[11px] text-accent/50 font-mono tabular-nums leading-none tracking-wider">
                                {item.date ? item.date.replace(/-/g, '.') : ''}
                              </span>
                              <span className={`text-[9px] tracking-[0.15em] border px-3 py-1 font-bold font-serif ${getCategoryColor(item.category)}`}>
                                {item.category}
                              </span>
                            </div>

                            <span className="text-sm md:text-base text-foreground group-hover:text-accent transition-colors flex-1 leading-relaxed font-serif">
                              {item.important && <span className="text-accent font-bold mr-2">【重要】</span>}
                              {item.title.trim()}
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
                  </div>
                ))}
              </div>
            )}

            {remaining > 0 && (
              <div className="text-center mt-14">
                <button
                  onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                  className="px-10 py-3 border border-accent/30 text-accent text-sm font-serif tracking-[0.2em] hover:bg-accent hover:text-white transition-colors"
                >
                  もっと見る（残り{remaining}件）
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
