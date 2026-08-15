import { CheckIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import * as React from "react";

import { Balance } from "@/components/balance";
import { InstitutionBadge } from "@/components/institution-badge";
import { PricePill } from "@/components/points-award";
import { Wordmark } from "@/components/wordmark";
import { institution } from "@/lib/fixtures";
import {
  type Group,
  groupOf,
  groupRequired,
  groupsFor,
  nextStep,
  phaseCount,
  phaseNumber,
  type StepId,
  stepsFor,
} from "@/lib/steps";
import { completedSteps, studentStatus, useOnboarding } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * The rail, rebuilt around Phases.
 *
 * Ten Steps must not read as ten. Airwallex's two-level rail is the answer:
 * parent groups with children, and only the group you are actually in
 * expanded. Four rows are visible at rest and the current Phase opens to its
 * Quests, so the rail is the same height it was when the flow had seven Steps
 * — the client's "the rail is too short" complaint is answered by there being
 * more to say, not by padding.
 *
 * Minutes sit on the Quest row, which revokes the previous round's rule that
 * time never appears on a Quest line. Klaviyo puts "About 3 minutes" on a
 * sub-step and HoneyBook puts minutes on every row of a checklist — and with
 * every Step levelled at one to three, the figure reads as "this is quick".
 * It disappears once the row is complete, as HoneyBook's does.
 */

function useProgress(current: StepId) {
  const state = useOnboarding();
  const done = new Set(completedSteps(state));
  const activeGroup = groupOf(current);
  const status = studentStatus(state);
  return { done, activeGroup, status, walk: groupsFor(status) };
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
  priced,
}: {
  group: Group;
  current: StepId;
  done: Set<StepId>;
  expanded: boolean;
  /** The two Quests allowed to show a price: the current one and the next one. */
  priced: Set<StepId>;
}) {
  const number = phaseNumber(group.id);
  const complete = groupDone(group, done);
  const apart = group.kind !== "phase";

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
            /* The Closing and After are drawn apart from the Phases on purpose:
               no number, a square-ish mark rather than a numbered dot. Neither
               is phase four and neither should be mistakable for it. */
            apart && "rounded-[6px]",
          )}
        >
          {complete ? (
            <CheckIcon weight="bold" aria-hidden className="size-3" />
          ) : apart ? (
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
          <span className="text-[0.6875rem] leading-4 text-ink-500">
            {group.steps.length} {group.steps.length === 1 ? "quest" : "quests"} ·{" "}
            {groupRequired(group) ? "Required" : "Optional"}
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
                    "row-nudge flex flex-col gap-0.5 rounded-[var(--radius-field)] px-2 py-1.5 transition-colors",
                    isCurrent ? "bg-surface shadow-soft" : "hover:bg-ink-50",
                  )}
                >
                  <span className="flex items-start gap-2">
                    <span
                      className={cn(
                        /* Wraps rather than truncates. At 14rem a Quest name
                           and a tag do not both fit on one line, and "Health
                           infor…" is the one thing a rail must never do — it is
                           the only place that name is written. */
                        "text-small",
                        isCurrent && "font-bold text-ink-900",
                        /* Struck through when saved: a tick alone reads as a
                           status; a struck line reads as "done with, move on". */
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
                        className="mt-0.5 ml-auto size-3.5 shrink-0 text-mint-600"
                      />
                    ) : null}
                  </span>

                  {/* The minute figure goes when the row is done, and the price
                      only ever shows on the Quest being worked and the one
                      after it. A rail that priced all ten would be the price
                      list `CONTEXT.md` forbids. */}
                  {!isDone && (step.minutes > 0 || !step.required || priced.has(step.id)) ? (
                    <span className="flex flex-wrap items-center gap-x-1.5 text-[0.625rem] leading-4 text-ink-400">
                      {step.minutes > 0 ? (
                        <span className="whitespace-nowrap numeric">{step.minutes} min</span>
                      ) : null}
                      {!step.required ? (
                        <span className="font-bold tracking-[0.06em] whitespace-nowrap uppercase">
                          Optional
                        </span>
                      ) : null}
                      {priced.has(step.id) ? (
                        <PricePill points={step.points} size="rail" stepId={step.id} />
                      ) : null}
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
  const { done, activeGroup, status, walk } = useProgress(current);
  const upcoming = nextStep(current, status);
  const priced = new Set<StepId>([current, ...(upcoming ? [upcoming.id] : [])]);

  return (
    <aside className="hidden w-56 shrink-0 border-r border-ink-100 bg-surface lg:block">
      <div className="sticky top-0 flex h-dvh flex-col overflow-y-auto px-4 py-6">
        <InstitutionBadge size="compact" />

        {/* One Balance, at the top of the rail, in the same pixel on every
            screen in the flow. Without a fixed destination the award's flight
            has nowhere to land. */}
        <div className="mt-5">
          <Balance />
        </div>

        <nav aria-label="Your path" className="mt-5 border-t border-ink-100 pt-5">
          <ol className="flex flex-col gap-1.5">
            {walk.map((group, index) => (
              <React.Fragment key={group.id}>
                {/* The Closing is fenced off from the Phases by a rule, not
                    just by styling — it is outside the count. */}
                {group.kind !== "phase" && index > 0 ? (
                  <li aria-hidden className="my-1 border-t border-ink-100" />
                ) : null}
                <GroupRow
                  group={group}
                  current={current}
                  done={done}
                  expanded={group.id === activeGroup.id}
                  priced={priced}
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
 * A segment *is* a chapter, which is why neither the Closing nor After is in
 * it. Three segments say "three Phases" at a glance in a way a single bar
 * filling to 9/10 never did.
 */
export function PhaseBar({ current }: { current: StepId }) {
  const { done, activeGroup, walk } = useProgress(current);
  const activeNumber = phaseNumber(activeGroup.id);
  const beyondPhases = activeGroup.kind !== "phase";
  const railPhases = walk.filter((group) => group.kind === "phase");

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
          aria-valuenow={beyondPhases ? phaseCount : (activeNumber ?? 1)}
          aria-valuemin={1}
          aria-valuemax={phaseCount}
          aria-label={
            beyondPhases
              ? `${activeGroup.label}, after ${phaseCount} of ${phaseCount} phases`
              : `Phase ${activeNumber} of ${phaseCount}: ${activeGroup.label}`
          }
        >
          {railPhases.map((phase) => {
            const complete = groupDone(phase, done);
            const isActive = phase.id === activeGroup.id;

            return (
              <span key={phase.id} className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-100">
                <span
                  className={cn(
                    "block h-full rounded-full transition-[width] duration-[var(--duration-stage)] ease-[var(--ease-out-expo)]",
                    /* The progress fill is the one place the third hue earns
                       itself: it ends in the colour of "done". */
                    complete ? "bg-mint-500" : "progress-fill",
                  )}
                  style={{
                    width: complete
                      ? "100%"
                      : isActive || beyondPhases
                        ? `${(phase.steps.filter((step) => done.has(step.id)).length / phase.steps.length) * 100 || 12}%`
                        : "0%",
                  }}
                />
              </span>
            );
          })}
        </div>
        <p className="text-[0.6875rem] font-bold tracking-[0.06em] text-ink-500 uppercase">
          {beyondPhases ? activeGroup.label : `Phase ${activeNumber} of ${phaseCount}`} ·{" "}
          <span className="text-ink-700">{activeGroup.label}</span>
        </p>
      </div>
    </header>
  );
}

/**
 * The total time and the total Points, announced once before the first field.
 *
 * Melio's "Takes 4-5 minutes · Each step is saved as you progress" and
 * Langdock's "0 / 595" crowning a checklist. Once, at the entrance: repeated
 * per screen it becomes a running remainder, which is a threat rather than an
 * orientation.
 */
export function useSpine() {
  const state = useOnboarding();
  const status = studentStatus(state);
  return { status, walk: stepsFor(status), groups: groupsFor(status) };
}

export { totalMinutesFor, totalPointsAvailableFor } from "@/lib/steps";
