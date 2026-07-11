import { getAllNewsForAdmin } from "@/lib/admin/notion-admin";
import NewsAdminClient from "./news-admin-client";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage() {
  const news = await getAllNewsForAdmin();
  const sorted = [...news].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return <NewsAdminClient news={sorted} />;
}
