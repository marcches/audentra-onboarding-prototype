import { ArrowRightIcon, ClockIcon, LightningIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";

import { FlatCard } from "@/components/surfaces";
import { Button } from "@/components/ui/button";
import {
  daysToDeadline,
  formatDeadlineShort,
  type Requirement,
  unlockCount,
  urgencyOf,
  valueToday,
  valueTomorrow,
} from "@/lib/portal";
import { cn } from "@/lib/utils";

/**
 * One Requirement, at full weight: what it is, when it is wanted, how long it
 * takes, and what it is worth today against what it will be worth tomorrow.
 *
 * **A flat card on a Well, never an elevated one** (ADR 0010). Shadow is
 * reserved for what genuinely floats, and a list of twelve shadows is the
 * stacking the client has objected to in three separate rounds. The Well under
 * the list is the local ground for the collection; raising every item off it
 * would put a shadow inside a recess.
 *
 * The anatomy is Langdock's and Portrait's: a primary action carrying a verb,
 * a quiet secondary beside it, and the value carried as a tag on the row rather
 * than announced on completion. Points and the deadline are two independent
 * fields (OpenSea) rather than blended into a single priority — a student can
 * act on "ten days" and on "one point a day", and cannot act on a score.
 */
export function QuestCard({
  requirement,
  lead = false,
}: {
  requirement: Requirement;
  /**
   * The top of Smart order, which says so and says why. The badge carries the
   * transitive unlock count because *Best next step* has to be a claim the
   * student can check rather than an assertion of magic.
   */
  lead?: boolean;
}) {
  const today = valueToday(requirement);
  const tomorrow = valueTomorrow(requirement);
  const days = daysToDeadline(requirement);
  const opens = unlockCount(requirement.id);

  return (
    <FlatCard as="article" className="p-3">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="rounded-[var(--radius-pill)] bg-ink-100 px-1.5 py-0.5 text-meta font-bold text-ink-600">
          {requirement.category}
        </span>
        <Deadline requirement={requirement} />
        {lead ? (
          <span className="ml-auto flex items-center gap-1 rounded-[var(--radius-pill)] bg-violet-50 px-1.5 py-0.5 text-meta font-bold text-violet-700">
            <LightningIcon weight="fill" aria-hidden className="size-3" />
            Best next step
            {opens > 0 ? (
              <span className="font-normal text-violet-600 numeric">· opens {opens} more</span>
            ) : null}
          </span>
        ) : null}
      </div>

      <h3 className="mt-1.5 text-h3 text-ink-900">{requirement.label}</h3>
      <p className="text-small leading-5 text-ink-600">{requirement.blurb}</p>

      {/* The five facts, all at the metadata step and all lower case, so the
          Quest name is unmistakably the largest thing in the card (Linear). */}
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-meta text-ink-500">
        <span className="numeric">
          Due {formatDeadlineShort(requirement.deadline)} ·{" "}
          {days >= 0 ? `${days} days` : `${Math.abs(days)} days ago`}
        </span>
        <span className="flex items-center gap-1 numeric">
          <ClockIcon weight="duotone" aria-hidden className="size-3" />
          About {requirement.minutes} min
        </span>
        {/* Decay, shown literally: today's value beside tomorrow's, and never
            a tally of what has already been lost. The client's one
            non-negotiable — *hoje é 100, amanhã 99* — and the one component in
            the portal with no precedent in the reference catalogue. */}
        <span className="font-strong text-violet-700 numeric">
          {today} pts today
          <span className="font-normal text-ink-500"> · {tomorrow} tomorrow</span>
        </span>
      </div>

      <div className="mt-2.5 flex items-center gap-1.5">
        <Button asChild size="sm">
          <Link to={requirement.path as never}>
            {requirement.action}
            <ArrowRightIcon weight="bold" aria-hidden className="size-3.5" />
          </Link>
        </Button>
        {/* Present and inert. Its drawer is the next cycle's, and a secondary
            action that arrives later and moves the row it is on is worse than
            one that does nothing now — so it occupies its final size from the
            start. */}
        <Button type="button" variant="ghost" size="sm" disabled>
          See how
        </Button>
      </div>
    </FlatCard>
  );
}

/**
 * The urgency chip: three steps rather than a countdown on every row.
 *
 * A card that shouts about ninety days away teaches the student to ignore the
 * one that does not, so `steady` says nothing at all and the tone only appears
 * where it has something to add.
 */
function Deadline({ requirement }: { requirement: Requirement }) {
  const urgency = urgencyOf(requirement);
  const days = daysToDeadline(requirement);
  if (urgency === "steady") return null;

  return (
    <span
      className={cn(
        "rounded-[var(--radius-pill)] px-1.5 py-0.5 text-meta font-bold numeric",
        urgency === "overdue" && "bg-danger-50 text-danger-600",
        urgency === "urgent" && "bg-danger-50 text-danger-600",
        urgency === "soon" && "bg-amber-50 text-amber-500",
      )}
    >
      {days < 0 ? "Overdue" : days === 0 ? "Due today" : `Due in ${days} days`}
    </span>
  );
}
