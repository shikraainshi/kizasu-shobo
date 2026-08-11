import { getAllEventsForAdmin } from "@/lib/admin/events-admin";
import type { EventDoc } from "@/lib/events";
import EventsAdminClient from "./events-admin-client";
import FirestoreNotice from "@/app/admin/_components/FirestoreNotice";
import EventsSubNav from "@/app/admin/_components/EventsSubNav";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  let events: EventDoc[] = [];
  try {
    events = await getAllEventsForAdmin();
  } catch (error) {
    console.warn("Failed to load events for admin:", error);
    return (
      <div className="space-y-6">
        <EventsSubNav />
        <h1 className="text-2xl font-serif font-bold text-foreground tracking-[0.1em]">イベント一覧</h1>
        <FirestoreNotice />
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <EventsSubNav />
      <EventsAdminClient events={events} />
    </div>
  );
}
