'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ImagePlus } from 'lucide-react';
import type { EventDoc } from '@/lib/events';
import { validateEventInput, validateImageFile } from '@/lib/admin/validation';
import Field from './ui/Field';
import TextInput from './ui/TextInput';
import TextArea from './ui/TextArea';
import ErrorBanner from './ui/ErrorBanner';
import SubmitButton from './ui/SubmitButton';

function toDatetimeLocalValue(iso?: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function toIso(localValue: string): string {
  if (!localValue) return '';
  const date = new Date(localValue);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
}

type FormState = {
  title: string;
  description: string;
  coverImageUrl: string;
  venue: string;
  startAt: string; // datetime-local文字列
  endAt: string; // datetime-local文字列
  price: string;
  capacity: string; // 空欄=無制限
  status: 'draft' | 'published' | 'closed';
};

function eventToForm(event?: EventDoc): FormState {
  return {
    title: event?.title || '',
    description: event?.description || '',
    coverImageUrl: event?.coverImageUrl || '',
    venue: event?.venue || '',
    startAt: toDatetimeLocalValue(event?.startAt),
    endAt: toDatetimeLocalValue(event?.endAt),
    price: event ? String(event.price) : '0',
    capacity: event?.capacity === null || event?.capacity === undefined ? '' : String(event.capacity),
    status: event?.status || 'draft',
  };
}

export default function EventForm({ event }: { event?: EventDoc }) {
  const router = useRouter();
  const isCreate = !event;
  const [form, setForm] = useState<FormState>(() => eventToForm(event));
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(event?.coverImageUrl || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    const imgError = validateImageFile(file);
    if (imgError) {
      setError(imgError);
      e.target.value = '';
      return;
    }
    setImageFile(file);
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    let coverImageUrl = form.coverImageUrl;

    setIsLoading(true);
    try {
      if (imageFile) {
        const imageForm = new FormData();
        imageForm.set('image', imageFile);
        const uploadRes = await fetch('/api/admin/events/upload-image', {
          method: 'POST',
          body: imageForm,
        });
        const uploadResult = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadResult.error || '画像のアップロードに失敗しました。');
        }
        coverImageUrl = uploadResult.url;
      }

      const payload = {
        title: form.title,
        description: form.description,
        coverImageUrl,
        venue: form.venue,
        startAt: toIso(form.startAt),
        endAt: toIso(form.endAt),
        price: Number(form.price) || 0,
        capacity: form.capacity.trim() === '' ? null : Number(form.capacity),
        status: form.status,
      };

      const errors = validateEventInput(payload, isCreate);
      if (errors.length > 0) {
        setError(errors.join('\n'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const url = isCreate ? '/api/admin/events' : `/api/admin/events/${event!.id}`;
      const method = isCreate ? 'POST' : 'PATCH';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || '保存に失敗しました。');
      }

      router.push('/admin/events');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました。');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <ErrorBanner message={error} />

      <Field label="イベント名" required>
        <TextInput required value={form.title} onChange={(e) => set('title', e.target.value)} />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Field label="開催日時" required>
          <TextInput
            required
            type="datetime-local"
            value={form.startAt}
            onChange={(e) => set('startAt', e.target.value)}
          />
        </Field>
        <Field label="終了日時" hint="任意">
          <TextInput type="datetime-local" value={form.endAt} onChange={(e) => set('endAt', e.target.value)} />
        </Field>
      </div>

      <Field label="開催場所" required>
        <TextInput required value={form.venue} onChange={(e) => set('venue', e.target.value)} />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Field label="参加費（円）" required hint="無料の場合は0">
          <TextInput
            required
            type="number"
            min={0}
            value={form.price}
            onChange={(e) => set('price', e.target.value)}
          />
        </Field>
        <Field label="定員" hint="空欄で無制限">
          <TextInput
            type="number"
            min={1}
            value={form.capacity}
            onChange={(e) => set('capacity', e.target.value)}
          />
        </Field>
      </div>

      <Field label="イベント概要">
        <TextArea rows={6} value={form.description} onChange={(e) => set('description', e.target.value)} />
      </Field>

      <p className="text-[11px] text-foreground/40 font-serif">
        キャンセルポリシーは全イベント共通です。
        <Link href="/admin/settings" className="text-accent/60 hover:text-accent underline underline-offset-2">
          設定ページ
        </Link>
        で編集できます。
      </p>

      <Field label="カバー画像" hint="任意">
        <div className="border border-accent/20 bg-wakaba/5 aspect-video max-w-md flex items-center justify-center overflow-hidden">
          {imagePreview ? (
            <img src={imagePreview} alt="" className="w-full h-full object-cover" />
          ) : (
            <ImagePlus className="text-accent/20" size={32} />
          )}
        </div>
        <label className="mt-3 block max-w-md text-center text-[11px] font-bold tracking-[0.15em] uppercase text-accent border border-accent/20 py-2.5 cursor-pointer hover:bg-wakaba/20 transition-colors font-serif">
          画像を選択
          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </label>
      </Field>

      <Field label="公開状態" required>
        <select
          value={form.status}
          onChange={(e) => set('status', e.target.value as FormState['status'])}
          className="w-full bg-background border border-accent/20 px-4 py-3 text-sm font-serif focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/10 transition-all appearance-none cursor-pointer shadow-sm"
        >
          <option value="draft">下書き（非公開）</option>
          <option value="published">公開</option>
          <option value="closed">受付終了</option>
        </select>
      </Field>

      <div className="pt-4">
        <SubmitButton isLoading={isLoading}>{isCreate ? 'イベントを登録する' : '変更を保存する'}</SubmitButton>
      </div>
    </form>
  );
}
