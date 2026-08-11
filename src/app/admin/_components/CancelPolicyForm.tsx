'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Field from './ui/Field';
import TextArea from './ui/TextArea';
import ErrorBanner from './ui/ErrorBanner';
import SubmitButton from './ui/SubmitButton';

export default function CancelPolicyForm({ cancelPolicy }: { cancelPolicy: string }) {
  const router = useRouter();
  const [value, setValue] = useState(cancelPolicy);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSaved(false);

    if (!value.trim()) {
      setError('キャンセルポリシーを入力してください。');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cancelPolicy: value }),
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || '保存に失敗しました。');
      }

      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <ErrorBanner message={error} />
      {saved && (
        <div className="p-4 bg-wakaba/20 border border-accent/20 text-accent text-sm font-serif">
          保存しました。
        </div>
      )}

      <Field
        label="キャンセルポリシー"
        required
        hint="すべてのイベントの申込ページに共通で表示されます"
      >
        <TextArea rows={10} value={value} onChange={(e) => { setValue(e.target.value); setSaved(false); }} />
      </Field>

      <SubmitButton isLoading={isLoading}>変更を保存する</SubmitButton>
    </form>
  );
}
