// LINE公式アカウントのリッチメニューを作成・画像アップロード・全員適用まで行うスクリプト。
// 使い方: node scripts/setup-line-richmenu.mjs ./path/to/richmenu.png
// 画像はPNG形式、横800〜2500px・縦250〜1686pxの範囲で用意すること。
// レイアウトは画像を3列x2行に分割し、右上にEVENT（縦長）、
// 下段にWEB／INSTAGRAM／CONTACTを3等分で配置（左上はボタンなしの背景領域）。
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

const SITE_URL = "https://kizasu-shobo.jp";
const HOMEPAGE_URL = "https://www.kizasu-shobo.jp/";
const INSTAGRAM_URL = "https://www.instagram.com/kawaberi_bookandcafe/";
const LIFF_ID = env.NEXT_PUBLIC_LIFF_ID;
// LIFF ID未設定時は通常のサイトURLで代替（申込完了時のLINEトーク通知は無効）
const EVENT_URL = LIFF_ID ? `https://liff.line.me/${LIFF_ID}/events` : `${SITE_URL}/events`;

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
  const col2X = colWidths[0] + colWidths[1];

  // 3列x2行に分割し、左上2列(y:0〜rowHeight)はボタンなしの背景領域として残す。
  return {
    size: { width, height },
    selected: true,
    name: "kizasu-shobo-main-menu",
    chatBarText: "メニュー",
    areas: [
      {
        // 右上: EVENT（縦長）
        bounds: { x: col2X, y: 0, width: colWidths[2], height: rowHeight },
        action: { type: "uri", label: "イベント", uri: EVENT_URL },
      },
      {
        // 下段左: WEB
        bounds: { x: 0, y: rowHeight, width: colWidths[0], height: height - rowHeight },
        action: { type: "uri", label: "ホームページ", uri: HOMEPAGE_URL },
      },
      {
        // 下段中央: INSTAGRAM
        bounds: { x: colWidths[0], y: rowHeight, width: colWidths[1], height: height - rowHeight },
        action: { type: "uri", label: "インスタグラム", uri: INSTAGRAM_URL },
      },
      {
        // 下段右: CONTACT
        bounds: { x: col2X, y: rowHeight, width: colWidths[2], height: height - rowHeight },
        action: { type: "uri", label: "お問合せ", uri: `${SITE_URL}/contact` },
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
