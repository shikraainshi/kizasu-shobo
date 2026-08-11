import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Ticket } from "lucide-react";
import { getEventById } from "@/lib/events";
import { getPaidParticipantCount } from "@/lib/applications";
import { getCancelPolicy } from "@/lib/settings";
import { formatEventDateTime } from "@/lib/events-format";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const event = await getEventById(eventId);
  if (!event || event.status !== "published") notFound();

  const cancelPolicy = await getCancelPolicy();
  const remaining =
    event.capacity !== null ? event.capacity - (await getPaidParticipantCount(event.id)) : null;
  const isFull = remaining !== null && remaining <= 0;

  return (
    <div className="pb-24 bg-background">
      <section className="bg-wakaba/30 py-20 border-b border-border">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="text-3xl font-serif font-bold text-foreground tracking-[0.1em]">{event.title}</h1>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-14 space-y-10">
        <div className="flex flex-wrap gap-x-10 gap-y-3 text-sm text-foreground/70 font-serif border-b border-border/40 pb-8">
          <span className="flex items-center gap-2">
            <CalendarDays size={18} className="text-accent/60" />
            {formatEventDateTime(event.startAt)}
            {event.endAt ? ` 〜 ${formatEventDateTime(event.endAt)}` : ""}
          </span>
          <span className="flex items-center gap-2">
            <MapPin size={18} className="text-accent/60" />
            {event.venue}
          </span>
          <span className="flex items-center gap-2">
            <Ticket size={18} className="text-accent/60" />
            {event.price > 0 ? `${event.price.toLocaleString()}円` : "参加無料"}
          </span>
        </div>

        <p className="text-foreground/80 font-serif leading-loose whitespace-pre-wrap">{event.description}</p>

        {cancelPolicy && (
          <div className="bg-wakaba/5 border border-border/40 p-6 space-y-2">
            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent/60 font-serif">
              キャンセルポリシー
            </h2>
            <p className="text-sm text-foreground/70 font-serif leading-relaxed whitespace-pre-wrap">
              {cancelPolicy}
            </p>
          </div>
        )}

        <div className="pt-4">
          {isFull ? (
            <div className="text-center py-5 border border-border/40 bg-wakaba/5 text-sm font-serif text-foreground/50 tracking-widest">
              満席になりました
            </div>
          ) : (
            <Link
              href={`/events/${event.id}/apply`}
              className="inline-flex items-center justify-center w-full bg-accent text-white py-5 font-bold tracking-[0.3em] text-[12px] uppercase hover:bg-accent/90 transition-all font-serif shadow-lg"
            >
              申し込む
            </Link>
          )}
          {remaining !== null && !isFull && (
            <p className="text-center text-[11px] text-foreground/40 font-serif mt-3 tracking-widest">
              残り{remaining}名
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
