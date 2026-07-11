import BookForm from "@/app/admin/_components/BookForm";

export default function NewBookPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-serif font-bold text-foreground tracking-[0.1em]">新規書籍を追加</h1>
      <BookForm />
    </div>
  );
}
