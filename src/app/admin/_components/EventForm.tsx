'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FileText, ImagePlus } from 'lucide-react';
import type { EventDoc } from '@/lib/events';
import { validateEventInput, validateFlyerFile } from '@/lib/admin/validation';
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
  mediaType: 'image' | 'pdf';
  venue: string;
  startAt: string; // datetime-local文字列
  endAt: string; // datetime-local文字列
  price: string;
  capacity: string; // 空欄=無制限
  cancellationPolicy: string;
  status: 'draft' | 'published' | 'closed';
};

function eventToForm(event?: EventDoc): FormState {
  return {
    title: event?.title || '',
    description: event?.description || '',
    coverImageUrl: event?.coverImageUrl || '',
    mediaType: event?.mediaType || 'image',
    venue: event?.venue || '',
    startAt: toDatetimeLocalValue(event?.startAt),
    endAt: toDatetimeLocalValue(event?.endAt),
    price: event ? String(event.price) : '0',
    capacity: event?.capacity === null || event?.capacity === undefined ? '' : String(event.capacity),
    cancellationPolicy: event?.cancellationPolicy || '',
    status: event?.status || 'draft',
  };
}

export default function EventForm({ event, paidCount }: { event?: EventDoc; paidCount?: number }) {
  const router = useRouter();
  const isCreate = !event;
  const [form, setForm] = useState<FormState>(() => eventToForm(event));
  const [flyerFile, setFlyerFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    event?.mediaType !== 'pdf' ? event?.coverImageUrl || null : null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    const fileError = validateFlyerFile(file, form.mediaType);
    if (fileError) {
      setError(fileError);
      e.target.value = '';
      return;
    }
    setFlyerFile(file);
    if (file && form.mediaType === 'image') setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    let coverImageUrl = form.coverImageUrl;

    setIsLoading(true);
    try {
      if (flyerFile) {
        const uploadForm = new FormData();
        uploadForm.set('file', flyerFile);
        uploadForm.set('mediaType', form.mediaType);
        const uploadRes = await fetch('/api/admin/events/upload-flyer', {
          method: 'POST',
          body: uploadForm,
        });
        const uploadResult = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadResult.error || 'ファイルのアップロードに失敗しました。');
        }
        coverImageUrl = uploadResult.url;
      }

      const payload = {
        title: form.title,
        description: form.description,
        coverImageUrl,
        mediaType: form.mediaType,
        venue: form.venue,
        startAt: toIso(form.startAt),
        endAt: toIso(form.endAt),
        price: Number(form.price) || 0,
        capacity: form.capacity.trim() === '' ? null : Number(form.capacity),
        cancellationPolicy: form.cancellationPolicy,
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
        <Field label="開催日時" hint="任意。カバー画像に記載済みなら空欄でよい">
          <TextInput type="datetime-local" value={form.startAt} onChange={(e) => set('startAt', e.target.value)} />
        </Field>
        <Field label="終了日時" hint="任意">
          <TextInput type="datetime-local" value={form.endAt} onChange={(e) => set('endAt', e.target.value)} />
        </Field>
      </div>

      <Field label="開催場所" hint="任意。カバー画像に記載済みなら空欄でよい">
        <TextInput value={form.venue} onChange={(e) => set('venue', e.target.value)} />
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
        <Field
          label="定員"
          hint={
            !isCreate && paidCount !== undefined
              ? `空欄で無制限／現在の決済済み申込: ${paidCount}名`
              : '空欄で無制限'
          }
        >
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

      <Field label="このイベント固有のキャンセルポリシー" hint="空欄の場合は共通のキャンセルポリシーを使用します">
        <TextArea
          rows={4}
          value={form.cancellationPolicy}
          onChange={(e) => set('cancellationPolicy', e.target.value)}
        />
      </Field>
      <p className="text-[11px] text-foreground/40 font-serif -mt-4">
        共通のキャンセルポリシーは
        <Link href="/admin/settings" className="text-accent/60 hover:text-accent underline underline-offset-2">
          設定ページ
        </Link>
        で編集できます。
      </p>

      <Field label="チラシの種類">
        <div className="flex gap-3">
          {(['image', 'pdf'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                set('mediaType', type);
                setFlyerFile(null);
                if (type === 'pdf') setImagePreview(null);
              }}
              className={`px-5 py-2.5 text-xs font-bold tracking-[0.15em] uppercase font-serif border transition-all ${
                form.mediaType === type
                  ? 'bg-accent text-white border-accent'
                  : 'bg-background border-accent/20 text-foreground/70 hover:border-accent/40'
              }`}
            >
              {type === 'image' ? '画像' : 'PDF'}
            </button>
          ))}
        </div>
      </Field>

      <Field label="チラシ" hint="任意">
        {form.mediaType === 'image' ? (
          <div className="border border-accent/20 bg-wakaba/5 aspect-video max-w-md flex items-center justify-center overflow-hidden">
            {imagePreview ? (
              <img src={imagePreview} alt="" className="w-full h-full object-cover" />
            ) : (
              <ImagePlus className="text-accent/20" size={32} />
            )}
          </div>
        ) : (
          <div className="border border-accent/20 bg-wakaba/5 aspect-video max-w-md flex flex-col items-center justify-center gap-2 overflow-hidden">
            <FileText className="text-accent/20" size={32} />
            <span className="text-xs text-accent/40 font-serif">
              {flyerFile ? flyerFile.name : form.coverImageUrl ? 'PDF設定済み' : '未設定'}
            </span>
          </div>
        )}
        <label className="mt-3 block max-w-md text-center text-[11px] font-bold tracking-[0.15em] uppercase text-accent border border-accent/20 py-2.5 cursor-pointer hover:bg-wakaba/20 transition-colors font-serif">
          {form.mediaType === 'image' ? '画像を選択' : 'PDFを選択'}
          <input
            type="file"
            accept={form.mediaType === 'image' ? 'image/*' : 'application/pdf'}
            onChange={handleFileChange}
            className="hidden"
          />
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
