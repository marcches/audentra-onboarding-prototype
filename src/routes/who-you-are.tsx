import {
  HouseLineIcon,
  IdentificationBadgeIcon,
  IdentificationCardIcon,
  LockSimpleIcon,
  SealCheckIcon,
  UserIcon,
} from "@phosphor-icons/react";
import * as React from "react";

import { PricePill, useCelebration } from "@/components/celebration";
import { DocumentUpload } from "@/components/document-upload";
import { Field, isPrefill, Prefilled, ReadOnlyField } from "@/components/field";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  citiesByState,
  countries,
  prefill,
  residencyVerificationOptions,
  studentRecord,
  studentStatusOptions,
  type UsStateCode,
  usStates,
} from "@/lib/fixtures";
import { type StudentStatus, stepById } from "@/lib/steps";
import { type OnboardingState, patch, type UploadedFile, useOnboarding } from "@/lib/store";
import { addressSchemaFor, documentLabelFor, whoYouAreSchema } from "@/lib/validation";

/**
 * Who you are: everything about *you*, on one screen.
 *
 * Laura described the defect the rebuild fixed exactly — *"a gente começou
 * falando de nome, falou de contato, aí voltou a falar de nome, falou de
 * contato de novo."* One subject per Step answered that, and the split that
 * followed was right about the disease and wrong about where the boundary
 * falls: it drew it around *fields*, which is how the permanent address came to
 * be a Quest of its own — two minutes of two fields, existing because an
 * earlier round needed somewhere to put an address that varies by Student
 * status.
 *
 * The boundary is around **subjects** (ADR 0011). Your name, your number, your
 * status, your document and your permanent address are one subject; the people
 * you nominate are another; health is a third. So this screen absorbed *Where
 * you live now*, and the status rule that made it a Step drops one level: the
 * address Sections are present for a U.S. citizen and a permanent resident, and
 * **absent** for an international student. Not shown and explained, not
 * disabled: absent, exactly as the Step was. Gusto's "Personal information" is
 * the precedent — preferred name, legal name, pronouns, phone and home address
 * in one step, with the agreement at its foot.
 *
 * The Step is drawn as a numbered checklist, each part checking itself off as
 * it is answered. The document is present and muted from the first frame rather
 * than appearing out of nowhere: a student can see the whole shape of what they
 * are about to do before they start, which is the difference between a form and
 * a task. It unlocks when Student status is answered, because **the request is
 * never generic** — the status decides which document is asked for, and asking
 * before knowing is how the old screen came to request "an identity document"
 * from everybody.
 *
 * The strip across the top is what Aster already holds. It is first because the
 * first question anybody has about a form is which parts of it are already
 * done, and it is the only collapsible thing here — closing something the
 * student cannot edit is the one case where a chevron earns its click.
 */
export function WhoYouAreRoute() {
  const state = useOnboarding();
  const who = state.whoYouAre;
  const live = state.whereYouLive;
  const award = useCelebration();
  const { goNext } = useStepNav("who-you-are");
  const step = stepById("who-you-are");

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const set = (changes: Partial<typeof who>) => patch("whoYouAre", changes);
  const setAddress = (changes: Partial<typeof live>) => patch("whereYouLive", changes);

  const status = who.studentStatus;
  const documented = who.idDocuments.length > 0;
  const reachable = who.phone.trim() !== "";

  /* The same seam as before, called from the Section rather than from a route
     of its own. `null` means the address is absent — and absent means it does
     not participate in validation at all, rather than being a hidden required
     field that blocks Continue with an error nobody can see. */
  const addressSchema = addressSchemaFor(status);
  const addressFilled = addressFieldsFilled(live);
  const addressDone = addressFilled === ADDRESS_FIELDS;
  const residencyDone = Boolean(live.residencyVerification);

  /* What the primary action narrates. It counts what is actually left, which
     for a citizen is two more things than for an international student
     (Deputy). */
  const missing =
    [!reachable, status === "", !documented].filter(Boolean).length +
    (addressSchema ? ADDRESS_FIELDS - addressFilled + (residencyDone ? 0 : 1) : 0);

  const submit = () => {
    const identity = whoYouAreSchema.safeParse({
      preferredName: who.preferredName,
      pronouns: who.pronouns,
      dialCode: who.dialCode,
      phone: who.phone,
      studentStatus: who.studentStatus,
      idDocuments: who.idDocuments,
    });
    const address = addressSchema?.safeParse({
      street: live.street,
      unit: live.unit,
      state: live.state,
      city: live.city,
      postalCode: live.postalCode,
      country: live.country,
      residencyVerification: live.residencyVerification,
    });

    if (!identity.success || address?.success === false) {
      const next: Record<string, string> = {};
      for (const issue of [...(identity.error?.issues ?? []), ...(address?.error?.issues ?? [])]) {
        const key = String(issue.path[0]);
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setErrors({});
    /* One flag for one screen. The address used to carry its own `submitted`
       and the two could disagree, which is how a screen comes to be
       half-saved. */
    patch("whoYouAre", { submitted: true });
    award?.celebrate("who-you-are", step.points);
  };

  const cities = live.state ? (citiesByState[live.state as UsStateCode] ?? []) : [];
  const cityLabel = cities.find((entry) => entry.value === live.city)?.label;
  const stateLabel = usStates.find((entry) => entry.value === live.state)?.label;

  /* **Prefill is a comparison, not a flag** (see `isPrefill`). A field is one
     exactly while its value is still the institution's own copy, so correcting
     it stops it claiming a provenance it no longer has and no stored marker can
     disagree with the value beside it.

     The address is one Prefill rather than five: the institution either holds
     an address or it does not, and confirming it is one decision. */
  const phonePrefilled =
    isPrefill(who.phone, prefill.phone) && isPrefill(who.dialCode, prefill.dialCode);
  const addressPrefilled = (["street", "city", "state", "postalCode", "country"] as const).every(
    (key) => isPrefill(live[key], prefill[key]),
  );
  const prefilledAddress = [live.street, cityLabel, stateLabel, live.postalCode]
    .filter(Boolean)
    .join(", ");
  const addressError = errors.street ?? errors.city ?? errors.state ?? errors.postalCode;

  return (
    <StepShell
      current="who-you-are"
      title="Who you are"
      lead="Your name as you want it used, a number we can reach you on, one document, and where you live."
      headerAside={<PricePill points={step.points} stepId="who-you-are" earned={who.submitted} />}
      guide={
        <StepGuide
          current="who-you-are"
          why="Aster already holds your legal name and your email. What is missing is how you want to be addressed, a number that reaches you, and proof of who you are."
          tasks={[
            { label: "A number we can reach you on", done: reachable },
            { label: "Your student status", done: status !== "" },
            { label: "The document it calls for", done: documented },
            ...(addressSchema
              ? [
                  { label: "Where you live now", done: addressDone },
                  { label: "How we should check it", done: residencyDone },
                ]
              : []),
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
      <Sections as="fieldset">
        {/* Spans the sheet: a two-field strip beside a full-height section
            leaves a hole where the other half of the row would have been. */}
        <Section
          collapsible
          icon={<LockSimpleIcon weight="bold" aria-hidden className="size-4" />}
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
          icon={<UserIcon weight="bold" aria-hidden className="size-4" />}
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
            {/* **Prefill.** Aster has a number for this student from the
                application, so their job is to confirm rather than to type —
                and the row says so instead of putting the value in an empty
                box and hoping they notice. The moment they change it, the
                comparison in `isPrefill` fails and it becomes an ordinary
                field: nothing stored says "prefilled", so nothing stored can
                disagree with the value beside it. */}
            {phonePrefilled ? (
              <Prefilled
                width="long"
                label="Mobile number"
                htmlFor="mobile"
                value={`${who.dialCode} ${who.phone}`}
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
              </Prefilled>
            ) : (
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
            )}
          </SectionFields>
        </Section>

        {/* The branching question. It says why it is asked, once (Remote), and
            each option carries its consequence in its own label (Fiverr). */}
        <Section
          step={2}
          done={status !== ""}
          icon={<IdentificationCardIcon weight="bold" aria-hidden className="size-4" />}
          title="Your student status"
        >
          <Prose size="note">
            This decides which document we ask you for, and whether we need a U.S. address.
          </Prose>
          <RadioGroup
            className="mt-2 grid grid-cols-3 gap-2 narrow:grid-cols-1"
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
            <p className="mt-2 text-meta font-medium text-danger-600">{errors.studentStatus}</p>
          ) : null}
        </Section>

        <Section
          step={3}
          done={documented}
          icon={<IdentificationBadgeIcon weight="bold" aria-hidden className="size-4" />}
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
                <p className="mt-2 text-meta font-medium text-danger-600">{errors.idDocuments}</p>
              ) : null}
            </>
          ) : (
            <Prose>Answer your student status above and we will ask for the right one.</Prose>
          )}
        </Section>

        {/* The two Sections that used to be a Step. Absent for an international
            student, who has no U.S. permanent address to give: "se não é
            residente ou cidadão dos Estados Unidos, não precisa de endereço, já
            arranca fora." */}
        {addressSchema ? (
          <Section
            step={4}
            done={addressDone}
            icon={<HouseLineIcon weight="bold" aria-hidden className="size-4" />}
            title="Your permanent address"
            count={[addressFilled, ADDRESS_FIELDS]}
            value={
              live.street
                ? [live.street, cityLabel, stateLabel, live.postalCode].filter(Boolean).join(", ")
                : undefined
            }
          >
            <Prose size="note" className="mb-2">
              This decides your residency classification, and it is where anything official goes. It
              is not where you will be living during term.
            </Prose>
            {/* **The whole address is one Prefill, not five.** The institution
                either holds an address for this student or it does not, and
                confirming it is one decision — so the confirmed state is one
                row where the form is five fields. That is where a mostly
                prefilled Step actually gets shorter: not by setting anything
                smaller, but by not drawing the machinery for an answer nobody
                has to give. `Change` opens the five fields underneath, with
                nothing above them moving. */}
            {addressPrefilled ? (
              <Prefilled
                width="full"
                label="Permanent address"
                value={prefilledAddress}
                error={addressError}
              >
                <SectionFields>
                  <Field width="long" label="Street address" htmlFor="street" error={errors.street}>
                    <Input
                      id="street"
                      autoComplete="address-line1"
                      value={live.street}
                      onChange={(event) => setAddress({ street: event.target.value })}
                    />
                  </Field>
                  <Field width="short" label="Apartment or unit" htmlFor="unit" optional>
                    <Input
                      id="unit"
                      autoComplete="address-line2"
                      value={live.unit}
                      onChange={(event) => setAddress({ unit: event.target.value })}
                    />
                  </Field>

                  {/* State and city are selects, and the city list is scoped to the
                  state. The review call asked for the dropdown explicitly, so
                  the registrar is not correcting free text. Changing the state
                  clears the city: a city that no longer belongs to the chosen
                  state is exactly the kind of well-formed nonsense a select
                  exists to prevent. */}
                  <Field width="short" label="State" htmlFor="state" error={errors.state}>
                    <Select
                      value={live.state}
                      onValueChange={(value) => setAddress({ state: value, city: "" })}
                    >
                      <SelectTrigger id="state" className="w-full">
                        <SelectValue placeholder="Choose your state" />
                      </SelectTrigger>
                      <SelectContent>
                        {usStates.map((entry) => (
                          <SelectItem key={entry.value} value={entry.value}>
                            {entry.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field width="short" label="City" htmlFor="city" error={errors.city}>
                    <Select
                      value={live.city}
                      onValueChange={(value) => setAddress({ city: value })}
                      disabled={!live.state}
                    >
                      <SelectTrigger id="city" className="w-full">
                        <SelectValue
                          placeholder={live.state ? "Choose your city" : "Choose a state first"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((entry) => (
                          <SelectItem key={entry.value} value={entry.value}>
                            {entry.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field width="short" label="ZIP code" htmlFor="postal" error={errors.postalCode}>
                    <Input
                      id="postal"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      value={live.postalCode}
                      onChange={(event) => setAddress({ postalCode: event.target.value })}
                    />
                  </Field>

                  <Field width="short" label="Country" htmlFor="country" error={errors.country}>
                    <Select
                      value={live.country}
                      onValueChange={(value) => setAddress({ country: value })}
                    >
                      <SelectTrigger id="country" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((entry) => (
                          <SelectItem key={entry.value} value={entry.value}>
                            {entry.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </SectionFields>
              </Prefilled>
            ) : (
              <SectionFields>
                <Field width="long" label="Street address" htmlFor="street" error={errors.street}>
                  <Input
                    id="street"
                    autoComplete="address-line1"
                    value={live.street}
                    onChange={(event) => setAddress({ street: event.target.value })}
                  />
                </Field>
                <Field width="short" label="Apartment or unit" htmlFor="unit" optional>
                  <Input
                    id="unit"
                    autoComplete="address-line2"
                    value={live.unit}
                    onChange={(event) => setAddress({ unit: event.target.value })}
                  />
                </Field>

                {/* State and city are selects, and the city list is scoped to the
                  state. The review call asked for the dropdown explicitly, so
                  the registrar is not correcting free text. Changing the state
                  clears the city: a city that no longer belongs to the chosen
                  state is exactly the kind of well-formed nonsense a select
                  exists to prevent. */}
                <Field width="short" label="State" htmlFor="state" error={errors.state}>
                  <Select
                    value={live.state}
                    onValueChange={(value) => setAddress({ state: value, city: "" })}
                  >
                    <SelectTrigger id="state" className="w-full">
                      <SelectValue placeholder="Choose your state" />
                    </SelectTrigger>
                    <SelectContent>
                      {usStates.map((entry) => (
                        <SelectItem key={entry.value} value={entry.value}>
                          {entry.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field width="short" label="City" htmlFor="city" error={errors.city}>
                  <Select
                    value={live.city}
                    onValueChange={(value) => setAddress({ city: value })}
                    disabled={!live.state}
                  >
                    <SelectTrigger id="city" className="w-full">
                      <SelectValue
                        placeholder={live.state ? "Choose your city" : "Choose a state first"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((entry) => (
                        <SelectItem key={entry.value} value={entry.value}>
                          {entry.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field width="short" label="ZIP code" htmlFor="postal" error={errors.postalCode}>
                  <Input
                    id="postal"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    value={live.postalCode}
                    onChange={(event) => setAddress({ postalCode: event.target.value })}
                  />
                </Field>

                <Field width="short" label="Country" htmlFor="country" error={errors.country}>
                  <Select
                    value={live.country}
                    onValueChange={(value) => setAddress({ country: value })}
                  >
                    <SelectTrigger id="country" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((entry) => (
                        <SelectItem key={entry.value} value={entry.value}>
                          {entry.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </SectionFields>
            )}
          </Section>
        ) : null}

        {addressSchema ? (
          <Section
            step={5}
            done={residencyDone}
            icon={<SealCheckIcon weight="bold" aria-hidden className="size-4" />}
            title="Residency check"
            value={
              residencyVerificationOptions.find(
                (option) => option.value === live.residencyVerification,
              )?.label
            }
          >
            <fieldset>
              <legend className="field-label">How should we check your residency?</legend>
              <RadioGroup
                className="mt-2 grid grid-cols-3 gap-2 narrow:grid-cols-1"
                value={live.residencyVerification}
                onValueChange={(value) => setAddress({ residencyVerification: value })}
              >
                {residencyVerificationOptions.map((option) => (
                  <OptionCard
                    key={option.value}
                    id={`residency-${option.value}`}
                    value={option.value}
                    label={option.label}
                    consequence={option.consequence}
                  />
                ))}
              </RadioGroup>
              {errors.residencyVerification ? (
                <p className="mt-2 text-meta font-medium text-danger-600">
                  {errors.residencyVerification}
                </p>
              ) : null}
            </fieldset>
          </Section>
        ) : null}
      </Sections>
    </StepShell>
  );
}

/** The address fields that count toward the Section's own counter. */
const ADDRESS_FIELDS = 5;

function addressFieldsFilled(live: OnboardingState["whereYouLive"]): number {
  return [live.street, live.state, live.city, live.postalCode, live.country].filter(
    (entry) => entry.trim() !== "",
  ).length;
}
