import { getDb } from "@/lib/firebase/admin";

export type EventStatus = "draft" | "published" | "closed";
export type EventMediaType = "image" | "pdf";

export interface EventDoc {
  id: string;
  title: string;
  description: string;
  coverImageUrl?: string; // mediaTypeに応じて画像またはPDFのURL
  mediaType: EventMediaType;
  venue: string;
  startAt: string; // ISO
  endAt?: string; // ISO
  price: number; // 円
  capacity: number | null; // nullは無制限
  cancellationPolicy?: string; // 未設定時は共通のキャンセルポリシー（settings）にフォールバック
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
    description: data.description || "",
    coverImageUrl: data.coverImageUrl || undefined,
    mediaType: data.mediaType === "pdf" ? "pdf" : "image",
    venue: data.venue || "",
    startAt: data.startAt || "",
    endAt: data.endAt || undefined,
    price: data.price || 0,
    capacity: data.capacity ?? null,
    cancellationPolicy: data.cancellationPolicy || undefined,
    status: data.status || "draft",
    createdAt: data.createdAt || "",
    updatedAt: data.updatedAt || "",
  };
}

export async function getPublishedEvents(): Promise<EventDoc[]> {
  const snap = await getDb().collection(EVENTS_COLLECTION).where("status", "==", "published").get();
  return snap.docs.map(toEvent).sort((a, b) => a.startAt.localeCompare(b.startAt));
}

export async function getEventById(eventId: string): Promise<EventDoc | undefined> {
  const doc = await getDb().collection(EVENTS_COLLECTION).doc(eventId).get();
  if (!doc.exists) return undefined;
  return toEvent(doc);
}
