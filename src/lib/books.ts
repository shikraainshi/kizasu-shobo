import booksData from "@/data/books.json";
import { getBooksFromNotion } from "./notion-service";

export interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  date: string;
  description: string;
  fullDescription: string;
  price: string;
  isbn: string;
  pages: string;
  color: string;
  image?: string; // 画像パス
  featured?: boolean; // 注目表示
}

// JSONデータをBook型の配列として扱う（フォールバック用）
export const BOOKS: Book[] = booksData as Book[];

/**
 * 全ての書籍を取得する関数 (Notion対応)
 */
export async function getBooks(): Promise<Book[]> {
  const books = await getBooksFromNotion();
  return books.map(book => {
    // 日付から年(4桁)と月(2桁)を抽出して YYYY.MM 形式にする
    const dateMatch = book.date.match(/(\d{4})[^0-9]?(\d{2})/);
    const formattedDate = dateMatch ? `${dateMatch[1]}.${dateMatch[2]}` : book.date;
    
    // 金額から数値のみを抽出して 10% の税を足し 3,000円（税込） 形式にする
    const priceNumbers = book.price.replace(/[^0-9]/g, '');
    let formattedPrice = book.price;
    
    if (priceNumbers) {
      const basePrice = parseInt(priceNumbers, 10);
      const taxIncludedPrice = Math.floor(basePrice * 1.1);
      formattedPrice = `${taxIncludedPrice.toLocaleString()}円（税込）`;
    }
    
    return {
      ...book,
      date: formattedDate,
      price: formattedPrice
    };
  });
}

/**
 * 最新の書籍を取得する関数
 * @param limit 取得する件数
 */
export async function getLatestBooks(limit?: number): Promise<Book[]> {
  const books = await getBooks();
  // IDの降順（新しい順）に並べ替えて返す
  const sorted = [...books].sort((a, b) => b.id - a.id);
  return limit ? sorted.slice(0, limit) : sorted;
}

/**
 * 注目表示の書籍をランダムに取得する関数
 * @param limit 取得する件数
 */
export async function getFeaturedBooks(limit: number = 2): Promise<Book[]> {
  const books = await getBooks();
  const featuredBooks = books.filter(book => book.featured);
  
  // ランダムにシャッフル
  const shuffled = [...featuredBooks].sort(() => 0.5 - Math.random());
  
  return shuffled.slice(0, limit);
}

/**
 * IDから特定の書籍を取得する関数
 */
export async function getBookById(id: number): Promise<Book | undefined> {
  const books = await getBooks();
  return books.find(book => book.id === id);
}
