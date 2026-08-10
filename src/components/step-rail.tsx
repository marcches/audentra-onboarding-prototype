import { CheckIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";

import { InstitutionBadge } from "@/components/institution-badge";
import { AudentraMark } from "@/components/wordmark";
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
        <InstitutionBadge size="compact" className="min-w-0" />
        {/* Just the counter — the page heading right below already names the
            step, and repeating it twice on a 390px screen is noise. */}
        <p className="ml-auto shrink-0 text-micro font-bold tracking-[0.06em] text-ink-500 uppercase">
          Step {currentIndex + 1} of {stepCount}
        </p>
      </header>

      <aside className="hidden w-[19rem] shrink-0 border-r border-ink-100 bg-surface lg:block">
        {/* One rule between every block, at one weight, from the crest at the
            top to the platform mark at the bottom.

            Each rule is an explicit `border-t` with `mt-6` above and `pt-6`
            below, so it sits exactly halfway between the two things it
            separates. `divide-y` was doing this and getting it wrong: it draws
            on each child's *bottom* edge, which pinned every rule flush against
            the content above it and left the whole 48px of breathing room on
            the far side. */}
        <div className="sticky top-0 flex h-dvh flex-col overflow-y-auto p-8">
          {/* The institution leads. This is its portal; Audentra is the thing
              it runs on, and that goes at the foot of the rail. */}
          <InstitutionBadge />

          <div className="mt-6 space-y-3 border-t border-ink-100 pt-6">
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

          <nav aria-label="Onboarding steps" className="mt-6 border-t border-ink-100 pt-6">
            <ol className="relative flex flex-col gap-1">
              {steps.map((step, index) => {
                const isDone = done.includes(step.id);
                const isCurrent = step.id === current;

                return (
                  <li key={step.id} className="relative">
                    {/* One connector per gap rather than a single spine down the
                        list: the rows are not all the same height, so a spine
                        measured from the list's own edges overshoots the last
                        dot. Anchored to the dot instead — left-5 is its centre
                        (8px link padding + half of the 24px dot), top-6 is the
                        same measure vertically (10px padding + 2px mt + 12px),
                        and -bottom-7 reaches the next dot's centre (4px gap +
                        24px). */}
                    {index < steps.length - 1 ? (
                      <span
                        aria-hidden
                        className="absolute top-6 -bottom-7 left-5 w-px -translate-x-1/2 bg-ink-100"
                      />
                    ) : null}
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

          {/* Quiet, and one line: the platform credit is the least important
              thing in the rail and should be sized like it. */}
          {/* `mt-8` is the floor, `mt-auto` the ceiling: on a short rail the
              footer keeps its own 32px of clearance instead of colliding with
              the step list; on a tall one it settles at the bottom. */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-ink-100 pt-6 lg:mt-auto">
            <a
              href={`mailto:${institution.admissionsEmail}`}
              className="text-small text-ink-400 transition-colors hover:text-ink-600"
            >
              Need a hand?
            </a>
            <span className="flex items-center gap-1.5 text-ink-400">
              <span className="text-micro tracking-[0.06em] uppercase">by</span>
              <AudentraMark className="size-4" />
              <span className="text-micro font-bold tracking-[0.12em] uppercase">Audentra</span>
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
