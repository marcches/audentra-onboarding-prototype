import { SyringeIcon, WheelchairIcon } from "@phosphor-icons/react";

import { PricePill, useCelebration } from "@/components/celebration";
import { DocumentUpload } from "@/components/document-upload";
import { Field } from "@/components/field";
import { OptionCard } from "@/components/option-card";
import {
  BackButton,
  ContinueAction,
  StepGuide,
  StepShell,
  useStepNav,
} from "@/components/step-shell";
import { Prose, Reveal, Section, SectionFields, Sections } from "@/components/surfaces";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { stepById } from "@/lib/steps";
import { patch, useOnboarding } from "@/lib/store";

/**
 * Health information: the Step the client described as having a strange flow.
 *
 * It keeps its own place in the spine — the research argued against dissolving
 * it into Who you are — but it sits immediately after Who you are, so the three
 * uploads of the whole flow (Identity document, medical documentation,
 * Immunization record) are adjacent rather than scattered across two Phases.
 * Deputy and Revolut both give document collection its own rail entry for the
 * same reason.
 *
 * The **Immunization record is asked for regardless of the accommodation
 * answer.** Gating it on disability was part of what made the flow read as
 * strange, and it is a record Aster holds for every student.
 *
 * Optionality is said out loud, twice, because the two halves of it are
 * different facts: this Step does not block anything, *and* the portal will
 * require the immunization record before class registration. Laura was explicit
 * that the second one has to be said rather than implied.
 */
export function HealthRoute() {
  const state = useOnboarding();
  const health = state.health;
  const award = useCelebration();
  const { goNext } = useStepNav("health");
  const step = stepById("health");

  const set = (changes: Partial<typeof health>) => patch("health", changes);

  const save = () => {
    patch("health", { submitted: true });
    award?.celebrate("health", step.points);
  };

  const accommodating = health.accommodations === "yes";

  return (
    <StepShell
      current="health"
      title="Health information"
      lead="Optional here. The student portal will ask for it later either way."
      headerAside={<PricePill points={step.points} stepId="health" earned={health.submitted} />}
      guide={
        <StepGuide
          current="health"
          why="Nothing here blocks you. Accessibility Services uses the first answer to reach you before term starts, and Aster holds an immunization record for every student — the portal will require it before you register for classes."
          tasks={[
            {
              label: "Whether you need an accommodation",
              done: health.accommodations !== "",
              optional: true,
            },
            {
              label: "Your immunization record",
              done: health.immunizationDocuments.length > 0,
              optional: true,
            },
          ]}
        />
      }
      actions={
        <>
          <BackButton current="health" />
          {health.submitted ? (
            <ContinueAction label="Continue" onClick={goNext} />
          ) : (
            <>
              <Button type="button" variant="ghost" onClick={goNext}>
                Skip for now
              </Button>
              <ContinueAction label="Save and continue" onClick={save} />
            </>
          )}
        </>
      }
    >
      <Sections as="fieldset">
        {/* The sensitive question says why it is asked, once, before it asks
            (Remote). Flat register: this is the one screen in the flow where
            warmth would read as intrusive. */}
        <Section
          step={1}
          done={health.accommodations !== ""}
          icon={<WheelchairIcon weight="duotone" aria-hidden className="size-4" />}
          title="Accommodations"
          value={
            health.accommodations === "yes"
              ? "Yes — Accessibility Services will be in touch"
              : health.accommodations === "no"
                ? "Not right now"
                : undefined
          }
        >
          <fieldset>
            <legend className="field-label">
              Do you need an accommodation for a disability or health condition?
            </legend>
            <Prose size="note" className="mt-0.5">
              Accessibility Services uses this to reach you before term starts. Nobody teaching you
              sees it.
            </Prose>
            <RadioGroup
              className="mt-2 grid grid-cols-2 gap-1.5 narrow:grid-cols-1"
              value={health.accommodations}
              onValueChange={(value) => set({ accommodations: value as "yes" | "no" })}
            >
              <OptionCard
                id="accommodations-yes"
                value="yes"
                label="Yes, I would like to talk to Accessibility Services"
              />
              <OptionCard id="accommodations-no" value="no" label="No, not right now" />
            </RadioGroup>
          </fieldset>

          {/* Born below the control that revealed it, in the same Section. */}
          <Reveal open={accommodating}>
            <SectionFields className="pt-3">
              <Field width="full" label="What would help?" htmlFor="accommodation-note" optional>
                <Textarea
                  id="accommodation-note"
                  rows={2}
                  placeholder="Anything you want them to know before they call"
                  value={health.accommodationNote}
                  onChange={(event) => set({ accommodationNote: event.target.value })}
                />
              </Field>
              <div className="col-span-12">
                <DocumentUpload
                  label="Medical documentation"
                  hint="A letter or report from a clinician."
                  files={health.medicalDocuments}
                  onChange={(files) => set({ medicalDocuments: files })}
                />
              </div>
            </SectionFields>
          </Reveal>
        </Section>

        {/* Its own Section, never gated on the answer above (Lindy's two file
            Wells under one heading). */}
        <Section
          step={2}
          done={health.immunizationDocuments.length > 0}
          icon={<SyringeIcon weight="duotone" aria-hidden className="size-4" />}
          title="Immunization record"
          value={
            health.immunizationDocuments.length
              ? `${health.immunizationDocuments.length} attached`
              : undefined
          }
        >
          <Prose size="note" className="mb-2">
            Aster holds this on file for every student, whatever you answered above.
          </Prose>
          <DocumentUpload
            tall
            label="Immunization record"
            files={health.immunizationDocuments}
            onChange={(files) => set({ immunizationDocuments: files })}
          />
        </Section>
      </Sections>
    </StepShell>
  );
}
