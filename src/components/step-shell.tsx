import { ArrowUUpLeftIcon, CloudCheckIcon } from "@phosphor-icons/react";
import { Link, useSearch } from "@tanstack/react-router";
import type * as React from "react";

import { StepRail } from "@/components/step-rail";
import { type StepId, stepCount, stepIndex } from "@/lib/steps";
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

export function StepShell({
  current,
  title,
  lead,
  aside,
  children,
}: {
  current: StepId;
  title: string;
  lead?: React.ReactNode;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  const index = stepIndex(current);

  return (
    <>
      <StepRail current={current} />
      <main className="flex-1 px-4 pt-8 pb-24 sm:px-8 lg:px-12 lg:pt-14">
        <div className="mx-auto flex w-full max-w-[46rem] flex-col gap-8">
          <ReturnToReview />
          <header className="space-y-3">
            <p className="text-micro font-bold tracking-[0.06em] text-violet-600 uppercase">
              Step {index + 1} of {stepCount}
            </p>
            <h1 className="text-h1 text-ink-900 sm:text-display">{title}</h1>
            {lead ? <div className="text-lead text-ink-600">{lead}</div> : null}
          </header>
          {aside}
          {children}
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
