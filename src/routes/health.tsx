import { ArrowRightIcon } from "@phosphor-icons/react";

import { DocumentUpload } from "@/components/document-upload";
import { Field } from "@/components/field";
import { Notice } from "@/components/notice";
import { OptionCard } from "@/components/option-card";
import { BackButton, Panel, SectionTitle, StepShell, useStepNav } from "@/components/step-shell";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { institution } from "@/lib/fixtures";
import { patch, useOnboarding } from "@/lib/store";

/**
 * Health information, split out of Campus life.
 *
 * The accommodation question used to sit under "Clubs and interests", which
 * put a disability disclosure one scroll away from picking a club — the wrong
 * neighbour for something this sensitive, and with nowhere for the medical
 * documentation and immunization record the real portal eventually asks for.
 * The question itself, and its "don't write medical details here" warning,
 * are unchanged; what's new is the two uploads that appear once the answer is
 * yes, and a step of its own to hold them.
 *
 * Optional throughout, like every accommodation-adjacent question in this
 * flow: skipping it doesn't block Review & sign or the deposit, and the copy
 * says so.
 */
export function HealthRoute() {
  const state = useOnboarding();
  const { next, goNext: advance } = useStepNav("health");
  const health = state.health;

  /* Skipping is not answering — same rule as Campus life next door. Both
     buttons used to collapse into one "submitted: true" write, which would
     tell Review & sign this question had been answered when the student had
     deliberately passed on it. */
  const goNext = (answered: boolean) => {
    if (answered) patch("health", { submitted: true });
    advance();
  };

  return (
    <StepShell
      current="health"
      title="Health information"
      lead="Optional — skipping it doesn't block your enrollment. Some accommodations need documentation before they can be arranged."
      actions={
        <>
          <BackButton current="health" />
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
        <SectionTitle description="Ask Disability Services to contact you. Do not upload medical records here.">
          Do you need any accommodations?
        </SectionTitle>

        <RadioGroup
          value={health.accommodations}
          onValueChange={(value) => patch("health", { accommodations: value as "yes" | "no" })}
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

        {health.accommodations === "yes" ? (
          <div className="space-y-5">
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
                value={health.accommodationNote}
                onChange={(event) => patch("health", { accommodationNote: event.target.value })}
                placeholder="A note-taker in lectures, step-free routes between buildings…"
              />
            </Field>

            {/* Both uploads are optional and both say so on the field itself —
                the hints under them were repeating the word a third time. */}
            <div className="grid gap-4 sm:grid-cols-2">
              <DocumentUpload
                label="Medical documentation"
                files={health.medicalDocuments}
                onChange={(files) => patch("health", { medicalDocuments: files })}
              />

              <DocumentUpload
                label="Immunization record"
                files={health.immunizationDocuments}
                onChange={(files) => patch("health", { immunizationDocuments: files })}
              />
            </div>
          </div>
        ) : null}

        {health.accommodations === "no" ? (
          <Notice tone="info" title="Nothing is recorded">
            Ask {institution.housingOffice} or Disability Services whenever you need to.
          </Notice>
        ) : null}
      </Panel>
    </StepShell>
  );
}
