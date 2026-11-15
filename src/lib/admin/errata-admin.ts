import { getDb } from "@/lib/firebase/admin";
import { ERRATA_COLLECTION } from "@/lib/errata";
import { errataNewsTitle } from "@/lib/errata-format";
import { createNews, getAllBooksForAdmin } from "@/lib/admin/notion-admin";
import type { ErrataInput } from "@/lib/admin/types";

/** 書籍名の候補（Notionの書籍DBから、新しい順・重複なし） */
export async function getErrataBookTitles(): Promise<string[]> {
  const books = await getAllBooksForAdmin();
  return [...new Set(books.map((b) => b.title.trim()).filter(Boolean))];
}

/** 正誤表PDFを添付したお知らせ（カテゴリ「お知らせ」）を作成する */
async function createErrataNews(input: ErrataInput, kind: "published" | "updated"): Promise<string> {
  const title = errataNewsTitle(input.bookTitle, kind);
  const { pageId } = await createNews({
    title,
    date: input.updatedAt,
    category: "お知らせ",
    important: false,
    content: title,
    attachmentUrl: input.pdfUrl,
    attachmentName: input.pdfName,
  });
  return pageId;
}

/**
 * 正誤表を新規登録し、「正誤表を掲載いたしました。」のお知らせを作成する。
 */
export async function createErrata(input: ErrataInput): Promise<{ id: string; newsPageId: string }> {
  const newsPageId = await createErrataNews(input, "published");

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
 * 正誤表を更新する。
 * PDFを差し替えた場合は「正誤表を更新いたしました。」のお知らせを新しく作成する
 * （それまでのお知らせはそのまま残す）。書籍名・更新日だけの変更ではお知らせは作らない。
 */
export async function updateErrata(
  errataId: string,
  input: ErrataInput,
  previous: { pdfUrl: string }
): Promise<{ newsPageId: string | null }> {
  const pdfChanged = previous.pdfUrl !== input.pdfUrl;
  const newsPageId = pdfChanged ? await createErrataNews(input, "updated") : null;

  await getDb()
    .collection(ERRATA_COLLECTION)
    .doc(errataId)
    .update({
      bookTitle: input.bookTitle,
      updatedAt: input.updatedAt,
      pdfUrl: input.pdfUrl,
      pdfName: input.pdfName,
      // 最新のお知らせを指すようにする
      ...(newsPageId ? { newsPageId } : {}),
    });

  return { newsPageId };
}
