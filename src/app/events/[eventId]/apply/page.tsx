import { notFound } from "next/navigation";
import { getEventById } from "@/lib/events";
import { getPaidParticipantCount } from "@/lib/applications";
import { getCancelPolicy } from "@/lib/settings";
import EventApplyForm from "@/app/events/_components/EventApplyForm";

export const dynamic = "force-dynamic";

export default async function EventApplyPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const event = await getEventById(eventId);
  if (!event || event.status !== "published") notFound();

  if (event.capacity !== null) {
    const paidCount = await getPaidParticipantCount(event.id);
    if (paidCount >= event.capacity) notFound();
  }

  const cancelPolicy = await getCancelPolicy();

  return (
    <div className="pb-24 bg-background">
      <section className="bg-wakaba/30 py-16 border-b border-border">
        <div className="container mx-auto px-6 max-w-2xl">
          <h1 className="text-2xl font-serif font-bold text-foreground tracking-[0.1em]">お申し込み</h1>
          <p className="text-sm text-foreground/60 font-serif mt-2">{event.title}</p>
        </div>
      </section>
      <section className="max-w-2xl mx-auto px-6 py-14">
        <EventApplyForm event={event} cancelPolicy={cancelPolicy} />
      </section>
    </div>
  );
}
