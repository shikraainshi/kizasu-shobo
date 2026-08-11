'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, ClipboardList, Settings } from 'lucide-react';

const tabs = [
  { href: '/admin/events', label: 'イベント一覧', icon: CalendarDays },
  { href: '/admin/applications', label: '申し込み履歴', icon: ClipboardList },
  { href: '/admin/settings', label: 'キャンセルポリシー設定', icon: Settings },
];

export default function EventsSubNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-1 border-b border-border/60 -mt-2">
      {tabs.map(({ href, label, icon: Icon }) => {
        const active = pathname?.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold tracking-[0.1em] font-serif border-b-2 -mb-px transition-colors ${
              active
                ? 'text-accent border-accent'
                : 'text-foreground/50 border-transparent hover:text-accent hover:border-accent/30'
            }`}
          >
            <Icon size={14} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
