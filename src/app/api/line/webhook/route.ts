import { NextResponse } from "next/server";
import { verifyLineSignature } from "@/lib/line/signature";
import { replyMessage } from "@/lib/line/client";
import { resolveReply, GREETING_MESSAGE } from "@/lib/line/replies";
import { resolvePostbackMessage, showContactMenu } from "@/lib/line/contact-flow";
import { isAwaitingFreeText } from "@/lib/line/contact-state";
import { UNEXPECTED_MESSAGE_INTRO } from "@/lib/line/contact-content";
import { LineWebhookBody } from "@/lib/line/types";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-line-signature");

  const isValid = await verifyLineSignature(rawBody, signature);
  if (!isValid) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  try {
    const body: LineWebhookBody = JSON.parse(rawBody);
    const events = body.events ?? [];

    await Promise.all(
      events.map(async (event) => {
        if (event.type === "follow" && event.replyToken) {
          await replyMessage(event.replyToken, [{ type: "text", text: GREETING_MESSAGE }]);
          return;
        }

        if (event.type === "postback" && event.replyToken) {
          const message = await resolvePostbackMessage(event.postback?.data ?? "", event.source?.userId);
          await replyMessage(event.replyToken, [message]);
          return;
        }

        if (event.type !== "message" || event.message?.type !== "text" || !event.replyToken) {
          return;
        }

        const reply = resolveReply(event.message.text ?? "");
        if (reply) {
          await replyMessage(event.replyToken, [{ type: "text", text: reply }]);
          return;
        }

        if (await isAwaitingFreeText(event.source?.userId)) {
          // スタッフへの自由入力を促した直後なので、想定外メッセージ案内は出さない
          return;
        }

        await replyMessage(event.replyToken, [showContactMenu(UNEXPECTED_MESSAGE_INTRO)]);
      })
    );
  } catch (error) {
    console.error("LINE webhook error:", error);
  }

  // LINE側の再送を防ぐため、処理失敗時も200を返す
  return NextResponse.json({ success: true });
}
