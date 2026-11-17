'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import liff from '@line/liff';
import { closeLiffWindow, initLiff, sendLineCompletionMessage } from '@/lib/line/liff-client';

export default function CompleteNotifier({ message }: { message: string }) {
  const [inClient, setInClient] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    let mounted = true;
    initLiff().then(() => {
      if (mounted) setInClient(liff.isInClient());
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleSend = async () => {
    if (isSending || sent) return;
    setIsSending(true);
    const result = await sendLineCompletionMessage(message);
    setSent(result);
    setIsSending(false);
  };

  return (
    <div className="space-y-4">
      {inClient && (
        <button
          onClick={handleSend}
          disabled={isSending || sent}
          className={`inline-flex items-center justify-center w-full border border-accent/30 text-accent py-4 font-bold tracking-[0.3em] text-[11px] uppercase transition-all font-serif ${
            isSending || sent ? 'opacity-60 cursor-not-allowed' : 'hover:bg-wakaba-hover'
          }`}
        >
          {sent ? 'LINEに送信しました' : isSending ? '送信中...' : '申込内容をLINEに送る'}
        </button>
      )}

      {inClient ? (
        <button
          onClick={closeLiffWindow}
          className="inline-flex items-center justify-center w-full bg-accent text-white py-4 font-bold tracking-[0.3em] text-[11px] uppercase hover:bg-accent/90 transition-all font-serif shadow-lg"
        >
          閉じる
        </button>
      ) : (
        <Link
          href="/events"
          className="inline-flex items-center justify-center w-full bg-accent text-white py-4 font-bold tracking-[0.3em] text-[11px] uppercase hover:bg-accent/90 transition-all font-serif shadow-lg"
        >
          イベント一覧に戻る
        </Link>
      )}
    </div>
  );
}
