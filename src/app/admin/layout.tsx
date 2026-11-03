import type { Metadata } from "next";
import AdminNav from "./_components/AdminNav";

export const metadata: Metadata = {
  title: "管理画面 | 萌書房",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    // 管理画面は読みやすさ優先でゴシック体にする（font-serif もこの変数を参照するため、ここで上書き）
    <div className="min-h-screen bg-wakaba/50 text-foreground font-serif [--font-noto-serif:'Hiragino_Sans','Hiragino_Kaku_Gothic_ProN','Yu_Gothic_UI','Meiryo',sans-serif]">
      <AdminNav />
      <main className="container mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
