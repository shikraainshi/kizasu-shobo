import ErrataForm from "@/app/admin/_components/ErrataForm";

export default function NewErrataPage() {
  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-serif font-bold text-foreground tracking-[0.1em]">新規正誤表を追加</h1>
      <ErrataForm />
    </div>
  );
}
