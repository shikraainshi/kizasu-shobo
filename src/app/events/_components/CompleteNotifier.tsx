'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import liff from '@line/liff';
import { closeLiffWindow, sendLineCompletionMessage } from '@/lib/line/liff-client';

export default function CompleteNotifier({ message }: { message: string }) {
  const [sent, setSent] = useState(false);
  const [inClient, setInClient] = useState(false);

  useEffect(() => {
    let mounted = true;
    sendLineCompletionMessage(message).then((result) => {
      if (!mounted) return;
      setSent(result);
      setInClient(liff.isInClient());
    });
    return () => {
      mounted = false;
    };
  }, [message]);

  return (
    <div className="space-y-4">
      {sent && (
        <p className="text-xs text-foreground/50 font-serif">LINEのトークに完了メッセージを送信しました。</p>
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
