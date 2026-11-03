import { InputHTMLAttributes } from 'react';

export default function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props;
  return (
    <input
      {...rest}
      className={`w-full bg-background border border-accent/35 px-4 py-3 text-sm font-serif focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/10 transition-all placeholder:text-foreground/40 shadow-sm ${className}`}
    />
  );
}
