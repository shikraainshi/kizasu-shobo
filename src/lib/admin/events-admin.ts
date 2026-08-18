import { getDb } from "@/lib/firebase/admin";
import { EVENTS_COLLECTION, EventDoc, toEvent } from "@/lib/events";
import type { EventInput } from "@/lib/admin/types";

export async function getAllEventsForAdmin(): Promise<EventDoc[]> {
  const snap = await getDb().collection(EVENTS_COLLECTION).get();
  return snap.docs.map(toEvent).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getEventForAdmin(eventId: string): Promise<EventDoc | undefined> {
  const doc = await getDb().collection(EVENTS_COLLECTION).doc(eventId).get();
  if (!doc.exists) return undefined;
  return toEvent(doc);
}

export async function createEvent(input: EventInput): Promise<{ id: string }> {
  const now = new Date().toISOString();
  const ref = getDb().collection(EVENTS_COLLECTION).doc();
  await ref.set({
    title: input.title,
    coverImageUrl: input.coverImageUrl || "",
    mediaType: input.mediaType,
    price: input.price,
    capacity: input.capacity ?? null,
    status: input.status,
    createdAt: now,
    updatedAt: now,
  });
  return { id: ref.id };
}

export async function updateEvent(eventId: string, input: Partial<EventInput>): Promise<void> {
  const updates: Record<string, unknown> = { updatedAt: new Date().toISOString() };
  if (input.title !== undefined) updates.title = input.title;
  if (input.coverImageUrl !== undefined) updates.coverImageUrl = input.coverImageUrl;
  if (input.mediaType !== undefined) updates.mediaType = input.mediaType;
  if (input.price !== undefined) updates.price = input.price;
  if (input.capacity !== undefined) updates.capacity = input.capacity;
  if (input.status !== undefined) updates.status = input.status;

  await getDb().collection(EVENTS_COLLECTION).doc(eventId).update(updates);
}
