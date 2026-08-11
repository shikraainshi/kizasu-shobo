import { getCancelPolicyForAdmin } from "@/lib/admin/settings-admin";
import CancelPolicyForm from "@/app/admin/_components/CancelPolicyForm";
import FirestoreNotice from "@/app/admin/_components/FirestoreNotice";
import EventsSubNav from "@/app/admin/_components/EventsSubNav";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  let cancelPolicy = "";
  try {
    cancelPolicy = await getCancelPolicyForAdmin();
  } catch (error) {
    console.warn("Failed to load settings for admin:", error);
    return (
      <div className="space-y-6">
        <EventsSubNav />
        <h1 className="text-2xl font-serif font-bold text-foreground tracking-[0.1em]">キャンセルポリシー設定</h1>
        <FirestoreNotice />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <EventsSubNav />
      <h1 className="text-2xl font-serif font-bold text-foreground tracking-[0.1em]">キャンセルポリシー設定</h1>
      <CancelPolicyForm cancelPolicy={cancelPolicy} />
    </div>
  );
}
