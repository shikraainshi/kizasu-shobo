import Link from "next/link";
import { BookOpen, Newspaper, Plus } from "lucide-react";
import { getAllBooksForAdmin, getAllNewsForAdmin } from "@/lib/admin/notion-admin";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [books, news] = await Promise.all([getAllBooksForAdmin(), getAllNewsForAdmin()]);
  const publicCount = books.filter((b) => b.isPublic).length;
  const draftCount = books.length - publicCount;

  const cards = [
    {
      href: "/admin/books",
      icon: BookOpen,
      label: "書籍",
      stats: [
        { value: books.length, label: "総数" },
        { value: publicCount, label: "公開中" },
        { value: draftCount, label: "非公開" },
      ],
      newHref: "/admin/books/new",
      newLabel: "新規書籍を追加",
    },
    {
      href: "/admin/news",
      icon: Newspaper,
      label: "お知らせ",
      stats: [{ value: news.length, label: "総数" }],
      newHref: "/admin/news/new",
      newLabel: "新規お知らせを追加",
    },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground tracking-[0.1em]">ダッシュボード</h1>
        <p className="text-sm text-foreground/50 font-serif mt-1">書籍情報とお知らせをここから管理できます。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map(({ href, icon: Icon, label, stats, newHref, newLabel }) => (
          <div key={href} className="border border-border bg-wakaba/5 p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon className="text-accent" size={22} />
                <h2 className="text-lg font-serif font-bold text-foreground">{label}</h2>
              </div>
              <Link
                href={href}
                className="text-[11px] font-bold tracking-[0.2em] uppercase text-accent/60 hover:text-accent transition-colors"
              >
                一覧を見る →
              </Link>
            </div>

            <div className="flex gap-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-3xl font-serif font-bold text-foreground tabular-nums">{s.value}</div>
                  <div className="text-[11px] text-foreground/50 font-serif tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>

            <Link
              href={newHref}
              className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase bg-accent text-white px-5 py-3 hover:bg-accent/90 transition-all font-serif"
            >
              <Plus size={14} />
              {newLabel}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
