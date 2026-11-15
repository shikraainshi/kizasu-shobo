import ErrataForm from "@/app/admin/_components/ErrataForm";
import { getErrataBookTitles } from "@/lib/admin/errata-admin";

export const dynamic = "force-dynamic";

export default async function NewErrataPage() {
  const bookTitles = await getErrataBookTitles();

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-serif font-bold text-foreground tracking-[0.1em]">新規追加</h1>
      <ErrataForm bookTitles={bookTitles} />
    </div>
  );
}
