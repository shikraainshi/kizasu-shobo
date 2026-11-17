import Link from "next/link";
import { notFound } from "next/navigation";
import { Ticket } from "lucide-react";
import { getEventById } from "@/lib/events";
import { getPaidParticipantCount } from "@/lib/applications";
import { getCancelPolicy } from "@/lib/settings";
import EventFlyer from "@/app/events/_components/EventFlyer";
import CancelPolicyList from "@/app/events/_components/CancelPolicyList";

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
          <h1 className="text-3xl font-bold text-foreground tracking-[0.1em]">{event.title}</h1>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-14 space-y-10">
        <EventFlyer url={event.coverImageUrl} mediaType={event.mediaType} title={event.title} />

        <div className="flex items-center gap-4 border border-border/40 bg-wakaba/10 px-6 py-5">
          <Ticket size={22} className="text-accent/70 shrink-0" />
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-bold tracking-[0.15em] uppercase text-accent/60">
              参加費
            </span>
            {event.price > 0 ? (
              <span className="">
                <span className="text-2xl font-bold text-foreground tabular-nums">
                  {event.price.toLocaleString()}
                </span>
                <span className="text-sm text-foreground/70 ml-1">円</span>
                <span className="text-xs text-foreground/70 ml-2">／ 1名</span>
              </span>
            ) : (
              <span className="text-2xl font-bold text-foreground">参加無料</span>
            )}
          </div>
        </div>

        {cancelPolicy && (
          <div className="bg-wakaba/5 border border-border/40 p-6 space-y-2">
            <h2 className="text-xs font-bold tracking-[0.1em] uppercase text-accent/60">
              キャンセルポリシー
            </h2>
            <CancelPolicyList text={cancelPolicy} className="text-sm" />
          </div>
        )}

        <div className="pt-4">
          {isFull ? (
            <div className="text-center py-5 border border-border/40 bg-wakaba/5 text-sm text-foreground/70 tracking-widest">
              満席になりました
            </div>
          ) : (
            <Link
              href={`/events/${event.id}/apply`}
              className="inline-flex items-center justify-center w-full bg-accent text-white py-5 font-bold tracking-[0.15em] text-[12px] uppercase hover:bg-accent/90 transition-all shadow-lg"
            >
              申し込みへ進む
            </Link>
          )}
          {remaining !== null && !isFull && (
            <p className="text-center text-[13px] text-foreground/70 mt-3 tracking-widest">
              残り{remaining}名
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
