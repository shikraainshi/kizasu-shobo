'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Plus, AlertCircle } from 'lucide-react';
import { News } from '@/lib/notion-service';
import { NEWS_CATEGORIES } from '@/lib/admin/constants';

export default function NewsAdminClient({ news }: { news: News[] }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');

  const filtered = useMemo(() => {
    return news.filter((n) => {
      if (query && !n.title.toLowerCase().includes(query.toLowerCase())) return false;
      if (category && n.category !== category) return false;
      return true;
    });
  }, [news, query, category]);

  const goToEdit = (id: string) => router.push(`/admin/news/${id}/edit`);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-serif font-bold text-foreground tracking-[0.1em]">お知らせ一覧</h1>
        <Link
          href="/admin/news/new"
          className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase bg-accent text-white px-5 py-3 hover:bg-accent/90 transition-all font-serif"
        >
          <Plus size={14} />
          新規お知らせを追加
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-accent/60" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="タイトルで検索"
            className="w-full bg-background border border-accent/30 pl-9 pr-4 py-2.5 text-sm font-serif text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/10 transition-all"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-background border border-accent/30 px-4 py-2.5 text-sm font-serif text-foreground focus:outline-none focus:border-accent"
        >
          <option value="">すべてのカテゴリ</option>
          {NEWS_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <div className="flex items-center text-xs text-foreground/70 font-serif font-medium px-2">
          {filtered.length} / {news.length} 件
        </div>
      </div>

      <div className="border-2 border-foreground/15 overflow-x-auto bg-background">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="bg-wakaba-base/40 text-left text-[11px] font-bold tracking-[0.1em] uppercase text-foreground/80 font-serif border-b-2 border-foreground/15">
              <th className="p-3 whitespace-nowrap">日付</th>
              <th className="p-3">タイトル</th>
              <th className="p-3">カテゴリ</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr
                key={item.id}
                onClick={() => goToEdit(item.id)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') goToEdit(item.id);
                }}
                className="border-t border-foreground/10 hover:bg-wakaba/40 focus:bg-wakaba/40 focus:outline-none cursor-pointer transition-colors"
              >
                <td className="p-3 text-sm font-serif text-foreground/90 font-medium whitespace-nowrap tabular-nums">{item.date}</td>
                <td className="p-3 text-sm font-serif text-foreground font-bold max-w-[420px]">{item.title}</td>
                <td className="p-3 text-sm font-serif text-foreground/90 font-medium whitespace-nowrap">{item.category || '—'}</td>
                <td className="p-3">
                  {item.important && (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-accent text-white tracking-wider w-fit">
                      <AlertCircle size={10} />
                      重要
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="p-10 text-center text-sm text-foreground/60 font-serif">
                  該当するお知らせがありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
