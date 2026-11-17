import type { EventMediaType } from "@/lib/events";

export default function EventFlyer({
  url,
  mediaType,
  title,
}: {
  url?: string;
  mediaType: EventMediaType;
  title: string;
}) {
  if (!url) return null;

  if (mediaType === "pdf") {
    return (
      <div className="border border-border/40 bg-wakaba/5">
        <iframe src={url} title={`${title} チラシ`} className="w-full h-[70vh]" />
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

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt={`${title} チラシ`} className="w-full h-auto border border-border/40" />
  );
}
