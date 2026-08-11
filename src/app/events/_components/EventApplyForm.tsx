'use client';

import { useState } from 'react';
import type { EventDoc } from '@/lib/events';

export default function EventApplyForm({ event, cancelPolicy }: { event: EventDoc; cancelPolicy: string }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [participantCount, setParticipantCount] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amount = event.price * participantCount;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !phone.trim() || !email.trim()) {
      setError('お名前・電話番号・メールアドレスを入力してください。');
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
    <form onSubmit={handleSubmit} className="space-y-8 bg-wakaba/5 p-8 border border-border/40">
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
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full bg-background border border-accent/20 px-5 py-4 text-sm font-serif focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/10 transition-all"
        />
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent/80 font-serif block">
          メールアドレス <span className="text-accent/40 ml-2">必須</span>
        </label>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-background border border-accent/20 px-5 py-4 text-sm font-serif focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/10 transition-all"
        />
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent/80 font-serif block">
          参加人数
        </label>
        <input
          required
          type="number"
          min={1}
          value={participantCount}
          onChange={(e) => setParticipantCount(Math.max(1, Number(e.target.value) || 1))}
          className="w-32 bg-background border border-accent/20 px-5 py-4 text-sm font-serif focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/10 transition-all"
        />
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

      <div className="pt-2 border-t border-border/40">
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
          {isLoading ? '処理中...' : '支払いへ進む'}
        </button>
      </div>
    </form>
  );
}
