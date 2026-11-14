// クライアントコンポーネントからも使うため、firebase-admin に依存しないヘルパーだけを置く

/** 正誤表を新規追加したときに自動作成するお知らせのタイトル（本文も同じ文言） */
export function errataNewsTitle(bookTitle: string): string {
  return `『${bookTitle}』，正誤表を更新いたしました。`;
}

/** 日本時間の今日（YYYY-MM-DD） */
export function todayInJapan(): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(new Date());
}
