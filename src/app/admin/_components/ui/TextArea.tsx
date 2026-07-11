import { TextareaHTMLAttributes } from 'react';

export default function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = '', ...rest } = props;
  return (
    <textarea
      {...rest}
      className={`w-full bg-background border border-accent/20 px-4 py-3 text-sm font-serif focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/10 transition-all placeholder:text-accent/20 shadow-sm resize-y ${className}`}
    />
  );
}
