// LINEお問い合わせフローの文言・構成データ。内容だけ自由に調整してよい。
// 回答テキストを変更したいときはこのファイルの CONTACT_ANSWERS だけ触れば反映される。

export type ContactCategoryId = "event" | "business" | "books" | "other";

export const CONTACT_CATEGORIES: { id: ContactCategoryId; label: string }[] = [
  { id: "event", label: "イベントについて" },
  { id: "business", label: "営業・店舗について" },
  { id: "books", label: "本・萌書房について" },
  { id: "other", label: "その他のお問い合わせ" },
];

export type ContactQuestionCategoryId = Exclude<ContactCategoryId, "other">;

export const CONTACT_QUESTIONS: Record<
  ContactQuestionCategoryId,
  { id: string; label: string }[]
> = {
  event: [
    { id: "apply", label: "イベントの申込について" },
    { id: "cancel", label: "キャンセルについて" },
    { id: "content", label: "開催内容について" },
    { id: "other", label: "その他" },
  ],
  business: [
    { id: "hours", label: "営業時間・営業日" },
    { id: "access", label: "アクセス" },
    { id: "parking", label: "駐車場" },
    { id: "menu", label: "メニュー" },
    { id: "rental", label: "貸切・レンタルスペース" },
  ],
  books: [
    { id: "stock", label: "本の在庫について" },
    { id: "purchase", label: "本の購入について" },
    { id: "about", label: "萌書房について" },
    { id: "contact", label: "書籍に関するお問い合わせ" },
  ],
};

const MOESHOBO_URL = "https://www.kizasu-shobo.jp/";

// "category:item" キーで回答文言を管理。未確定の文言は暫定のまま運用しつつ後で書き換える。
export const CONTACT_ANSWERS: Record<string, string> = {
  "event:apply": "イベントのお申込みについては、現在準備中です。\n公開まで今しばらくお待ちください。",
  "event:cancel": "イベントのキャンセルについては、現在準備中です。\n詳細が決まり次第ご案内いたします。",
  "event:content": "開催内容の詳細については、現在準備中です。\n公開まで今しばらくお待ちください。",

  "business:hours": "営業時間についてはお電話（Book Cafe 川べり：0742-42-6986）にてお問い合わせください。",
  "business:access": "Book Cafe 川べり：〒630-8113 奈良県奈良市法蓮町1050-1（近鉄奈良駅より徒歩約15分）\nhttps://maps.google.com/?q=奈良県奈良市法蓮町1050-1",
  "business:parking": "駐車場のご案内については、現在準備中です。\nお急ぎの場合はお電話（0742-42-6986）にてお問い合わせください。",
  "business:menu": "メニューについては、現在準備中です。\n店頭にてご案内しております。",
  "business:rental": "貸切・レンタルスペースのご案内・ご予約機能は現在準備中です。\n公開まで今しばらくお待ちください。",

  "books:stock": "本の在庫については、現在準備中です。\nお急ぎの場合はお電話（0742-42-6986）にてお問い合わせください。",
  "books:purchase": `本のご購入については、萌書房ホームページもあわせてご覧ください。\n${MOESHOBO_URL}`,
  "books:about": `萌書房についての詳しい情報は、ホームページをご覧ください。\n${MOESHOBO_URL}`,
};

export const FREE_TEXT_PROMPT = `お問い合わせ内容を、このままメッセージでお送りください。
スタッフが確認のうえ返信いたします。`;

export const EVENT_FREE_TEXT_PROMPT = `イベントに関するお問い合わせ内容を、このままメッセージでお送りください。
スタッフが確認のうえ返信いたします。`;

export const UNEXPECTED_MESSAGE_INTRO = `メッセージありがとうございます。
お問い合わせ内容を下記からお選びください。`;

export const EVENT_PLACEHOLDER_MESSAGE = `イベント情報は現在準備中です。
公開まで今しばらくお待ちください。`;

export const RENTAL_PLACEHOLDER_MESSAGE = `レンタルスペースのご案内・予約機能は現在準備中です。
公開まで今しばらくお待ちください。`;

// event の「その他」／books の「書籍に関するお問い合わせ」／トップの「その他のお問い合わせ」は
// 自由入力を促すプロンプトを返す項目として扱う。
export const FREE_TEXT_ITEMS: Record<ContactQuestionCategoryId, string[]> = {
  event: ["other"],
  business: [],
  books: ["contact"],
};
