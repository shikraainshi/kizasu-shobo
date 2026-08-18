'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Plus } from 'lucide-react';
import type { EventDoc, EventStatus } from '@/lib/events';

const STATUS_LABEL: Record<EventStatus, string> = {
  draft: '下書き',
  published: '公開',
  closed: '受付終了',
};

export default function EventsAdminClient({ events }: { events: EventDoc[] }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'' | EventStatus>('');

  const filtered = useMemo(() => {
    return events.filter((event) => {
      if (query) {
        const q = query.toLowerCase();
        const haystack = event.title.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (statusFilter && event.status !== statusFilter) return false;
      return true;
    });
  }, [events, query, statusFilter]);

  const goToEdit = (eventId: string) => router.push(`/admin/events/${eventId}/edit`);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-serif font-bold text-foreground tracking-[0.1em]">イベント一覧</h1>
        <Link
          href="/admin/events/new"
          className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase bg-accent text-white px-5 py-3 hover:bg-accent/90 transition-all font-serif"
        >
          <Plus size={14} />
          新規イベントを追加
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-accent/60" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="イベント名で検索"
            className="w-full bg-background border border-accent/30 pl-9 pr-4 py-2.5 text-sm font-serif text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/10 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as '' | EventStatus)}
          className="bg-background border border-accent/30 px-4 py-2.5 text-sm font-serif text-foreground focus:outline-none focus:border-accent"
        >
          <option value="">公開状態すべて</option>
          <option value="draft">下書き</option>
          <option value="published">公開</option>
          <option value="closed">受付終了</option>
        </select>
        <div className="flex items-center text-xs text-foreground/70 font-serif font-medium px-2">
          {filtered.length} / {events.length} 件
        </div>
      </div>

      <div className="border-2 border-foreground/15 overflow-x-auto bg-background">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="bg-wakaba-base/40 text-left text-[11px] font-bold tracking-[0.1em] uppercase text-foreground/80 font-serif border-b-2 border-foreground/15">
              <th className="p-3">イベント名</th>
              <th className="p-3 text-right">参加費</th>
              <th className="p-3">定員</th>
              <th className="p-3">状態</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((event) => (
              <tr
                key={event.id}
                onClick={() => goToEdit(event.id)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') goToEdit(event.id);
                }}
                className="border-t border-foreground/10 hover:bg-wakaba/40 focus:bg-wakaba/40 focus:outline-none cursor-pointer transition-colors"
              >
                <td className="p-3 text-sm font-serif text-foreground font-bold max-w-[280px]">{event.title}</td>
                <td className="p-3 text-sm font-serif text-foreground/90 text-right whitespace-nowrap tabular-nums">
                  {event.price > 0 ? `${event.price.toLocaleString()}円` : '無料'}
                </td>
                <td className="p-3 text-sm font-serif text-foreground/90 whitespace-nowrap tabular-nums">
                  {event.capacity ?? '無制限'}
                </td>
                <td className="p-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 tracking-wider ${
                      event.status === 'published'
                        ? 'bg-accent text-white'
                        : event.status === 'closed'
                          ? 'bg-foreground/40 text-white'
                          : 'bg-foreground/15 text-foreground/70'
                    }`}
                  >
                    {STATUS_LABEL[event.status]}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="p-10 text-center text-sm text-foreground/60 font-serif">
                  該当するイベントがありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
