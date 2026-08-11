import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { stripe } from "@/lib/stripe/client";
import { getApplicationById } from "@/lib/applications";
import { getEventById } from "@/lib/events";
import { formatEventDateTime } from "@/lib/events-format";
import CompleteNotifier from "@/app/events/_components/CompleteNotifier";

export const dynamic = "force-dynamic";

export default async function EventApplyCompletePage({
  params,
  searchParams,
}: {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<{ session_id?: string; applicationId?: string }>;
}) {
  const { eventId } = await params;
  const { session_id, applicationId } = await searchParams;

  const event = await getEventById(eventId);
  const application = applicationId ? await getApplicationById(applicationId) : undefined;

  // Firestoreの状態（Webhookが正）を優先し、反映前の一瞬はStripeへ直接問い合わせて補う
  let isPaid = application?.status === "paid";
  if (!isPaid && session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      isPaid = session.payment_status === "paid";
    } catch (err) {
      console.error("Stripe session retrieve failed:", err);
    }
  }

  if (!isPaid || !event) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 bg-background">
        <div className="max-w-md w-full text-center space-y-6">
          <XCircle className="mx-auto text-accent/50" size={48} />
          <h1 className="text-xl font-serif font-bold text-foreground">決済を確認できませんでした</h1>
          <p className="text-sm text-foreground/60 font-serif leading-relaxed">
            決済がキャンセルされたか、確認中にエラーが発生しました。お手数ですがイベントページから再度お試しください。
          </p>
          <Link
            href={`/events/${eventId}`}
            className="inline-block text-[11px] font-bold tracking-[0.3em] uppercase text-accent/60 hover:text-accent border-b border-accent/20 pb-1 font-serif"
          >
            イベントページに戻る
          </Link>
        </div>
      </div>
    );
  }

  const notifyText = `【申込完了】${event.title}\nお申し込みありがとうございました。決済が完了しました。\n開催日時: ${formatEventDateTime(
    event.startAt
  )}\n参加人数: ${application?.participantCount ?? 1}名`;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 bg-background">
      <div className="max-w-md w-full text-center space-y-8">
        <CheckCircle2 className="mx-auto text-accent" size={48} />
        <div className="space-y-3">
          <h1 className="text-2xl font-serif font-bold text-foreground">お申し込みが完了しました</h1>
          <p className="text-sm text-foreground/60 font-serif leading-relaxed">
            {event.title} へのお申し込み・決済が完了しました。
            <br />
            ご参加をお待ちしております。
          </p>
        </div>
        <CompleteNotifier message={notifyText} />
      </div>
    </div>
  );
}
