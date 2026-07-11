import { InputHTMLAttributes } from 'react';

export default function CheckboxInput({
  label,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="flex items-center gap-3 text-sm font-serif text-foreground cursor-pointer select-none">
      <input type="checkbox" {...rest} className="w-4 h-4 accent-accent" />
      {label}
    </label>
  );
}
