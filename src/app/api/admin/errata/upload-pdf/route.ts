import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getBucket } from "@/lib/firebase/admin";
import { validateErrataPdf } from "@/lib/admin/validation";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "PDFファイルを選択してください。" }, { status: 400 });
    }

    const validationError = validateErrataPdf(file);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const bucket = getBucket();
    const path = `errata/${Date.now()}-${randomUUID()}.pdf`;
    const token = randomUUID();

    const buffer = Buffer.from(await file.arrayBuffer());
    await bucket.file(path).save(buffer, {
      contentType: file.type,
      metadata: { metadata: { firebaseStorageDownloadTokens: token } },
    });

    const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
      path
    )}?alt=media&token=${token}`;

    return NextResponse.json({ url, name: file.name });
  } catch (error) {
    console.error("Admin errata pdf upload error:", error);
    return NextResponse.json({ error: "PDFのアップロードに失敗しました。" }, { status: 500 });
  }
}
