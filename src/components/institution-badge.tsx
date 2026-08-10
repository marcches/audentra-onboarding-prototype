import * as React from "react";

import { institution, offer } from "@/lib/fixtures";
import { cn } from "@/lib/utils";

/**
 * Aster University's crest.
 *
 * A stand-in for the logo a real tenant uploads — but a crest, not a monogram
 * tile: universities are represented by a mark, and initials in a rounded
 * square read as a user avatar, which is the one thing this must not look like.
 *
 * The device is the flower the institution is named after — *aster* is Greek
 * for star, which is why the eight petals double as one — over the chief band
 * every academic shield seems to carry.
 */
export function InstitutionCrest({ className }: { className?: string }) {
  const gradientId = `institution-crest-${React.useId()}`;

  return (
    <svg
      viewBox="0 0 40 46"
      role="img"
      aria-label={`${institution.name} crest`}
      className={cn("size-11", className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-violet-500)" />
          <stop offset="100%" stopColor="var(--color-azure-500)" />
        </linearGradient>
      </defs>

      {/* The shield: square shoulders, drawn down to a point. */}
      <path
        d="M2 3.5h36v22.8c0 8.4-6.7 13.6-18 18.2C8.7 39.9 2 34.7 2 26.3V3.5Z"
        fill={`url(#${gradientId})`}
      />
      <path
        d="M2 3.5h36v22.8c0 8.4-6.7 13.6-18 18.2C8.7 39.9 2 34.7 2 26.3V3.5Z"
        fill="none"
        stroke="var(--color-ink-900)"
        strokeOpacity="0.14"
        strokeWidth="1.6"
      />

      {/* The chief — the band across the top of an academic shield. */}
      <path d="M2 11.6h36" stroke="var(--color-mint-500)" strokeWidth="2.4" />

      {/* The aster: eight petals around an open centre. */}
      <g transform="translate(20 26)" fill="#ffffff">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <ellipse key={angle} rx="2.1" ry="6.4" cy="-4.2" transform={`rotate(${angle})`} />
        ))}
      </g>
      <circle cx="20" cy="26" r="3" fill="var(--color-mint-500)" />
    </svg>
  );
}

/**
 * The institution's identity in the onboarding shell.
 *
 * This slot is not decoration and it is not a caption: it is the one place that
 * tells the student whose portal they are standing in, and in the real product
 * it carries whichever institution sent them the offer. It used to be the
 * Audentra wordmark with the university's name set underneath it in small grey
 * text — which puts the vendor above the institution, and reads as a footnote
 * about the most important noun on the screen.
 *
 * So the institution leads, with a monogram standing in for the crest a real
 * tenant would supply. Audentra stays on the page, at the size a platform
 * belongs at.
 */
export function InstitutionBadge({
  className,
  size = "default",
}: {
  className?: string;
  /** `compact` is the phone header, where this shares a row with the counter. */
  size?: "default" | "compact";
}) {
  const compact = size === "compact";

  return (
    <span className={cn("flex items-center gap-3", className)}>
      <InstitutionCrest className={cn("shrink-0", compact ? "size-8" : "size-11")} />

      <span className="flex min-w-0 flex-col">
        <span
          className={cn(
            "truncate font-display font-black tracking-[-0.015em] text-ink-900",
            compact ? "text-body" : "text-h3",
          )}
        >
          {institution.name}
        </span>
        {compact ? null : (
          <span className="text-small text-ink-500">
            {offer.campus} · {offer.startingTerm} intake
          </span>
        )}
      </span>
    </span>
  );
}
