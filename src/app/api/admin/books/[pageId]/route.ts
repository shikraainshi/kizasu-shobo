import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { updateBook, BookInput } from "@/lib/admin/notion-admin";
import { validateBookInput, validateImageFile } from "@/lib/admin/validation";

function str(form: FormData, key: string): string {
  const v = form.get(key);
  return typeof v === "string" ? v : "";
}

function parseBookInput(form: FormData): BookInput {
  return {
    title: str(form, "title"),
    author: str(form, "author"),
    authorKana: str(form, "authorKana"),
    category: str(form, "category"),
    pubDate: str(form, "pubDate"),
    price: str(form, "price"),
    pages: str(form, "pages"),
    isbn: str(form, "isbn"),
    description: str(form, "description"),
    fullDescription: str(form, "fullDescription"),
    color: str(form, "color"),
    isPublic: form.get("isPublic") === "on",
    featured: form.get("featured") === "on",
    seriesName: str(form, "seriesName"),
    seriesVolume: str(form, "seriesVolume"),
    titleVolume: str(form, "titleVolume"),
    titleKana: str(form, "titleKana"),
    slug: str(form, "slug"),
    url1: str(form, "url1"),
    url2: str(form, "url2"),
    url3: str(form, "url3"),
  };
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ pageId: string }> }
) {
  try {
    const { pageId } = await params;
    const form = await request.formData();
    const input = parseBookInput(form);
    const imageEntry = form.get("image");
    const image = imageEntry instanceof File ? imageEntry : null;

    const errors = [
      ...validateBookInput(input, true),
      ...([validateImageFile(image)].filter(Boolean) as string[]),
    ];
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join("\n") }, { status: 400 });
    }

    await updateBook(pageId, input, image);

    revalidatePath("/books");
    revalidatePath("/");

    return NextResponse.json({ success: true, pageId });
  } catch (error: any) {
    console.error("Admin update book error:", error);
    const status = error?.status === 429 ? 429 : 500;
    const message =
      status === 429
        ? "Notion APIのレート制限に達しました。しばらく待ってから再度お試しください。"
        : "書籍の更新に失敗しました。";
    return NextResponse.json({ error: message }, { status });
  }
}
