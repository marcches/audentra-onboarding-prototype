import { CheckIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";

import { Wordmark } from "@/components/wordmark";
import { institution } from "@/lib/fixtures";
import { type StepId, stepCount, stepIndex, steps } from "@/lib/steps";
import { completedSteps, useOnboarding } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * The sidebar counts `steps`, so the "N of 6" can never disagree with what is
 * actually in the flow. The live portal shows "N of 8" because Emergency
 * contacts and Family permissions are still steps there; here they are
 * sections of About you, and the count follows automatically.
 */
export function StepRail({ current }: { current: StepId }) {
  const state = useOnboarding();
  const done = completedSteps(state);
  const currentIndex = stepIndex(current);

  return (
    <>
      {/* Phone: a single line of progress, no step list competing with the form. */}
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-ink-100 bg-canvas/85 px-4 py-3 backdrop-blur lg:hidden">
        <Wordmark className="shrink-0" />
        {/* Just the counter — the page heading right below already names the
            step, and repeating it twice on a 390px screen is noise. */}
        <p className="ml-auto text-micro font-bold tracking-[0.06em] text-ink-500 uppercase">
          Step {currentIndex + 1} of {stepCount}
        </p>
      </header>

      <aside className="hidden w-[19rem] shrink-0 border-r border-ink-100 bg-surface lg:block">
        <div className="sticky top-0 flex h-dvh flex-col gap-8 overflow-y-auto p-8">
          <div className="space-y-1">
            <Wordmark />
            <p className="pl-[2.375rem] text-small text-ink-500">{institution.name}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <h2 className="text-h3 text-ink-900">Your path to {institution.short}</h2>
            </div>
            <p className="text-small text-ink-500">
              {done.length} of {stepCount} saved. We keep your answers as you go.
            </p>
            <div
              className="h-1.5 overflow-hidden rounded-full bg-ink-100"
              role="progressbar"
              aria-valuenow={done.length}
              aria-valuemin={0}
              aria-valuemax={stepCount}
              aria-label="Onboarding progress"
            >
              <div
                className="brand-gradient h-full rounded-full transition-[width] duration-500 ease-[var(--ease-out-expo)]"
                style={{ width: `${(done.length / stepCount) * 100}%` }}
              />
            </div>
          </div>

          <nav aria-label="Onboarding steps">
            <ol className="relative flex flex-col gap-1">
              {/* The spine. Sits behind the dots and stops short of the last one. */}
              <span
                aria-hidden
                className="absolute top-6 bottom-6 left-[0.6875rem] w-px bg-ink-100"
              />
              {steps.map((step, index) => {
                const isDone = done.includes(step.id);
                const isCurrent = step.id === current;

                return (
                  <li key={step.id} className="relative">
                    <Link
                      to={step.path}
                      className={cn(
                        "flex items-start gap-3 rounded-[var(--radius-field)] px-2 py-2.5 transition-colors",
                        isCurrent ? "bg-violet-50" : "hover:bg-ink-50",
                      )}
                      aria-current={isCurrent ? "step" : undefined}
                    >
                      <span
                        className={cn(
                          "relative z-10 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border text-micro font-bold",
                          isDone && "border-mint-500 bg-mint-500 text-white",
                          !isDone && isCurrent && "brand-gradient border-transparent text-white",
                          !isDone && !isCurrent && "border-ink-200 bg-surface text-ink-400",
                        )}
                      >
                        {isDone ? (
                          <CheckIcon weight="bold" aria-hidden className="size-3.5" />
                        ) : (
                          index + 1
                        )}
                      </span>
                      <span className="flex flex-col">
                        <span
                          className={cn(
                            "text-body font-bold",
                            isCurrent ? "text-violet-700" : "text-ink-800",
                          )}
                        >
                          {step.label}
                        </span>
                        <span className="text-small text-ink-500">{step.blurb}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </nav>

          <p className="mt-auto text-small text-ink-400">
            Stuck on something? {institution.admissionsEmail}
          </p>
        </div>
      </aside>
    </>
  );
}
