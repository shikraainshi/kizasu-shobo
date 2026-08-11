'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, BookOpen, Newspaper, CalendarDays, LogOut } from 'lucide-react';

const links = [
  { href: '/admin', label: 'ダッシュボード', icon: LayoutDashboard, exact: true, extraPrefixes: [] as string[] },
  { href: '/admin/books', label: '書籍', icon: BookOpen, exact: false, extraPrefixes: [] as string[] },
  { href: '/admin/news', label: 'お知らせ', icon: Newspaper, exact: false, extraPrefixes: [] as string[] },
  {
    href: '/admin/events',
    label: 'イベント',
    icon: CalendarDays,
    exact: false,
    // 申し込み履歴・キャンセルポリシー設定はイベントタブ内のサブナビに統合しているため、ここも「イベント」をアクティブにする
    extraPrefixes: ['/admin/applications', '/admin/settings'],
  },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  if (pathname === '/admin/login') {
    return null;
  }

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur-md sticky top-0 z-40">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/admin" className="font-serif font-bold text-foreground tracking-[0.15em] text-sm">
            萌書房 管理画面
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {links.map(({ href, label, icon: Icon, exact, extraPrefixes }) => {
              const active = exact
                ? pathname === href
                : pathname?.startsWith(href) || extraPrefixes.some((p) => pathname?.startsWith(p));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-[0.1em] font-serif transition-colors ${
                    active
                      ? 'text-accent bg-wakaba/40'
                      : 'text-foreground/60 hover:text-accent hover:bg-wakaba/20'
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2 text-xs font-bold tracking-[0.1em] font-serif text-foreground/50 hover:text-accent transition-colors disabled:opacity-50"
        >
          <LogOut size={14} />
          ログアウト
        </button>
      </div>
    </header>
  );
}
