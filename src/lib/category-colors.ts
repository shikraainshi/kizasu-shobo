const CATEGORY_COLORS: Record<string, string> = {
  新刊情報: "bg-[#edf4ed] text-[#2d4a3e] border-[#9abf9a]",
  メディア掲載: "bg-[#e8eef7] text-[#2d4478] border-[#9fb3d4]",
  イベント: "bg-[#fdf4e7] text-[#7a5520] border-[#d4b07a]",
  お知らせ: "bg-[#fffbeb] text-[#92400e] border-[#fbbf24]",
};

const DEFAULT_COLOR = "bg-[#fffbeb] text-[#92400e] border-[#fbbf24]";

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? DEFAULT_COLOR;
}
