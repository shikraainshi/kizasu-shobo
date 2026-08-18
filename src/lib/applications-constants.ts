// 申込フォームで使う選択肢。クライアントコンポーネントからも読み込むため、
// Firebase Admin SDKに依存する src/lib/applications.ts とは分離している。

// 居住エリア・きっかけの選択肢。後から増減しやすいようここで一元管理する。
export const AREA_OPTIONS = ["奈良市内", "奈良県内", "大阪府", "京都府", "その他県外"] as const;
export const SOURCE_OPTIONS = ["Instagram", "LINE", "店頭", "知人紹介", "HP", "その他"] as const;
