import { ArrowRightIcon } from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";

import { ClubGrid } from "@/components/club-grid";
import { Field } from "@/components/field";
import { Notice } from "@/components/notice";
import { OptionCard } from "@/components/option-card";
import { SectionTitle, StepActions, StepShell } from "@/components/step-shell";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { clubs, institution } from "@/lib/fixtures";
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
 * Note for the demo: Laura never mentioned this step. This reduction is an
 * extrapolation of her argument, and has to be presented as a proposal.
 */
export function CampusLifeRoute() {
  const state = useOnboarding();
  const navigate = useNavigate();
  const campusLife = state.campusLife;

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
      title="What you'd show up for"
      lead="None of this blocks your enrollment, and you can change all of it later. Skip the whole step if you'd rather."
    >
      <section className="space-y-4">
        <SectionTitle description="Pick as many as you like. We'll introduce you to the people who run them before term starts.">
          Clubs and interests
        </SectionTitle>

        <ClubGrid
          clubs={clubs}
          selected={campusLife.clubs}
          onToggle={(id) =>
            patch("campusLife", {
              clubs: campusLife.clubs.includes(id)
                ? campusLife.clubs.filter((current) => current !== id)
                : [...campusLife.clubs, id],
            })
          }
        />

        <p aria-live="polite" className="text-small text-ink-500">
          {campusLife.clubs.length === 0
            ? "Nothing picked yet."
            : `${campusLife.clubs.length} picked.`}
        </p>
      </section>

      <section className="space-y-4">
        <SectionTitle description="The only question on this screen that changes what someone does about it.">
          Do you need any accommodations?
        </SectionTitle>

        <RadioGroup
          value={campusLife.accommodations}
          onValueChange={(value) => patch("campusLife", { accommodations: value as "yes" | "no" })}
        >
          <OptionCard
            value="yes"
            id="accommodations-yes"
            label="Yes, I'd like someone to get in touch"
            hint="Accessibility Services will contact you before term starts"
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
            <Notice tone="caution" title="Don't put medical details here">
              A sentence about what would help is enough — "I need a note-taker", "I need step-free
              access". Accessibility Services will ask for documentation separately, over a channel
              built for it.
            </Notice>

            <Field
              label="What would help?"
              htmlFor="accommodation-note"
              optional
              hint="Skip it if you'd rather talk to a person first."
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
          <Notice tone="info" title="That's fine">
            Nothing is recorded and nobody will chase you. Ask {institution.housingOffice} or
            Accessibility Services whenever you need to.
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
