import { ArrowRightIcon, CheckIcon, ClockCounterClockwiseIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";

import {
  daysToDeadline,
  formatDeadlineShort,
  type Requirement,
  type RequirementState,
  valueToday,
} from "@/lib/portal";
import { cn } from "@/lib/utils";

/**
 * One Requirement as a line, for everything the three cards do not show.
 *
 * The division of weight the catalogue keeps landing on: **one item at full
 * size and the rest as rows** (Bonsai's numbered list beside its expanded step,
 * Circle's setup checklist, Square's collapsed items). Without it the Dashboard
 * showed three of twelve and then stopped, and what was under it was 195px of
 * grey — which is the ADR 0009 defect arriving on the landing screen by a
 * different door.
 *
 * **Four fields, and no more.** Name, category, when, and what it is worth. The
 * minutes estimate and `See how` stay on the card: a row being scanned does not
 * support six fields, and if a row carried everything a card carries, the card
 * would have stopped meaning anything.
 */
export function QuestRow({
  requirement,
  state,
  waiting = [],
}: {
  requirement: Requirement;
  state: RequirementState;
  /** What an Upcoming Requirement is waiting on, from `waitingOn()`. */
  waiting?: string[];
}) {
  const mine = state === "available";
  const days = daysToDeadline(requirement);

  return (
    <li className="flex items-center gap-2 border-t border-ink-100 py-1 first:border-t-0">
      <StateMark state={state} />

      <Link
        to={requirement.path as never}
        className="row-nudge flex min-w-0 flex-[2] items-center gap-1.5"
      >
        <span
          className={cn(
            "min-w-0 truncate text-small",
            mine ? "font-strong text-ink-800" : "text-ink-600",
          )}
        >
          {requirement.label}
        </span>
        {mine ? (
          <ArrowRightIcon weight="bold" aria-hidden className="size-3 shrink-0 text-ink-300" />
        ) : null}
      </Link>

      <span className="min-w-0 flex-1 truncate text-meta text-ink-400 compact:hidden">
        {requirement.category}
      </span>

      {/* When — or, for the two states that are not the student's move, why it
          is not. A state the student cannot act on still owes them a reason for
          existing, and a named prerequisite is an instruction where a padlock is
          an obstacle. */}
      <span className="min-w-0 flex-[1.6] truncate text-right text-meta text-ink-500">
        {state === "under-review" ? (
          <>With {requirement.office}</>
        ) : state === "upcoming" ? (
          /* The first blocker, and a count if there is more than one. Two joined
             with "and" ran past the column and truncated mid-word, which turns
             an instruction back into a padlock. */
          <>
            Waiting on {waiting[0]}
            {waiting.length > 1 ? ` +${waiting.length - 1}` : ""}
          </>
        ) : (
          <span className="numeric">
            {formatDeadlineShort(requirement.deadline)} · {days} days
          </span>
        )}
      </span>

      {/* Under review carries no value: the student has done their part, and a
          number sliding while the university holds the work would be the reward
          system charging them for somebody else's queue. */}
      <span className="w-14 shrink-0 text-right text-meta numeric">
        {state === "under-review" ? (
          <span className="text-ink-300">—</span>
        ) : (
          <span className={mine ? "font-strong text-violet-700" : "text-ink-400"}>
            {valueToday(requirement)} pts
          </span>
        )}
      </span>
    </li>
  );
}

/** Whose move it is, at a glance and before any word is read. */
function StateMark({ state }: { state: RequirementState }) {
  if (state === "under-review") {
    return (
      <ClockCounterClockwiseIcon
        weight="duotone"
        aria-label="With the university"
        className="size-3.5 shrink-0 text-azure-500"
      />
    );
  }
  if (state === "complete") {
    return (
      <CheckIcon weight="bold" aria-label="Done" className="size-3.5 shrink-0 text-mint-600" />
    );
  }
  return (
    <span
      aria-hidden
      className={cn(
        "size-2 shrink-0 rounded-full",
        state === "available" ? "bg-violet-500" : "border border-ink-300 bg-surface",
      )}
    />
  );
}
