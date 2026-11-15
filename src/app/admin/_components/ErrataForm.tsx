'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText } from 'lucide-react';
import type { ErrataDoc } from '@/lib/errata';
import type { ErrataInput } from '@/lib/admin/types';
import { todayInJapan } from '@/lib/errata-format';
import BookTitleCombobox from './BookTitleCombobox';
import { validateErrataInput, validateErrataPdf } from '@/lib/admin/validation';
import Field from './ui/Field';
import TextInput from './ui/TextInput';
import ErrorBanner from './ui/ErrorBanner';
import SubmitButton from './ui/SubmitButton';

function errataToInput(errata?: ErrataDoc): ErrataInput {
  return {
    bookTitle: errata?.bookTitle || '',
    updatedAt: errata?.updatedAt || todayInJapan(),
    pdfUrl: errata?.pdfUrl || '',
    pdfName: errata?.pdfName || '',
  };
}

export default function ErrataForm({ errata, bookTitles }: { errata?: ErrataDoc; bookTitles: string[] }) {
  const router = useRouter();
  const isCreate = !errata;
  const [input, setInput] = useState<ErrataInput>(() => errataToInput(errata));
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof ErrataInput>(key: K, value: ErrataInput[K]) =>
    setInput((prev) => ({ ...prev, [key]: value }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    const fileError = validateErrataPdf(file);
    if (fileError) {
      setError(fileError);
      e.target.value = '';
      return;
    }
    setError(null);
    setPdfFile(file);
    // PDFを差し替えたら更新日を今日にする（必要なら手で変更できる）
    if (file && !isCreate) set('updatedAt', todayInJapan());
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // PDFはまだアップロード前なので、選択済みならURLがある扱いで検証する
    const errors = validateErrataInput({ ...input, pdfUrl: pdfFile ? 'pending' : input.pdfUrl });
    // 書籍名は一覧から選んだものに限る（既存の正誤表で書籍名を変えていない場合は除く）
    if (input.bookTitle.trim() && input.bookTitle !== errata?.bookTitle && !bookTitles.includes(input.bookTitle)) {
      errors.push('書籍名は候補の一覧から選択してください。');
    }
    if (errors.length > 0) {
      setError(errors.join('\n'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsLoading(true);
    try {
      let payload = input;
      if (pdfFile) {
        const uploadForm = new FormData();
        uploadForm.set('file', pdfFile);
        const uploadRes = await fetch('/api/admin/errata/upload-pdf', { method: 'POST', body: uploadForm });
        const uploadResult = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadResult.error || 'PDFのアップロードに失敗しました。');
        }
        payload = { ...input, pdfUrl: uploadResult.url, pdfName: uploadResult.name };
      }

      const url = isCreate ? '/api/admin/errata' : `/api/admin/errata/${errata!.id}`;
      const res = await fetch(url, {
        method: isCreate ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || '保存に失敗しました。');
      }

      router.push('/admin/errata');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました。');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };

  const fileLabel = pdfFile ? pdfFile.name : input.pdfUrl ? input.pdfName || 'PDF設定済み' : '未設定';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ErrorBanner message={error} />

      <Field label="書籍名" required>
        <BookTitleCombobox
          value={input.bookTitle}
          onChange={(v) => set('bookTitle', v)}
          options={bookTitles}
        />
      </Field>

      <Field label="更新日" required>
        <TextInput
          type="date"
          required
          value={input.updatedAt}
          onChange={(e) => set('updatedAt', e.target.value)}
          className="max-w-xs"
        />
      </Field>

      <Field
        label="正誤表PDF"
        required
        hint={isCreate ? 'PDF（20MBまで）' : 'PDF（20MBまで）。選択すると、保存時にPDFが差し替わります。'}
      >
        <div className="border border-accent/35 bg-wakaba/5 max-w-md flex items-center gap-3 px-4 py-4">
          <FileText className="text-accent/50 shrink-0" size={24} />
          <span className="text-xs text-accent/80 font-serif break-all flex-1">{fileLabel}</span>
          {!pdfFile && input.pdfUrl && (
            <a
              href={input.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-accent/80 hover:text-accent font-serif shrink-0"
            >
              表示
            </a>
          )}
        </div>
        <label className="mt-3 block max-w-md text-center text-xs font-bold tracking-[0.08em] uppercase text-accent border border-accent/35 py-2.5 cursor-pointer hover:bg-wakaba/20 transition-colors font-serif">
          {isCreate ? 'PDFを選択' : 'PDFを差し替える'}
          <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
        </label>
      </Field>

      <div className="pt-4">
        <SubmitButton isLoading={isLoading}>{isCreate ? '正誤表を登録する' : '変更を保存する'}</SubmitButton>
      </div>
    </form>
  );
}
