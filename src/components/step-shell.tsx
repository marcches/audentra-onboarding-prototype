import { CloudCheckIcon } from "@phosphor-icons/react";
import type * as React from "react";

import { StepRail } from "@/components/step-rail";
import { type StepId, stepCount, stepIndex, steps } from "@/lib/steps";
import { cn } from "@/lib/utils";

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
  const step = steps[index];

  return (
    <>
      <StepRail current={current} />
      <main className="flex-1 px-4 pt-8 pb-24 sm:px-8 lg:px-12 lg:pt-14">
        <div className="mx-auto flex w-full max-w-[46rem] flex-col gap-8">
          <header className="space-y-3">
            <p className="text-micro font-bold tracking-[0.06em] text-violet-600 uppercase">
              Step {index + 1} of {stepCount}
              {step && !step.redesigned ? " · unchanged this round" : ""}
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
