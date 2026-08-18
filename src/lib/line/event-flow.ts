import { getPublishedEvents, EventDoc } from "@/lib/events";
import { getPaidParticipantCount } from "@/lib/applications";
import { LineFlexMessage, LineMessage } from "@/lib/line/types";

// ブックカフェ「川べり」のトーンに合わせた落ち着いた配色（LINEグリーンは使わない）。
const FLEX_COLORS = {
  background: "#FAF7F2",
  title: "#3B2F2A",
  description: "#6B5D52",
  separator: "#E4DED2",
  button: "#8095A8",
  buttonMuted: "#B9B2A6",
};

const NO_EVENTS_MESSAGE = "現在受付中のイベントはございません。\n次回の開催をお楽しみに。";
const MAX_CAROUSEL_EVENTS = 10;

function buildEventUrl(eventId: string): string {
  const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
  const siteUrl = process.env.SITE_URL || "https://kizasu-shobo.jp";
  const base = liffId ? `https://liff.line.me/${liffId}` : siteUrl;
  return `${base}/events/${eventId}`;
}

async function buildEventBubble(event: EventDoc) {
  const remaining =
    event.capacity !== null ? event.capacity - (await getPaidParticipantCount(event.id)) : null;
  const isFull = remaining !== null && remaining <= 0;

  const infoLines = [
    event.price > 0 ? `${event.price.toLocaleString()}円` : "参加無料",
    remaining !== null ? (isFull ? "満席" : `残り${remaining}名`) : null,
  ].filter((line): line is string => !!line);

  return {
    type: "bubble",
    ...(event.mediaType === "image" && event.coverImageUrl
      ? {
          hero: {
            type: "image",
            url: event.coverImageUrl,
            size: "full",
            aspectRatio: "20:13",
            aspectMode: "cover",
          },
        }
      : {}),
    body: {
      type: "box",
      layout: "vertical",
      backgroundColor: FLEX_COLORS.background,
      paddingAll: "20px",
      spacing: "sm",
      contents: [
        { type: "text", text: event.title, weight: "bold", size: "md", color: FLEX_COLORS.title, wrap: true },
        {
          type: "text",
          text: infoLines.join(" ・ "),
          size: "xs",
          color: FLEX_COLORS.description,
          wrap: true,
          margin: "sm",
        },
      ],
    },
    footer: {
      type: "box",
      layout: "vertical",
      paddingAll: "12px",
      contents: [
        {
          type: "button",
          style: "primary",
          color: isFull ? FLEX_COLORS.buttonMuted : FLEX_COLORS.button,
          height: "sm",
          action: {
            type: "uri",
            label: isFull ? "満席（詳細を見る）" : "詳細・申し込み",
            uri: buildEventUrl(event.id),
          },
        },
      ],
    },
  };
}

export async function resolveEventListMessage(): Promise<LineMessage> {
  const events = (await getPublishedEvents()).slice(0, MAX_CAROUSEL_EVENTS);
  if (events.length === 0) {
    return { type: "text", text: NO_EVENTS_MESSAGE };
  }

  const bubbles = await Promise.all(events.map(buildEventBubble));

  const flex: LineFlexMessage = {
    type: "flex",
    altText: "現在受付中のイベント一覧",
    contents: {
      type: "carousel",
      contents: bubbles,
    },
  };
  return flex;
}
