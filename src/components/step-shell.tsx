import { ArrowUUpLeftIcon, CloudCheckIcon } from "@phosphor-icons/react";
import { Link, useSearch } from "@tanstack/react-router";
import type * as React from "react";

import { StepRail } from "@/components/step-rail";
import type { StepId } from "@/lib/steps";
import { cn } from "@/lib/utils";

/**
 * The return half of the Review & sign round trip.
 *
 * The summary's edit links carry `?from=review`; without something reading it,
 * "the edit link takes you straight to it and brings you back here" was only
 * half true — fixing one line meant walking the rest of the flow again to get
 * back to the summary. Rendered by the shell so every step gets it for free.
 */
function ReturnToReview() {
  const search = useSearch({ strict: false }) as { from?: string };
  if (search.from !== "review") return null;

  return (
    <Link
      to="/onboarding/review"
      className="-mb-2 inline-flex w-fit items-center gap-2 rounded-[var(--radius-pill)] bg-violet-50 px-3.5 py-1.5 text-small font-bold text-violet-700 transition-colors hover:bg-violet-100"
    >
      <ArrowUUpLeftIcon weight="bold" aria-hidden className="size-4" />
      Back to review &amp; sign
    </Link>
  );
}

/**
 * The step layout: rail, the step's own column, and a fixed column beside it.
 *
 * The single 46rem column this replaces was the root of the complaint Laura
 * made on four consecutive screens. On a 1600px monitor it left ~232px of dead
 * gutter on each side, and the fix is not a wider form — a long measure is
 * tiring to read, which is why 46rem was chosen in the first place. The extra
 * width gets its own job instead: `context` is whatever that step needs kept in
 * view while the left column scrolls (the ranking slots, the picks so far, the
 * amount and the deadline).
 *
 * Three columns need roughly 1280px to exist without squeezing any of them, so
 * the pair collapses at `xl` and the rail at `lg`, in that order.
 */
export function StepShell({
  current,
  title,
  lead,
  context,
  children,
}: {
  current: StepId;
  title: string;
  lead?: React.ReactNode;
  /** The fixed column. Omitted where a step genuinely has no second thing. */
  context?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      <StepRail current={current} />
      <main className="flex-1 px-4 pt-8 pb-16 sm:px-8 lg:px-12 lg:pt-12">
        {/* The container is exactly as wide as the two columns plus the gap
            between them — see the tokens in app.css.

            It used to be 84rem while the tracks came to 69.5rem, and grid does
            not stretch fixed tracks to fill their container: the leftover
            14.5rem piled up at the right-hand end, so `mx-auto` centred a box
            whose contents sat left inside it. The page read as though the rail
            had shoved everything sideways. Two numbers that have to agree,
            written in two places, is the whole bug — so now there is one
            number and the other is derived from it. */}
        <div className="mx-auto flex w-full max-w-[var(--step-measure)] flex-col gap-6">
          <ReturnToReview />
          {/* No "Step N of 6" here. The trail in the rail already shows the
              position, visually and continuously, and it was being repeated in
              text three times besides. */}
          <header className="max-w-[var(--step-column)] space-y-2">
            <h1 className="text-h1 text-ink-900 sm:text-display">{title}</h1>
            {lead ? <div className="text-lead text-ink-600">{lead}</div> : null}
          </header>
          <div
            className={cn(
              /* Rows stretch — deliberately not `items-start`. A sticky panel
                 can only travel inside its own container, so an `aside` sized
                 to its content has nowhere to stick to and simply scrolls away
                 with the page. Stretching the column to the row's height is
                 what gives it the distance. */
              "grid gap-6",
              context &&
                "xl:grid-cols-[minmax(0,var(--step-column))_minmax(17rem,var(--step-context))]",
            )}
          >
            <div className="flex min-w-0 max-w-[var(--step-column)] flex-col gap-6">{children}</div>
            {context ? (
              /* No scroller of its own, and no sticky of its own.
                 Both used to live here, which put a second scrollbar beside the
                 page's on any step whose context column ran long, and a third
                 on Review & sign — wheel over one and it scrolled until it hit
                 its end, then the page lurched. Whether the panel should stick
                 depends on how tall that step's panel is, which only the step
                 knows, so each one now asks for it on the panel itself. */
              <aside className="min-w-0">{context}</aside>
            ) : null}
          </div>
        </div>
      </main>
    </>
  );
}

/**
 * The action row. The autosave line lives here rather than in a toast because
 * "did that save?" is a question people ask at the moment they are about to
 * leave the step, not a moment earlier.
 */
export function StepActions({
  className,
  children,
  saved = true,
}: {
  className?: string;
  children: React.ReactNode;
  saved?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-4 border-t border-ink-100 pt-6 sm:flex-row sm:items-center",
        className,
      )}
    >
      {saved ? (
        <p className="flex items-center gap-2 text-small text-ink-500">
          <CloudCheckIcon weight="fill" aria-hidden className="size-4 text-mint-600" />
          Saved automatically
        </p>
      ) : (
        <span />
      )}
      <div className="flex flex-col gap-3 sm:ml-auto sm:flex-row sm:items-center">{children}</div>
    </div>
  );
}

/**
 * The fixed column's container. One shape for all six steps, so the right-hand
 * side reads as the same piece of furniture rather than as six different cards
 * that happen to sit in the same place.
 */
export function ContextPanel({
  title,
  description,
  sticky = false,
  className,
  children,
}: {
  title: string;
  description?: React.ReactNode;
  /**
   * Holds position while the step's column scrolls past it.
   *
   * Opt-in, and only for a panel that comfortably fits the viewport: a sticky
   * element taller than the screen pins its top and puts its own bottom out of
   * reach, and the fix for that — giving it its own scrollbar — is what put
   * three of them on Review & sign.
   */
  sticky?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "space-y-4 rounded-[var(--radius-slab)] border border-ink-100 bg-surface p-5 shadow-card",
        sticky && "xl:sticky xl:top-12",
        className,
      )}
    >
      <div className="space-y-1">
        <h2 className="text-h3 text-ink-900">{title}</h2>
        {description ? <p className="text-small text-ink-500">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function SectionTitle({
  children,
  description,
}: {
  children: React.ReactNode;
  description?: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <h2 className="text-h2 text-ink-900">{children}</h2>
      {description ? <p className="text-body text-ink-600">{description}</p> : null}
    </div>
  );
}
