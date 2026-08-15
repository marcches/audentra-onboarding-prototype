import { CheckIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";

import { Balance } from "@/components/balance";
import { InstitutionCrest } from "@/components/institution-badge";
import { studentRecord } from "@/lib/fixtures";
import { aboveCompact, inCompactFlex, RAIL_CONNECTOR_OFFSET, RAIL_WIDTH } from "@/lib/layout";
import { type Group, groupOf, groups, phaseCount, phaseNumber, type StepId } from "@/lib/steps";
import { completedSteps, useOnboarding } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * The Rail: the desktop's permanent trail, and the first row of the Presence
 * table.
 *
 * Rebuilt for this round rather than restyled. The old rail expanded only the
 * Phase you were standing in, which meant the answer to "how much is left" was
 * behind a click — and on a screen whose whole job is to say *where you are*
 * that is the one question it must answer without one. All three Phases are
 * open, all ten Quests are visible with their checks, and the row is dense
 * enough (Mercury, Klook Merchant) that the whole spine fits above the fold on
 * the 640px a 1366×768 machine actually gives you.
 *
 * Three fixed slots, top to bottom: **who this is** (the institution's mark and
 * the student's own name), **where you are** (the spine), **what you have
 * earned** (the Balance, pinned to the foot — Time2book). The Balance at the
 * foot rather than the head is what gives the Points flight somewhere to land
 * that is not competing with the title of the screen.
 *
 * It never collapses and never changes width. A rail that narrowed on catalogue
 * Steps would slide every centred thing on the page sideways on navigation, on
 * a flow that is nothing but navigation.
 */

function useProgress(current: StepId) {
  const state = useOnboarding();
  const done = new Set(completedSteps(state));
  const activeGroup = groupOf(current);
  /* One walk, for every student. The rail used to be filtered by Student
     status, which meant it could be nine rows for one student and ten for
     another — see ADR 0011 for why that stopped. */
  return { state, done, activeGroup, walk: groups };
}

/** True when every Quest in the group is saved. */
function groupDone(group: Group, done: Set<StepId>) {
  return group.steps.every((step) => done.has(step.id));
}

/** Where the connector and every mark on it sit, derived rather than guessed. */
const CONNECTOR = { left: `${RAIL_CONNECTOR_OFFSET}px` } as const;
/** The Quest row's text, clearing the mark by the same gap the group row uses. */
const QUEST_INDENT = { paddingLeft: `${RAIL_CONNECTOR_OFFSET + 10}px` } as const;

/**
 * One Quest's mark, sitting **on** the line rather than beside it.
 *
 * The rail had no marks: every Quest row was bare and the check sat out at the
 * right, which left the line reading as a leftover border with names next to
 * it. Three states in one shape, which is the same grammar as the group marker
 * and as the Section marker one level further in — hollow for unstarted, filled
 * for where you are, a check for done.
 *
 * Nothing new was added to the screen: the check changed sides.
 */
function QuestMark({ done, current }: { done: boolean; current: boolean }) {
  return (
    <span
      aria-hidden
      style={CONNECTOR}
      className={cn(
        "absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full",
        "transition-colors duration-[var(--duration-base)]",
        done && "size-3.5 bg-mint-500 text-white",
        !done && current && "size-2 bg-violet-600",
        !done && !current && "size-2 border border-ink-300 bg-surface",
      )}
    >
      {done ? <CheckIcon weight="bold" aria-hidden className="size-2.5" /> : null}
    </span>
  );
}

function GroupRow({ group, current, done }: { group: Group; current: StepId; done: Set<StepId> }) {
  const number = phaseNumber(group.id);
  const complete = groupDone(group, done);
  const active = group.steps.some((step) => step.id === current);
  /* The Closing and After are drawn apart from the Phases on purpose: no
     number, a square-ish mark rather than a numbered dot. Neither is phase four
     and neither should be mistakable for it. */
  const apart = group.kind !== "phase";

  return (
    <li>
      <div className="flex items-center gap-2 px-1 pt-1 pb-1.5">
        <span
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-full border text-[0.625rem] font-bold",
            complete && "border-mint-500 bg-mint-500 text-white",
            !complete && active && "brand-gradient border-transparent text-white",
            !complete && !active && "border-ink-200 bg-surface text-ink-400",
            apart && "rounded-[4px]",
          )}
        >
          {complete ? (
            <CheckIcon weight="bold" aria-hidden className="size-3" />
          ) : apart ? (
            <span aria-hidden className="size-1 rounded-[1px] bg-current" />
          ) : (
            number
          )}
        </span>
        <span
          className={cn(
            "min-w-0 flex-1 truncate text-micro font-bold tracking-[0.06em] uppercase",
            active ? "text-violet-700" : "text-ink-500",
          )}
        >
          {group.label}
        </span>
      </div>

      {/* A segment per group, drawn per row rather than as one run down the
          rail. One continuous line would pull the Closing and After into the
          same spine as the three Phases, which is exactly what ADR 0001 and
          `CONTEXT.md` keep apart — and drawing it per row is also what lets the
          segment start under this group's own marker and stop at its last
          Quest without anybody measuring a row's height. */}
      <ol className="flex flex-col">
        {group.steps.map((step, index) => {
          const isDone = done.has(step.id);
          const isCurrent = step.id === current;
          const isLast = index === group.steps.length - 1;

          return (
            <li key={step.id} className="relative">
              <span
                aria-hidden
                style={CONNECTOR}
                className={cn(
                  "absolute bottom-1/2 w-px -translate-x-1/2 bg-ink-100",
                  /* `-top-1.5` on the first row closes the group row's own
                     `pb-1.5`, so the segment meets the marker above it. */
                  index === 0 ? "-top-1.5" : "top-0",
                )}
              />
              {isLast ? null : (
                <span
                  aria-hidden
                  style={CONNECTOR}
                  className="absolute top-1/2 bottom-0 w-px -translate-x-1/2 bg-ink-100"
                />
              )}
              <QuestMark done={isDone} current={isCurrent} />

              <Link
                to={step.path}
                aria-current={isCurrent ? "step" : undefined}
                style={QUEST_INDENT}
                className={cn(
                  "row-nudge flex items-center rounded-[var(--radius-field)] py-1.5 pr-2 transition-colors",
                  isCurrent ? "bg-violet-50" : "hover:bg-ink-50",
                )}
              >
                <span
                  className={cn(
                    /* Never truncates. "Health infor…" is the one thing a
                       rail must never do — this is the only place that name is
                       written. The width in `layout.ts` is set so it does not
                       have to. */
                    "min-w-0 flex-1 text-body leading-5",
                    isCurrent && "font-bold text-violet-700",
                    /* Struck through when saved: a tick alone reads as a
                       status; a struck line reads as "done with, move on". */
                    !isCurrent && isDone && "text-ink-400 line-through",
                    !isCurrent && !isDone && "text-ink-700",
                  )}
                >
                  {step.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </li>
  );
}

export function StepRail({ current }: { current: StepId }) {
  const { state, done, walk } = useProgress(current);
  const name = state.whoYouAre.preferredName.trim() || studentRecord.legalFirstName;

  return (
    <aside className={cn(RAIL_WIDTH, "shrink-0 border-r border-ink-100 bg-surface", aboveCompact)}>
      <div className="sticky top-0 flex h-dvh flex-col gap-3 overflow-y-auto px-3.5 py-3.5">
        {/* Whose portal this is, and whose record. The student's own name at
            the top is what stops the screen reading as a generic form. */}
        <div className="flex items-center gap-2">
          <InstitutionCrest className="size-9 shrink-0" />
          <span className="flex min-w-0 flex-col">
            <span className="truncate font-display text-body font-black tracking-[-0.015em] text-ink-900">
              Aster University
            </span>
            <span className="truncate text-micro tracking-[0.06em] text-ink-500 uppercase">
              {name}
            </span>
          </span>
        </div>

        <nav
          aria-label="Your path"
          className="min-h-0 flex-1 overflow-y-auto border-t border-ink-100 pt-3"
        >
          <ol className="flex flex-col gap-2.5">
            {walk.map((group) => (
              <GroupRow key={group.id} group={group} current={current} done={done} />
            ))}
          </ol>
        </nav>

        {/* Pinned to the foot, in the same pixel on every screen in the flow.
            Without a fixed destination the award's flight has nowhere to land. */}
        <div className="border-t border-ink-100 pt-2.5">
          <Balance />
        </div>
      </div>
    </aside>
  );
}

/**
 * The phone's half of the same Presence row: institution, Balance, and one
 * segment per Phase.
 *
 * A segment *is* a chapter, which is why neither the Closing nor After is in
 * it. Three segments say "three Phases" at a glance in a way a single bar
 * filling to 9/10 never did. It reads the same state as the Rail — there is one
 * source of progress, drawn twice, never two.
 */
export function PhaseBar({ current }: { current: StepId }) {
  const { done, activeGroup, walk } = useProgress(current);
  const activeNumber = phaseNumber(activeGroup.id);
  const beyondPhases = activeGroup.kind !== "phase";
  const railPhases = walk.filter((group) => group.kind === "phase");

  return (
    <header
      className={cn(
        "sticky top-0 z-[var(--z-rail)] flex-col gap-1.5 border-b border-ink-100 bg-surface/90 px-4 py-2 backdrop-blur",
        inCompactFlex,
      )}
    >
      <div className="flex items-center gap-2">
        <InstitutionCrest className="size-6 shrink-0" />
        <span className="min-w-0 flex-1 truncate font-display text-small font-black tracking-[-0.015em] text-ink-900">
          Aster University
        </span>
        <Balance variant="chip" />
      </div>

      <div className="flex flex-col gap-1">
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
            const filled = phase.steps.filter((step) => done.has(step.id)).length;

            return (
              <span key={phase.id} className="h-1 flex-1 overflow-hidden rounded-full bg-ink-100">
                {/* `scaleX` rather than `width`: a width transition is a layout
                    animation, and no animation rule in this system touches
                    one. The origin is the left edge so it grows the way a
                    progress bar has to. */}
                <span
                  className={cn(
                    "block h-full origin-left rounded-full",
                    "transition-transform duration-[var(--duration-stage)] ease-[var(--ease-out-expo)]",
                    complete ? "bg-mint-500" : "progress-fill",
                  )}
                  style={{
                    transform: `scaleX(${
                      complete
                        ? 1
                        : isActive || beyondPhases
                          ? filled / phase.steps.length || 0.12
                          : 0
                    })`,
                  }}
                />
              </span>
            );
          })}
        </div>
        <p className="text-micro font-bold tracking-[0.06em] text-ink-500 uppercase">
          {beyondPhases ? activeGroup.label : `Phase ${activeNumber} of ${phaseCount}`} ·{" "}
          <span className="text-ink-700">{activeGroup.label}</span>
        </p>
      </div>
    </header>
  );
}

/* `useSpine` lived here and re-exported the two totals through this module,
   because both had to be asked *per student*. With one spine for everybody the
   totals are constants and the entrance reads them from `steps.ts` directly.
   Nothing imported the hook; it goes with the status parameter that was its
   only reason to exist. */
