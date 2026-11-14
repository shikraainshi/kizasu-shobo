import { getDb } from "@/lib/firebase/admin";
import { ERRATA_COLLECTION } from "@/lib/errata";
import { errataNewsTitle } from "@/lib/errata-format";
import { createNews, updateNews } from "@/lib/admin/notion-admin";
import type { ErrataInput } from "@/lib/admin/types";

/**
 * 正誤表を新規追加し、同時にお知らせ（カテゴリ「お知らせ」、PDF添付）を作成する。
 */
export async function createErrata(input: ErrataInput): Promise<{ id: string; newsPageId: string }> {
  const title = errataNewsTitle(input.bookTitle);
  const { pageId: newsPageId } = await createNews({
    title,
    date: input.updatedAt,
    category: "お知らせ",
    important: false,
    content: title,
    attachmentUrl: input.pdfUrl,
    attachmentName: input.pdfName,
  });

  const now = new Date().toISOString();
  const ref = getDb().collection(ERRATA_COLLECTION).doc();
  await ref.set({
    bookTitle: input.bookTitle,
    updatedAt: input.updatedAt,
    pdfUrl: input.pdfUrl,
    pdfName: input.pdfName,
    newsPageId,
    createdAt: now,
  });

  return { id: ref.id, newsPageId };
}

/**
 * 正誤表を更新する。お知らせは新たに作らない。
 * PDFを差し替えた場合は、新規追加時に作ったお知らせの添付PDFも新しいものに差し替える。
 */
export async function updateErrata(
  errataId: string,
  input: ErrataInput,
  previous: { pdfUrl: string; newsPageId: string }
): Promise<void> {
  await getDb().collection(ERRATA_COLLECTION).doc(errataId).update({
    bookTitle: input.bookTitle,
    updatedAt: input.updatedAt,
    pdfUrl: input.pdfUrl,
    pdfName: input.pdfName,
  });

  if (previous.newsPageId && previous.pdfUrl !== input.pdfUrl) {
    await updateNews(previous.newsPageId, {
      attachmentUrl: input.pdfUrl,
      attachmentName: input.pdfName,
    });
  }
}
