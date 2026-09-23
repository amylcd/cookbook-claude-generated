"use client";

import { useEffect, useState } from "react";

export default function Checklist({
  items,
  storageKey,
  as = "ul",
  className,
  marker = "none",
}: {
  items: string[];
  storageKey: string;
  as?: "ul" | "ol";
  className?: string;
  marker?: "bullet" | "number" | "none";
}) {
  const [checked, setChecked] = useState<boolean[]>(() =>
    items.map(() => false)
  );

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length === items.length) {
        setChecked(parsed);
      }
    } catch {
      // ignore malformed storage
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, items.length]);

  function toggle(index: number) {
    setChecked((prev) => {
      const next = prev.slice();
      next[index] = !next[index];
      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  }

  function reset() {
    const next = items.map(() => false);
    setChecked(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  }

  const List = as;

  return (
    <div className="flex flex-col gap-3">
      <List className={className}>
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            {marker === "bullet" && (
              <span className="text-zinc-300 dark:text-zinc-700">•</span>
            )}
            {marker === "number" && (
              <span className="shrink-0 font-medium text-zinc-400 dark:text-zinc-600">
                {i + 1}.
              </span>
            )}
            <label className="flex flex-1 cursor-pointer items-start gap-2">
              <input
                type="checkbox"
                checked={checked[i] ?? false}
                onChange={() => toggle(i)}
                className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              />
              <span
                className={
                  checked[i]
                    ? "text-zinc-400 line-through dark:text-zinc-600"
                    : ""
                }
              >
                {item}
              </span>
            </label>
          </li>
        ))}
      </List>
      {checked.some(Boolean) && (
        <button
          type="button"
          onClick={reset}
          className="self-start text-xs text-zinc-500 underline underline-offset-4 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          Reset checklist
        </button>
      )}
    </div>
  );
}
