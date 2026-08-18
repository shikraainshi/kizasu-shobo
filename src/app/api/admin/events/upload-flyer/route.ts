import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getBucket } from "@/lib/firebase/admin";
import { validateFlyerFile } from "@/lib/admin/validation";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    const mediaType = form.get("mediaType") === "pdf" ? "pdf" : "image";

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "ファイルを選択してください。" }, { status: 400 });
    }

    const validationError = validateFlyerFile(file, mediaType);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const bucket = getBucket();
    const ext = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")) : "";
    const path = `events/${Date.now()}-${randomUUID()}${ext}`;
    const token = randomUUID();

    const buffer = Buffer.from(await file.arrayBuffer());
    const storageFile = bucket.file(path);
    await storageFile.save(buffer, {
      contentType: file.type,
      metadata: { metadata: { firebaseStorageDownloadTokens: token } },
    });

    const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
      path
    )}?alt=media&token=${token}`;

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Admin event flyer upload error:", error);
    return NextResponse.json({ error: "ファイルのアップロードに失敗しました。" }, { status: 500 });
  }
}
