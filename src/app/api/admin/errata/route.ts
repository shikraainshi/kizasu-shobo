import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createErrata } from "@/lib/admin/errata-admin";
import { parseErrataInput, validateErrataInput } from "@/lib/admin/validation";
import { todayInJapan } from "@/lib/errata-format";

export async function POST(request: Request) {
  try {
    // 更新日（＝お知らせの日付）は登録した日にする
    const input = { ...parseErrataInput(await request.json()), updatedAt: todayInJapan() };

    const errors = validateErrataInput(input);
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join("\n") }, { status: 400 });
    }

    const { id, newsPageId } = await createErrata(input);

    revalidatePath("/errata");
    revalidatePath("/news");
    revalidatePath(`/news/${newsPageId}`);
    revalidatePath("/");

    return NextResponse.json({ success: true, id, newsPageId });
  } catch (error) {
    console.error("Admin create errata error:", error);
    const status = (error as { status?: number })?.status === 429 ? 429 : 500;
    const message =
      status === 429
        ? "Notion APIのレート制限に達しました。しばらく待ってから再度お試しください。"
        : "正誤表の登録に失敗しました。";
    return NextResponse.json({ error: message }, { status });
  }
}
