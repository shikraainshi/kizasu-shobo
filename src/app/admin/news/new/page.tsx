import NewsForm from "@/app/admin/_components/NewsForm";

export default function NewNewsPage() {
  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-serif font-bold text-foreground tracking-[0.1em]">新規お知らせを追加</h1>
      <NewsForm />
    </div>
  );
}
