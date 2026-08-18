import type { BookInput, EventInput, NewsInput } from "@/lib/admin/types";
import { BOOK_CATEGORIES, NEWS_CATEGORIES } from "@/lib/admin/constants";

const MAX_IMAGE_BYTES = 20 * 1024 * 1024; // 20MB (Notion単一パートアップロードの目安上限)

export function validateBookInput(input: Partial<BookInput>, isCreate: boolean): string[] {
  const errors: string[] = [];

  if (isCreate || input.title !== undefined) {
    if (!input.title?.trim()) errors.push("書籍名を入力してください。");
  }
  if (isCreate || input.author !== undefined) {
    if (!input.author?.trim()) errors.push("著者名を入力してください。");
  }
  if (isCreate || input.category !== undefined) {
    if (!input.category?.trim()) {
      errors.push("カテゴリを選択してください。");
    } else if (!(BOOK_CATEGORIES as readonly string[]).includes(input.category)) {
      errors.push("カテゴリの値が不正です。");
    }
  }
  if (input.price && !/^[0-9,]+$/.test(input.price.trim())) {
    errors.push("価格は数字で入力してください。");
  }
  if (input.pages && !/^[0-9]+$/.test(input.pages.trim())) {
    errors.push("ページ数は数字で入力してください。");
  }
  if (input.color && input.color.trim() && !/^#[0-9a-fA-F]{3,8}$/.test(input.color.trim())) {
    errors.push("背景色はhex形式（例: #cc9f93）で入力してください。");
  }

  return errors;
}

export function validateNewsInput(input: Partial<NewsInput>, isCreate: boolean): string[] {
  const errors: string[] = [];

  if (isCreate || input.title !== undefined) {
    if (!input.title?.trim()) errors.push("タイトルを入力してください。");
  }
  if (isCreate || input.date !== undefined) {
    if (!input.date?.trim()) errors.push("日付を入力してください。");
  }
  if (isCreate || input.category !== undefined) {
    if (!input.category?.trim()) {
      errors.push("カテゴリを選択してください。");
    } else if (!(NEWS_CATEGORIES as readonly string[]).includes(input.category)) {
      errors.push("カテゴリの値が不正です。");
    }
  }

  return errors;
}

export function validateEventInput(input: Partial<EventInput>, isCreate: boolean): string[] {
  const errors: string[] = [];

  if (isCreate || input.title !== undefined) {
    if (!input.title?.trim()) errors.push("イベント名を入力してください。");
  }
  if (isCreate || input.price !== undefined) {
    if (input.price === undefined || Number.isNaN(input.price) || input.price < 0) {
      errors.push("参加費は0以上の数字で入力してください。");
    }
  }
  if (input.capacity !== undefined && input.capacity !== null) {
    if (Number.isNaN(input.capacity) || input.capacity < 1) {
      errors.push("定員は1以上の数字で入力してください（空欄で無制限）。");
    }
  }
  if (isCreate || input.status !== undefined) {
    if (!["draft", "published", "closed"].includes(input.status || "")) {
      errors.push("公開状態の値が不正です。");
    }
  }
  if (isCreate || input.mediaType !== undefined) {
    if (!["image", "pdf"].includes(input.mediaType || "")) {
      errors.push("チラシの種類の値が不正です。");
    }
  }

  return errors;
}

export function validateImageFile(image: File | null | undefined): string | null {
  if (!image || image.size === 0) return null;
  if (!image.type.startsWith("image/")) {
    return "画像ファイルを選択してください。";
  }
  if (image.size > MAX_IMAGE_BYTES) {
    return "画像サイズは20MB以下にしてください。";
  }
  return null;
}

export function validateFlyerFile(file: File | null | undefined, mediaType: "image" | "pdf"): string | null {
  if (!file || file.size === 0) return null;
  if (mediaType === "pdf") {
    if (file.type !== "application/pdf") {
      return "PDFファイルを選択してください。";
    }
  } else if (!file.type.startsWith("image/")) {
    return "画像ファイルを選択してください。";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "ファイルサイズは20MB以下にしてください。";
  }
  return null;
}
