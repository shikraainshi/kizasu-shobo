import { AlertTriangle } from "lucide-react";

export default function FirestoreNotice() {
  return (
    <div className="flex items-start gap-3 border border-amber-200 bg-amber-50 text-amber-800 p-6 text-sm font-serif">
      <AlertTriangle size={18} className="mt-0.5 shrink-0" />
      <p>
        Firestoreに接続できませんでした。<code>.env.local</code> の
        <code>FIREBASE_PROJECT_ID</code> / <code>FIREBASE_CLIENT_EMAIL</code> /{" "}
        <code>FIREBASE_PRIVATE_KEY</code> が設定されているか確認してください。
      </p>
    </div>
  );
}
