import { ArrowRightIcon, XIcon } from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";

import { ClubGrid } from "@/components/club-grid";
import { Field } from "@/components/field";
import { Notice } from "@/components/notice";
import { OptionCard } from "@/components/option-card";
import { ContextPanel, SectionTitle, StepActions, StepShell } from "@/components/step-shell";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { type Club, clubs, institution } from "@/lib/fixtures";
import { patch, useOnboarding } from "@/lib/store";

/**
 * Campus life, cut from five blocks to two.
 *
 * The live step asks for clubs, then a social-setting preference, then "what
 * would you love to find", then support topics, then accommodations. Three of
 * those are profile questions wearing an enrollment step's clothes — the same
 * objection Laura made to the housing lifestyle questionnaire, applied one
 * screen along. What survives is the part with a consequence (accommodations)
 * and the part that is actually a pleasure to answer (clubs).
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
  const navigate = useNavigate();
  const campusLife = state.campusLife;

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
   * Skipping is not answering. Both buttons used to write `submitted: true`,
   * which put a tick against Campus life in the rail for a student who
   * deliberately passed on it — and, worse, told Review & sign the
   * accommodations question had been answered when it had not.
   */
  const goNext = (answered: boolean) => {
    if (answered) patch("campusLife", { submitted: true });
    navigate({ to: "/onboarding/review" });
  };

  return (
    <StepShell
      current="campus-life"
      title="Campus life"
      lead="None of this blocks your enrollment and you can change it later. Skip the whole step if you would rather."
      context={<Picks picked={picked} onRemove={toggle} />}
    >
      <section className="space-y-4">
        <SectionTitle description="We introduce you to the people who run them before term starts.">
          Clubs and interests
        </SectionTitle>

        <ClubGrid clubs={clubs} selected={campusLife.clubs} onToggle={toggle} />

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
      </section>

      <section className="space-y-4">
        <SectionTitle description="Ask Disability Services to contact you. Do not upload medical records here.">
          Do you need any accommodations?
        </SectionTitle>

        <RadioGroup
          value={campusLife.accommodations}
          onValueChange={(value) => patch("campusLife", { accommodations: value as "yes" | "no" })}
        >
          <OptionCard
            value="yes"
            id="accommodations-yes"
            label="Yes, contact me"
            hint="Disability Services will contact you by email within 3 working days"
          />
          <OptionCard
            value="no"
            id="accommodations-no"
            label="No, not right now"
            hint="You can ask at any point in the year"
          />
        </RadioGroup>

        {campusLife.accommodations === "yes" ? (
          <div className="space-y-4">
            {/* This warning is load-bearing, not boilerplate: this box is not a
                medical record and is not stored like one. */}
            <Notice tone="caution" title="Do not put medical details here">
              A sentence about what would help is enough. Disability Services will tell you what
              they need, over a channel built for it.
            </Notice>

            <Field
              label="What would help?"
              htmlFor="accommodation-note"
              optional
              hint="Skip it if you would rather talk to a person first."
            >
              <Textarea
                id="accommodation-note"
                value={campusLife.accommodationNote}
                onChange={(event) => patch("campusLife", { accommodationNote: event.target.value })}
                placeholder="A note-taker in lectures, step-free routes between buildings…"
              />
            </Field>
          </div>
        ) : null}

        {campusLife.accommodations === "no" ? (
          <Notice tone="info" title="Nothing is recorded">
            Ask {institution.housingOffice} or Disability Services whenever you need to.
          </Notice>
        ) : null}
      </section>

      <StepActions>
        <Button type="button" variant="ghost" size="lg" onClick={() => goNext(false)}>
          Skip for now
        </Button>
        <Button type="button" size="lg" onClick={() => goNext(true)}>
          Next: review &amp; sign
          <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
        </Button>
      </StepActions>
    </StepShell>
  );
}

/**
 * The fixed column: what the student has chosen, accumulating.
 *
 * A grid of nine cards with a selected state on some of them answers "which one
 * is this" but not "what have I picked" — and the second question is the one
 * being asked after the third scroll.
 */
function Picks({ picked, onRemove }: { picked: Club[]; onRemove: (id: string) => void }) {
  return (
    <ContextPanel
      sticky
      title="Your picks"
      description={picked.length > 0 ? `${picked.length} chosen so far.` : undefined}
    >
      {picked.length === 0 ? (
        /* Empty state, per the Message Library rule: say why it is empty and
           what would fill it. "Nothing picked yet." said the first half only. */
        <p className="text-small text-ink-500">
          Nothing picked yet. Choose a club on the left and it appears here. Picking none is a fine
          answer — nothing on this step blocks your enrollment.
        </p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {picked.map((club) => (
            <li key={club.id}>
              <button
                type="button"
                onClick={() => onRemove(club.id)}
                className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-violet-200 bg-violet-50 py-1.5 pr-2 pl-3 text-small font-bold text-violet-700 transition-colors hover:border-violet-300 hover:bg-violet-100"
              >
                {club.name}
                <XIcon weight="bold" aria-hidden className="size-3.5" />
                <span className="sr-only">Remove {club.name} from your picks</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </ContextPanel>
  );
}
