'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ImagePlus } from 'lucide-react';
import { Book } from '@/lib/books';
import { BookInput } from '@/lib/admin/types';
import { BOOK_CATEGORIES } from '@/lib/admin/constants';
import { validateBookInput, validateImageFile } from '@/lib/admin/validation';
import Field from './ui/Field';
import TextInput from './ui/TextInput';
import TextArea from './ui/TextArea';
import SelectInput from './ui/SelectInput';
import CheckboxInput from './ui/CheckboxInput';
import ErrorBanner from './ui/ErrorBanner';
import SubmitButton from './ui/SubmitButton';

function bookToInput(book?: Book): BookInput {
  return {
    title: book?.title || '',
    author: book?.author || '',
    authorKana: '',
    category: book?.category || '',
    pubDate: book?.date || '',
    price: book?.price || '',
    pages: book?.pages || '',
    isbn: book?.isbn || '',
    description: book?.description || '',
    fullDescription: book?.fullDescription || '',
    color: book?.color || '',
    isPublic: book?.isPublic ?? false,
    featured: book?.featured ?? false,
    seriesName: '',
    seriesVolume: '',
    titleVolume: '',
    titleKana: '',
    slug: '',
    url1: '',
    url2: '',
    url3: '',
  };
}

export default function BookForm({ book }: { book?: Book }) {
  const router = useRouter();
  const isCreate = !book;
  const [input, setInput] = useState<BookInput>(() => bookToInput(book));
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(book?.image || null);
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof BookInput>(key: K, value: BookInput[K]) =>
    setInput((prev) => ({ ...prev, [key]: value }));

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

    const errors = [
      ...validateBookInput(input, isCreate),
      ...([validateImageFile(imageFile)].filter(Boolean) as string[]),
    ];
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
      if (imageFile) form.set('image', imageFile);

      const url = isCreate ? '/api/admin/books' : `/api/admin/books/${book!.notionPageId}`;
      const method = isCreate ? 'POST' : 'PATCH';
      const res = await fetch(url, { method, body: form });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || '保存に失敗しました。');
      }

      router.push('/admin/books');
      router.refresh();
    } catch (err: any) {
      setError(err.message || '予期せぬエラーが発生しました。');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <ErrorBanner message={error} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Cover image */}
        <div className="space-y-3">
          <Field label="書影">
            <div className="border border-accent/20 bg-wakaba/5 aspect-[3/4] flex items-center justify-center overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="" className="w-full h-full object-cover" />
              ) : (
                <ImagePlus className="text-accent/20" size={32} />
              )}
            </div>
            <label className="block text-center text-[11px] font-bold tracking-[0.15em] uppercase text-accent border border-accent/20 py-2.5 cursor-pointer hover:bg-wakaba/20 transition-colors font-serif">
              画像を選択
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </Field>
        </div>

        {/* Main fields */}
        <div className="md:col-span-2 space-y-6">
          <Field label="書籍名" required>
            <TextInput required value={input.title} onChange={(e) => set('title', e.target.value)} />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field label="著者名" required>
              <TextInput required value={input.author} onChange={(e) => set('author', e.target.value)} />
            </Field>
            <Field label="カテゴリ" required>
              <SelectInput
                required
                options={BOOK_CATEGORIES}
                placeholder="選択してください"
                value={input.category}
                onChange={(e) => set('category', e.target.value)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Field label="刊行日" hint="例: 20260715">
              <TextInput value={input.pubDate} onChange={(e) => set('pubDate', e.target.value)} placeholder="20260715" />
            </Field>
            <Field label="価格（税抜）">
              <TextInput value={input.price} onChange={(e) => set('price', e.target.value)} placeholder="2400" />
            </Field>
            <Field label="ページ数">
              <TextInput value={input.pages} onChange={(e) => set('pages', e.target.value)} placeholder="240" />
            </Field>
          </div>

          <Field label="ISBN">
            <TextInput value={input.isbn} onChange={(e) => set('isbn', e.target.value)} placeholder="9784860651831" />
          </Field>

          <Field label="概要">
            <TextArea rows={3} value={input.description} onChange={(e) => set('description', e.target.value)} />
          </Field>

          <Field label="詳細説明">
            <TextArea rows={6} value={input.fullDescription} onChange={(e) => set('fullDescription', e.target.value)} />
          </Field>

          <div className="flex items-center gap-8 pt-2">
            <CheckboxInput
              label="公開する"
              checked={input.isPublic}
              onChange={(e) => set('isPublic', e.target.checked)}
            />
            <CheckboxInput
              label="注目書籍として表示"
              checked={input.featured}
              onChange={(e) => set('featured', e.target.checked)}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <button
          type="button"
          onClick={() => setShowDetails((v) => !v)}
          className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-accent/60 hover:text-accent transition-colors font-serif"
        >
          <ChevronDown size={14} className={`transition-transform ${showDetails ? 'rotate-180' : ''}`} />
          詳細設定
        </button>

        {showDetails && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Field label="著者名カナ">
                <TextInput value={input.authorKana} onChange={(e) => set('authorKana', e.target.value)} />
              </Field>
              <Field label="書名カナ">
                <TextInput value={input.titleKana} onChange={(e) => set('titleKana', e.target.value)} />
              </Field>
              <Field label="シリーズ名">
                <TextInput value={input.seriesName} onChange={(e) => set('seriesName', e.target.value)} />
              </Field>
              <Field label="シリーズ巻次">
                <TextInput value={input.seriesVolume} onChange={(e) => set('seriesVolume', e.target.value)} />
              </Field>
              <Field label="書名巻次">
                <TextInput value={input.titleVolume} onChange={(e) => set('titleVolume', e.target.value)} />
              </Field>
              <Field label="slug">
                <TextInput value={input.slug} onChange={(e) => set('slug', e.target.value)} />
              </Field>
              <Field label="背景色" hint="例: #cc9f93">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={/^#[0-9a-fA-F]{6}$/.test(input.color || '') ? input.color : '#cccccc'}
                    onChange={(e) => set('color', e.target.value)}
                    className="w-10 h-10 border border-accent/20 cursor-pointer"
                  />
                  <TextInput value={input.color} onChange={(e) => set('color', e.target.value)} placeholder="#cc9f93" />
                </div>
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Field label="URL①">
                <TextInput type="url" value={input.url1} onChange={(e) => set('url1', e.target.value)} />
              </Field>
              <Field label="URL②">
                <TextInput type="url" value={input.url2} onChange={(e) => set('url2', e.target.value)} />
              </Field>
              <Field label="URL③">
                <TextInput type="url" value={input.url3} onChange={(e) => set('url3', e.target.value)} />
              </Field>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4">
        <SubmitButton isLoading={isLoading}>{isCreate ? '書籍を登録する' : '変更を保存する'}</SubmitButton>
      </div>
    </form>
  );
}
