// クライアントコンポーネントからも使うため、firebase-admin に依存しないヘルパーだけを置く

/**
 * 正誤表の登録・更新時に自動作成するお知らせのタイトル（本文も同じ文言）
 * - published: 新規登録したとき
 * - updated: PDFを差し替えたとき
 */
export function errataNewsTitle(bookTitle: string, kind: "published" | "updated"): string {
  return kind === "published"
    ? `『${bookTitle}』，正誤表を掲載いたしました。`
    : `『${bookTitle}』，正誤表を更新いたしました。`;
}

/** 日本時間の今日（YYYY-MM-DD） */
export function todayInJapan(): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(new Date());
}
