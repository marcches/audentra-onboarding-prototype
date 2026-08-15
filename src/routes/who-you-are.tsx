import { ArrowRightIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import * as React from "react";

import { DocumentUpload } from "@/components/document-upload";
import { Field, ReadOnlyField } from "@/components/field";
import { OptionCard } from "@/components/option-card";
import { PhoneInput } from "@/components/phone-input";
import { AwardStage, PricePill, usePointsAward } from "@/components/points-award";
import { BackButton, StepShell, steadyAction, useStepNav } from "@/components/step-shell";
import { Panel, PanelDivider, Well } from "@/components/surfaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@/components/ui/radio-group";
import { studentRecord, studentStatusOptions } from "@/lib/fixtures";
import { type StudentStatus, stepById } from "@/lib/steps";
import { patch, type UploadedFile, useOnboarding } from "@/lib/store";
import { documentLabelFor, whoYouAreSchema } from "@/lib/validation";

/**
 * Who you are: the first of the three Steps that replaced `identity-contact`.
 *
 * Laura described the defect this fixes exactly: *"a gente começou falando de
 * nome, falou de contato, aí voltou a falar de nome, falou de contato de
 * novo."* One Step carrying four subjects across 1068 lines. An accordion hid
 * that; it did not fix it. Nor does compression: the client's "more density AND
 * less scrolling" is not a contradiction, because both improve when a subject
 * **leaves** the screen.
 *
 * The one structural rule here: **Student status is answered before any
 * document is requested**, so the request is never generic. The upload appears
 * directly below the control that revealed it, inside the same Panel, with an
 * authored transition (Cake Equity). Nothing above the trigger moves.
 */
export function WhoYouAreRoute() {
  const state = useOnboarding();
  const who = state.whoYouAre;
  const award = usePointsAward();
  const { goNext } = useStepNav("who-you-are");
  const step = stepById("who-you-are");
  const reduceMotion = useReducedMotion();

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const set = (changes: Partial<typeof who>) => patch("whoYouAre", changes);

  const submit = () => {
    const result = whoYouAreSchema.safeParse({
      preferredName: who.preferredName,
      pronouns: who.pronouns,
      dialCode: who.dialCode,
      phone: who.phone,
      studentStatus: who.studentStatus,
      idDocuments: who.idDocuments,
    });

    if (!result.success) {
      const next: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setErrors({});
    patch("whoYouAre", { submitted: true });
    award?.celebrate("who-you-are", step.points);
  };

  const status = who.studentStatus;

  return (
    <StepShell
      current="who-you-are"
      title="Who you are"
      lead="Your name as you want it used, a number we can reach you on, and one document."
      headerAside={<PricePill points={step.points} stepId="who-you-are" earned={who.submitted} />}
      actions={
        <>
          <BackButton current="who-you-are" />
          <Button type="button" size="lg" className={steadyAction} onClick={submit}>
            Save and continue
            <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
          </Button>
        </>
      }
    >
      {/* One Panel with internal dividers, not three. The three groups are
          sequential parts of one form with no independent actions, which is
          exactly the case lululemon's checkout answers with dividers. */}
      <Panel as="fieldset">
        <Well label="Already on your record">
          <div className="grid gap-4 sm:grid-cols-2">
            <ReadOnlyField
              label="Legal name"
              value={`${studentRecord.legalFirstName} ${studentRecord.legalLastName}`}
              note="Admissions holds this. Write to them if it is wrong."
            />
            <ReadOnlyField
              label="Email"
              value={studentRecord.personalEmail}
              note="Admissions holds this. Write to them if it is wrong."
            />
          </div>
        </Well>

        <PanelDivider />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Preferred name" htmlFor="preferred-name" optional>
            <Input
              id="preferred-name"
              value={who.preferredName}
              placeholder="What people call you"
              onChange={(event) => set({ preferredName: event.target.value })}
            />
          </Field>
          <Field label="Pronouns" htmlFor="pronouns" optional>
            <Input
              id="pronouns"
              value={who.pronouns}
              placeholder="they/them"
              onChange={(event) => set({ pronouns: event.target.value })}
            />
          </Field>
        </div>

        {/* One compact row: dial-code select plus number, one line of help, no
            heading block of its own. The review call asked for this directly
            and it has been specified twice before without being built. */}
        <Field
          className="mt-4"
          label="Mobile number"
          htmlFor="mobile"
          hint="We use this for enrolment messages and nothing else."
          error={errors.phone}
        >
          <PhoneInput
            id="mobile"
            dialCode={who.dialCode}
            onDialCodeChange={(value) => set({ dialCode: value })}
            value={who.phone}
            invalid={Boolean(errors.phone)}
            onChange={(event) => set({ phone: event.target.value })}
          />
        </Field>

        <PanelDivider />

        {/* The branching question. It says why it is asked, once (Remote), and
            each option carries its consequence in its own label (Fiverr). */}
        <fieldset>
          <legend className="field-label">Your student status</legend>
          <p className="mt-1 text-small text-ink-500">
            This decides which document we ask you for, and whether we need a U.S. address.
          </p>
          <RadioGroup
            className="mt-3 grid gap-2.5"
            value={status}
            onValueChange={(value) => set({ studentStatus: value as StudentStatus })}
          >
            {studentStatusOptions.map((option) => (
              <OptionCard
                key={option.value}
                id={`status-${option.value}`}
                value={option.value}
                label={option.label}
                consequence={option.consequence}
              />
            ))}
          </RadioGroup>
          {errors.studentStatus ? (
            <p className="mt-2 text-small font-medium text-danger-600">{errors.studentStatus}</p>
          ) : null}
        </fieldset>

        {/* Born directly below the control that revealed it, inside the same
            Panel. Nothing above the trigger moves, which is the replacement for
            the revoked "reserve space or be an overlay" rule. */}
        <AnimatePresence initial={false}>
          {status ? (
            <motion.div
              key={status}
              initial={reduceMotion ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-5">
                <p className="field-label">{documentLabelFor(status as StudentStatus)}</p>
                <div className="mt-2">
                  <DocumentUpload
                    label={documentLabelFor(status as StudentStatus)}
                    files={who.idDocuments}
                    onChange={(files: UploadedFile[]) => set({ idDocuments: files })}
                  />
                </div>
                {errors.idDocuments ? (
                  <p className="mt-2 text-small font-medium text-danger-600">
                    {errors.idDocuments}
                  </p>
                ) : null}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Panel>

      <AwardStage stepId="who-you-are" headline="That is who you are.">
        <Button type="button" size="lg" onClick={goNext}>
          Continue
          <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
        </Button>
      </AwardStage>
    </StepShell>
  );
}
