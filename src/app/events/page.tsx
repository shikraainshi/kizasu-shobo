import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { getPublishedEvents } from "@/lib/events";
import { formatEventDateTime } from "@/lib/events-format";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await getPublishedEvents();

  return (
    <div className="pb-24 bg-background">
      <section className="bg-wakaba/30 py-24 border-b border-border">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-serif font-bold text-center text-foreground tracking-[0.2em]">イベント</h1>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-14 md:py-24">
        {events.length === 0 ? (
          <p className="text-center text-foreground/50 font-serif">現在開催予定のイベントはありません。</p>
        ) : (
          <div className="space-y-6">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="block border border-border/40 bg-wakaba/5 p-8 hover:border-accent/40 transition-colors"
              >
                <h2 className="text-xl font-serif font-bold text-foreground">{event.title}</h2>
                <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm text-foreground/60 font-serif">
                  <span className="flex items-center gap-2">
                    <CalendarDays size={16} className="text-accent/60" />
                    {formatEventDateTime(event.startAt)}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin size={16} className="text-accent/60" />
                    {event.venue}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
