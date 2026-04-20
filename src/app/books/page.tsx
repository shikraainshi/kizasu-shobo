import { getBooks } from "@/lib/books";
import BooksClient from "./books-client";

export const revalidate = 60;

export default async function BooksPage() {
  const books = await getBooks();

  return <BooksClient initialBooks={books} />;
}
