import { getDb } from "@/lib/firebase/admin";

export type EventStatus = "draft" | "published" | "closed";
export type EventMediaType = "image" | "pdf";

export interface EventDoc {
  id: string;
  title: string;
  coverImageUrl?: string; // mediaTypeに応じて画像またはPDFのURL
  mediaType: EventMediaType;
  price: number; // 円
  capacity: number | null; // nullは無制限
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

export const EVENTS_COLLECTION = "events";

export function toEvent(doc: FirebaseFirestore.DocumentSnapshot): EventDoc {
  const data = doc.data() || {};
  return {
    id: doc.id,
    title: data.title || "",
    coverImageUrl: data.coverImageUrl || undefined,
    mediaType: data.mediaType === "pdf" ? "pdf" : "image",
    price: data.price || 0,
    capacity: data.capacity ?? null,
    status: data.status || "draft",
    createdAt: data.createdAt || "",
    updatedAt: data.updatedAt || "",
  };
}

export async function getPublishedEvents(): Promise<EventDoc[]> {
  const snap = await getDb().collection(EVENTS_COLLECTION).where("status", "==", "published").get();
  return snap.docs.map(toEvent).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getEventById(eventId: string): Promise<EventDoc | undefined> {
  const doc = await getDb().collection(EVENTS_COLLECTION).doc(eventId).get();
  if (!doc.exists) return undefined;
  return toEvent(doc);
}
