import Link from "next/link";
import { BookOpen, Newspaper, FileText, CalendarDays, ClipboardList, Settings } from "lucide-react";
import { getAllErrata } from "@/lib/errata";
import { getAllBooksForAdmin, getAllNewsForAdmin } from "@/lib/admin/notion-admin";
import { getAllEventsForAdmin } from "@/lib/admin/events-admin";
import { getAllApplicationsForAdmin } from "@/lib/admin/applications-admin";
import DashboardCard from "@/app/admin/_components/DashboardCard";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [books, news] = await Promise.all([getAllBooksForAdmin(), getAllNewsForAdmin()]);
  const publicCount = books.filter((b) => b.isPublic).length;
  const draftCount = books.length - publicCount;

  // Firestore未設定でもダッシュボード全体がクラッシュしないようにする
  let firestoreError = false;
  let events: Awaited<ReturnType<typeof getAllEventsForAdmin>> = [];
  let applications: Awaited<ReturnType<typeof getAllApplicationsForAdmin>> = [];
  let errata: Awaited<ReturnType<typeof getAllErrata>> = [];
  try {
    [events, applications, errata] = await Promise.all([
      getAllEventsForAdmin(),
      getAllApplicationsForAdmin(),
      getAllErrata(),
    ]);
  } catch (error) {
    console.warn("Failed to load events/applications for dashboard:", error);
    firestoreError = true;
  }
  const publishedEventCount = events.filter((e) => e.status === "published").length;
  const paidApplicationCount = applications.filter((a) => a.status === "paid").length;

  const cards = [
    {
      href: "/admin/books",
      icon: <BookOpen size={20} />,
      label: "書籍",
      stats: [
        { value: books.length, label: "総数" },
        { value: publicCount, label: "公開中" },
        { value: draftCount, label: "非公開" },
      ],
      newHref: "/admin/books/new",
      newLabel: "新規追加",
    },
    {
      href: "/admin/news",
      icon: <Newspaper size={20} />,
      label: "お知らせ",
      stats: [{ value: news.length, label: "総数" }],
      newHref: "/admin/news/new",
      newLabel: "新規追加",
    },
    {
      href: "/admin/errata",
      icon: <FileText size={20} />,
      label: "正誤表",
      stats: firestoreError ? [] : [{ value: errata.length, label: "総数" }],
      newHref: "/admin/errata/new",
      newLabel: "新規追加",
      note: firestoreError ? "Firestoreが未設定のため、統計を表示できません。" : undefined,
    },
    {
      href: "/admin/events",
      icon: <CalendarDays size={20} />,
      label: "イベント",
      stats: firestoreError
        ? []
        : [
            { value: events.length, label: "総数" },
            { value: publishedEventCount, label: "公開中" },
            { value: applications.length, label: "累計申込" },
            { value: paidApplicationCount, label: "決済済み" },
          ],
      newHref: "/admin/events/new",
      newLabel: "新規追加",
      note: firestoreError ? "Firestoreが未設定のため、統計を表示できません。" : undefined,
    },
  ];

  const quickLinks = [
    { href: "/admin/applications", icon: ClipboardList, label: "申し込み履歴" },
    { href: "/admin/settings", icon: Settings, label: "設定" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground tracking-[0.1em]">ダッシュボード</h1>
        <p className="text-sm text-foreground/70 font-serif mt-1">
          書籍・お知らせ・正誤表・イベントをここから管理できます。カードをクリックすると一覧に移動します。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => (
          <DashboardCard key={card.href} {...card} />
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
        {quickLinks.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2 text-xs font-bold tracking-[0.08em] uppercase text-foreground/75 hover:text-accent border border-border px-5 py-3 hover:border-accent/40 hover:bg-wakaba/20 transition-all font-serif"
          >
            <Icon size={14} />
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
