import { Wordmark } from "@/components/wordmark";
import { institution } from "@/lib/fixtures";
import { cn } from "@/lib/utils";

/**
 * The shareable card: 4:5, four metrics in a 2×2 grid, the wordmark at the
 * foot, over a gradient ground rather than over raw UI (Uxcel Go, Beli, Calm).
 *
 * It is the same component in both places it appears, because it is the same
 * object: the thing the flow hands over. What gets screenshotted is what gets
 * designed for, and a screenshot of a dashboard is not a design decision.
 *
 * 4:5 rather than square because that is what a story crop wants, and a card
 * that gets cropped on the way out was not a share card.
 */
export function ShareCard({
  eyebrow,
  headline,
  metrics,
  className,
}: {
  eyebrow: string;
  headline: string;
  /** Exactly four. A 2×2 grid with three cells is a grid with a hole in it. */
  metrics: [Metric, Metric, Metric, Metric];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "brand-gradient relative isolate flex aspect-[4/5] w-full max-w-xs flex-col justify-between overflow-hidden rounded-[var(--radius-slab)] p-6 text-white shadow-lift",
        className,
      )}
    >
      {/* A second wash over the two-stop gradient, so the card has depth
          without a third brand hue appearing in it. */}
      <span
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(70%_50%_at_20%_0%,rgb(255_255_255/0.28),transparent_70%)]"
      />

      <div>
        <p className="text-micro font-bold tracking-[0.14em] uppercase opacity-80">{eyebrow}</p>
        <p className="mt-2 text-h1 leading-tight font-bold text-balance">{headline}</p>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <dt className="text-[0.625rem] font-bold tracking-[0.1em] uppercase opacity-70">
              {metric.label}
            </dt>
            <dd className="mt-0.5 text-lead font-bold numeric">{metric.value}</dd>
          </div>
        ))}
      </dl>

      <div className="flex items-center justify-between gap-3 border-t border-white/25 pt-3">
        <span className="text-small font-strong opacity-90">{institution.name}</span>
        <Wordmark className="h-3 opacity-80" tone="knockout" />
      </div>
    </div>
  );
}

export type Metric = { label: string; value: string };
