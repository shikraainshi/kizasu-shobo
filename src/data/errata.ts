export interface Errata {
  /** 書籍名（『』は表示時に付与されるので不要） */
  bookTitle: string;
  /** 更新日（YYYY-MM-DD） */
  updatedAt: string;
  /** PDFのパス。public/errata/ に置いたファイルなら "/errata/ファイル名.pdf" */
  pdfUrl: string;
}

/**
 * 正誤表一覧
 *
 * 追加手順:
 *   1. PDFを public/errata/ に置く（ファイル名は半角英数字推奨）
 *   2. 下の配列に1件追加する
 *
 * 例:
 *   { bookTitle: "愛とか正義とか", updatedAt: "2026-11-14", pdfUrl: "/errata/aitoka.pdf" },
 */
export const ERRATA: Errata[] = [];
