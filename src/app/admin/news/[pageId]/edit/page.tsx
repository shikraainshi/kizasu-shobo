import { notFound } from "next/navigation";
import { getNewsForAdmin } from "@/lib/admin/notion-admin";
import NewsForm from "@/app/admin/_components/NewsForm";

export const dynamic = "force-dynamic";

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ pageId: string }>;
}) {
  const { pageId } = await params;
  const news = await getNewsForAdmin(pageId);

  if (!news) {
    notFound();
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-serif font-bold text-foreground tracking-[0.1em]">{news.title} を編集</h1>
      <NewsForm news={news} />
    </div>
  );
}
