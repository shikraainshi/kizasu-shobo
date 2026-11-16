import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getErrataById } from "@/lib/errata";
import { updateErrata } from "@/lib/admin/errata-admin";
import { parseErrataInput, validateErrataInput } from "@/lib/admin/validation";
import { todayInJapan } from "@/lib/errata-format";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ errataId: string }> }
) {
  try {
    const { errataId } = await params;
    const current = await getErrataById(errataId);
    if (!current) {
      return NextResponse.json({ error: "正誤表が見つかりません。" }, { status: 404 });
    }

    const parsed = parseErrataInput(await request.json());
    // 更新日はPDFを差し替えたときだけ今日にし、それ以外は元の日付のままにする
    const input = {
      ...parsed,
      updatedAt: parsed.pdfUrl !== current.pdfUrl ? todayInJapan() : current.updatedAt,
    };

    const errors = validateErrataInput(input);
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join("\n") }, { status: 400 });
    }

    const { newsPageId } = await updateErrata(errataId, input, current);

    revalidatePath("/errata");
    if (newsPageId) {
      revalidatePath("/news");
      revalidatePath(`/news/${newsPageId}`);
      revalidatePath("/");
    }

    return NextResponse.json({ success: true, id: errataId });
  } catch (error) {
    console.error("Admin update errata error:", error);
    const status = (error as { status?: number })?.status === 429 ? 429 : 500;
    const message =
      status === 429
        ? "Notion APIのレート制限に達しました。しばらく待ってから再度お試しください。"
        : "正誤表の更新に失敗しました。";
    return NextResponse.json({ error: message }, { status });
  }
}
