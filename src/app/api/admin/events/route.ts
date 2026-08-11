import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createEvent } from "@/lib/admin/events-admin";
import { validateEventInput } from "@/lib/admin/validation";
import type { EventInput } from "@/lib/admin/types";

function parseEventInput(body: Record<string, unknown>): EventInput {
  return {
    title: String(body.title || ""),
    description: String(body.description || ""),
    coverImageUrl: String(body.coverImageUrl || ""),
    venue: String(body.venue || ""),
    startAt: String(body.startAt || ""),
    endAt: String(body.endAt || ""),
    price: Number(body.price) || 0,
    capacity: body.capacity === "" || body.capacity === null || body.capacity === undefined ? null : Number(body.capacity),
    status: body.status === "published" || body.status === "closed" ? body.status : "draft",
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = parseEventInput(body);

    const errors = validateEventInput(input, true);
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join("\n") }, { status: 400 });
    }

    const { id } = await createEvent(input);

    revalidatePath("/events");

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Admin create event error:", error);
    return NextResponse.json({ error: "イベントの作成に失敗しました。" }, { status: 500 });
  }
}
