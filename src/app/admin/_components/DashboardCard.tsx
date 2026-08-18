'use client';

import { useRouter } from 'next/navigation';
import { Plus, ArrowRight } from 'lucide-react';

export default function DashboardCard({
  href,
  icon,
  label,
  stats,
  newHref,
  newLabel,
  note,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  stats: { value: number; label: string }[];
  newHref: string;
  newLabel: string;
  note?: string;
}) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(href)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') router.push(href);
      }}
      role="button"
      tabIndex={0}
      className="group border border-border bg-wakaba/5 p-8 space-y-6 cursor-pointer transition-all hover:border-accent/50 hover:bg-wakaba/20 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
            {icon}
          </div>
          <h2 className="text-lg font-serif font-bold text-foreground">{label}</h2>
        </div>
        <ArrowRight
          size={18}
          className="text-accent/30 group-hover:text-accent group-hover:translate-x-1 transition-all"
        />
      </div>

      {note ? (
        <p className="text-xs text-foreground/50 font-serif">{note}</p>
      ) : (
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-serif font-bold text-foreground tabular-nums">{s.value}</div>
              <div className="text-[11px] text-foreground/50 font-serif tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          router.push(newHref);
        }}
        className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase bg-accent text-white px-5 py-3 hover:bg-accent/90 transition-all font-serif"
      >
        <Plus size={14} />
        {newLabel}
      </button>
    </div>
  );
}
