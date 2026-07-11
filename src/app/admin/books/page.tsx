import { getAllBooksForAdmin } from "@/lib/admin/notion-admin";
import BooksAdminClient from "./books-admin-client";

export const dynamic = "force-dynamic";

export default async function AdminBooksPage() {
  const books = await getAllBooksForAdmin();
  return <BooksAdminClient books={books} />;
}
