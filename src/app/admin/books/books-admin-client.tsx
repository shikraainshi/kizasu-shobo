'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Plus, Star } from 'lucide-react';
import { Book } from '@/lib/books';
import { BOOK_CATEGORIES } from '@/lib/admin/constants';

export default function BooksAdminClient({ books }: { books: Book[] }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [publicFilter, setPublicFilter] = useState<'' | 'public' | 'draft'>('');
  const [featuredFilter, setFeaturedFilter] = useState<'' | 'featured' | 'not-featured'>('');

  const filtered = useMemo(() => {
    return books.filter((b) => {
      if (query) {
        const q = query.toLowerCase();
        const haystack = `${b.title}${b.author}${b.isbn}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (category && b.category !== category) return false;
      if (publicFilter === 'public' && !b.isPublic) return false;
      if (publicFilter === 'draft' && b.isPublic) return false;
      if (featuredFilter === 'featured' && !b.featured) return false;
      if (featuredFilter === 'not-featured' && b.featured) return false;
      return true;
    });
  }, [books, query, category, publicFilter, featuredFilter]);

  const goToEdit = (pageId?: string) => {
    if (pageId) router.push(`/admin/books/${pageId}/edit`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-serif font-bold text-foreground tracking-[0.1em]">書籍一覧</h1>
        <Link
          href="/admin/books/new"
          className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase bg-accent text-white px-5 py-3 hover:bg-accent/90 transition-all font-serif"
        >
          <Plus size={14} />
          新規書籍を追加
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-accent/60" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="書名・著者・ISBNで検索"
            className="w-full bg-background border border-accent/30 pl-9 pr-4 py-2.5 text-sm font-serif text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/10 transition-all"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-background border border-accent/30 px-4 py-2.5 text-sm font-serif text-foreground focus:outline-none focus:border-accent"
        >
          <option value="">すべてのカテゴリ</option>
          {BOOK_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={publicFilter}
          onChange={(e) => setPublicFilter(e.target.value as any)}
          className="bg-background border border-accent/30 px-4 py-2.5 text-sm font-serif text-foreground focus:outline-none focus:border-accent"
        >
          <option value="">公開状態すべて</option>
          <option value="public">公開のみ</option>
          <option value="draft">非公開のみ</option>
        </select>
        <select
          value={featuredFilter}
          onChange={(e) => setFeaturedFilter(e.target.value as any)}
          className="bg-background border border-accent/30 px-4 py-2.5 text-sm font-serif text-foreground focus:outline-none focus:border-accent"
        >
          <option value="">注目書籍すべて</option>
          <option value="featured">注目のみ</option>
          <option value="not-featured">注目以外</option>
        </select>
        <div className="flex items-center text-xs text-foreground/70 font-serif font-medium px-2">
          {filtered.length} / {books.length} 件
        </div>
      </div>

      <div className="border-2 border-foreground/15 overflow-x-auto bg-background">
        <table className="w-full min-w-[780px] border-collapse">
          <thead>
            <tr className="bg-wakaba-base/40 text-left text-[11px] font-bold tracking-[0.1em] uppercase text-foreground/80 font-serif border-b-2 border-foreground/15">
              <th className="p-3 w-16"></th>
              <th className="p-3">書名</th>
              <th className="p-3">著者</th>
              <th className="p-3">カテゴリ</th>
              <th className="p-3">刊行日</th>
              <th className="p-3 text-right">価格</th>
              <th className="p-3">状態</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((book) => (
              <tr
                key={book.notionPageId}
                onClick={() => goToEdit(book.notionPageId)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') goToEdit(book.notionPageId);
                }}
                className="border-t border-foreground/10 hover:bg-wakaba/40 focus:bg-wakaba/40 focus:outline-none cursor-pointer transition-colors"
              >
                <td className="p-3">
                  {book.image ? (
                    <img src={book.image} alt="" className="w-10 h-14 object-cover border border-foreground/15" />
                  ) : (
                    <div className="w-10 h-14 bg-wakaba/50 border border-foreground/15" />
                  )}
                </td>
                <td className="p-3 text-sm font-serif text-foreground max-w-[260px]">
                  <div className="font-bold">{book.title}</div>
                  <div className="text-[11px] text-foreground/60">#{book.id}</div>
                </td>
                <td className="p-3 text-sm font-serif text-foreground/90 font-medium whitespace-nowrap">{book.author}</td>
                <td className="p-3 text-sm font-serif text-foreground/90 font-medium whitespace-nowrap">{book.category || '—'}</td>
                <td className="p-3 text-sm font-serif text-foreground/90 font-medium whitespace-nowrap tabular-nums">{book.date || '—'}</td>
                <td className="p-3 text-sm font-serif text-foreground/90 font-medium text-right whitespace-nowrap tabular-nums">
                  {book.price || '—'}
                </td>
                <td className="p-3">
                  <div className="flex flex-col gap-1 items-start">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 tracking-wider ${
                        book.isPublic ? 'bg-accent text-white' : 'bg-foreground/15 text-foreground/70'
                      }`}
                    >
                      {book.isPublic ? '公開' : '非公開'}
                    </span>
                    {book.featured && (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-wakaba-base text-accent tracking-wider">
                        <Star size={10} fill="currentColor" />
                        注目
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-10 text-center text-sm text-foreground/60 font-serif">
                  該当する書籍がありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
