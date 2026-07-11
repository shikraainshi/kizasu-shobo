import { notFound } from "next/navigation";
import { getBookForAdmin } from "@/lib/admin/notion-admin";
import BookForm from "@/app/admin/_components/BookForm";

export const dynamic = "force-dynamic";

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ pageId: string }>;
}) {
  const { pageId } = await params;
  const book = await getBookForAdmin(pageId);

  if (!book) {
    notFound();
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-serif font-bold text-foreground tracking-[0.1em]">{book.title} を編集</h1>
      <BookForm book={book} />
    </div>
  );
}
