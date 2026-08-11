import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getBucket } from "@/lib/firebase/admin";
import { validateImageFile } from "@/lib/admin/validation";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const image = form.get("image");

    if (!(image instanceof File) || image.size === 0) {
      return NextResponse.json({ error: "画像ファイルを選択してください。" }, { status: 400 });
    }

    const validationError = validateImageFile(image);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const bucket = getBucket();
    const ext = image.name.includes(".") ? image.name.slice(image.name.lastIndexOf(".")) : "";
    const path = `events/${Date.now()}-${randomUUID()}${ext}`;
    const token = randomUUID();

    const buffer = Buffer.from(await image.arrayBuffer());
    const file = bucket.file(path);
    await file.save(buffer, {
      contentType: image.type,
      metadata: { metadata: { firebaseStorageDownloadTokens: token } },
    });

    const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
      path
    )}?alt=media&token=${token}`;

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Admin event image upload error:", error);
    return NextResponse.json({ error: "画像のアップロードに失敗しました。" }, { status: 500 });
  }
}
