import { getDb } from "@/lib/firebase/admin";

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
    cancelPolicyAgreed: true,
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

export async function markApplicationPaid(applicationId: string, paymentIntentId?: string): Promise<void> {
  await getDb()
    .collection(APPLICATIONS_COLLECTION)
    .doc(applicationId)
    .update({
      status: "paid",
      paidAt: new Date().toISOString(),
      ...(paymentIntentId ? { stripePaymentIntentId: paymentIntentId } : {}),
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
