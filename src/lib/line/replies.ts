// 自動応答の文面。サイトに未掲載の情報（営業時間・予約方法）を含むため暫定文言。
// 内容だけ自由に調整してよい。

export const KEYWORD_REPLIES: { keywords: string[]; reply: string }[] = [
  {
    keywords: ["営業時間", "何時"],
    reply:
      "営業時間についてはお電話（Book Cafe 川べり：0742-42-6986）にてお問い合わせください。",
  },
  {
    keywords: ["予約"],
    reply:
      "ご予約はお電話（0742-42-6986）またはお問い合わせフォーム（https://kizasu-shobo.jp/contact）よりご連絡ください。",
  },
  {
    keywords: ["アクセス", "場所", "住所"],
    reply:
      "Book Cafe 川べり：〒630-8113 奈良県奈良市法蓮町1050-1（近鉄奈良駅より徒歩約15分）\nhttps://maps.google.com/?q=奈良県奈良市法蓮町1050-1",
  },
];

export const GREETING_MESSAGE = `友だち追加ありがとうございます。
ブックカフェ「川べり」です。

佐保川のほとりで、本と珈琲を楽しむ小さな場所をひらいています。

このLINEでは、読書会や演奏会などのイベント情報を中心に、川べりからのお知らせをお届けします。

イベントへのお申し込みやお問い合わせは、下のメニューからご利用いただけます。

川べりで過ごす時間が、日々のなかの小さな楽しみになれば幸いです。`;

export function resolveReply(text: string): string | undefined {
  const matched = KEYWORD_REPLIES.find(({ keywords }) =>
    keywords.some((keyword) => text.includes(keyword))
  );
  return matched?.reply;
}
