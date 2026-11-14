import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getErrataById } from "@/lib/errata";
import { updateErrata } from "@/lib/admin/errata-admin";
import { parseErrataInput, validateErrataInput } from "@/lib/admin/validation";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ errataId: string }> }
) {
  try {
    const { errataId } = await params;
    const input = parseErrataInput(await request.json());

    const errors = validateErrataInput(input);
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join("\n") }, { status: 400 });
    }

    const current = await getErrataById(errataId);
    if (!current) {
      return NextResponse.json({ error: "正誤表が見つかりません。" }, { status: 404 });
    }

    await updateErrata(errataId, input, current);

    revalidatePath("/errata");
    if (current.newsPageId && current.pdfUrl !== input.pdfUrl) {
      revalidatePath("/news");
      revalidatePath(`/news/${current.newsPageId}`);
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
