'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText } from 'lucide-react';
import { News } from '@/lib/notion-service';
import { NewsInput } from '@/lib/admin/types';
import { NEWS_CATEGORIES } from '@/lib/admin/constants';
import { validateNewsAttachment, validateNewsInput } from '@/lib/admin/validation';
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
    attachmentUrl: news?.attachmentUrl || '',
    attachmentName: news?.attachmentName || '',
  };
}

export default function NewsForm({ news }: { news?: News }) {
  const router = useRouter();
  const isCreate = !news;
  const [input, setInput] = useState<NewsInput>(() => newsToInput(news));
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof NewsInput>(key: K, value: NewsInput[K]) =>
    setInput((prev) => ({ ...prev, [key]: value }));

  const isNewRelease = input.category === '新刊情報';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    const fileError = validateNewsAttachment(file);
    if (fileError) {
      setError(fileError);
      e.target.value = '';
      return;
    }
    setAttachmentFile(file);
  };

  const handleRemoveAttachment = () => {
    setAttachmentFile(null);
    set('attachmentUrl', '');
    set('attachmentName', '');
  };

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
      let payload = input;
      if (attachmentFile) {
        const uploadForm = new FormData();
        uploadForm.set('file', attachmentFile);
        const uploadRes = await fetch('/api/admin/news/upload-file', {
          method: 'POST',
          body: uploadForm,
        });
        const uploadResult = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadResult.error || 'ファイルのアップロードに失敗しました。');
        }
        payload = { ...input, attachmentUrl: uploadResult.url, attachmentName: uploadResult.name };
      }

      const form = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
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

      <Field label="添付ファイル" hint="任意。PDF・画像・Word・Excel・PowerPoint（20MBまで）。お知らせページに表示されます。">
        <div className="border border-accent/20 bg-wakaba/5 max-w-md flex items-center gap-3 px-4 py-4">
          <FileText className="text-accent/30 shrink-0" size={24} />
          <span className="text-xs text-accent/60 font-serif break-all flex-1">
            {attachmentFile ? attachmentFile.name : input.attachmentUrl ? input.attachmentName || '設定済み' : '未設定'}
          </span>
          {(attachmentFile || input.attachmentUrl) && (
            <button
              type="button"
              onClick={handleRemoveAttachment}
              className="text-[11px] font-bold text-accent/50 hover:text-accent font-serif shrink-0"
            >
              削除
            </button>
          )}
        </div>
        <label className="mt-3 block max-w-md text-center text-[11px] font-bold tracking-[0.15em] uppercase text-accent border border-accent/20 py-2.5 cursor-pointer hover:bg-wakaba/20 transition-colors font-serif">
          ファイルを選択
          <input
            type="file"
            accept="application/pdf,image/*,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
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
