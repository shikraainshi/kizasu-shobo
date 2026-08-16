import { getDb } from "@/lib/firebase/admin";

// 自由入力を促した直後は、想定外メッセージへの自動フォールバック案内を
// 一定時間出さないようにするための状態管理（同じ案内が連続で出るループを防ぐ）。

const CONTACT_STATES_COLLECTION = "lineContactStates";
const AWAITING_FREE_TEXT_TTL_MINUTES = 60;

export async function markAwaitingFreeText(userId: string): Promise<void> {
  const expiresAt = new Date(Date.now() + AWAITING_FREE_TEXT_TTL_MINUTES * 60 * 1000).toISOString();
  await getDb().collection(CONTACT_STATES_COLLECTION).doc(userId).set({ expiresAt });
}

export async function isAwaitingFreeText(userId: string | undefined): Promise<boolean> {
  if (!userId) return false;
  const doc = await getDb().collection(CONTACT_STATES_COLLECTION).doc(userId).get();
  const expiresAt = doc.data()?.expiresAt;
  if (!expiresAt) return false;
  return new Date(expiresAt).getTime() > Date.now();
}
