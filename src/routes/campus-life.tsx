import { ArrowRightIcon, XIcon } from "@phosphor-icons/react";
import * as React from "react";

import { ClubDetail } from "@/components/club-detail";
import { ClubGrid } from "@/components/club-grid";
import { BackButton, Panel, SectionTitle, StepShell, useStepNav } from "@/components/step-shell";
import { Button } from "@/components/ui/button";
import { type Club, type ClubCategory, clubCategories, clubs } from "@/lib/fixtures";
import { patch, useOnboarding } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * Campus life, cut from five blocks to one.
 *
 * The live step asks for clubs, then a social-setting preference, then "what
 * would you love to find", then support topics, then accommodations. Four of
 * those are profile questions wearing an enrollment step's clothes — the same
 * objection Laura made to the housing lifestyle questionnaire, applied one
 * screen along. What survives is the part that is actually a pleasure to
 * answer: clubs. The one item with a real consequence — accommodations — moved
 * out entirely, into its own Health information step, once it grew
 * documentation uploads a "clubs and interests" screen had no business holding.
 *
 * This was the fourth and last screen where Laura complained about the space,
 * and the only one where she said she had no solution: "está muito esparramada,
 * muito espaçada, eu não sei o que a gente pode fazer." The grid answers it the
 * same way as the other three — the picks accumulate in the fixed column while
 * the grid of photographs scrolls.
 *
 * Note for the demo: Laura never mentioned this step. This reduction is an
 * extrapolation of her argument, and has to be presented as a proposal.
 */
export function CampusLifeRoute() {
  const state = useOnboarding();
  const { next, goNext: advance } = useStepNav("campus-life");
  const campusLife = state.campusLife;

  const [categoryFilter, setCategoryFilter] = React.useState<ClubCategory[]>([]);
  const [detailClub, setDetailClub] = React.useState<Club | null>(null);

  const picked = campusLife.clubs
    .map((id) => clubs.find((club) => club.id === id))
    .filter((club): club is Club => Boolean(club));

  /* The filter narrows what's on screen, never what's picked. `picked` above
     always reads from the full `clubs` list, so a club chosen and then
     filtered out of view stays chosen — the running total in `Picks` and the
     grid's own checkmarks never depend on which categories happen to be
     toggled right now. */
  const visibleClubs =
    categoryFilter.length === 0
      ? clubs
      : clubs.filter((club) => categoryFilter.includes(club.category));

  const toggleCategory = (category: ClubCategory) =>
    setCategoryFilter((current) =>
      current.includes(category)
        ? current.filter((value) => value !== category)
        : [...current, category],
    );

  const toggle = (id: string) =>
    patch("campusLife", {
      clubs: campusLife.clubs.includes(id)
        ? campusLife.clubs.filter((current) => current !== id)
        : [...campusLife.clubs, id],
    });

  /**
   * Skipping is not answering. Both buttons used to write `submitted: true`,
   * which put a tick against Campus life in the rail for a student who
   * deliberately passed on it.
   */
  const goNext = (answered: boolean) => {
    if (answered) patch("campusLife", { submitted: true });
    advance();
  };

  return (
    <StepShell
      current="campus-life"
      title="Campus life"
      lead="None of this blocks your enrollment and you can change it later."
      actions={
        <>
          <BackButton current="campus-life" />
          <Button type="button" variant="ghost" size="lg" onClick={() => goNext(false)}>
            Skip
          </Button>
          <Button type="button" size="lg" onClick={() => goNext(true)}>
            <span className="hidden sm:inline">Next: {next?.label.toLowerCase()}</span>
            <span className="sm:hidden">Next</span>
            <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
          </Button>
        </>
      }
    >
      <Panel className="space-y-4">
        <SectionTitle description="We introduce you to the people who run them before term starts.">
          Clubs and interests
        </SectionTitle>

        <CategoryFilter
          selected={categoryFilter}
          onToggle={toggleCategory}
          onClear={() => setCategoryFilter([])}
        />

        {/* What used to be the third column, now a strip directly above the
            grid. "What have I picked" is asked while looking at the grid, so
            the answer belongs against it rather than off to one side — and
            unlike the panel it replaces, it costs nothing when empty. */}
        <Picks picked={picked} onRemove={toggle} />

        <ClubGrid
          clubs={visibleClubs}
          selected={campusLife.clubs}
          onToggle={toggle}
          onOpenDetail={setDetailClub}
        />

        {visibleClubs.length === 0 ? (
          <p className="text-small text-ink-500">
            Nothing matches that filter. Clear it to see all nine clubs again.
          </p>
        ) : null}

        {/* The running total, announced. Each card reports only its own pressed
            state, and the Picks panel that carries the count is static text
            that sits after the whole grid in the DOM below 1280px — so without
            this, a screen-reader user cannot tell how many they have chosen
            without leaving the grid to go and find out. Housing keeps the
            equivalent announcer for its ranking. */}
        <p aria-live="polite" className="sr-only">
          {picked.length === 0
            ? "No clubs chosen."
            : `${picked.length} ${picked.length === 1 ? "club" : "clubs"} chosen: ${picked
                .map((club) => club.name)
                .join(", ")}.`}
        </p>
      </Panel>

      <ClubDetail
        club={detailClub}
        open={detailClub !== null}
        onOpenChange={(open) => {
          if (!open) setDetailClub(null);
        }}
      />
    </StepShell>
  );
}

/**
 * Category filter, above the grid. Multi-select — narrowing to "sport" and
 * "outdoors" at once is a normal way to browse nine options down to the two or
 * three someone actually cares about.
 */
function CategoryFilter({
  selected,
  onToggle,
  onClear,
}: {
  selected: ClubCategory[];
  onToggle: (category: ClubCategory) => void;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {clubCategories.map((category) => {
        const active = selected.includes(category.value);
        return (
          <button
            key={category.value}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(category.value)}
            className={cn(
              "rounded-[var(--radius-pill)] border px-3.5 py-1.5 text-small font-bold transition-colors",
              active
                ? "border-violet-500 bg-violet-500 text-white"
                : "border-ink-200 bg-surface text-ink-600 hover:border-ink-300",
            )}
          >
            {category.label}
          </button>
        );
      })}
      {selected.length > 0 ? (
        <button
          type="button"
          onClick={onClear}
          className="text-small font-bold text-violet-600 transition-colors hover:text-violet-700"
        >
          Clear filter
        </button>
      ) : null}
    </div>
  );
}

/**
 * What the student has chosen, accumulating.
 *
 * A grid of nine cards with a selected state on some of them answers "which one
 * is this" but not "what have I picked". As a panel in a third column that
 * needed an empty state explaining itself; as a strip above the grid it simply
 * is not there until there is something to say.
 */
function Picks({ picked, onRemove }: { picked: Club[]; onRemove: (id: string) => void }) {
  if (picked.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-[var(--radius-field)] bg-violet-50/70 px-3 py-2.5">
      <span className="text-micro font-bold tracking-[0.06em] text-violet-700 uppercase">
        {picked.length} chosen
      </span>
      <ul className="flex flex-wrap gap-1.5">
        {picked.map((club) => (
          <li key={club.id}>
            <button
              type="button"
              onClick={() => onRemove(club.id)}
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-violet-200 bg-surface py-1 pr-2 pl-2.5 text-small font-bold text-violet-700 transition-colors hover:border-violet-300 hover:bg-violet-100"
            >
              {club.name}
              <XIcon weight="bold" aria-hidden className="size-3" />
              <span className="sr-only">Remove {club.name} from your picks</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
