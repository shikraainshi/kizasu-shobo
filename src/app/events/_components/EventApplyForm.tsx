'use client';

import { useEffect, useState } from 'react';
import type { EventDoc } from '@/lib/events';
import { AREA_OPTIONS, SOURCE_OPTIONS } from '@/lib/applications-constants';
import { getLiffUserId } from '@/lib/line/liff-client';

const optionButtonClass = (selected: boolean) =>
  `px-4 py-2.5 text-xs font-serif border transition-all ${
    selected
      ? 'bg-accent text-white border-accent'
      : 'bg-background border-accent/20 text-foreground/70 hover:border-accent/40'
  }`;

export default function EventApplyForm({ event, cancelPolicy }: { event: EventDoc; cancelPolicy: string }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [participantCount, setParticipantCount] = useState(1);
  const [area, setArea] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lineUserId, setLineUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    getLiffUserId().then(setLineUserId);
  }, []);

  const amount = event.price * participantCount;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !phone.trim()) {
      setError('お名前・電話番号を入力してください。');
      return;
    }
    if (!agreed) {
      setError('キャンセルポリシーへの同意が必要です。');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/events/${event.id}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email,
          participantCount,
          area,
          source,
          lineUserId,
          cancelPolicyAgreed: agreed,
        }),
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || '申込処理に失敗しました。');
      }

      window.location.href = result.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました。');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 bg-wakaba/5 p-8 pb-6 border border-border/40">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm font-serif whitespace-pre-wrap">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <label className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent/80 font-serif block">
          お名前 <span className="text-accent/40 ml-2">必須</span>
        </label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-background border border-accent/20 px-5 py-4 text-sm font-serif focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/10 transition-all"
        />
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent/80 font-serif block">
          電話番号 <span className="text-accent/40 ml-2">必須</span>
        </label>
        <input
          required
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full bg-background border border-accent/20 px-5 py-4 text-sm font-serif focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/10 transition-all"
        />
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent/50 font-serif block">
          メールアドレス <span className="text-accent/30 ml-2">任意</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-background border border-accent/20 px-5 py-4 text-sm font-serif focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/10 transition-all"
        />
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent/80 font-serif block">
          参加人数 <span className="text-accent/40 ml-2">必須</span>
        </label>
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => setParticipantCount((c) => Math.max(1, c - 1))}
            className="w-11 h-11 border border-accent/20 flex items-center justify-center text-accent text-lg hover:bg-wakaba-hover transition-colors"
            aria-label="人数を減らす"
          >
            −
          </button>
          <span className="w-8 text-center text-lg font-serif tabular-nums">{participantCount}</span>
          <button
            type="button"
            onClick={() => setParticipantCount((c) => Math.min(99, c + 1))}
            className="w-11 h-11 border border-accent/20 flex items-center justify-center text-accent text-lg hover:bg-wakaba-hover transition-colors"
            aria-label="人数を増やす"
          >
            ＋
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent/50 font-serif block">
          居住エリア <span className="text-accent/30 ml-2">任意</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {AREA_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setArea((prev) => (prev === option ? null : option))}
              className={optionButtonClass(area === option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent/50 font-serif block">
          このイベントを知ったきっかけ <span className="text-accent/30 ml-2">任意</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {SOURCE_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSource((prev) => (prev === option ? null : option))}
              className={optionButtonClass(source === option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {cancelPolicy && (
        <div className="space-y-3">
          <label className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent/80 font-serif block">
            キャンセルポリシー
          </label>
          <div className="border border-border/40 p-5 max-h-40 overflow-y-auto">
            <p className="text-xs text-foreground/70 font-serif leading-relaxed whitespace-pre-wrap">
              {cancelPolicy}
            </p>
          </div>
        </div>
      )}

      <label className="flex items-start gap-3 text-sm font-serif text-foreground/80 cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1"
        />
        キャンセルポリシーに同意します
      </label>

      <div className="sticky bottom-0 -mx-8 px-8 pt-6 pb-6 bg-wakaba/5 border-t border-border/40">
        <p className="text-sm font-serif text-foreground/70 mb-4">
          お支払い金額: <span className="text-lg font-bold text-foreground">{amount.toLocaleString()}円</span>
        </p>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-accent text-white py-5 font-bold tracking-[0.3em] text-[12px] uppercase transition-all font-serif shadow-lg ${
            isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-accent/90'
          }`}
        >
          {isLoading ? '処理中...' : '決済へ進む'}
        </button>
      </div>
    </form>
  );
}
