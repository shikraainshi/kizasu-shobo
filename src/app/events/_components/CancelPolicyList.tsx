// キャンセルポリシーは管理画面で自由入力された文章なので、改行と「。」で区切って箇条書きにする。
// 入力側で付けた「・」「-」などの行頭記号は二重にならないよう取り除く。
function toItems(text: string): string[] {
  return text
    .split(/\r?\n/)
    .flatMap((line) => line.split(/(?<=。)/))
    .map((item) => item.replace(/^\s*[・\-－*•●]\s*/, '').trim())
    .filter(Boolean);
}

export default function CancelPolicyList({ text, className = '' }: { text: string; className?: string }) {
  return (
    <ul className={`list-disc pl-5 space-y-1.5 text-foreground/70  leading-relaxed ${className}`}>
      {toItems(text).map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
