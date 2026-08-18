'use client';

import liff from '@line/liff';

let initPromise: Promise<void> | null = null;

export function initLiff(): Promise<void> {
  const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
  if (!liffId) {
    console.warn('NEXT_PUBLIC_LIFF_ID is not set');
    return Promise.resolve();
  }
  if (!initPromise) {
    initPromise = liff.init({ liffId }).catch((err) => {
      console.error('LIFF init failed', err);
    });
  }
  return initPromise;
}

// トーク画面から開かれている場合のみ、そのトークへ完了メッセージを送る。
// 通常ブラウザやトーク外から開いた場合は何もせず false を返す。
export async function sendLineCompletionMessage(text: string): Promise<boolean> {
  try {
    await initLiff();
    if (!liff.isInClient()) return false;
    const context = liff.getContext();
    if (!context || context.type === 'none') return false;
    await liff.sendMessages([{ type: 'text', text }]);
    return true;
  } catch (err) {
    console.error('liff.sendMessages failed', err);
    return false;
  }
}

// トーク画面から開かれている場合のみLINEユーザーIDを返す。それ以外はundefined。
export async function getLiffUserId(): Promise<string | undefined> {
  try {
    await initLiff();
    if (!liff.isInClient()) return undefined;
    const context = liff.getContext();
    return context?.userId || undefined;
  } catch (err) {
    console.error('liff getContext failed', err);
    return undefined;
  }
}

export function closeLiffWindow(): void {
  if (liff.isInClient()) {
    liff.closeWindow();
  }
}
