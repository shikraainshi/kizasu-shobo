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
    { id: "purchase", label: "本の購入について" },
    { id: "about", label: "萌書房について" },
    { id: "contact", label: "書籍に関するお問い合わせ" },
  ],
};

const SITE_URL = "https://www.kizasu-shobo.jp";

// 回答は単純なテキスト、またはリンクボタン付き（text + linkLabel + linkUrl）で管理する。
export type ContactAnswer = string | { text: string; linkLabel: string; linkUrl: string };

// "category:item" キーで回答文言を管理。未確定の文言は暫定のまま運用しつつ後で書き換える。
export const CONTACT_ANSWERS: Record<string, ContactAnswer> = {
  "event:apply":
    "イベントへのお申し込みは、リッチメニューの「イベント」からお願いいたします。\n開催中のイベントを選択し、詳細ページよりお申し込みいただけます。",
  "event:cancel": "イベントのキャンセルについては、現在準備中です。\n詳細が決まり次第ご案内いたします。",
  "event:content": "開催内容の詳細については、現在準備中です。\n公開まで今しばらくお待ちください。",

  "business:hours": "【営業時間】\n10:30〜18:00\n\n【定休日】\n月曜日\n※月曜日が祝日の場合は、翌火曜日がお休みとなります。",
  "business:access": "Book Cafe 川べり：〒630-8113 奈良県奈良市法蓮町1050-1（近鉄奈良駅より徒歩約15分）\nhttps://maps.google.com/?q=奈良県奈良市法蓮町1050-1",
  "business:parking":
    "店舗駐車場を1台分ご用意しております。\n先着順でのご利用となります。\n\n店舗周辺は道幅が狭くなっておりますので、お車でお越しの際はどうぞお気をつけてお越しください。",
  "business:menu": "メニューについては、現在準備中です。\n店頭にてご案内しております。",
  "business:rental":
    "貸切・レンタルスペースについては、リッチメニューの「レンタルスペース」からご覧いただけます。\nご利用についての詳細・お申し込みは、そちらからお願いいたします。",

  "books:purchase": {
    text: "萌書房の書籍は、ホームページからご覧いただけます。\n気になる書籍を選択すると、書籍の詳細や購入方法をご確認いただけます。",
    linkLabel: "書籍一覧を見る",
    linkUrl: `${SITE_URL}/books`,
  },
  "books:about": {
    text: "萌書房について、出版社としての歩みや本づくりへの思いをご紹介しています。",
    linkLabel: "萌書房について見る",
    linkUrl: `${SITE_URL}/about`,
  },
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
