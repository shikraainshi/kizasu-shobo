import { getDb } from "@/lib/firebase/admin";

const SETTINGS_COLLECTION = "settings";
const GENERAL_DOC_ID = "general";

export async function getCancelPolicy(): Promise<string> {
  const doc = await getDb().collection(SETTINGS_COLLECTION).doc(GENERAL_DOC_ID).get();
  return doc.data()?.cancelPolicy || "";
}
