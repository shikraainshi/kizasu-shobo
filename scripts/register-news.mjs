import { Client } from "@notionhq/client";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envContent = readFileSync(join(__dirname, "../.env.local"), "utf-8");
const env = {};
for (const line of envContent.split("\n")) {
  const [key, ...vals] = line.split("=");
  if (key && vals.length) env[key.trim()] = vals.join("=").trim();
}

const notion = new Client({ auth: env.NOTION_API_KEY, notionVersion: "2022-06-28" });
const DB_ID = env.NOTION_NEWS_DB_ID;

// 登録対象リスト
const NEWS_LIST = [
  { date: "2026-04-24", title: "『ディケンズ全集　書簡集　Ⅲ』，正誤表を更新いたしました（pdfファイル）。" },
  { date: "2026-04-24", title: "『ディケンズ全集　書簡集　Ⅰ』，正誤表を更新いたしました（pdfファイル）。" },
  { date: "2026-04-20", title: "最新刊『シェリングとスピノザ主義』（松山壽一著）のお知らせ" },
  { date: "2026-03-17", title: "『ディケンズ全集　書簡集　Ⅲ』，正誤表を更新いたしました（pdfファイル）。" },
  { date: "2026-02-24", title: "最新刊『災害と福祉の交差点――理論・方法・実装の越境と連結――』（立木 茂雄・横田 恵子・松川 杏寧・本莊 雄一・横山 登志子・黒宮 亜希子・武田 丈・川見 文紀 著）のお知らせ" },
  { date: "2026-01-24", title: "最新刊〈ディケンズ全集〉第10回配本『クリスマス・ブックス』（チャールズ・ディケンズ著／田辺洋子訳）のお知らせ" },
  { date: "2026-01-16", title: "『ディケンズ全集　書簡集　Ⅲ』，正誤表を掲載いたしました（pdfファイル）。" },
  { date: "2025-12-17", title: "最新刊『シェリング自然哲学の諸相』（松山壽一著）のお知らせ" },
  { date: "2025-10-16", title: "最新刊『凡夫と時間――法哲学の人間論――』（松岡伸樹著）のお知らせ" },
  { date: "2025-08-30", title: "最新刊〈ディケンズ全集〉第9回配本『二都物語』（チャールズ・ディケンズ著／田辺洋子訳）のお知らせ" },
  { date: "2025-08-14", title: "『ディケンズ全集　書簡集Ⅱ』、正誤表のリンクミスを修正いたしました。ご迷惑をおかけし、お詫び申し上げます。" },
  { date: "2025-06-10", title: "最新刊『ヌース』（マシュー・リップマン著／ほっしーえいじ・坂田和代訳）のお知らせ" },
  { date: "2025-06-05", title: "『ディケンズ全集　書簡集Ⅱ』，正誤表を掲載いたしました（pdfファイル）。" },
  { date: "2025-05-27", title: "最新刊『文学する身体――谷崎潤一郎と志賀直哉』（呉谷充利著）のお知らせ" },
  { date: "2025-04-08", title: "最新刊『神話の真理――シェリングの神話論』（松山壽一著）のお知らせ" },
  { date: "2025-03-16", title: "最新刊『マルセル・デュシャンと「絵画」という名――モデルニスムの歴史のなかで』（森田亜紀・山縣直子著）のお知らせ" },
  { date: "2025-02-26", title: "最新刊『塩尻公明――苦悩と随喜の生涯』（中谷彪著）のお知らせ" },
  { date: "2025-02-18", title: "最新刊『自然の論理』（中敬夫著）のお知らせ" },
  { date: "2025-02-02", title: "最新刊〈ディケンズ全集〉第8回配本『書簡集III　1842-1843年』（チャールズ・ディケンズ著／田辺洋子訳）のお知らせ" },
  { date: "2025-02-02", title: "最新刊〈ディケンズ全集〉第7回配本『オリヴァー・トゥイスト』（チャールズ・ディケンズ著／田辺洋子訳）のお知らせ" },
  { date: "2024-06-23", title: "最新刊『人民による反乱の試み――ドイツの悲劇』（ギュンター・グラス著／伊藤哲夫訳）のお知らせ" },
  { date: "2024-03-31", title: "最新刊『或る遺書について』（塩尻公明著）のお知らせ" },
  { date: "2024-03-31", title: "最新刊『ヘーゲル『精神現象学』の建築術』（田端信廣著）のお知らせ" },
  { date: "2024-01-18", title: "最新刊〈ディケンズ全集〉第6回配本『ニコラス・ニクルビー　下』（チャールズ・ディケンズ著／田辺洋子訳）刊行のお知らせ" },
  { date: "2023-11-11", title: "最新刊〈ディケンズ全集〉第5回配本『ニコラス・ニクルビー　上』（チャールズ・ディケンズ著／田辺洋子訳）のお知らせ" },
  { date: "2023-10-08", title: "最新刊『装いの不自由』倉本香・森田美芽・沼田千恵・上田章子・岡村優生著のお知らせ" },
  { date: "2023-09-15", title: "最新刊『キェルケゴールは反ヘーゲル主義者だったのか？――彼のヘーゲルへの関わりを再吟味する』（ジョン・スチュアート著／枡形公也監訳）のお知らせ" },
  { date: "2023-04-16", title: "最新刊『曲がり角の向こう――現代社会への問いかけ――』（庭田茂吉・倉本香・和田渡編）のお知らせ" },
  { date: "2023-04-13", title: "『戦略思考のしくみ』，正誤表を更新いたしました。" },
  { date: "2023-03-16", title: "最新刊『飛鳥の古代寺院』（清水昭博著）のお知らせ" },
  { date: "2023-03-12", title: "ディケンズ全集特集ページ，開設いたしました。" },
  { date: "2023-01-15", title: "『芸術の中動態──受容／制作の基層──』（森田亜紀著）、価格改定のお知らせ" },
  { date: "2023-01-15", title: "最新刊『芸術と共在の中動態――作品をめぐる自他関係とシステムの基層』（森田亜紀著）のお知らせ" },
  { date: "2022-12-31", title: "『ディケンズ全集　書簡集Ⅰ』，正誤表を掲載いたしました（pdfファイル） （2024/06/10 正誤表更新）。" },
  { date: "2022-12-20", title: "『災害と復興の社会学〔増補版〕』（立木茂雄著）のお知らせ" },
  { date: "2022-12-20", title: "『縁起の基礎法学入門』（松岡伸樹著）のお知らせ" },
  { date: "2022-12-20", title: "『徳富蘇峰　人と時代』（和田守著／伊藤彌彦編）のお知らせ" },
  { date: "2022-12-18", title: "〈ディケンズ全集〉第4回配本『書簡集II　1840-1841年』（田辺洋子訳）のお知らせ" },
  { date: "2022-09-20", title: "〈i-BOSAIブックレットNo.4〉誰一人取り残さない防災のために、福祉関係者が取り組むべきこと【解説編】（立木茂雄監修・西野佳名子著）のお知らせ" },
  { date: "2022-09-20", title: "〈i-BOSAIブックレットNo.3〉誰一人取り残さない防災のために、福祉関係者が取り組むべきこと【物語編】（立木茂雄監修・西野佳名子著）のお知らせ" },
  { date: "2022-09-20", title: "〈i-BOSAIブックレットNo.2〉誰一人取り残さない防災のための、当事者力アセスメントの進め方（立木茂雄監修・森保純子著）のお知らせ" },
  { date: "2022-09-20", title: "『レヴィナスからレヴィナスへ』（庭田茂吉著）のお知らせ" },
  { date: "2022-02-22", title: "〈ディケンズ全集〉第3回配本『ドンビー父子』下巻（田辺洋子訳）のお知らせ" },
  { date: "2021-12-13", title: "最新刊『経験論の多面的展開――イギリス経験論から現代プラグマティズムへ――』（加賀裕郎・新茂之編）のお知らせ" },
  { date: "2021-09-12", title: "〈ディケンズ全集〉第2回配本『ドンビー父子』上巻（田辺洋子訳）のお知らせ" },
  { date: "2021-09-12", title: "最新刊『外国語教員のための大学リテラシー入門』（木村正則著）のお知らせ" },
  { date: "2021-09-12", title: "最新刊『生活形式と脆弱性――倫理としてのケア』（アンヌ・ゴノン／沼田千恵／落合芳編）のお知らせ" },
  { date: "2021-09-12", title: "最新刊『読むラジオ講座　ミスチルで哲学しよう』（小林正嗣著）のお知らせ" },
  { date: "2021-03-05", title: "最新刊『自然の現象学入門』（中敬夫著）のお知らせ" },
  { date: "2021-01-13", title: "最新刊『ディケンズ全集　書簡集Ⅰ　1820-1839年』（田辺洋子訳）のお知らせ（ディケンズ全集　第1回配本）" },
  { date: "2020-12-28", title: "『戦略思考のしくみ』，正誤表を掲載いたしました。" },
  { date: "2020-12-27", title: "最新刊『存在と力』（ジャン＝ミシェル・ル・ラヌー著／服部敬弘・樋口雄哉訳）のお知らせ" },
  { date: "2020-10-16", title: "最新刊『他性と場所　Ⅱ』（中敬夫著）のお知らせ" },
  { date: "2020-10-16", title: "最新刊『戦略思考のしくみ』（杉田英樹著）のお知らせ" },
  { date: "2020-09-03", title: "最新刊〈i-BOSAIブックレット〉『誰一人取り残さない防災に向けて、福祉関係者が身につけるべきこと』（立木茂雄 著）のお知らせ" },
  { date: "2020-07-17", title: "最新刊『定住外国人活躍政策の提案』（松下啓一・神奈川県政策形成実践研究会 著）のお知らせ" },
  { date: "2020-04-20", title: "最新刊『ブレグジット×トランプの時代』（小野塚佳光著）のお知らせ" },
  { date: "2020-01-31", title: "最新刊『まほろば文学街道』（真銅正宏著）のお知らせ" },
  { date: "2019-12-12", title: "最新刊『ハンナ・アレント再論──〈あるべき政治〉を求めて』（寺島俊穂著）のお知らせ" },
  { date: "2019-11-28", title: "『家族システムの理論的・実証的研究』，正誤表を掲載いたしました。" },
  { date: "2019-10-22", title: "最新刊『〈縁〉と〈出会い〉の空間へ──都市の風土学12講』（木岡伸夫編）のお知らせ" },
  { date: "2019-09-05", title: "最新刊『糧』（コリーヌ・ぺリュション著／服部敬弘・佐藤真人・樋口雄哉・平光佑訳）のお知らせ" },
  { date: "2019-09-05", title: "最新刊『映画の四日間 Part 2──中島貞夫シナリオゼミナール〔新装版〕』（中島貞夫著／吉田馨構成）のお知らせ" },
  { date: "2019-04-07", title: "最新刊『共に生きる倫理』（倉本香・沼田千恵・上田章子・岡本優生・蓮尾浩之・阪本恭子・森田美芽著）のお知らせ" },
  { date: "2019-04-07", title: "最新刊『新たな哲学の創発』（河村次郎著）のお知らせ" },
  { date: "2019-04-04", title: "最新刊『陶芸で多面体』（石黒武彦著）のお知らせ" },
  { date: "2019-04-04", title: "最新刊『「ストーリー漫画の父」テプフェール』（森田直子著）のお知らせ" },
  { date: "2018-11-18", title: "最新刊『現代における宗教批判の克服学』（金子昭著）のお知らせ" },
  { date: "2018-11-18", title: "最新刊『ヂヾイ・テリブル、あるいは反時代的考察』（庭田茂吉著）のお知らせ" },
  { date: "2018-11-18", title: "最新刊『運動する身体の哲学』（鋳物美佳著）のお知らせ" },
  { date: "2018-05-10", title: "最新刊『読みつぐビートルズ』（小林順編著）のお知らせ" },
  { date: "2018-05-02", title: "最新刊『現代自治体論』（松下啓一著）のお知らせ" },
  { date: "2018-05-01", title: "最新刊『日常の中の哲学』（庭田茂吉著）のお知らせ" },
  { date: "2018-05-01", title: "最新刊『レヴィナスにおける身体の問題Ⅰ』（庭田茂吉著）のお知らせ" },
  { date: "2018-05-01", title: "最新刊『教養としての経済思想』（北田了介編著）のお知らせ" },
  { date: "2018-04-24", title: "『なぜ企業に倫理を問えるのか』，正誤表を掲載いたしました。" },
  { date: "2018-03-27", title: "最新刊『哲学，する？』（平尾昌宏著）のお知らせ" },
  { date: "2018-03-27", title: "最新刊『なぜ企業に倫理を問えるのか』（宮坂純一）のお知らせ" },
  { date: "2017-12-20", title: "最新刊『語りつぐトクヴィル』（中谷猛著）のお知らせ" },
  { date: "2017-09-21", title: "最新刊『他性と場所　Ⅰ』（中敬夫著）のお知らせ" },
  { date: "2017-09-21", title: "最新刊『丸山眞男と清水幾太郎』（小幡清剛著）のお知らせ" },
  { date: "2017-05-14", title: "最新刊『子どもと倫理学』（フィリップ・キャム著／枡形公也監訳のお知らせ" },
  { date: "2017-05-14", title: "最新刊『ガバナンス時代の国連改革と国際公務員』（皆川萌子著）のお知らせ" },
  { date: "2017-04-10", title: "2017年5月15日から7月30日まで、ジュンク堂書店大阪本店3階で「大阪地本祭り」が開催されます。萌書房も出展します。公式Facebookページはこちら。" },
  { date: "2017-04-10", title: "最新刊『自治体若者政策・愛知県新城市の挑戦』（松下啓一・穂積亮次編）のお知らせ" },
  { date: "2017-04-10", title: "最新刊『美と藝術の扉』（田之頭一知著）のお知らせ" },
  { date: "2016-10-14", title: "最新刊『存在と時空』（河村次郎著）のお知らせ" },
  { date: "2016-09-04", title: "最新刊『万延遣米使節におけるアメリカ体験の諸相』（岡林伸夫著）のお知らせ" },
  { date: "2016-09-04", title: "最新刊『ブラック企業に負けないリーガル・リテラシー』（中嶌剛著）のお知らせ" },
  { date: "2016-06-29", title: "最新刊『石川達三』（川上勉著）のお知らせ" },
  { date: "2016-05-01", title: "最新刊『自治する日本』（穂積亮次著）のお知らせ" },
  { date: "2016-05-01", title: "最新刊『「リーガル・スタディ」コトハジメ』（山口由紀子・奥貫妃文著）のお知らせ" },
  { date: "2016-03-19", title: "最新刊『障害者の〈生〉』（小幡清剛著）のお知らせ" },
  { date: "2016-03-19", title: "最新刊『災害と復興の社会学』（立木茂雄著）のお知らせ" },
  { date: "2016-03-19", title: "最新刊『励ます地方自治』（松下啓一著）のお知らせ" },
  { date: "2015-10-25", title: "最新刊『共に考える』（フィリップ・キャム著／枡形公也監訳）のお知らせ" },
  { date: "2015-10-15", title: "最新刊『ラインホルト哲学研究序説』（田端信廣著）のお知らせ" },
  { date: "2015-10-15", title: "最新刊『キャリア・アントレプレナーシップ論』（松重和美監修／竹本拓治編著）のお知らせ" },
  { date: "2015-10-15", title: "最新刊『海洋国家の歴史に見る日本の未来』（多田稔著）のお知らせ" },
  { date: "2015-10-15", title: "最新刊『家族システムの理論的・実証的研究〔増補改訂版〕』（立木茂雄著）のお知らせ" },
  { date: "2015-05-14", title: "萌書房公式サイト，リニューアルいたしました。" },
];

// カテゴリ推定
function inferCategory(title) {
  if (title.includes("最新刊") || title.includes("刊行")) return "新刊情報";
  return "お知らせ";
}

// 重複チェック用に正規化 (「（pdfファイル）」などを除去して比較)
function normalizeTitle(t) {
  return t
    .replace(/（pdfファイル）/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/。$/, "");
}

function isDuplicate(myTitle, existingTitles) {
  const myNorm = normalizeTitle(myTitle);
  for (const existing of existingTitles) {
    const exNorm = normalizeTitle(existing);
    if (myNorm === exNorm || myNorm.startsWith(exNorm) || exNorm.startsWith(myNorm)) {
      return existing;
    }
  }
  return null;
}

async function main() {
  // 既存エントリを全件取得
  console.log("既存エントリを取得中...");
  let existingTitles = [];
  let hasMore = true;
  let cursor;

  while (hasMore) {
    const res = await notion.request({
      path: `databases/${DB_ID}/query`,
      method: "post",
      body: { page_size: 100, start_cursor: cursor },
    });
    for (const page of res.results) {
      const t = page.properties["タイトル"]?.title?.[0]?.plain_text || "";
      if (t) existingTitles.push(t);
    }
    hasMore = res.has_more;
    cursor = res.next_cursor || undefined;
  }
  console.log(`既存: ${existingTitles.length}件\n`);

  // 重複チェックして分類
  const toRegister = [];
  const skipped = [];

  for (const item of NEWS_LIST) {
    const dup = isDuplicate(item.title, existingTitles);
    if (dup) {
      skipped.push({ item, matchedWith: dup });
    } else {
      toRegister.push(item);
    }
  }

  console.log(`スキップ（登録済み）: ${skipped.length}件`);
  for (const { item, matchedWith } of skipped) {
    console.log(`  ✓ [${item.date}] ${item.title.slice(0, 50)}...`);
  }

  console.log(`\n登録予定: ${toRegister.length}件`);
  for (const item of toRegister) {
    console.log(`  + [${item.date}] ${item.title.slice(0, 60)}...`);
  }

  if (toRegister.length === 0) {
    console.log("\n登録するものはありません。");
    return;
  }

  console.log("\n登録開始...");
  let registered = 0;
  let failed = 0;

  for (const item of toRegister) {
    const category = inferCategory(item.title);
    const slug = item.date.replace(/-/g, "") + "-" + (registered + failed + 1);

    try {
      await notion.request({
        path: "pages",
        method: "post",
        body: {
          parent: { database_id: DB_ID },
          properties: {
            タイトル: { title: [{ text: { content: item.title } }] },
            日付: { date: { start: item.date } },
            カテゴリ: { select: { name: category } },
            slug: { rich_text: [{ text: { content: slug } }] },
            重要フラグ: { checkbox: false },
          },
        },
      });
      registered++;
      console.log(`[${registered}/${toRegister.length}] ✓ ${item.date} ${item.title.slice(0, 50)}`);
    } catch (e) {
      failed++;
      console.error(`✗ 失敗: ${item.title.slice(0, 40)} — ${e.message}`);
    }

    await new Promise(r => setTimeout(r, 350));
  }

  console.log(`\n完了。登録: ${registered}件、失敗: ${failed}件`);
}

main().catch(console.error);
