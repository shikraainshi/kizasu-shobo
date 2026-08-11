import { getAllApplicationsForAdmin } from "@/lib/admin/applications-admin";
import type { ApplicationDoc } from "@/lib/applications";
import ApplicationsAdminClient from "./applications-admin-client";
import FirestoreNotice from "@/app/admin/_components/FirestoreNotice";
import EventsSubNav from "@/app/admin/_components/EventsSubNav";

export const dynamic = "force-dynamic";

export default async function AdminApplicationsPage() {
  let applications: ApplicationDoc[] = [];
  try {
    applications = await getAllApplicationsForAdmin();
  } catch (error) {
    console.warn("Failed to load applications for admin:", error);
    return (
      <div className="space-y-6">
        <EventsSubNav />
        <h1 className="text-2xl font-serif font-bold text-foreground tracking-[0.1em]">申し込み履歴</h1>
        <FirestoreNotice />
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <EventsSubNav />
      <ApplicationsAdminClient applications={applications} />
    </div>
  );
}
