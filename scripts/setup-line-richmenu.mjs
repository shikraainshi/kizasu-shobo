// LINE公式アカウントのリッチメニューを作成・画像アップロード・全員適用まで行うスクリプト。
// 使い方: node scripts/setup-line-richmenu.mjs ./path/to/richmenu.png
// 画像はPNG形式、横800〜2500px・縦250〜1686pxの範囲で用意すること。
// レイアウトは画像を3列x2行の均等グリッドに分割:
//   上段: 左=ロゴ（ボタンなし） / 中央=イベント（postback） / 右=レンタルスペース（postback）
//   下段: 左=WEB（uri） / 中央=INSTAGRAM（uri） / 右=お問い合わせ（postback）
// ボタン領域は画像の実サイズから自動計算する。

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envContent = readFileSync(join(__dirname, "../.env.local"), "utf-8");
const env = {};
for (const line of envContent.split("\n")) {
  const [key, ...vals] = line.split("=");
  if (key && vals.length) env[key.trim()] = vals.join("=").trim();
}

const ACCESS_TOKEN = env.LINE_CHANNEL_ACCESS_TOKEN;
if (!ACCESS_TOKEN) {
  console.error("LINE_CHANNEL_ACCESS_TOKEN が .env.local に設定されていません。");
  process.exit(1);
}

const imagePath = process.argv[2];
if (!imagePath) {
  console.error("使い方: node scripts/setup-line-richmenu.mjs ./path/to/richmenu.png");
  process.exit(1);
}

const ext = extname(imagePath).toLowerCase();
const contentType = ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "image/png";

const HOMEPAGE_URL = "https://www.kizasu-shobo.jp/";
const INSTAGRAM_URL = "https://www.instagram.com/kawaberi_bookandcafe/";

function getPngDimensions(buffer) {
  const isPng =
    buffer.length >= 24 &&
    buffer.readUInt32BE(0) === 0x89504e47 &&
    buffer.readUInt32BE(4) === 0x0d0a1a0a;
  if (!isPng) {
    throw new Error("PNG画像のみ自動サイズ判定に対応しています。PNG形式で書き出してください。");
  }
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function buildRichMenuDefinition(width, height) {
  const colWidths = [Math.round(width / 3), Math.round(width / 3)];
  colWidths.push(width - colWidths[0] - colWidths[1]);
  const rowHeight = Math.round(height / 2);
  const col1X = colWidths[0];
  const col2X = colWidths[0] + colWidths[1];
  const row2Height = height - rowHeight;

  // 3列x2行の均等グリッド。左上（ロゴ）はボタンなしの背景領域として残す。
  return {
    size: { width, height },
    selected: true,
    name: "kizasu-shobo-main-menu",
    chatBarText: "メニュー",
    areas: [
      {
        // 上段中央: イベント（準備中メッセージ）
        bounds: { x: col1X, y: 0, width: colWidths[1], height: rowHeight },
        action: { type: "postback", label: "イベント", data: "event_placeholder", displayText: "イベント" },
      },
      {
        // 上段右: レンタルスペース（準備中メッセージ）
        bounds: { x: col2X, y: 0, width: colWidths[2], height: rowHeight },
        action: {
          type: "postback",
          label: "レンタルスペース",
          data: "rental_placeholder",
          displayText: "レンタルスペース",
        },
      },
      {
        // 下段左: WEB
        bounds: { x: 0, y: rowHeight, width: colWidths[0], height: row2Height },
        action: { type: "uri", label: "ホームページ", uri: HOMEPAGE_URL },
      },
      {
        // 下段中央: INSTAGRAM
        bounds: { x: col1X, y: rowHeight, width: colWidths[1], height: row2Height },
        action: { type: "uri", label: "インスタグラム", uri: INSTAGRAM_URL },
      },
      {
        // 下段右: お問い合わせ（カテゴリ選択フロー）
        bounds: { x: col2X, y: rowHeight, width: colWidths[2], height: row2Height },
        action: { type: "postback", label: "お問い合わせ", data: "contact_menu", displayText: "お問い合わせ" },
      },
    ],
  };
}

const imageBuffer = readFileSync(imagePath);
const { width, height } = getPngDimensions(imageBuffer);
console.log(`画像サイズ: ${width}x${height}`);
const richMenuDefinition = buildRichMenuDefinition(width, height);

async function main() {
  console.log("1/3 リッチメニューを作成中...");
  const createRes = await fetch("https://api.line.me/v2/bot/richmenu", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
    body: JSON.stringify(richMenuDefinition),
  });
  if (!createRes.ok) {
    throw new Error(`リッチメニュー作成に失敗: ${createRes.status} ${await createRes.text()}`);
  }
  const { richMenuId } = await createRes.json();
  console.log(`  richMenuId: ${richMenuId}`);

  console.log("2/3 画像をアップロード中...");
  const uploadRes = await fetch(`https://api-data.line.me/v2/bot/richmenu/${richMenuId}/content`, {
    method: "POST",
    headers: {
      "Content-Type": contentType,
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
    body: imageBuffer,
  });
  if (!uploadRes.ok) {
    throw new Error(`画像アップロードに失敗: ${uploadRes.status} ${await uploadRes.text()}`);
  }

  console.log("3/3 全ユーザーへのデフォルトメニューとして設定中...");
  const setDefaultRes = await fetch(`https://api.line.me/v2/bot/user/all/richmenu/${richMenuId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
  });
  if (!setDefaultRes.ok) {
    throw new Error(`デフォルト設定に失敗: ${setDefaultRes.status} ${await setDefaultRes.text()}`);
  }

  console.log("完了しました。LINEアプリでリッチメニューを確認してください。");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
