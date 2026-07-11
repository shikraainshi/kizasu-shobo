import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createNews } from "@/lib/admin/notion-admin";
import type { NewsInput } from "@/lib/admin/types";
import { validateNewsInput } from "@/lib/admin/validation";

function str(form: FormData, key: string): string {
  const v = form.get(key);
  return typeof v === "string" ? v : "";
}

function parseNewsInput(form: FormData): NewsInput {
  return {
    title: str(form, "title"),
    date: str(form, "date"),
    category: str(form, "category"),
    important: form.get("important") === "on",
    content: str(form, "content"),
    relatedUrl1: str(form, "relatedUrl1"),
    relatedUrl2: str(form, "relatedUrl2"),
    urlLabel1: str(form, "urlLabel1"),
    urlLabel2: str(form, "urlLabel2"),
    slug: str(form, "slug"),
  };
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const input = parseNewsInput(form);

    const errors = validateNewsInput(input, true);
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join("\n") }, { status: 400 });
    }

    const { pageId } = await createNews(input);

    revalidatePath("/news");
    revalidatePath("/");
    if (input.slug) revalidatePath(`/news/${input.slug}`);

    return NextResponse.json({ success: true, pageId });
  } catch (error: any) {
    console.error("Admin create news error:", error);
    const status = error?.status === 429 ? 429 : 500;
    const message =
      status === 429
        ? "Notion APIのレート制限に達しました。しばらく待ってから再度お試しください。"
        : "お知らせの作成に失敗しました。";
    return NextResponse.json({ error: message }, { status });
  }
}
