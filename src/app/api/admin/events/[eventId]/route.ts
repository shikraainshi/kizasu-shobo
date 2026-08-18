import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { updateEvent } from "@/lib/admin/events-admin";
import { validateEventInput } from "@/lib/admin/validation";
import type { EventInput } from "@/lib/admin/types";

function parseEventInput(body: Record<string, unknown>): EventInput {
  return {
    title: String(body.title || ""),
    description: String(body.description || ""),
    coverImageUrl: String(body.coverImageUrl || ""),
    mediaType: body.mediaType === "pdf" ? "pdf" : "image",
    venue: String(body.venue || ""),
    startAt: String(body.startAt || ""),
    endAt: String(body.endAt || ""),
    price: Number(body.price) || 0,
    capacity: body.capacity === "" || body.capacity === null || body.capacity === undefined ? null : Number(body.capacity),
    cancellationPolicy: String(body.cancellationPolicy || ""),
    status: body.status === "published" || body.status === "closed" ? body.status : "draft",
  };
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const body = await request.json();
    const input = parseEventInput(body);

    const errors = validateEventInput(input, true);
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join("\n") }, { status: 400 });
    }

    await updateEvent(eventId, input);

    revalidatePath("/events");
    revalidatePath(`/events/${eventId}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin update event error:", error);
    return NextResponse.json({ error: "イベントの更新に失敗しました。" }, { status: 500 });
  }
}
