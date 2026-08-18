import { getDb } from "@/lib/firebase/admin";
import { EVENTS_COLLECTION } from "@/lib/events";

export { AREA_OPTIONS, SOURCE_OPTIONS } from "@/lib/applications-constants";

export type ApplicationStatus = "pending_payment" | "paid" | "canceled" | "failed";

export interface ApplicationDoc {
  id: string;
  eventId: string;
  eventTitle: string;
  name: string;
  phone: string;
  email: string;
  participantCount: number;
  amount: number;
  cancelPolicyAgreed: boolean;
  lineUserId?: string;
  area?: string;
  source?: string;
  overbooked?: boolean;
  status: ApplicationStatus;
  stripeCheckoutSessionId: string;
  stripePaymentIntentId?: string;
  createdAt: string;
  paidAt?: string;
}

export const APPLICATIONS_COLLECTION = "applications";

export function toApplication(doc: FirebaseFirestore.DocumentSnapshot): ApplicationDoc {
  const data = doc.data() || {};
  return {
    id: doc.id,
    eventId: data.eventId || "",
    eventTitle: data.eventTitle || "",
    name: data.name || "",
    phone: data.phone || "",
    email: data.email || "",
    participantCount: data.participantCount || 1,
    amount: data.amount || 0,
    cancelPolicyAgreed: !!data.cancelPolicyAgreed,
    lineUserId: data.lineUserId || undefined,
    area: data.area || undefined,
    source: data.source || undefined,
    overbooked: data.overbooked || undefined,
    status: data.status || "pending_payment",
    stripeCheckoutSessionId: data.stripeCheckoutSessionId || "",
    stripePaymentIntentId: data.stripePaymentIntentId || undefined,
    createdAt: data.createdAt || "",
    paidAt: data.paidAt || undefined,
  };
}

export interface CreatePendingApplicationInput {
  eventId: string;
  eventTitle: string;
  name: string;
  phone: string;
  email: string;
  participantCount: number;
  amount: number;
  cancelPolicyAgreed: boolean;
  lineUserId?: string;
  area?: string;
  source?: string;
}

export async function createPendingApplication(
  input: CreatePendingApplicationInput
): Promise<ApplicationDoc> {
  const ref = getDb().collection(APPLICATIONS_COLLECTION).doc();
  const data = {
    eventId: input.eventId,
    eventTitle: input.eventTitle,
    name: input.name,
    phone: input.phone,
    email: input.email,
    participantCount: input.participantCount,
    amount: input.amount,
    cancelPolicyAgreed: input.cancelPolicyAgreed,
    ...(input.lineUserId ? { lineUserId: input.lineUserId } : {}),
    ...(input.area ? { area: input.area } : {}),
    ...(input.source ? { source: input.source } : {}),
    status: "pending_payment" as ApplicationStatus,
    stripeCheckoutSessionId: "",
    createdAt: new Date().toISOString(),
  };
  await ref.set(data);
  return { id: ref.id, ...data };
}

export async function attachStripeSession(applicationId: string, sessionId: string): Promise<void> {
  await getDb().collection(APPLICATIONS_COLLECTION).doc(applicationId).update({
    stripeCheckoutSessionId: sessionId,
  });
}

// 決済確定の唯一の入口。Webhookの重複配信や、無料イベントの即時確定と衝突しても
// 安全なようトランザクションで冪等性と定員の再チェックを行う。
// 決済自体は既に完了しているため、超過が判明しても申込は"paid"のまま維持し、
// overbookedフラグで管理画面から把握できるようにする。
export async function markApplicationPaid(applicationId: string, paymentIntentId?: string): Promise<void> {
  const db = getDb();
  const appRef = db.collection(APPLICATIONS_COLLECTION).doc(applicationId);

  await db.runTransaction(async (tx) => {
    const appSnap = await tx.get(appRef);
    if (!appSnap.exists) return;
    const application = toApplication(appSnap);
    if (application.status === "paid") return; // 冪等性: 既に確定済みなら何もしない

    const eventSnap = await tx.get(db.collection(EVENTS_COLLECTION).doc(application.eventId));
    const capacity: number | null = eventSnap.exists ? eventSnap.data()?.capacity ?? null : null;

    let overbooked = false;
    if (capacity !== null) {
      const paidSnap = await tx.get(
        db
          .collection(APPLICATIONS_COLLECTION)
          .where("eventId", "==", application.eventId)
          .where("status", "==", "paid")
      );
      const alreadyPaid = paidSnap.docs.reduce((sum, d) => sum + (d.data().participantCount || 0), 0);
      overbooked = alreadyPaid + application.participantCount > capacity;
    }

    tx.update(appRef, {
      status: "paid",
      paidAt: new Date().toISOString(),
      ...(paymentIntentId ? { stripePaymentIntentId: paymentIntentId } : {}),
      ...(overbooked ? { overbooked: true } : {}),
    });
  });
}

export async function getApplicationById(applicationId: string): Promise<ApplicationDoc | undefined> {
  const doc = await getDb().collection(APPLICATIONS_COLLECTION).doc(applicationId).get();
  if (!doc.exists) return undefined;
  return toApplication(doc);
}

export async function getPaidParticipantCount(eventId: string): Promise<number> {
  const snap = await getDb()
    .collection(APPLICATIONS_COLLECTION)
    .where("eventId", "==", eventId)
    .where("status", "==", "paid")
    .get();
  return snap.docs.reduce((sum, doc) => sum + (doc.data().participantCount || 0), 0);
}
