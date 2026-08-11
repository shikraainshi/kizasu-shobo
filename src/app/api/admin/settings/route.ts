import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { updateCancelPolicy } from "@/lib/admin/settings-admin";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const cancelPolicy = String(body.cancelPolicy || "").trim();

    if (!cancelPolicy) {
      return NextResponse.json({ error: "キャンセルポリシーを入力してください。" }, { status: 400 });
    }

    await updateCancelPolicy(cancelPolicy);

    revalidatePath("/admin/settings");
    revalidatePath("/events");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin update settings error:", error);
    return NextResponse.json({ error: "設定の更新に失敗しました。" }, { status: 500 });
  }
}
