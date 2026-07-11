import type { Metadata } from "next";
import AdminNav from "./_components/AdminNav";

export const metadata: Metadata = {
  title: "管理画面 | 萌書房",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <main className="container mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
