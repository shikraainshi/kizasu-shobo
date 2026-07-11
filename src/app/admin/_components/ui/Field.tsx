export default function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-accent/80 font-serif block">
        {label}
        {required && <span className="text-accent/40 ml-2 normal-case tracking-normal">必須</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-foreground/40 font-serif">{hint}</p>}
    </div>
  );
}
