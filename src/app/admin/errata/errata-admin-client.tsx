'use client';

import { useRouter } from 'next/navigation';
import type { ErrataDoc } from '@/lib/errata';

export default function ErrataAdminClient({ errata }: { errata: ErrataDoc[] }) {
  const router = useRouter();
  const goToEdit = (id: string) => router.push(`/admin/errata/${id}/edit`);

  return (
    <div className="border-2 border-foreground/25 overflow-x-auto bg-background">
      <table className="w-full min-w-[600px] border-collapse">
        <thead>
          <tr className="bg-wakaba-base/40 text-left text-xs font-bold tracking-[0.1em] uppercase text-foreground/90 font-serif border-b-2 border-foreground/25">
            <th className="p-3 whitespace-nowrap">更新日</th>
            <th className="p-3">書籍名</th>
            <th className="p-3">PDF</th>
          </tr>
        </thead>
        <tbody>
          {errata.map((item) => (
            <tr
              key={item.id}
              onClick={() => goToEdit(item.id)}
              tabIndex={0}
              role="button"
              onKeyDown={(e) => {
                if (e.key === 'Enter') goToEdit(item.id);
              }}
              className="border-t border-foreground/20 hover:bg-wakaba/40 focus:bg-wakaba/40 focus:outline-none cursor-pointer transition-colors"
            >
              <td className="p-3 text-sm font-serif text-foreground font-medium whitespace-nowrap tabular-nums">
                {item.updatedAt}
              </td>
              <td className="p-3 text-sm font-serif text-foreground font-bold max-w-[420px]">『{item.bookTitle}』</td>
              <td className="p-3 text-sm font-serif">
                {item.pdfUrl ? (
                  <a
                    href={item.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-accent font-bold hover:underline break-all"
                  >
                    {item.pdfName || '表示'}
                  </a>
                ) : (
                  '—'
                )}
              </td>
            </tr>
          ))}
          {errata.length === 0 && (
            <tr>
              <td colSpan={3} className="p-10 text-center text-sm text-foreground/75 font-serif">
                正誤表はまだ登録されていません
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
