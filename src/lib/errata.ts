import { getDb } from "@/lib/firebase/admin";

export interface ErrataDoc {
  id: string;
  /** 書籍名（『』は表示時に付与されるので不要） */
  bookTitle: string;
  /** 更新日（YYYY-MM-DD） */
  updatedAt: string;
  /** Firebase Storage上のPDFのURL */
  pdfUrl: string;
  /** アップロード時の元ファイル名 */
  pdfName: string;
  /** 新規追加時に自動作成したお知らせのNotionページID */
  newsPageId: string;
  createdAt: string;
}

export const ERRATA_COLLECTION = "errata";

export function toErrata(doc: FirebaseFirestore.DocumentSnapshot): ErrataDoc {
  const data = doc.data() || {};
  return {
    id: doc.id,
    bookTitle: data.bookTitle || "",
    updatedAt: data.updatedAt || "",
    pdfUrl: data.pdfUrl || "",
    pdfName: data.pdfName || "",
    newsPageId: data.newsPageId || "",
    createdAt: data.createdAt || "",
  };
}

/** 更新日の新しい順 */
export async function getAllErrata(): Promise<ErrataDoc[]> {
  const snap = await getDb().collection(ERRATA_COLLECTION).get();
  return snap.docs
    .map(toErrata)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || b.createdAt.localeCompare(a.createdAt));
}

export async function getErrataById(errataId: string): Promise<ErrataDoc | undefined> {
  const doc = await getDb().collection(ERRATA_COLLECTION).doc(errataId).get();
  if (!doc.exists) return undefined;
  return toErrata(doc);
}
