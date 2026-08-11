import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { updateApplicationStatus } from "@/lib/admin/applications-admin";
import type { ApplicationStatus } from "@/lib/applications";

const ALLOWED_STATUSES: ApplicationStatus[] = ["pending_payment", "paid", "canceled", "failed"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ applicationId: string }> }
) {
  try {
    const { applicationId } = await params;
    const body = await request.json();
    const status = body.status as ApplicationStatus;

    if (!ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json({ error: "ステータスの値が不正です。" }, { status: 400 });
    }

    await updateApplicationStatus(applicationId, status);

    revalidatePath("/admin/applications");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin update application error:", error);
    return NextResponse.json({ error: "申込の更新に失敗しました。" }, { status: 500 });
  }
}
