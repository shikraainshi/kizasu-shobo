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
      <label className="text-sm font-bold tracking-[0.05em] text-foreground font-serif block">
        {label}
        {required && (
          <span className="ml-2 align-middle text-[11px] font-bold text-white bg-accent px-1.5 py-0.5 tracking-normal">必須</span>
        )}
      </label>
      {children}
      {hint && <p className="text-xs text-foreground/75 font-serif leading-relaxed">{hint}</p>}
    </div>
  );
}
