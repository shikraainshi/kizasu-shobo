import { notFound } from "next/navigation";
import { getErrataById } from "@/lib/errata";
import ErrataForm from "@/app/admin/_components/ErrataForm";
import { getErrataBookTitles } from "@/lib/admin/errata-admin";

export const dynamic = "force-dynamic";

export default async function EditErrataPage({
  params,
}: {
  params: Promise<{ errataId: string }>;
}) {
  const { errataId } = await params;
  const [errata, bookTitles] = await Promise.all([getErrataById(errataId), getErrataBookTitles()]);

  if (!errata) {
    notFound();
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-serif font-bold text-foreground tracking-[0.1em]">
        『{errata.bookTitle}』正誤表を編集
      </h1>
      <ErrataForm errata={errata} bookTitles={bookTitles} />
    </div>
  );
}
