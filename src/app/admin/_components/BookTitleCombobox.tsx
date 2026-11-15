'use client';

import { useId, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

// 大文字小文字・半角/全角スペースの違いを無視して部分一致させる
function normalize(s: string): string {
  return s.toLowerCase().replace(/[\s　]+/g, '');
}

export default function BookTitleCombobox({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const filtered = useMemo(() => {
    const q = normalize(value);
    if (!q) return options;
    return options.filter((o) => normalize(o).includes(q));
  }, [value, options]);

  const select = (title: string) => {
    onChange(title);
    setOpen(false);
  };

  const moveActive = (next: number) => {
    setActiveIndex(next);
    listRef.current?.children[next]?.scrollIntoView({ block: 'nearest' });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        moveActive(0);
      } else if (filtered.length > 0) {
        moveActive(Math.min(activeIndex + 1, filtered.length - 1));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveActive(Math.max(activeIndex - 1, 0));
    } else if (e.key === 'Enter') {
      if (open && filtered[activeIndex]) {
        e.preventDefault();
        select(filtered[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        autoComplete="off"
        required
        value={value}
        placeholder="書籍名を入力して絞り込み"
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setActiveIndex(0);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={handleKeyDown}
        className="w-full bg-background border border-accent/35 pl-4 pr-10 py-3 text-sm font-serif focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/10 transition-all placeholder:text-foreground/40 shadow-sm"
      />
      <ChevronDown
        size={16}
        className={`absolute right-3 top-1/2 -translate-y-1/2 text-accent/70 pointer-events-none transition-transform ${
          open ? 'rotate-180' : ''
        }`}
      />
      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          className="absolute z-20 left-0 right-0 mt-1 max-h-72 overflow-y-auto bg-background border border-accent/40 shadow-lg"
        >
          {filtered.length === 0 ? (
            <li className="px-4 py-3 text-sm text-foreground/60 font-serif">該当する書籍がありません</li>
          ) : (
            filtered.map((title, i) => (
              <li
                key={title}
                role="option"
                aria-selected={title === value}
                // inputのblurより先に選択させる
                onMouseDown={(e) => {
                  e.preventDefault();
                  select(title);
                }}
                onMouseEnter={() => setActiveIndex(i)}
                className={`px-4 py-2.5 text-sm font-serif cursor-pointer ${
                  i === activeIndex ? 'bg-wakaba/50 text-accent' : 'text-foreground'
                } ${title === value ? 'font-bold' : ''}`}
              >
                {title}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
