import { NextResponse } from "next/server";
import { getEventById } from "@/lib/events";
import { attachStripeSession, createPendingApplication, getPaidParticipantCount, markApplicationPaid } from "@/lib/applications";
import { stripe } from "@/lib/stripe/client";

const SITE_URL = process.env.SITE_URL || "https://kizasu-shobo.jp";

export async function POST(request: Request, { params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;

  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const email = String(body.email || "").trim();
    const participantCount = Math.max(1, Math.floor(Number(body.participantCount) || 1));
    const cancelPolicyAgreed = !!body.cancelPolicyAgreed;

    if (!name || !phone || !email) {
      return NextResponse.json({ error: "お名前・電話番号・メールアドレスを入力してください。" }, { status: 400 });
    }
    if (!cancelPolicyAgreed) {
      return NextResponse.json({ error: "キャンセルポリシーへの同意が必要です。" }, { status: 400 });
    }

    const event = await getEventById(eventId);
    if (!event || event.status !== "published") {
      return NextResponse.json({ error: "イベントが見つかりません。" }, { status: 404 });
    }

    if (event.capacity !== null) {
      const paidCount = await getPaidParticipantCount(eventId);
      if (paidCount + participantCount > event.capacity) {
        return NextResponse.json({ error: "定員に達しているため、お申し込みいただけません。" }, { status: 409 });
      }
    }

    const amount = event.price * participantCount;

    const application = await createPendingApplication({
      eventId,
      eventTitle: event.title,
      name,
      phone,
      email,
      participantCount,
      amount,
    });

    // LIFF ID未設定時は通常のサイトURLで戻す（LINEトーク完了通知は送信されない）
    const returnBase = process.env.NEXT_PUBLIC_LIFF_ID
      ? `https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}`
      : SITE_URL;
    const completeUrl = new URL(`${returnBase}/events/${eventId}/apply/complete`);
    completeUrl.searchParams.set("applicationId", application.id);

    // 参加費無料のイベントはStripeを介さず即時「決済済み」として扱う
    if (amount <= 0) {
      await markApplicationPaid(application.id);
      return NextResponse.json({ url: completeUrl.toString() });
    }

    // {CHECKOUT_SESSION_ID} はStripeが置換するプレースホルダーなのでエンコードせず末尾に付与する
    const successUrl = `${completeUrl.toString()}&session_id={CHECKOUT_SESSION_ID}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "jpy",
            product_data: { name: event.title },
            unit_amount: event.price,
          },
          quantity: participantCount,
        },
      ],
      success_url: successUrl,
      cancel_url: `${SITE_URL}/events/${eventId}/apply?canceled=1`,
      metadata: { applicationId: application.id, eventId },
    });

    await attachStripeSession(application.id, session.id);

    if (!session.url) {
      return NextResponse.json({ error: "決済ページの作成に失敗しました。" }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Application creation error:", error);
    return NextResponse.json({ error: "申込処理に失敗しました。" }, { status: 500 });
  }
}
