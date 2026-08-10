import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * The Audentra "A" — two diagonal strokes with a mint crossbar, redrawn from
 * the brand sheet. Kept as inline SVG so it inherits the page's currentColor
 * treatment on dark panels without shipping a second asset.
 *
 * The gradient id is per-instance. It used to be a constant, which broke every
 * screen that renders the mark twice — the entry screen has one in the form
 * column and one in the panel, and the step screens have one in the mobile
 * header and one in the rail. Two `<defs>` claiming the same id makes the
 * document resolve `url(#…)` to whichever came first, and when that one sits in
 * a `display:none` branch the left stroke renders as nothing at all.
 */
export function AudentraMark({ className }: { className?: string }) {
  const gradientId = `audentra-mark-${React.useId()}`;

  return (
    <svg viewBox="0 0 48 40" role="img" aria-label="Audentra" className={cn("size-8", className)}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-violet-500)" />
          <stop offset="100%" stopColor="var(--color-azure-500)" />
        </linearGradient>
      </defs>
      <polygon points="14,2 27,2 13,38 0,38" fill={`url(#${gradientId})`} />
      <polygon points="27,2 35,2 48,38 35,38" fill="var(--color-azure-500)" />
      <polygon points="18,22 34,22 31,29 20,29" fill="var(--color-mint-500)" />
    </svg>
  );
}

export function Wordmark({
  className,
  tone = "ink",
}: {
  className?: string;
  tone?: "ink" | "on-dark";
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <AudentraMark className="size-7" />
      <span
        className={cn(
          "font-display text-lead font-black tracking-[0.14em] uppercase",
          tone === "on-dark" ? "text-white" : "text-ink-900",
        )}
      >
        Audentra
      </span>
    </span>
  );
}
