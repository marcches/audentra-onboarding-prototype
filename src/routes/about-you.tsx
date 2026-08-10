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
} from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { type FieldErrors, useFieldArray, useForm } from "react-hook-form";

import { Field, ReadOnlyField } from "@/components/field";
import { Notice } from "@/components/notice";
import { OptionCard } from "@/components/option-card";
import { PhoneInput } from "@/components/phone-input";
import { StepActions, StepShell } from "@/components/step-shell";
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
  citizenshipOptions,
  countries,
  disclosureScopeOptions,
  institution,
  relationshipOptions,
  residencyVerificationOptions,
  studentRecord,
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
  disclosureScope: "family",
};

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

  const identityDone = Boolean(values.citizenship);
  const emergencyDone = values.emergencyContacts?.every(
    (contact) => contact.fullName && contact.relationship && contact.phone,
  );

  return (
    <StepShell
      current="about-you"
      title="About you"
      lead={
        <>
          Four things in one place: who you are, where you live, who we call in an emergency, and
          who else may see your record. Open what you need — the rest can wait.
        </>
      }
    >
      <form
        onSubmit={form.handleSubmit(handleValid, handleInvalid)}
        noValidate
        className="space-y-8"
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
                summary="Legal name · date of birth · what we call you · citizenship"
                status={identityDone ? "done" : "needed"}
              />
            </AccordionTrigger>
            <AccordionContent className="space-y-6">
              <Notice tone="info" title="Quick fill from your ID">
                Upload a passport, national ID or driver's licence and EDward reads it, finds the
                portrait, and prepares a private preview for you to check.{" "}
                <em className="text-ink-500 not-italic">
                  Not wired up in this prototype — the fields below are already filled from your
                  application.
                </em>
              </Notice>

              <div className="grid gap-5 sm:grid-cols-2">
                <ReadOnlyField
                  label="Legal first name"
                  value={studentRecord.legalFirstName}
                  note="From your application. The Registrar changes this, not you."
                />
                <ReadOnlyField
                  label="Legal last name"
                  value={studentRecord.legalLastName}
                  note="From your application. The Registrar changes this, not you."
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <ReadOnlyField
                  label="Date of birth"
                  value={new Date(`${studentRecord.dateOfBirth}T00:00:00`).toLocaleDateString(
                    "en-US",
                    { month: "long", day: "numeric", year: "numeric" },
                  )}
                />
                <ReadOnlyField
                  label="Email on record"
                  value={studentRecord.personalEmail}
                  note="Change this in your profile once you're through onboarding."
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="What should we call you?"
                  htmlFor="preferred-name"
                  optional
                  hint={`Defaults to ${studentRecord.legalFirstName}.`}
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

              <Field
                label="Mobile number"
                htmlFor="about-phone"
                optional
                hint="Only used for enrollment reminders, and only if you ask for them."
                error={errors.phone?.message}
              >
                <PhoneInput
                  id="about-phone"
                  dialCode={values.dialCode}
                  onDialCodeChange={(value) =>
                    form.setValue("dialCode", value, { shouldDirty: true })
                  }
                  invalid={Boolean(errors.phone)}
                  {...form.register("phone")}
                />
              </Field>

              <Field
                label="Citizenship or student status"
                htmlFor="citizenship"
                hint="This decides which financial aid and visa steps show up later."
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
            </AccordionContent>
          </AccordionItem>

          {/* 2 — Permanent address and residency */}
          <AccordionItem value="residence" id="section-residence" className="scroll-mt-20">
            <AccordionTrigger>
              <SectionHeader
                icon={<HouseLineIcon weight="duotone" />}
                title="Where you live now"
                summary="Permanent address · how we check your residency"
                status="optional"
              />
            </AccordionTrigger>
            <AccordionContent className="space-y-6">
              <p className="text-body text-ink-600">
                All optional. It only matters for post that has to reach you and for your residency
                classification, which affects tuition.
              </p>

              <div className="grid gap-5 sm:grid-cols-[2fr_1fr]">
                <Field label="Street address" htmlFor="street" optional>
                  <Input id="street" autoComplete="address-line1" {...form.register("street")} />
                </Field>
                <Field label="Apartment or unit" htmlFor="unit" optional>
                  <Input id="unit" autoComplete="address-line2" {...form.register("unit")} />
                </Field>
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <Field label="City" htmlFor="city" optional>
                  <Input id="city" autoComplete="address-level2" {...form.register("city")} />
                </Field>
                <Field label="State or province" htmlFor="state" optional>
                  <Input id="state" autoComplete="address-level1" {...form.register("state")} />
                </Field>
                <Field label="ZIP or postal code" htmlFor="postal-code" optional>
                  <Input
                    id="postal-code"
                    autoComplete="postal-code"
                    {...form.register("postalCode")}
                  />
                </Field>
              </div>

              <Field label="Country" htmlFor="country" optional className="sm:max-w-xs">
                <Select
                  value={values.country}
                  onValueChange={(value) => form.setValue("country", value)}
                >
                  <SelectTrigger id="country">
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
                <legend className="field-label mb-2">How should we check your residency?</legend>
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
                <p className="text-small text-ink-500">
                  Leave it blank and Enrollment Services will pick a path and tell you.
                </p>
              </fieldset>
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
                status={emergencyDone ? "done" : "needed"}
              />
            </AccordionTrigger>
            <AccordionContent className="space-y-6">
              <p className="text-body text-ink-600">
                One person is enough. They aren't given access to anything — that's the next
                section.
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
                status="optional"
              />
            </AccordionTrigger>
            <AccordionContent className="space-y-6">
              <p className="text-body text-ink-600">
                Right now nobody but you can see your record. If you want a parent, guardian or
                supporter to see part of it, name them here. You pick exactly what they get, and you
                can take it back at any time.
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
                <Notice tone="success" title="Nobody else has access">
                  That's the default and it's a perfectly good answer. You can grant access later
                  from your profile.
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

        <p className="text-small text-ink-500">
          Anything wrong on a locked field? Write to {institution.admissionsEmail} and the Registrar
          will fix it.
        </p>
      </form>
    </StepShell>
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
  status: "done" | "needed" | "optional";
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

function StatusPill({ status }: { status: "done" | "needed" | "optional" }) {
  if (status === "done") {
    return (
      <span className="inline-flex items-center gap-1 rounded-[var(--radius-pill)] bg-mint-50 px-2 py-0.5 text-micro font-bold tracking-[0.06em] text-mint-700 uppercase">
        <CheckIcon weight="bold" aria-hidden className="size-3" />
        Done
      </span>
    );
  }

  if (status === "optional") {
    return (
      <span className="inline-flex items-center gap-1 rounded-[var(--radius-pill)] bg-ink-100 px-2 py-0.5 text-micro font-bold tracking-[0.06em] text-ink-500 uppercase">
        Optional
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
