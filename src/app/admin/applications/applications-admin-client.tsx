'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Download } from 'lucide-react';
import type { ApplicationDoc, ApplicationStatus } from '@/lib/applications';

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  pending_payment: '決済待ち',
  paid: '決済済み',
  canceled: 'キャンセル',
  failed: '決済失敗',
};

const STATUS_BADGE: Record<ApplicationStatus, string> = {
  pending_payment: 'bg-foreground/15 text-foreground/70',
  paid: 'bg-accent text-white',
  canceled: 'bg-foreground/40 text-white',
  failed: 'bg-red-100 text-red-600',
};

function toCsv(applications: ApplicationDoc[]): string {
  const header = [
    'イベント',
    '氏名',
    '電話番号',
    'メール',
    '人数',
    '金額',
    '居住エリア',
    'きっかけ',
    'ステータス',
    '定員超過',
    '申込日時',
  ];
  const rows = applications.map((a) => [
    a.eventTitle,
    a.name,
    a.phone,
    a.email,
    String(a.participantCount),
    String(a.amount),
    a.area || '',
    a.source || '',
    STATUS_LABEL[a.status],
    a.overbooked ? 'はい' : '',
    a.createdAt,
  ]);
  return [header, ...rows]
    .map((row) => row.map((cell) => `"${(cell ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\r\n');
}

export default function ApplicationsAdminClient({ applications }: { applications: ApplicationDoc[] }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'' | ApplicationStatus>('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const eventTitles = useMemo(
    () => Array.from(new Set(applications.map((a) => a.eventTitle))).sort(),
    [applications]
  );

  const filtered = useMemo(() => {
    return applications.filter((a) => {
      if (query) {
        const q = query.toLowerCase();
        const haystack = `${a.name}${a.email}${a.phone}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (eventFilter && a.eventTitle !== eventFilter) return false;
      if (statusFilter && a.status !== statusFilter) return false;
      return true;
    });
  }, [applications, query, eventFilter, statusFilter]);

  const handleStatusChange = async (applicationId: string, status: ApplicationStatus) => {
    setUpdatingId(applicationId);
    try {
      const res = await fetch(`/api/admin/applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      alert('ステータスの更新に失敗しました。');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExportCsv = () => {
    const csv = toCsv(filtered);
    const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `applications_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-serif font-bold text-foreground tracking-[0.1em]">申し込み履歴</h1>
        <button
          onClick={handleExportCsv}
          className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase bg-accent text-white px-5 py-3 hover:bg-accent/90 transition-all font-serif"
        >
          <Download size={14} />
          CSVダウンロード
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-accent/60" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="氏名・メール・電話番号で検索"
            className="w-full bg-background border border-accent/30 pl-9 pr-4 py-2.5 text-sm font-serif text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/10 transition-all"
          />
        </div>
        <select
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
          className="bg-background border border-accent/30 px-4 py-2.5 text-sm font-serif text-foreground focus:outline-none focus:border-accent"
        >
          <option value="">すべてのイベント</option>
          {eventTitles.map((title) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as '' | ApplicationStatus)}
          className="bg-background border border-accent/30 px-4 py-2.5 text-sm font-serif text-foreground focus:outline-none focus:border-accent"
        >
          <option value="">ステータスすべて</option>
          {(Object.keys(STATUS_LABEL) as ApplicationStatus[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
        <div className="flex items-center text-xs text-foreground/70 font-serif font-medium px-2">
          {filtered.length} / {applications.length} 件
        </div>
      </div>

      <div className="border-2 border-foreground/15 overflow-x-auto bg-background">
        <table className="w-full min-w-[1100px] border-collapse">
          <thead>
            <tr className="bg-wakaba-base/40 text-left text-[11px] font-bold tracking-[0.1em] uppercase text-foreground/80 font-serif border-b-2 border-foreground/15">
              <th className="p-3">イベント</th>
              <th className="p-3">氏名</th>
              <th className="p-3">電話番号</th>
              <th className="p-3">メール</th>
              <th className="p-3">人数</th>
              <th className="p-3 text-right">金額</th>
              <th className="p-3">エリア</th>
              <th className="p-3">きっかけ</th>
              <th className="p-3">申込日時</th>
              <th className="p-3">ステータス</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="border-t border-foreground/10">
                <td className="p-3 text-sm font-serif text-foreground font-bold max-w-[220px]">{a.eventTitle}</td>
                <td className="p-3 text-sm font-serif text-foreground/90 whitespace-nowrap">{a.name}</td>
                <td className="p-3 text-sm font-serif text-foreground/90 whitespace-nowrap">{a.phone}</td>
                <td className="p-3 text-sm font-serif text-foreground/90 whitespace-nowrap">{a.email}</td>
                <td className="p-3 text-sm font-serif text-foreground/90 tabular-nums">{a.participantCount}</td>
                <td className="p-3 text-sm font-serif text-foreground/90 text-right whitespace-nowrap tabular-nums">
                  {a.amount.toLocaleString()}円
                </td>
                <td className="p-3 text-sm font-serif text-foreground/70 whitespace-nowrap">{a.area || '—'}</td>
                <td className="p-3 text-sm font-serif text-foreground/70 whitespace-nowrap">{a.source || '—'}</td>
                <td className="p-3 text-sm font-serif text-foreground/70 whitespace-nowrap">
                  {a.createdAt ? new Date(a.createdAt).toLocaleString('ja-JP') : '—'}
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <select
                      value={a.status}
                      disabled={updatingId === a.id}
                      onChange={(e) => handleStatusChange(a.id, e.target.value as ApplicationStatus)}
                      className={`text-[10px] font-bold px-2 py-1 tracking-wider border-0 focus:outline-none cursor-pointer ${STATUS_BADGE[a.status]}`}
                    >
                      {(Object.keys(STATUS_LABEL) as ApplicationStatus[]).map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABEL[s]}
                        </option>
                      ))}
                    </select>
                    {a.overbooked && (
                      <span className="text-[10px] font-bold px-2 py-1 tracking-wider bg-red-100 text-red-600 whitespace-nowrap">
                        定員超過
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} className="p-10 text-center text-sm text-foreground/60 font-serif">
                  該当する申し込みがありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
