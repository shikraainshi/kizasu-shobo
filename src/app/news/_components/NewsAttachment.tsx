import { FileText } from "lucide-react";

function getExtension(name: string): string {
  return name.includes(".") ? name.slice(name.lastIndexOf(".") + 1).toLowerCase() : "";
}

export default function NewsAttachment({
  url,
  name,
  title,
}: {
  url?: string;
  name?: string;
  title: string;
}) {
  if (!url) return null;

  // 保存パスにも拡張子が付いているので、ファイル名がなければURLから判定する
  const ext = getExtension(name || decodeURIComponent(url.split("?")[0]));
  const label = name || "添付ファイル";

  if (ext === "pdf") {
    return (
      <div className="border border-border/40 bg-wakaba/5">
        <iframe src={url} title={`${title} 添付ファイル`} className="w-full h-[70vh]" />
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center py-3 text-[11px] font-bold tracking-[0.3em] uppercase text-accent/60 hover:text-accent border-t border-border/40 font-serif"
        >
          PDFを開く
        </a>
      </div>
    );
  }

  if (["jpg", "jpeg", "png", "gif", "webp", "avif", "svg"].includes(ext)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={url} alt={label} className="w-full h-auto border border-border/40" />
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 border border-border/40 bg-wakaba/5 px-5 py-4 text-accent/70 hover:text-accent hover:border-accent/40 transition-colors font-serif"
    >
      <FileText size={20} className="shrink-0" />
      <span className="text-sm break-all">{label}</span>
    </a>
  );
}
