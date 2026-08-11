import { NextResponse } from "next/server";
import { verifyLineSignature } from "@/lib/line/signature";
import { replyMessage } from "@/lib/line/client";
import { resolveReply, GREETING_MESSAGE } from "@/lib/line/replies";
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
        if (event.type !== "message" || event.message?.type !== "text" || !event.replyToken) {
          return;
        }
        const reply = resolveReply(event.message.text ?? "");
        await replyMessage(event.replyToken, [{ type: "text", text: reply }]);
      })
    );
  } catch (error) {
    console.error("LINE webhook error:", error);
  }

  // LINE側の再送を防ぐため、処理失敗時も200を返す
  return NextResponse.json({ success: true });
}
