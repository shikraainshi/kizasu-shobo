import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllErrata, type ErrataDoc } from "@/lib/errata";
import FirestoreNotice from "@/app/admin/_components/FirestoreNotice";
import ErrataAdminClient from "./errata-admin-client";

export const dynamic = "force-dynamic";

export default async function AdminErrataPage() {
  let errata: ErrataDoc[] = [];
  let firestoreError = false;
  try {
    errata = await getAllErrata();
  } catch (error) {
    console.warn("Failed to load errata for admin:", error);
    firestoreError = true;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-serif font-bold text-foreground tracking-[0.1em]">正誤表一覧</h1>
        <Link
          href="/admin/errata/new"
          className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.08em] uppercase bg-accent text-white px-5 py-3 hover:bg-accent/90 transition-all font-serif"
        >
          <Plus size={14} />
          新規追加
        </Link>
      </div>
      {firestoreError ? <FirestoreNotice /> : <ErrataAdminClient errata={errata} />}
    </div>
  );
}
