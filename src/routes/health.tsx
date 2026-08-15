import { ArrowRightIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { DocumentUpload } from "@/components/document-upload";
import { Field } from "@/components/field";
import { OptionCard } from "@/components/option-card";
import { AwardStage, PricePill, usePointsAward } from "@/components/points-award";
import { BackButton, StepShell, steadyAction, useStepNav } from "@/components/step-shell";
import { Panel, PanelDivider } from "@/components/surfaces";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { stepById } from "@/lib/steps";
import { patch, useOnboarding } from "@/lib/store";

/**
 * Health information: the Step the client described as having a strange flow.
 *
 * It keeps its own place in the spine — the research argued against dissolving
 * it into Who you are — but it **moved to immediately after Who you are**, so
 * the three uploads of the whole flow (Identity document, medical
 * documentation, Immunization record) are adjacent rather than scattered across
 * two Phases. Deputy and Revolut both give document collection its own rail
 * entry for the same reason.
 *
 * Why it stays a Step, in order of weight:
 *
 * 1. It is the **only optional Step in its Phase**, and folding it into a
 *    required one would put optional information inside a mandatory screen.
 * 2. It carries two uploads and a conditional, which is exactly the shape that
 *    produced the "About you is a mess" complaint when four such things shared
 *    one screen.
 * 3. Deputy and Revolut both do it.
 *
 * The **Immunization record is asked for regardless of the accommodation
 * answer.** Gating it on disability was part of what made the flow read as
 * strange, and it is a record Aster holds for every student.
 */
export function HealthRoute() {
  const state = useOnboarding();
  const health = state.health;
  const award = usePointsAward();
  const { goNext } = useStepNav("health");
  const step = stepById("health");
  const reduceMotion = useReducedMotion();

  const set = (changes: Partial<typeof health>) => patch("health", changes);

  const save = () => {
    patch("health", { submitted: true });
    award?.celebrate("health", step.points);
  };

  return (
    <StepShell
      current="health"
      title="Health information"
      lead="Optional here. The student portal will ask for it later either way."
      headerAside={<PricePill points={step.points} stepId="health" earned={health.submitted} />}
      actions={
        <>
          <BackButton current="health" />
          <Button type="button" variant="ghost" onClick={goNext}>
            Skip for now
          </Button>
          <Button type="button" size="lg" className={steadyAction} onClick={save}>
            Save and continue
            <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
          </Button>
        </>
      }
    >
      <Panel as="fieldset">
        {/* The sensitive question says why it is asked, once, before it asks
            (Remote). Flat register: this is the one screen in the flow where
            warmth would read as intrusive. */}
        <fieldset>
          <legend className="field-label">
            Do you need an accommodation for a disability or health condition?
          </legend>
          <p className="mt-1 text-small text-ink-500">
            Accessibility Services uses this to reach you before term starts. Nobody teaching you
            sees it.
          </p>
          <RadioGroup
            className="mt-3 grid gap-2.5 sm:grid-cols-2"
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

        {/* Born below the control that revealed it, in the same Panel. */}
        <AnimatePresence initial={false}>
          {health.accommodations === "yes" ? (
            <motion.div
              initial={reduceMotion ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pt-5">
                <Field label="What would help?" htmlFor="accommodation-note" optional>
                  <Textarea
                    id="accommodation-note"
                    rows={3}
                    placeholder="Anything you want them to know before they call"
                    value={health.accommodationNote}
                    onChange={(event) => set({ accommodationNote: event.target.value })}
                  />
                </Field>

                <div>
                  <p className="field-label">Medical documentation</p>
                  <p className="mt-1 mb-2 text-small text-ink-500">
                    A letter or report from a clinician.
                  </p>
                  <DocumentUpload
                    label="Medical documentation"
                    files={health.medicalDocuments}
                    onChange={(files) => set({ medicalDocuments: files })}
                  />
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <PanelDivider />

        {/* Sibling Well under its own label, never gated on the answer above
            (Lindy's two file Wells under one heading). */}
        <div>
          <p className="field-label">Immunization record</p>
          <p className="mt-1 mb-2 text-small text-ink-500">
            Aster holds this on file for every student, whatever you answered above.
          </p>
          <DocumentUpload
            label="Immunization record"
            files={health.immunizationDocuments}
            onChange={(files) => set({ immunizationDocuments: files })}
          />
        </div>
      </Panel>

      {/* Optionality is stated plainly, and so is the consequence of skipping.
          Laura was explicit that this difference has to be said, not implied. */}
      <p className="text-small text-ink-500">
        Skipping is fine here. The portal will require your immunization record before you register
        for classes.
      </p>

      <AwardStage stepId="health" headline="Noted, and kept private.">
        <Button type="button" size="lg" onClick={goNext}>
          Continue
          <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
        </Button>
      </AwardStage>
    </StepShell>
  );
}
