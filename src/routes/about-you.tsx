import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRightIcon,
  CheckIcon,
  HouseLineIcon,
  IdentificationCardIcon,
  LifebuoyIcon,
  PlusIcon,
  ShieldCheckIcon,
  SparkleIcon,
  TrashIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { type FieldErrors, useFieldArray, useForm } from "react-hook-form";

import { Field, ReadOnlyField } from "@/components/field";
import { IdUpload } from "@/components/id-upload";
import { Notice } from "@/components/notice";
import { OptionCard } from "@/components/option-card";
import { PhoneInput } from "@/components/phone-input";
import { ContextPanel, StepActions, StepShell } from "@/components/step-shell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  citiesByState,
  citizenshipOptions,
  countries,
  disclosureScopeOptions,
  institution,
  relationshipOptions,
  residencyVerificationOptions,
  studentRecord,
  type UsStateCode,
  usStates,
} from "@/lib/fixtures";
import { emptyEmergencyContact, newContactId, patch, useOnboarding } from "@/lib/store";
import { cn } from "@/lib/utils";
import { type AboutYouValues, aboutYouSchema } from "@/lib/validation";

type SectionId = "identity" | "residence" | "emergency" | "family";

const SECTION_ORDER: SectionId[] = ["identity", "residence", "emergency", "family"];

const SECTION_LABELS: Record<SectionId, string> = {
  identity: "Who you are",
  residence: "Where you live now",
  emergency: "Who we call in an emergency",
  family: "Who else can see your record",
};

/** Which accordion section owns each field, so a failed submit can open it. */
const FIELD_SECTIONS: Record<string, SectionId> = {
  preferredName: "identity",
  pronouns: "identity",
  phone: "identity",
  citizenship: "identity",
  street: "residence",
  unit: "residence",
  city: "residence",
  state: "residence",
  postalCode: "residence",
  country: "residence",
  residencyVerification: "residence",
  emergencyContacts: "emergency",
  grantsFamilyAccess: "family",
  familyMemberName: "family",
  familyMemberEmail: "family",
  familyMemberRelationship: "family",
  disclosureScope: "family",
};

/** What to ask for, given what the student just told us about their status. */
function idDocumentHint(citizenship: string) {
  switch (citizenship) {
    case "us-citizen":
      return "Passport.";
    case "permanent-resident":
      return "Driver's license (state-issued).";
    case "eligible-noncitizen":
      return "Permanent resident card, or other government-issued photo ID.";
    case "international":
      return "Passport of your country of citizenship.";
    default:
      return "Passport, national ID or driver's licence.";
  }
}

export function AboutYouRoute() {
  const state = useOnboarding();
  const navigate = useNavigate();

  const form = useForm<AboutYouValues>({
    resolver: zodResolver(aboutYouSchema),
    mode: "onBlur",
    defaultValues: {
      preferredName: state.aboutYou.preferredName,
      pronouns: state.aboutYou.pronouns,
      dialCode: state.aboutYou.dialCode,
      phone: state.aboutYou.phone,
      citizenship: state.aboutYou.citizenship,
      street: state.aboutYou.street,
      unit: state.aboutYou.unit,
      city: state.aboutYou.city,
      state: state.aboutYou.state,
      postalCode: state.aboutYou.postalCode,
      country: state.aboutYou.country,
      residencyVerification: state.aboutYou.residencyVerification,
      emergencyContacts: state.aboutYou.emergencyContacts,
      grantsFamilyAccess: state.aboutYou.grantsFamilyAccess,
      familyMemberName: state.aboutYou.familyMemberName,
      familyMemberEmail: state.aboutYou.familyMemberEmail,
      familyMemberRelationship: state.aboutYou.familyMemberRelationship,
      disclosureScope: state.aboutYou.disclosureScope,
    },
  });

  const { errors } = form.formState;

  // Autosave. Every keystroke lands in localStorage, which is the whole of
  // "your progress is saved automatically" without a backend.
  React.useEffect(() => {
    const subscription = form.watch((values) => {
      patch("aboutYou", values as Partial<AboutYouValues>);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const openSections = state.aboutYou.openSections;
  const setOpenSections = React.useCallback((next: string[]) => {
    patch("aboutYou", { openSections: next });
  }, []);

  const values = form.watch();
  const contacts = useFieldArray({ control: form.control, name: "emergencyContacts" });
  const [sectionsNeedingAttention, setSectionsNeedingAttention] = React.useState<SectionId[]>([]);

  /* International students have no U.S. permanent address to give — the whole
     block hides for that branch (below), and any address already typed before
     switching to it has to go with it. Otherwise a student who tries "U.S.
     citizen", fills the block in, then corrects to "International student"
     would carry a stale U.S. address into a step that no longer shows it, and
     it would resurface in the agreement. */
  const citizenship = values.citizenship;
  React.useEffect(() => {
    if (citizenship !== "international") return;
    form.setValue("street", "");
    form.setValue("unit", "");
    form.setValue("city", "");
    form.setValue("state", "");
    form.setValue("postalCode", "");
    form.setValue("residencyVerification", "");
  }, [citizenship, form.setValue]);

  /* The city select is scoped to the chosen state. A state change that leaves
     the previously chosen city off the new list has to clear it — otherwise
     the field keeps showing a city that belongs to whichever state used to be
     selected. */
  const selectedState = values.state;
  React.useEffect(() => {
    const validCities = citiesByState[selectedState as UsStateCode] ?? [];
    if (values.city && !validCities.some((city) => city.value === values.city)) {
      form.setValue("city", "");
    }
  }, [selectedState, values.city, form.setValue]);

  function handleValid() {
    setSectionsNeedingAttention([]);
    patch("aboutYou", { submitted: true });
    navigate({ to: "/onboarding/housing" });
  }

  /* A collapsed section hiding a validation error is the one way this pattern
     can go wrong. So a failed submit opens every section that has one, names
     them in a live region, and puts the keyboard on the first — otherwise the
     form just refuses to advance and the reason is somewhere off screen.

     React Hook Form's own focus-first-error cannot do this: it runs before the
     reopened accordion content is mounted, so it finds nothing to focus. */
  function handleInvalid(invalid: FieldErrors<AboutYouValues>) {
    const failing = new Set(openSections);
    const named: SectionId[] = [];
    for (const key of Object.keys(invalid)) {
      const section = FIELD_SECTIONS[key];
      if (!section) continue;
      failing.add(section);
      if (!named.includes(section)) named.push(section);
    }
    named.sort((a, b) => SECTION_ORDER.indexOf(a) - SECTION_ORDER.indexOf(b));
    setOpenSections([...failing]);
    setSectionsNeedingAttention(named);

    const target = named[0];
    if (!target) return;
    // Wait for the accordion to finish opening before moving into it.
    window.setTimeout(() => {
      const section = document.getElementById(`section-${target}`);
      section?.scrollIntoView({ block: "start" });
      section?.querySelector<HTMLElement>("[data-slot=accordion-trigger]")?.focus();
    }, 260);
  }

  /**
   * Which sections are done, asked of the schema rather than re-derived here.
   *
   * A hand-rolled copy of these rules is a second source of truth that drifts
   * the moment either side changes, and it had already drifted: the family
   * check tested only the name, while `superRefine` also requires a valid email
   * and at least one disclosure area — so the panel showed a green tick and
   * "all four sections are filled in" on a form that then refused to submit.
   * Parsing the live values means a section is complete exactly when nothing in
   * it would block Continue, by construction.
   */
  const sectionStatus = React.useMemo(() => {
    const parsed = aboutYouSchema.safeParse(values);
    const status: Record<SectionId, "done" | "needed"> = {
      identity: "done",
      residence: "done",
      emergency: "done",
      family: "done",
    };
    if (parsed.success) return status;
    for (const issue of parsed.error.issues) {
      const section = FIELD_SECTIONS[String(issue.path[0] ?? "")];
      if (section) status[section] = "needed";
    }
    return status;
  }, [values]);

  const identityNote = state.aboutYou.idExtracted
    ? "Read from the document you uploaded and checked against your application. The Registrar changes this, not you."
    : "From your application. The Registrar changes this, not you.";

  return (
    <StepShell
      current="about-you"
      title="About you"
      lead="Who you are, where you live, who we call in an emergency, and who else may see your record. Open a section to fill it in."
      context={
        <SectionIndex
          status={sectionStatus}
          onOpen={(section) => {
            if (!openSections.includes(section)) setOpenSections([...openSections, section]);
            window.setTimeout(() => {
              document.getElementById(`section-${section}`)?.scrollIntoView({ block: "start" });
            }, 60);
          }}
        />
      }
    >
      <form
        onSubmit={form.handleSubmit(handleValid, handleInvalid)}
        noValidate
        className="space-y-6"
      >
        <Accordion
          type="multiple"
          value={openSections}
          onValueChange={setOpenSections}
          className="gap-3"
        >
          {/* 1 — Identity */}
          <AccordionItem value="identity" id="section-identity" className="scroll-mt-20">
            <AccordionTrigger>
              <SectionHeader
                icon={<IdentificationCardIcon weight="duotone" />}
                title="Who you are"
                summary="Citizenship · legal name · date of birth · what we call you"
                status={sectionStatus.identity}
              />
            </AccordionTrigger>
            <AccordionContent className="space-y-5">
              {/* Citizenship leads the section now: it decides what document to
                  ask for below and whether the next section's address block
                  applies at all, so it has to be answered before either of the
                  things it gates renders. */}
              <Field
                label="Citizenship or student status"
                htmlFor="citizenship"
                hint="This decides which financial aid and visa steps open later, and what we ask for below."
                error={errors.citizenship?.message}
              >
                <Select
                  value={values.citizenship}
                  onValueChange={(value) =>
                    form.setValue("citizenship", value, { shouldValidate: true })
                  }
                >
                  <SelectTrigger id="citizenship" aria-invalid={Boolean(errors.citizenship)}>
                    <SelectValue placeholder="Choose one" />
                  </SelectTrigger>
                  <SelectContent>
                    {citizenshipOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <IdUpload
                files={state.aboutYou.idDocuments}
                extracted={state.aboutYou.idExtracted}
                documentHint={idDocumentHint(values.citizenship)}
                /* Removing the last file takes the extraction with it. The
                   success notice and the "read from the document you uploaded"
                   note on every locked field both claim provenance from a file
                   that is no longer attached, and both persist. */
                onChange={(files) =>
                  patch("aboutYou", {
                    idDocuments: files,
                    ...(files.length === 0 ? { idExtracted: false } : {}),
                  })
                }
                /* The extraction marks the identity fields as corroborated by
                   the document and stops there.
                   It emphatically does not guess at citizenship. An earlier
                   version filled that select with "U.S. citizen" for any
                   accepted file, which meant an international student who
                   uploaded a foreign passport and did not scroll back could
                   sign an agreement whose clause 3 asserted, in the bold this
                   document uses to mark the student's own answers, a legal
                   status they never chose. A simulated read may confirm what is
                   already on record; it may not invent a fact about someone. */
                onExtracted={() => patch("aboutYou", { idExtracted: true })}
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <ReadOnlyField
                  label="Legal first name"
                  value={studentRecord.legalFirstName}
                  note={identityNote}
                />
                <ReadOnlyField
                  label="Legal last name"
                  value={studentRecord.legalLastName}
                  note={identityNote}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <ReadOnlyField
                  label="Date of birth"
                  value={new Date(`${studentRecord.dateOfBirth}T00:00:00`).toLocaleDateString(
                    "en-US",
                    { month: "long", day: "numeric", year: "numeric" },
                  )}
                  note={identityNote}
                />
                <ReadOnlyField
                  label="Email on record"
                  value={studentRecord.personalEmail}
                  note="Change this in your profile once you're through onboarding."
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Preferred name"
                  htmlFor="preferred-name"
                  optional
                  hint={`What you would like us to call you. Defaults to ${studentRecord.legalFirstName}.`}
                  error={errors.preferredName?.message}
                >
                  <Input
                    id="preferred-name"
                    placeholder={studentRecord.legalFirstName}
                    aria-invalid={Boolean(errors.preferredName)}
                    {...form.register("preferredName")}
                  />
                </Field>

                <Field
                  label="Pronouns"
                  htmlFor="pronouns"
                  optional
                  error={errors.pronouns?.message}
                >
                  <Input
                    id="pronouns"
                    placeholder="they/them"
                    aria-invalid={Boolean(errors.pronouns)}
                    {...form.register("pronouns")}
                  />
                </Field>
              </div>

              {/* Compacted to one row plus one line of helper text — no
                  standing label block above it. The dial code and number sit
                  side by side, exactly as `PhoneInput` already lays them out;
                  what changed is only what wraps them. */}
              <div className="flex flex-col gap-1.5">
                <PhoneInput
                  id="about-phone"
                  aria-label="Mobile number"
                  aria-describedby="about-phone-hint"
                  dialCode={values.dialCode}
                  onDialCodeChange={(value) =>
                    form.setValue("dialCode", value, { shouldDirty: true })
                  }
                  invalid={Boolean(errors.phone)}
                  {...form.register("phone")}
                />
                <p id="about-phone-hint" className="text-small text-ink-500">
                  Mobile number, optional — we use this for reminders only if you choose text.
                </p>
                {errors.phone?.message ? (
                  <p className="flex items-start gap-1.5 text-small font-medium text-danger-600">
                    <WarningCircleIcon
                      weight="fill"
                      aria-hidden
                      className="mt-0.5 size-4 shrink-0"
                    />
                    <span>{errors.phone.message}</span>
                  </p>
                ) : null}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 2 — Permanent address and residency */}
          <AccordionItem value="residence" id="section-residence" className="scroll-mt-20">
            <AccordionTrigger>
              <SectionHeader
                icon={<HouseLineIcon weight="duotone" />}
                title="Where you live now"
                summary="Permanent address · how we check your residency"
                status={sectionStatus.residence}
              />
            </AccordionTrigger>
            <AccordionContent className="space-y-5">
              {values.citizenship === "international" ? (
                /* No U.S. permanent address to give, so nothing to ask for.
                   The section stays in the accordion rather than disappearing
                   outright — it still has to say why it's short. */
                <p className="text-body text-ink-600">
                  International students skip this section. Enrollment Services uses your visa and
                  passport details instead of a U.S. permanent address — there's nothing to fill in
                  here.
                </p>
              ) : (
                <>
                  {/* Required, and this line is why. The address decides your
                      residency classification, which decides what you are charged,
                      and it is where official post goes — the reason survived the
                      rewrite even though the "all optional" claim above it did
                      not. */}
                  <p className="text-body text-ink-600">
                    Your permanent address decides your residency classification, which affects your
                    tuition, and it is where official post goes.
                  </p>

                  <div className="grid gap-5 sm:grid-cols-[2fr_1fr]">
                    <Field label="Street address" htmlFor="street" error={errors.street?.message}>
                      <Input
                        id="street"
                        autoComplete="address-line1"
                        aria-invalid={Boolean(errors.street)}
                        {...form.register("street")}
                      />
                    </Field>
                    <Field label="Apartment or unit" htmlFor="unit" optional>
                      <Input id="unit" autoComplete="address-line2" {...form.register("unit")} />
                    </Field>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-3">
                    <Field label="State" htmlFor="state" error={errors.state?.message}>
                      <Select
                        value={values.state}
                        onValueChange={(value) =>
                          form.setValue("state", value, { shouldValidate: true })
                        }
                      >
                        <SelectTrigger id="state" aria-invalid={Boolean(errors.state)}>
                          <SelectValue placeholder="Choose one" />
                        </SelectTrigger>
                        <SelectContent>
                          {usStates.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="City" htmlFor="city" error={errors.city?.message}>
                      <Select
                        value={values.city}
                        disabled={!values.state}
                        onValueChange={(value) =>
                          form.setValue("city", value, { shouldValidate: true })
                        }
                      >
                        <SelectTrigger id="city" aria-invalid={Boolean(errors.city)}>
                          <SelectValue
                            placeholder={values.state ? "Choose one" : "Choose a state first"}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {(citiesByState[values.state as UsStateCode] ?? []).map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field
                      label="ZIP or postal code"
                      htmlFor="postal-code"
                      error={errors.postalCode?.message}
                    >
                      <Input
                        id="postal-code"
                        autoComplete="postal-code"
                        aria-invalid={Boolean(errors.postalCode)}
                        {...form.register("postalCode")}
                      />
                    </Field>
                  </div>

                  <Field
                    label="Country"
                    htmlFor="country"
                    className="sm:max-w-xs"
                    error={errors.country?.message}
                  >
                    <Select
                      value={values.country}
                      onValueChange={(value) =>
                        form.setValue("country", value, { shouldValidate: true })
                      }
                    >
                      <SelectTrigger id="country" aria-invalid={Boolean(errors.country)}>
                        <SelectValue placeholder="Choose one" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.value} value={country.value}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <fieldset className="space-y-3">
                    <legend className="field-label mb-2">
                      How Enrollment Services should review your residency classification
                    </legend>
                    <RadioGroup
                      value={values.residencyVerification}
                      onValueChange={(value) => form.setValue("residencyVerification", value)}
                    >
                      {residencyVerificationOptions.map((option) => (
                        <OptionCard
                          key={option.value}
                          value={option.value}
                          id={`residency-${option.value}`}
                          label={option.label}
                          hint={option.hint}
                        />
                      ))}
                    </RadioGroup>
                    {/* Empty state, per the Message Library rule: why it is empty,
                        and what fills it. */}
                    <p className="text-small text-ink-500">
                      {values.residencyVerification
                        ? "Enrollment Services will review this and contact you if anything is needed."
                        : "Review path not selected. Choose one, or leave it and Enrollment Services will pick a path and tell you."}
                    </p>
                  </fieldset>
                </>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* 3 — Emergency contacts (was its own step) */}
          <AccordionItem value="emergency" id="section-emergency" className="scroll-mt-20">
            <AccordionTrigger>
              <SectionHeader
                icon={<LifebuoyIcon weight="duotone" />}
                title="Who we call in an emergency"
                summary={`${values.emergencyContacts?.length ?? 1} ${
                  (values.emergencyContacts?.length ?? 1) === 1 ? "person" : "people"
                } · name, relationship, number`}
                status={sectionStatus.emergency}
              />
            </AccordionTrigger>
            <AccordionContent className="space-y-5">
              <p className="text-body text-ink-600">
                One person is enough. They get no access to your record — that is the next section.
              </p>

              {contacts.fields.map((contactField, index) => (
                <div
                  key={contactField.id}
                  className="space-y-5 rounded-[var(--radius-card)] border border-ink-100 bg-ink-50/50 p-4 sm:p-5"
                >
                  <div className="flex items-center justify-between">
                    <p className="field-label">Contact {index + 1}</p>
                    {contacts.fields.length > 1 ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => contacts.remove(index)}
                      >
                        <TrashIcon aria-hidden className="size-4" />
                        Remove
                      </Button>
                    ) : null}
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label="Full name"
                      htmlFor={`contact-name-${index}`}
                      error={errors.emergencyContacts?.[index]?.fullName?.message}
                    >
                      <Input
                        id={`contact-name-${index}`}
                        aria-invalid={Boolean(errors.emergencyContacts?.[index]?.fullName)}
                        {...form.register(`emergencyContacts.${index}.fullName`)}
                      />
                    </Field>

                    <Field
                      label="How you know them"
                      htmlFor={`contact-relationship-${index}`}
                      error={errors.emergencyContacts?.[index]?.relationship?.message}
                    >
                      <Select
                        value={values.emergencyContacts?.[index]?.relationship ?? ""}
                        onValueChange={(value) =>
                          form.setValue(`emergencyContacts.${index}.relationship`, value, {
                            shouldValidate: true,
                          })
                        }
                      >
                        <SelectTrigger
                          id={`contact-relationship-${index}`}
                          aria-invalid={Boolean(errors.emergencyContacts?.[index]?.relationship)}
                        >
                          <SelectValue placeholder="Choose one" />
                        </SelectTrigger>
                        <SelectContent>
                          {relationshipOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>

                  <Field
                    label="Mobile number"
                    htmlFor={`contact-phone-${index}`}
                    error={errors.emergencyContacts?.[index]?.phone?.message}
                  >
                    <PhoneInput
                      id={`contact-phone-${index}`}
                      dialCode={values.emergencyContacts?.[index]?.dialCode ?? "+1"}
                      onDialCodeChange={(value) =>
                        form.setValue(`emergencyContacts.${index}.dialCode`, value)
                      }
                      invalid={Boolean(errors.emergencyContacts?.[index]?.phone)}
                      {...form.register(`emergencyContacts.${index}.phone`)}
                    />
                  </Field>
                </div>
              ))}

              <Button
                type="button"
                variant="secondary"
                /* An id derived from the array length collides with a
                   surviving contact as soon as anyone removes a row. */
                onClick={() => contacts.append(emptyEmergencyContact(newContactId()))}
              >
                <PlusIcon weight="bold" aria-hidden className="size-4" />
                Add another person
              </Button>
            </AccordionContent>
          </AccordionItem>

          {/* 4 — Family access / FERPA (was its own step) */}
          <AccordionItem value="family" id="section-family" className="scroll-mt-20">
            <AccordionTrigger>
              <SectionHeader
                icon={<ShieldCheckIcon weight="duotone" />}
                title="Who else can see your record"
                summary={
                  values.grantsFamilyAccess
                    ? `${values.familyMemberName || "One person"} · ${values.disclosureScope?.length ?? 0} area(s)`
                    : "Nobody, unless you say so"
                }
                status={sectionStatus.family}
              />
            </AccordionTrigger>
            <AccordionContent className="space-y-5">
              <p className="text-body text-ink-600">
                Choose who can see your record and what they can see. You can change or remove this
                at any time.
              </p>

              <label
                htmlFor="grant-family-access"
                className={cn(
                  "flex cursor-pointer items-start gap-3.5 rounded-[var(--radius-card)] border p-4 transition-colors",
                  values.grantsFamilyAccess
                    ? "border-violet-500 bg-violet-50/50"
                    : "border-ink-200 bg-surface hover:border-ink-300",
                )}
              >
                <Checkbox
                  id="grant-family-access"
                  className="mt-0.5"
                  checked={values.grantsFamilyAccess}
                  onCheckedChange={(checked) =>
                    form.setValue("grantsFamilyAccess", checked === true, { shouldValidate: true })
                  }
                />
                <span className="flex flex-col gap-0.5">
                  <span className="text-body font-bold text-ink-900">
                    Give someone access to part of my record
                  </span>
                  <span className="text-small text-ink-500">
                    They get an email explaining how to sign in.
                  </span>
                </span>
              </label>

              {values.grantsFamilyAccess ? (
                <div className="space-y-5 rounded-[var(--radius-card)] border border-ink-100 bg-ink-50/50 p-4 sm:p-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label="Their name"
                      htmlFor="family-name"
                      error={errors.familyMemberName?.message}
                    >
                      <Input
                        id="family-name"
                        aria-invalid={Boolean(errors.familyMemberName)}
                        {...form.register("familyMemberName")}
                      />
                    </Field>
                    <Field
                      label="Their email"
                      htmlFor="family-email"
                      error={errors.familyMemberEmail?.message}
                    >
                      <Input
                        id="family-email"
                        type="email"
                        aria-invalid={Boolean(errors.familyMemberEmail)}
                        {...form.register("familyMemberEmail")}
                      />
                    </Field>
                    {/* Same options as an emergency contact's relationship —
                        one vocabulary for "how you know them" everywhere it's
                        asked, rather than a second list that can say something
                        slightly different. */}
                    <Field
                      label="Their relationship to you"
                      htmlFor="family-relationship"
                      error={errors.familyMemberRelationship?.message}
                      className="sm:col-span-2 sm:max-w-xs"
                    >
                      <Select
                        value={values.familyMemberRelationship}
                        onValueChange={(value) =>
                          form.setValue("familyMemberRelationship", value, {
                            shouldValidate: true,
                          })
                        }
                      >
                        <SelectTrigger
                          id="family-relationship"
                          aria-invalid={Boolean(errors.familyMemberRelationship)}
                        >
                          <SelectValue placeholder="Choose one" />
                        </SelectTrigger>
                        <SelectContent>
                          {relationshipOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>

                  <fieldset>
                    <legend className="field-label mb-3">Exactly what they can see</legend>
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {disclosureScopeOptions.map((option) => {
                        const checked = values.disclosureScope?.includes(option.value) ?? false;
                        return (
                          <label
                            key={option.value}
                            htmlFor={`scope-${option.value}`}
                            className="flex cursor-pointer items-center gap-3 rounded-[var(--radius-field)] border border-ink-200 bg-surface px-3.5 py-3 transition-colors hover:border-ink-300"
                          >
                            <Checkbox
                              id={`scope-${option.value}`}
                              checked={checked}
                              onCheckedChange={(next) => {
                                const current = values.disclosureScope ?? [];
                                form.setValue(
                                  "disclosureScope",
                                  next === true
                                    ? [...current, option.value]
                                    : current.filter((item) => item !== option.value),
                                  { shouldValidate: true },
                                );
                              }}
                            />
                            <span className="text-body text-ink-800">{option.label}</span>
                          </label>
                        );
                      })}
                    </div>
                    {errors.disclosureScope?.message ? (
                      <p className="mt-2 text-small font-medium text-danger-600">
                        {errors.disclosureScope.message}
                      </p>
                    ) : null}
                  </fieldset>
                </div>
              ) : (
                <Notice tone="success" title="No one else has access to your record">
                  You can grant access any time from your profile.
                </Notice>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {sectionsNeedingAttention.length > 0 ? (
          <Notice alert tone="caution" title="A couple of things still need you">
            Nothing was lost. Check{" "}
            {sectionsNeedingAttention.map((section) => SECTION_LABELS[section]).join(" and ")} — the
            section{sectionsNeedingAttention.length > 1 ? "s are" : " is"} open above with the
            problem marked.
          </Notice>
        ) : null}

        <StepActions>
          <Button type="submit" size="lg">
            Next: housing
            <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
          </Button>
        </StepActions>
      </form>
    </StepShell>
  );
}

/**
 * The fixed column: the four sections and which of them still need you.
 *
 * Not a duplicate of the accordion headers — it is the one view of the step
 * that survives scrolling past section three, and it answers "how much of this
 * is left" without collapsing anything to find out.
 */
function SectionIndex({
  status,
  onOpen,
}: {
  status: Record<SectionId, "done" | "needed">;
  onOpen: (section: SectionId) => void;
}) {
  const remaining = SECTION_ORDER.filter((section) => status[section] === "needed").length;

  return (
    <ContextPanel
      sticky
      title="This step"
      description={
        remaining === 0
          ? "All four sections are filled in."
          : `${remaining} of 4 sections still need you.`
      }
    >
      <ol className="space-y-1">
        {SECTION_ORDER.map((section, index) => {
          const done = status[section] === "done";
          return (
            <li key={section}>
              <button
                type="button"
                onClick={() => onOpen(section)}
                className="flex w-full items-center gap-3 rounded-[var(--radius-field)] px-2 py-2 text-left transition-colors hover:bg-ink-50"
              >
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full border text-micro font-bold",
                    done
                      ? "border-mint-500 bg-mint-500 text-white"
                      : "border-ink-200 bg-surface text-ink-400",
                  )}
                >
                  {done ? <CheckIcon weight="bold" aria-hidden className="size-3.5" /> : index + 1}
                </span>
                <span className="flex-1 text-body text-ink-800">{SECTION_LABELS[section]}</span>
                {done ? null : (
                  <span className="text-micro font-bold tracking-[0.06em] text-violet-600 uppercase">
                    Needs you
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>

      <p className="border-t border-ink-100 pt-4 text-small text-ink-500">
        Anything wrong on a locked field? Write to {institution.admissionsEmail} and the Registrar
        will fix it.
      </p>
    </ContextPanel>
  );
}

function SectionHeader({
  icon,
  title,
  summary,
  status,
}: {
  icon: React.ReactNode;
  title: string;
  summary: string;
  status: "done" | "needed";
}) {
  return (
    <span className="flex flex-1 items-start gap-4">
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-[12px] [&_svg]:size-5",
          status === "done" ? "bg-mint-50 text-mint-600" : "bg-violet-50 text-violet-600",
        )}
      >
        {icon}
      </span>
      <span className="flex flex-1 flex-col gap-0.5">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-h3 text-ink-900">{title}</span>
          <StatusPill status={status} />
        </span>
        {/* The collapsed state still says what is inside. A closed section that
            reads only as a title makes people open all four to find out. */}
        <span className="text-small text-ink-500">{summary}</span>
      </span>
    </span>
  );
}

function StatusPill({ status }: { status: "done" | "needed" }) {
  if (status === "done") {
    return (
      <span className="inline-flex items-center gap-1 rounded-[var(--radius-pill)] bg-mint-50 px-2 py-0.5 text-micro font-bold tracking-[0.06em] text-mint-700 uppercase">
        <CheckIcon weight="bold" aria-hidden className="size-3" />
        Done
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-[var(--radius-pill)] bg-violet-50 px-2 py-0.5 text-micro font-bold tracking-[0.06em] text-violet-700 uppercase">
      <SparkleIcon weight="fill" aria-hidden className="size-3" />
      Needs you
    </span>
  );
}
