'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { News } from '@/lib/notion-service';
import { NewsInput } from '@/lib/admin/types';
import { NEWS_CATEGORIES } from '@/lib/admin/constants';
import { validateNewsInput } from '@/lib/admin/validation';
import Field from './ui/Field';
import TextInput from './ui/TextInput';
import TextArea from './ui/TextArea';
import SelectInput from './ui/SelectInput';
import CheckboxInput from './ui/CheckboxInput';
import ErrorBanner from './ui/ErrorBanner';
import SubmitButton from './ui/SubmitButton';

function newsToInput(news?: News): NewsInput {
  return {
    title: news?.title || '',
    date: news?.date ? news.date.slice(0, 10) : '',
    category: news?.category || '',
    important: news?.important ?? false,
    content: news?.content || '',
    relatedUrl1: news?.relatedUrl1 || '',
    relatedUrl2: news?.relatedUrl2 || '',
    urlLabel1: news?.urlLabel1 || '',
    urlLabel2: news?.urlLabel2 || '',
    slug: news?.slug || '',
  };
}

export default function NewsForm({ news }: { news?: News }) {
  const router = useRouter();
  const isCreate = !news;
  const [input, setInput] = useState<NewsInput>(() => newsToInput(news));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof NewsInput>(key: K, value: NewsInput[K]) =>
    setInput((prev) => ({ ...prev, [key]: value }));

  const isNewRelease = input.category === '新刊情報';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const errors = validateNewsInput(input, isCreate);
    if (errors.length > 0) {
      setError(errors.join('\n'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsLoading(true);
    try {
      const form = new FormData();
      Object.entries(input).forEach(([key, value]) => {
        if (typeof value === 'boolean') {
          if (value) form.set(key, 'on');
        } else {
          form.set(key, value ?? '');
        }
      });

      const url = isCreate ? '/api/admin/news' : `/api/admin/news/${news!.id}`;
      const method = isCreate ? 'POST' : 'PATCH';
      const res = await fetch(url, { method, body: form });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || '保存に失敗しました。');
      }

      router.push('/admin/news');
      router.refresh();
    } catch (err: any) {
      setError(err.message || '予期せぬエラーが発生しました。');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ErrorBanner message={error} />

      <Field label="タイトル" required>
        <TextInput required value={input.title} onChange={(e) => set('title', e.target.value)} />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Field label="日付" required>
          <TextInput type="date" required value={input.date} onChange={(e) => set('date', e.target.value)} />
        </Field>
        <Field label="カテゴリ" required>
          <SelectInput
            required
            options={NEWS_CATEGORIES}
            placeholder="選択してください"
            value={input.category}
            onChange={(e) => set('category', e.target.value)}
          />
        </Field>
      </div>

      <CheckboxInput
        label="重要なお知らせとして表示"
        checked={input.important}
        onChange={(e) => set('important', e.target.checked)}
      />

      <Field label="本文">
        <TextArea rows={6} value={input.content} onChange={(e) => set('content', e.target.value)} />
      </Field>

      <Field label="slug" hint="お知らせページのURL識別子（例: 2025-11-18-new-release）">
        <TextInput value={input.slug} onChange={(e) => set('slug', e.target.value)} />
      </Field>

      <div className="border-t border-border pt-6 space-y-6">
        <Field
          label="関連URL①"
          hint={isNewRelease ? '新刊情報カテゴリのため、URLではなく該当書籍のID（数値）を入力してください。' : undefined}
        >
          <TextInput
            value={input.relatedUrl1}
            onChange={(e) => set('relatedUrl1', e.target.value)}
            placeholder={isNewRelease ? '例: 180' : 'https://...'}
          />
        </Field>
        {!isNewRelease && (
          <Field label="URL表示①" hint="リンクのボタン等に表示するラベル">
            <TextInput value={input.urlLabel1} onChange={(e) => set('urlLabel1', e.target.value)} />
          </Field>
        )}

        <Field label="関連URL②">
          <TextInput value={input.relatedUrl2} onChange={(e) => set('relatedUrl2', e.target.value)} placeholder="https://..." />
        </Field>
        <Field label="URL表示②" hint="リンクのボタン等に表示するラベル">
          <TextInput value={input.urlLabel2} onChange={(e) => set('urlLabel2', e.target.value)} />
        </Field>
      </div>

      <div className="pt-4">
        <SubmitButton isLoading={isLoading}>{isCreate ? 'お知らせを登録する' : '変更を保存する'}</SubmitButton>
      </div>
    </form>
  );
}
