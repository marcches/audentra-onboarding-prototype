import { ArrowRightIcon, ClockIcon, CoinVerticalIcon, LightningIcon } from "@phosphor-icons/react";
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
 * **Flat on its Well, except the one card the screen is about** (ADR 0015).
 * Shadow contains the subject and nothing else: the lead card sits inside the
 * band and is raised, every card under it is flat on the Well that groups them.
 * A list of twelve shadows is the stacking the client has objected to in three
 * separate rounds, and raising every item off a Well would put a shadow inside
 * a recess.
 *
 * The elevation is **containment, never reaction**. The lead card is raised
 * because it is the subject, not because a mouse is near it — nothing here
 * lifts, grows or thickens on hover or on selection.
 *
 * The anatomy is Langdock's and Portrait's: a primary action carrying a verb,
 * a quiet secondary beside it, and **the price carried as a chip before the
 * student acts** rather than announced on completion. Points and the deadline
 * are two independent fields (OpenSea) rather than blended into a single
 * priority — a student can act on "ten days" and on "one point a day", and
 * cannot act on a score.
 *
 * Decay is on the lead card and nowhere else; see the chip below for why that
 * placement is a decision rather than a layout preference.
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
    <FlatCard as="article" className={cn("p-4", lead && "shadow-[var(--shadow-contains)]")}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-[var(--radius-pill)] bg-ink-100 px-2 py-1 text-meta font-bold text-ink-600">
          {requirement.category}
        </span>
        <Deadline requirement={requirement} />
        {/* **The price, before the student acts.**

            Points are a price and a receipt in one object (ADR 0007), and the
            product only ever drew the receipt: the value appeared when a Quest
            was finished and nowhere at the moment of choosing what to spend an
            evening on. This is the half that was never drawn, not a second
            figure — it is `valueToday`, the same number that lands in the
            Balance afterwards (Langdock's price on the row before acting).

            It sits in the chip row rather than on a line of its own, so it
            costs the card no height at all. */}
        <span className="flex items-center gap-1 rounded-[var(--radius-pill)] bg-violet-50 px-2 py-1 text-meta font-bold text-violet-700">
          <CoinVerticalIcon weight="fill" aria-hidden className="size-3" />
          <span className="numeric">{today} pts</span>
          {/* **Decay, and only on the card the student is being pointed at.**

              Literal, as the client specified it and as it has always been:
              today's value beside tomorrow's, never a running tally of what has
              already been lost. Displaying that would turn a reward into a
              reprimand, which is why the Original value is held and never
              shown.

              It appears here and nowhere else, and that placement is the
              risk-management decision of this cycle rather than a layout
              preference. Decay is the one component in the product with **no
              reference in the catalogue** — every app that has tried
              time-limited value uses a deadline or a countdown, and none of
              them shrinks the reward itself. Concentrating it on one card per
              screen is what lets human acceptance judge it, instead of it
              becoming twelve simultaneous unvalidated bets. */}
          {lead ? (
            <span className="font-normal text-violet-600 numeric">· {tomorrow} tomorrow</span>
          ) : null}
        </span>
        {lead ? (
          <span className="ml-auto flex items-center gap-1 rounded-[var(--radius-pill)] bg-violet-50 px-2 py-1 text-meta font-bold text-violet-700 compact:ml-0">
            <LightningIcon weight="fill" aria-hidden className="size-3" />
            Best next step
            {opens > 0 ? (
              <span className="font-normal text-violet-600 numeric">· opens {opens} more</span>
            ) : null}
          </span>
        ) : null}
      </div>

      <h3 className="mt-2 text-h3 text-ink-900">{requirement.label}</h3>
      <p className="text-small text-ink-600">{requirement.blurb}</p>

      {/* The remaining facts, at the metadata step and in lower case, so the
          Quest name is unmistakably the largest thing in the card (Linear). */}
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-meta text-ink-500">
        <span className="numeric">
          Due {formatDeadlineShort(requirement.deadline)} ·{" "}
          {days >= 0 ? `${days} days` : `${Math.abs(days)} days ago`}
        </span>
        <span className="flex items-center gap-1 numeric">
          <ClockIcon weight="bold" aria-hidden className="size-3" />
          About {requirement.minutes} min
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {/* One primary action per screen. Three violet buttons stacked is three
            invitations arguing with each other, and the ordering has already
            said which one to take — the card that carries `Best next step` is
            the one that carries the filled button (Square). */}
        <Button asChild size="sm" variant={lead ? "primary" : "secondary"}>
          <Link to={requirement.path as never}>
            {requirement.action}
            <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
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
        "rounded-[var(--radius-pill)] px-2 py-1 text-meta font-bold numeric",
        urgency === "overdue" && "bg-danger-50 text-danger-600",
        urgency === "urgent" && "bg-danger-50 text-danger-600",
        urgency === "soon" && "bg-amber-50 text-amber-500",
      )}
    >
      {days < 0 ? "Overdue" : days === 0 ? "Due today" : `Due in ${days} days`}
    </span>
  );
}
