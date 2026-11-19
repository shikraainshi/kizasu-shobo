import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, FileText } from "lucide-react";
import { getBooks, type Book } from "@/lib/books";
import { titleKey } from "@/lib/errata-format";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "ディケンズ全集",
  description:
    "本邦初の個人訳によるディケンズ全集の特集ページです。田辺洋子訳，萌書房より2021年から刊行中。小説作品等23冊（28作品），書簡集12巻。",
  alternates: { canonical: "/dickens" },
  openGraph: {
    title: "ディケンズ全集 | 萌書房",
    description: "本邦初の個人訳によるディケンズ全集の特集ページです。田辺洋子訳，萌書房より刊行中。",
    url: "/dickens",
    images: ["/dickens/CD_portrait.jpg"],
  },
};

// 全巻構成。key は書名（空白を除いて正規化したもの）に含まれる文字列で、
// Notion に「ディケンズ全集 …」の書籍が登録されると自動で既刊になってリンクされる。
type Volume = { title: string; key?: string };

const NOVELS: Volume[] = [
  { title: "ドンビー父子", key: "ドンビー父子" },
  { title: "ニコラス・ニクルビー", key: "ニコラス・ニクルビー" },
  { title: "オリヴァー・トゥイスト", key: "オリヴァー・トゥイスト" },
  { title: "ハード・タイムズ", key: "ハード・タイムズ" },
  { title: "二都物語", key: "二都物語" },
  { title: "バーナビ・ラッジ", key: "バーナビ・ラッジ" },
  { title: "リトル・ドリット", key: "リトル・ドリット" },
  { title: "荒涼館", key: "荒涼館" },
  { title: "デイヴィッド・コパフィールド", key: "デイヴィッド・コパフィールド" },
  { title: "ピクウィック・ペーパーズ", key: "ピクウィック・ペーパーズ" },
  { title: "マーティン・チャズルウィット", key: "マーティン・チャズルウィット" },
  { title: "クリスマス・ブックス", key: "クリスマス・ブックス" },
  { title: "クリスマス・ストーリーズ", key: "クリスマス・ストーリーズ" },
  { title: "骨董屋", key: "骨董屋" },
  { title: "ボズの素描集", key: "ボズの素描集" },
  { title: "ハンフリー親方の時計", key: "ハンフリー親方の時計" },
  { title: "御伽英国史", key: "御伽英国史" },
  { title: "ボズの素描滑稽篇", key: "ボズの素描滑稽篇" },
  { title: "物臭徒弟二人のなまくら膝栗毛他", key: "物臭徒弟二人のなまくら膝栗毛" },
  { title: "逍遥の旅人", key: "逍遥の旅人" },
  { title: "アメリカ探訪", key: "アメリカ探訪" },
  { title: "イタリア小景", key: "イタリア小景" },
  { title: "翻刻掌篇集", key: "翻刻掌篇集" },
  { title: "ホリデー・ロマンス他", key: "ホリデー・ロマンス" },
  { title: "寄稿集", key: "寄稿集" },
  { title: "エドウィン・ドゥルードの謎", key: "エドウィン・ドゥルードの謎" },
  { title: "大いなる遺産", key: "大いなる遺産" },
  { title: "互いの友", key: "互いの友" },
];

// 書名の正規化（NFKC）でⅠ→I などになるため、巻数＋開始年で照合する
const LETTERS: Volume[] = [
  ["Ⅰ", "I", "1820-1839"],
  ["Ⅱ", "II", "1840-1841"],
  ["Ⅲ", "III", "1842-1843"],
  ["Ⅳ", "IV", "1844-1846"],
  ["Ⅴ", "V", "1847-1849"],
  ["Ⅵ", "VI", "1850-1852"],
  ["Ⅶ", "VII", "1853-1855"],
  ["Ⅷ", "VIII", "1856-1858"],
  ["Ⅸ", "IX", "1859-1861"],
  ["Ⅹ", "X", "1862-1864"],
  ["Ⅺ", "XI", "1865-1867"],
  ["Ⅻ", "XII", "1868-1870"],
].map(([roman, ascii, years]) => ({
  title: `書簡集${roman}　${years}`,
  key: `書簡集${ascii}${years.slice(0, 4)}`,
}));

function formatMonth(date: string): string {
  const m = date.match(/(\d{4})\D*(\d{1,2})/);
  return m ? `${m[1]}年${parseInt(m[2], 10)}月` : "";
}

/** 1つの巻に当たる書籍（上下巻なら2冊）を古い順で返す */
function findBooks(books: Book[], key?: string): Book[] {
  if (!key) return [];
  const k = titleKey(key);
  return books.filter((b) => titleKey(b.title).includes(k)).sort((a, b) => a.id - b.id);
}

function partLabel(book: Book, index: number, count: number): string {
  if (count < 2) return "";
  const t = book.title.trim();
  if (/上$/.test(t)) return "上";
  if (/下$/.test(t)) return "下";
  return count === 2 ? (index === 0 ? "上" : "下") : `${index + 1}`;
}

function VolumeList({ volumes, books }: { volumes: Volume[]; books: Book[] }) {
  return (
    <ol className="divide-y divide-accent/10 border-y border-accent/10">
      {volumes.map((vol, i) => {
        const found = findBooks(books, vol.key);
        const published = found.length > 0;
        return (
          <li key={vol.title} className="flex items-baseline gap-4 py-3.5 px-1">
            <span className="w-7 shrink-0 text-right text-xs tabular-nums text-accent/60 font-mono">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className={`text-[15px] ${published ? "font-bold text-foreground" : "text-foreground/70"}`}>
                {vol.title}
              </span>
              {published && (
                <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[13px]">
                  {found.map((book, j) => {
                    const part = partLabel(book, j, found.length);
                    const month = formatMonth(book.date);
                    return (
                      <span key={book.id}>
                        <Link
                          href={`/books/${book.id}`}
                          className="text-accent underline underline-offset-4 decoration-accent/40 hover:decoration-accent"
                        >
                          {part ? `${part}巻` : "書籍詳細"}
                        </Link>
                        {month && <span className="text-foreground/70">（{month}）</span>}
                      </span>
                    );
                  })}
                </span>
              )}
            </div>
            {published && (
              <span className="shrink-0 text-xs font-bold border border-accent/30 text-accent bg-wakaba/40 px-2 py-0.5">
                既刊
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Sample({ images, pdf, label }: { images: string[]; pdf: string; label: string }) {
  return (
    <div className="space-y-4">
      <a href={pdf} target="_blank" rel="noopener noreferrer" className="block space-y-3 group">
        {images.map((src) => (
          <img
            key={src}
            src={src}
            alt={`${label}（組見本）`}
            className="w-full h-auto border border-border shadow-sm group-hover:opacity-90 transition-opacity"
          />
        ))}
      </a>
      <a
        href={pdf}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-bold border border-accent/40 text-accent bg-wakaba/10 hover:bg-accent hover:text-white transition-colors"
      >
        <FileText size={18} />
        {label} 組見本（PDF）
      </a>
    </div>
  );
}

export default async function DickensPage() {
  let books: Book[] = [];
  try {
    books = (await getBooks()).filter((b) => titleKey(b.title).includes("ディケンズ全集"));
  } catch (error) {
    console.error("Failed to load Dickens books:", error);
  }

  const latest = [...books].sort((a, b) => b.id - a.id);

  return (
    <main className="min-h-screen bg-background font-serif">
      {/* Breadcrumbs */}
      <nav className="bg-wakaba/20 border-b border-border py-4">
        <div className="container mx-auto px-6">
          <ul className="flex items-center gap-3 text-xs font-bold tracking-[0.1em] text-accent/80">
            <li>
              <Link href="/" className="hover:text-accent transition-colors">トップ</Link>
            </li>
            <ChevronRight size={10} className="text-accent/50" />
            <li>
              <Link href="/books" className="hover:text-accent transition-colors">書籍案内</Link>
            </li>
            <ChevronRight size={10} className="text-accent/50" />
            <li className="text-accent/60">ディケンズ全集</li>
          </ul>
        </div>
      </nav>

      {/* Page Header */}
      <header className="bg-wakaba/30 py-20 md:py-24 border-b border-border">
        <div className="container mx-auto px-6 text-center">
          <p className="text-xs font-bold tracking-[0.15em] text-accent/80 mb-4">チャールズ・ディケンズ／田辺洋子 訳</p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-[0.2em] mb-8">ディケンズ全集</h1>
          <p className="text-[15px] md:text-base leading-[2] text-foreground/80">
            本邦初の個人訳全集。2021年より刊行中。
            <br className="md:hidden" />
            小説作品等23冊（28作品），書簡集12巻。
          </p>
        </div>
      </header>

      {/* 既刊 */}
      {latest.length > 0 && (
        <section className="py-16 md:py-20 border-b border-border">
          <div className="container mx-auto px-6 max-w-6xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-[0.1em] mb-10">既刊</h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-10">
              {latest.map((book) => (
                <li key={book.id}>
                  <Link href={`/books/${book.id}`} className="group block">
                    <div className="aspect-[2/3] bg-wakaba/20 border border-border/60 shadow-sm overflow-hidden flex items-center justify-center">
                      {book.image ? (
                        <img
                          src={book.image}
                          alt={book.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <span className="p-3 text-xs text-center text-accent/80">{book.title}</span>
                      )}
                    </div>
                    <p className="mt-3 text-sm font-bold leading-snug text-foreground group-hover:text-accent transition-colors">
                      {book.title.replace(/^ディケンズ全集[\s　]*/, "").trim()}
                    </p>
                    <p className="mt-1 text-xs text-foreground/70 tabular-nums">{formatMonth(book.date)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 全巻構成 */}
      <section className="py-16 md:py-20 border-b border-border">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-[0.1em] mb-4">全巻構成</h2>
          <p className="text-sm text-foreground/70 mb-12 leading-relaxed">
            「小説作品」「書簡集」ともにおよその発刊順です。小説作品は上下分冊になる巻があります。
          </p>

          <div className="grid lg:grid-cols-[1fr_460px] gap-10 lg:gap-16 mb-16">
            <div>
              <h3 className="text-lg font-bold text-accent tracking-[0.1em] mb-4">小説作品</h3>
              <VolumeList volumes={NOVELS} books={books} />
            </div>
            <div className="lg:pt-11">
              <Sample
                images={["/dickens/CD_novels_sample-1.jpg", "/dickens/CD_novels_sample-2.jpg"]}
                pdf="/dickens/CD_novels_sample.pdf"
                label="小説作品"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_460px] gap-10 lg:gap-16">
            <div>
              <h3 className="text-lg font-bold text-accent tracking-[0.1em] mb-4">書簡集</h3>
              <VolumeList volumes={LETTERS} books={books} />
            </div>
            <div className="lg:pt-11">
              <Sample
                images={["/dickens/CD_letters_sample-1.jpg", "/dickens/CD_letters_sample-2.jpg"]}
                pdf="/dickens/CD_letters_sample.pdf"
                label="書簡集"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ディケンズについて・訳者紹介 */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6 max-w-4xl space-y-16">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-[0.1em] mb-8">
              チャールズ・ディケンズについて
            </h2>
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              <img
                src="/dickens/CD_portrait.jpg"
                alt="チャールズ・ディケンズの肖像"
                className="w-40 sm:w-48 h-auto shrink-0 border border-border shadow-sm"
              />
              <p className="text-[15px] md:text-base leading-[2.1] text-foreground/85">
                『オリヴァー・トゥイスト』や『二都物語』など，今なお世界中の多くの人に親しまれ，映画・演劇・ミュージカルにも翻案されるなど，没後150年以上が経った現在でも絶大な人気を誇る英国ヴィクトリア朝時代の国民的作家チャールズ・ディケンズ（Charles
                Dickens 1812-1870）。本全集は，ディケンズ研究の第一人者である訳者が，長年にわたり翻訳出版してきた23点の小説作品や紀行文等を改訳し，併せて12巻に及ぶ書簡の数々を新たに訳出した，本邦初の個人訳全集。
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-[0.1em] mb-8">訳者紹介</h2>
            <p className="text-lg font-bold text-foreground mb-4">
              田辺洋子<span className="ml-2 text-sm font-normal text-foreground/70">（たなべ・ようこ）</span>
            </p>
            <p className="text-[15px] md:text-base leading-[2.1] text-foreground/85">
              1955年広島市に生まれる。広島大学文学部卒業，同大学院文学研究科修了。博士（文学）。現在，広島経済大学教授。『「大いなる遺産」研究』（1994年，広島経済大学研究双書第12冊），『ディケンズ後期四作品研究』（こびあん書房．1999年）などの研究書や研究論文ほか，こびあん書房・あぽろん社・渓水社より，ディケンズ全小説作品23点，および寄稿文などを訳出・出版するなど，ディケンズ関連の著訳書・論文多数。父子二代にわたるディケンズ研究の第一人者。本全集はそれらの改訳を，オックスフォード大学出版会より刊行された書簡集全12巻の本邦初訳と合わせ，随時刊行。
            </p>
          </div>

          <div className="text-center pt-8">
            <Link
              href="/books"
              className="inline-block text-base font-bold tracking-[0.15em] border-b-2 border-accent/10 pb-3 text-accent/80 hover:text-accent hover:border-accent/40 transition-all"
            >
              書籍案内へ
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
