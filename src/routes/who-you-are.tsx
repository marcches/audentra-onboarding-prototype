import {
  IdentificationBadgeIcon,
  IdentificationCardIcon,
  LockSimpleIcon,
  UserIcon,
} from "@phosphor-icons/react";
import * as React from "react";

import { PricePill, useCelebration } from "@/components/celebration";
import { DocumentUpload } from "@/components/document-upload";
import { Field, ReadOnlyField } from "@/components/field";
import { OptionCard } from "@/components/option-card";
import { PhoneInput } from "@/components/phone-input";
import {
  BackButton,
  ContinueAction,
  StepGuide,
  StepShell,
  useStepNav,
} from "@/components/step-shell";
import { Prose, Section, SectionFields, Sections } from "@/components/surfaces";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@/components/ui/radio-group";
import { studentRecord, studentStatusOptions } from "@/lib/fixtures";
import { type StudentStatus, stepById } from "@/lib/steps";
import { patch, type UploadedFile, useOnboarding } from "@/lib/store";
import { documentLabelFor, whoYouAreSchema } from "@/lib/validation";

/**
 * Who you are: the Step the whole round was built against.
 *
 * Laura described the defect the rebuild fixed exactly — *"a gente começou
 * falando de nome, falou de contato, aí voltou a falar de nome, falou de
 * contato de novo."* One subject per Step answered that. What this round adds
 * is the other half of the same complaint: **all of it visible at once, in an
 * order that conducts.**
 *
 * The Step is drawn as a three-part checklist, numbered, each part checking
 * itself off as it is answered. The third part — the document — is present and
 * muted from the first frame rather than appearing out of nowhere: a student
 * can see the whole shape of what they are about to do before they start, which
 * is the difference between a form and a task. It unlocks when Student status
 * is answered, because **the request is never generic**: the status decides
 * which document is asked for, and asking before knowing is how the old screen
 * came to request "an identity document" from everybody.
 *
 * The strip across the top is what Aster already holds. It is first because the
 * first question anybody has about a form is which parts of it are already
 * done, and it is the only collapsible thing here — closing something the
 * student cannot edit is the one case where a chevron earns its click.
 */
export function WhoYouAreRoute() {
  const state = useOnboarding();
  const who = state.whoYouAre;
  const award = useCelebration();
  const { goNext } = useStepNav("who-you-are");
  const step = stepById("who-you-are");

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const set = (changes: Partial<typeof who>) => patch("whoYouAre", changes);

  const status = who.studentStatus;
  const documented = who.idDocuments.length > 0;
  const reachable = who.phone.trim() !== "";

  /* What the primary action narrates. Three things block this Step, and the
     button says how many are left rather than going missing until they are
     done (Deputy). */
  const missing = [!reachable, status === "", !documented].filter(Boolean).length;

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

  return (
    <StepShell
      current="who-you-are"
      title="Who you are"
      lead="Your name as you want it used, a number we can reach you on, and one document."
      headerAside={<PricePill points={step.points} stepId="who-you-are" earned={who.submitted} />}
      guide={
        <StepGuide
          current="who-you-are"
          why="Aster already holds your legal name and your email. What is missing is how you want to be addressed, a number that reaches you, and proof of who you are."
          tasks={[
            { label: "A number we can reach you on", done: reachable },
            { label: "Your student status", done: status !== "" },
            { label: "The document it calls for", done: documented },
          ]}
        />
      }
      actions={
        <>
          <BackButton current="who-you-are" />
          {who.submitted ? (
            <ContinueAction label="Continue" onClick={goNext} />
          ) : (
            <ContinueAction remaining={missing} label="Save and continue" onClick={submit} />
          )}
        </>
      }
    >
      <Sections as="fieldset" signature>
        {/* Spans the sheet: a two-field strip beside a full-height section
            leaves a hole where the other half of the row would have been. */}
        <Section
          collapsible
          icon={<LockSimpleIcon weight="duotone" aria-hidden className="size-4" />}
          title="Already on your record"
          value={`${studentRecord.legalFirstName} ${studentRecord.legalLastName} · ${studentRecord.personalEmail}`}
        >
          <SectionFields>
            <ReadOnlyField
              width="medium"
              label="Legal name"
              value={`${studentRecord.legalFirstName} ${studentRecord.legalLastName}`}
            />
            <ReadOnlyField width="medium" label="Email" value={studentRecord.personalEmail} />
            <Prose size="note" className="col-span-12">
              Admissions holds both of these. Write to them if either is wrong.
            </Prose>
          </SectionFields>
        </Section>

        <Section
          step={1}
          done={reachable}
          icon={<UserIcon weight="duotone" aria-hidden className="size-4" />}
          title="Your name and number"
        >
          <SectionFields>
            <Field width="medium" label="Preferred name" htmlFor="preferred-name" optional>
              <Input
                id="preferred-name"
                value={who.preferredName}
                placeholder="What people call you"
                onChange={(event) => set({ preferredName: event.target.value })}
              />
            </Field>
            <Field width="short" label="Pronouns" htmlFor="pronouns" optional>
              <Input
                id="pronouns"
                value={who.pronouns}
                placeholder="they/them"
                onChange={(event) => set({ pronouns: event.target.value })}
              />
            </Field>
            <Field
              width="long"
              label="Mobile number"
              htmlFor="mobile"
              hint="Enrolment messages, and nothing else."
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
          </SectionFields>
        </Section>

        {/* The branching question. It says why it is asked, once (Remote), and
            each option carries its consequence in its own label (Fiverr). */}
        <Section
          step={2}
          done={status !== ""}
          icon={<IdentificationCardIcon weight="duotone" aria-hidden className="size-4" />}
          title="Your student status"
        >
          <Prose size="note">
            This decides which document we ask you for, and whether we need a U.S. address.
          </Prose>
          <RadioGroup
            className="mt-2 grid grid-cols-3 gap-1.5 narrow:grid-cols-1"
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
            <p className="mt-1.5 text-micro font-medium text-danger-600">{errors.studentStatus}</p>
          ) : null}
        </Section>

        <Section
          step={3}
          done={documented}
          icon={<IdentificationBadgeIcon weight="duotone" aria-hidden className="size-4" />}
          title={status ? documentLabelFor(status as StudentStatus) : "Your identity document"}
          className={status ? undefined : "opacity-55"}
        >
          {status ? (
            <>
              <DocumentUpload
                tall
                label={documentLabelFor(status as StudentStatus)}
                files={who.idDocuments}
                onChange={(files: UploadedFile[]) => set({ idDocuments: files })}
              />
              {errors.idDocuments ? (
                <p className="mt-1.5 text-micro font-medium text-danger-600">
                  {errors.idDocuments}
                </p>
              ) : null}
            </>
          ) : (
            <Prose>Answer your student status above and we will ask for the right one.</Prose>
          )}
        </Section>
      </Sections>
    </StepShell>
  );
}
