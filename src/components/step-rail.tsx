import { CheckIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import * as React from "react";

import { Balance } from "@/components/balance";
import { InstitutionBadge } from "@/components/institution-badge";
import { Wordmark } from "@/components/wordmark";
import { institution } from "@/lib/fixtures";
import {
  closing,
  type Group,
  groupMinutes,
  groupOf,
  groupRequired,
  groups,
  phaseCount,
  phaseNumber,
  phases,
  type StepId,
} from "@/lib/steps";
import { completedSteps, useOnboarding } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * The rail, rebuilt around Phases.
 *
 * What it replaces was 19rem wide and listed all seven steps at once, each with
 * a blurb under it and a points badge beside it — the heaviest thing on the
 * screen, and the client's "no shell of a real system" complaint landed on it
 * hardest. This one is 14rem, shows three Phases plus the Closing, and only
 * opens the Phase you are actually in. Deel's step panel and Adaline's named
 * chapters are the references; both are small, and both hide the detail of the
 * chapters you are not in.
 *
 * Time and required/optional sit on the Phase row. A time figure at three
 * levels is noise, and per-Quest the only thing worth knowing is "can I skip
 * this" — so a Quest row carries an Optional tag and nothing else.
 */

function useProgress(current: StepId) {
  const state = useOnboarding();
  const done = new Set(completedSteps(state));
  const activeGroup = groupOf(current);
  return { done, activeGroup };
}

/** True when every Quest in the group is saved. */
function groupDone(group: Group, done: Set<StepId>) {
  return group.steps.every((step) => done.has(step.id));
}

function GroupRow({
  group,
  current,
  done,
  expanded,
}: {
  group: Group;
  current: StepId;
  done: Set<StepId>;
  expanded: boolean;
}) {
  const isClosing = group.kind === "closing";
  const number = phaseNumber(group.id);
  const complete = groupDone(group, done);
  const minutes = groupMinutes(group);

  return (
    <li>
      <div
        className={cn(
          "flex items-center gap-2.5 rounded-[var(--radius-field)] px-2 py-1.5",
          expanded && "bg-violet-50",
        )}
      >
        <span
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-full border text-[0.6875rem] font-bold",
            complete && "border-mint-500 bg-mint-500 text-white",
            !complete && expanded && "brand-gradient border-transparent text-white",
            !complete && !expanded && "border-ink-200 bg-surface text-ink-400",
            /* The Closing is drawn apart from the Phases on purpose: no number,
               a square-ish mark rather than a numbered dot. It is not phase
               four and should not be able to be mistaken for it. */
            isClosing && "rounded-[6px]",
          )}
        >
          {complete ? (
            <CheckIcon weight="bold" aria-hidden className="size-3" />
          ) : isClosing ? (
            <span aria-hidden className="size-1.5 rounded-[2px] bg-current" />
          ) : (
            number
          )}
        </span>

        <span className="flex min-w-0 flex-1 flex-col">
          <span
            className={cn(
              "truncate text-small font-bold",
              expanded ? "text-violet-700" : "text-ink-800",
            )}
          >
            {group.label}
          </span>
          {/* The one line of meta in the whole rail. The client asked for time
              and required/optional on Review & sign; putting them here shows
              them for the whole flow, before the work rather than after it. */}
          <span className="text-[0.6875rem] leading-4 text-ink-500">
            {minutes} min · {groupRequired(group) ? "Required" : "Optional"}
          </span>
        </span>
      </div>

      {expanded ? (
        <ol className="mt-1 ml-[1.4375rem] flex flex-col gap-0.5 border-l border-ink-100 pl-3">
          {group.steps.map((step) => {
            const isDone = done.has(step.id);
            const isCurrent = step.id === current;

            return (
              <li key={step.id}>
                <Link
                  to={step.path}
                  aria-current={isCurrent ? "step" : undefined}
                  className={cn(
                    "flex items-start gap-2 rounded-[var(--radius-field)] px-2 py-1.5 transition-colors",
                    isCurrent ? "bg-surface shadow-soft" : "hover:bg-ink-50",
                  )}
                >
                  <span
                    className={cn(
                      /* Wraps rather than truncates. At 14rem a Quest name and
                         an Optional tag do not both fit on one line, and
                         "Health infor…" is the one thing a rail must never
                         do — it is the only place that name is written. */
                      "text-small",
                      isCurrent && "font-bold text-ink-900",
                      /* Struck through when saved — Adaline's completion
                         register. A tick alone reads as a status; a struck line
                         reads as "done with, move on". */
                      !isCurrent && isDone && "text-ink-400 line-through",
                      !isCurrent && !isDone && "text-ink-700",
                    )}
                  >
                    {step.label}
                  </span>
                  {isDone ? (
                    <CheckIcon
                      weight="bold"
                      aria-hidden
                      className="ml-auto size-3.5 shrink-0 text-mint-600"
                    />
                  ) : !step.required ? (
                    <span className="mt-0.5 ml-auto shrink-0 text-[0.625rem] font-bold tracking-[0.06em] text-ink-400 uppercase">
                      Optional
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ol>
      ) : null}
    </li>
  );
}

export function StepRail({ current }: { current: StepId }) {
  const { done, activeGroup } = useProgress(current);

  return (
    <aside className="hidden w-56 shrink-0 border-r border-ink-100 bg-surface lg:block">
      <div className="sticky top-0 flex h-dvh flex-col overflow-y-auto px-4 py-6">
        <InstitutionBadge size="compact" />

        {/* One Balance, at the top of the rail, above the work it pays for. */}
        <div className="mt-5">
          <Balance />
        </div>

        <nav aria-label="Your path" className="mt-5 border-t border-ink-100 pt-5">
          <ol className="flex flex-col gap-1.5">
            {groups.map((group, index) => (
              <React.Fragment key={group.id}>
                {/* The Closing is fenced off from the Phases by a rule, not
                    just by styling — it is outside the count. */}
                {group.id === closing.id && index > 0 ? (
                  <li aria-hidden className="my-1 border-t border-ink-100" />
                ) : null}
                <GroupRow
                  group={group}
                  current={current}
                  done={done}
                  expanded={group.id === activeGroup.id}
                />
              </React.Fragment>
            ))}
          </ol>
        </nav>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-ink-100 pt-5 lg:mt-auto">
          <a
            href={`mailto:${institution.admissionsEmail}`}
            className="text-small text-ink-400 transition-colors hover:text-ink-600"
          >
            Need a hand?
          </a>
          <Wordmark className="h-3.5 opacity-70" />
        </div>
      </div>
    </aside>
  );
}

/**
 * The phone header: institution, Balance, and one segment per Phase.
 *
 * MyFitnessPal's segmented bar, where a segment *is* a chapter — which is why
 * the Closing is not in it. Three segments say "three Phases" at a glance in a
 * way a single bar filling to 6/7 never did, and the bar it replaces was
 * measuring position in a flat list of seven that no longer exists.
 */
export function PhaseBar({ current }: { current: StepId }) {
  const { done, activeGroup } = useProgress(current);
  const activeNumber = phaseNumber(activeGroup.id);
  const inClosing = activeGroup.kind === "closing";

  return (
    <header className="sticky top-0 z-30 flex flex-col gap-2.5 border-b border-ink-100 bg-surface/90 px-4 py-3 backdrop-blur lg:hidden">
      <div className="flex items-center gap-3">
        <InstitutionBadge size="compact" className="min-w-0" />
        <Balance variant="chip" />
      </div>

      <div className="flex flex-col gap-1.5">
        <div
          className="flex gap-1"
          role="progressbar"
          aria-valuenow={inClosing ? phaseCount : (activeNumber ?? 1)}
          aria-valuemin={1}
          aria-valuemax={phaseCount}
          aria-label={
            inClosing
              ? `${closing.label}, after ${phaseCount} of ${phaseCount} phases`
              : `Phase ${activeNumber} of ${phaseCount}: ${activeGroup.label}`
          }
        >
          {phases.map((phase) => {
            const complete = groupDone(phase, done);
            const isActive = phase.id === activeGroup.id;

            return (
              <span key={phase.id} className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-100">
                <span
                  className={cn(
                    "block h-full rounded-full transition-[width] duration-500 ease-[var(--ease-out-expo)]",
                    complete ? "bg-mint-500" : "brand-gradient",
                  )}
                  style={{
                    /* A partly-done Phase fills by its own Quests, so the bar
                       moves inside a Phase and not only between them. */
                    width: complete
                      ? "100%"
                      : isActive || inClosing
                        ? `${(phase.steps.filter((step) => done.has(step.id)).length / phase.steps.length) * 100 || 12}%`
                        : "0%",
                  }}
                />
              </span>
            );
          })}
        </div>
        <p className="text-[0.6875rem] font-bold tracking-[0.06em] text-ink-500 uppercase">
          {inClosing ? closing.label : `Phase ${activeNumber} of ${phaseCount}`} ·{" "}
          <span className="text-ink-700">{activeGroup.label}</span>
        </p>
      </div>
    </header>
  );
}
