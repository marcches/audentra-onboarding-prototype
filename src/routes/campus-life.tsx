import { ArrowRightIcon } from "@phosphor-icons/react";
import * as React from "react";

import { ClubDetail } from "@/components/club-detail";
import { ClubGrid } from "@/components/club-grid";
import { BackButton, StepShell, steadyAction, useStepNav } from "@/components/step-shell";
import { Button } from "@/components/ui/button";
import { type Club, clubs } from "@/lib/fixtures";
import { patch, useOnboarding } from "@/lib/store";

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
 *
 * Round three took four more things out, this time for the stacking the client
 * pointed at directly — "olha o tanto de informação uma contra a outra, nao
 * dando harmonia aos olhos". Between the page title and the first club sat a
 * panel heading with its own description, six category filters wrapping onto
 * two rows, a tray of chosen clubs, and an empty-filter sentence: five blocks
 * of furniture to work a catalogue of *nine* cards that fits in three rows.
 * None of the twenty references found for this moment does any of it — the
 * count lives in the button (Skillshare, Substack, Hulu) and the selection
 * lives in the grid (Bloom, Hulu). So: the grid, and the button.
 */
export function CampusLifeRoute() {
  const state = useOnboarding();
  const { goNext: advance } = useStepNav("campus-life");
  const campusLife = state.campusLife;

  const [detailClub, setDetailClub] = React.useState<Club | null>(null);

  const picked = campusLife.clubs
    .map((id) => clubs.find((club) => club.id === id))
    .filter((club): club is Club => Boolean(club));

  const toggle = (id: string) =>
    patch("campusLife", {
      clubs: campusLife.clubs.includes(id)
        ? campusLife.clubs.filter((current) => current !== id)
        : [...campusLife.clubs, id],
    });

  /**
   * Skipping is not answering — passing through without a pick must not put a
   * tick against Campus life in the rail. With Skip and Next collapsed into one
   * button, that distinction is no longer a question of which button was
   * pressed; it is simply whether anything was chosen.
   */
  const goNext = () => {
    if (picked.length > 0) patch("campusLife", { submitted: true });
    advance();
  };

  return (
    <StepShell
      current="campus-life"
      title="Campus life"
      lead="We'll introduce you to the people who run these before term starts — pick as many as you like, or none."
      actions={
        <>
          <BackButton current="campus-life" />
          {/* One button, not two. Skip and Next asked the same question by
              different routes on an optional step, and with nothing picked
              there was no way to tell which one you were supposed to press.
              Skillshare's answer: the primary button carries the state. It gets
              a width floor (`steadyAction`) so the label changing does not move
              the one piece of furniture that never moves. */}
          <Button type="button" size="lg" className={steadyAction} onClick={goNext}>
            {picked.length === 0
              ? "Skip for now"
              : `Continue with ${picked.length} ${picked.length === 1 ? "club" : "clubs"}`}
            <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
          </Button>
        </>
      }
    >
      {/* No `Panel`. A panel wraps fields; this is a gallery, and a white box on
          grey ground holding nine white cards is a border around a border. The
          written exception to "no step renders on the canvas" is in the
          stacking ruler, not just here. */}
      <ClubGrid
        clubs={clubs}
        selected={campusLife.clubs}
        onToggle={toggle}
        onOpenDetail={setDetailClub}
      />

      {/* The running total, announced. Each card reports only its own pressed
          state, so without this a screen-reader user cannot tell how many they
          have chosen without walking the whole grid to count — and the fade
          that says it to everyone else says nothing to them. Housing keeps the
          equivalent announcer for its ranking. */}
      <p aria-live="polite" className="sr-only">
        {picked.length === 0
          ? "No clubs chosen."
          : `${picked.length} ${picked.length === 1 ? "club" : "clubs"} chosen: ${picked
              .map((club) => club.name)
              .join(", ")}.`}
      </p>

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
