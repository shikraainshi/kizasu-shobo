import NewsForm from "@/app/admin/_components/NewsForm";

export default function NewNewsPage() {
  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-serif font-bold text-foreground tracking-[0.1em]">お知らせの新規追加</h1>
      <NewsForm />
    </div>
  );
}
