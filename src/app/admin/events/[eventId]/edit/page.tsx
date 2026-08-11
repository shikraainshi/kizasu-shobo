import { notFound } from "next/navigation";
import { getEventForAdmin } from "@/lib/admin/events-admin";
import EventForm from "@/app/admin/_components/EventForm";
import EventsSubNav from "@/app/admin/_components/EventsSubNav";

export const dynamic = "force-dynamic";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const event = await getEventForAdmin(eventId);

  if (!event) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <EventsSubNav />
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-2xl font-serif font-bold text-foreground tracking-[0.1em]">{event.title} を編集</h1>
        <EventForm event={event} />
      </div>
    </div>
  );
}
