import type { BookInput, NewsInput } from "@/lib/admin/types";
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
