import { HouseLineIcon, MapPinIcon, SealCheckIcon } from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";
import * as React from "react";

import { PricePill, useCelebration } from "@/components/celebration";
import { Field } from "@/components/field";
import { OptionCard } from "@/components/option-card";
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
  residencyVerificationOptions,
  type UsStateCode,
  usStates,
} from "@/lib/fixtures";
import { stepById } from "@/lib/steps";
import { patch, useOnboarding } from "@/lib/store";
import { addressSchemaFor } from "@/lib/validation";

/**
 * Where you live now, for the students it applies to.
 *
 * For an international student this Step **does not exist**. Not shown and
 * explained, not skipped in the rail: absent, from `steps.ts` outward. Laura on
 * the call: *"se não é residente ou cidadão dos Estados Unidos, não precisa de
 * endereço, já arranca fora."*
 *
 * The schema branches with it. `addressSchemaFor("international")` returns
 * `null` rather than a schema of optional fields, because a hidden required
 * field that blocks Continue with an error nobody can see is the worst version
 * of this.
 *
 * "Why we ask" used to be a second framed column beside the form, which is a
 * third of the width spent on four sentences nobody reads twice. It is now a
 * closed Section: the one line that answers the question is on its header, and
 * the paragraph is a click away for the student who wants it.
 */
export function WhereYouLiveRoute() {
  const state = useOnboarding();
  const live = state.whereYouLive;
  const status = state.whoYouAre.studentStatus;
  const navigate = useNavigate();
  const award = useCelebration();
  const { goNext } = useStepNav("where-you-live");
  const step = stepById("where-you-live");

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const schema = addressSchemaFor(status);

  /* Landing here after switching to "international" — from a bookmark, or from
     the Review summary's edit link written before the switch — is the one way
     to reach a Step the spine says does not exist. Leave rather than render it. */
  React.useEffect(() => {
    if (!schema) navigate({ to: "/onboarding/who-we-call", replace: true });
  }, [schema, navigate]);

  if (!schema) return null;

  const set = (changes: Partial<typeof live>) => patch("whereYouLive", changes);

  const cities = live.state ? (citiesByState[live.state as UsStateCode] ?? []) : [];

  const filled = [live.street, live.state, live.city, live.postalCode, live.country].filter(
    (entry) => entry.trim() !== "",
  ).length;
  const missing = 5 - filled + (live.residencyVerification ? 0 : 1);

  const submit = () => {
    const result = schema.safeParse({
      street: live.street,
      unit: live.unit,
      state: live.state,
      city: live.city,
      postalCode: live.postalCode,
      country: live.country,
      residencyVerification: live.residencyVerification,
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
    patch("whereYouLive", { submitted: true });
    award?.celebrate("where-you-live", step.points);
  };

  const cityLabel = cities.find((entry) => entry.value === live.city)?.label;
  const stateLabel = usStates.find((entry) => entry.value === live.state)?.label;

  return (
    <StepShell
      current="where-you-live"
      title="Where you live now"
      lead="Your permanent address, which decides your residency classification and where official post goes."
      headerAside={
        <PricePill points={step.points} stepId="where-you-live" earned={live.submitted} />
      }
      guide={
        <StepGuide
          current="where-you-live"
          why="Your permanent address decides your residency classification, which decides your tuition rate. It is also where anything official goes — your enrolment confirmation and your first bill. It is not where you will live during term."
          tasks={[
            { label: "Where you live now", done: filled === 5 },
            { label: "How we should check it", done: Boolean(live.residencyVerification) },
          ]}
        />
      }
      actions={
        <>
          <BackButton current="where-you-live" />
          {live.submitted ? (
            <ContinueAction label="Continue" onClick={goNext} />
          ) : (
            <ContinueAction remaining={missing} label="Save and continue" onClick={submit} />
          )}
        </>
      }
    >
      <Sections as="fieldset" signature>
        <Section
          step={1}
          done={filled === 5}
          icon={<HouseLineIcon weight="duotone" aria-hidden className="size-4" />}
          title="Your permanent address"
          count={[filled, 5]}
          value={
            live.street
              ? [live.street, cityLabel, stateLabel, live.postalCode].filter(Boolean).join(", ")
              : undefined
          }
        >
          <SectionFields>
            <Field width="long" label="Street address" htmlFor="street" error={errors.street}>
              <Input
                id="street"
                autoComplete="address-line1"
                value={live.street}
                onChange={(event) => set({ street: event.target.value })}
              />
            </Field>
            <Field width="short" label="Apartment or unit" htmlFor="unit" optional>
              <Input
                id="unit"
                autoComplete="address-line2"
                value={live.unit}
                onChange={(event) => set({ unit: event.target.value })}
              />
            </Field>

            {/* State and city are selects, and the city list is scoped to the
                state. The review call asked for the dropdown explicitly, so
                the registrar is not correcting free text. Changing the state
                clears the city: a city that no longer belongs to the chosen
                state is exactly the kind of well-formed nonsense a select
                exists to prevent. */}
            <Field width="short" label="State" htmlFor="state" error={errors.state}>
              <Select value={live.state} onValueChange={(value) => set({ state: value, city: "" })}>
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
                onValueChange={(value) => set({ city: value })}
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
                onChange={(event) => set({ postalCode: event.target.value })}
              />
            </Field>

            <Field width="short" label="Country" htmlFor="country" error={errors.country}>
              <Select value={live.country} onValueChange={(value) => set({ country: value })}>
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
        </Section>

        <Section
          step={2}
          done={Boolean(live.residencyVerification)}
          icon={<SealCheckIcon weight="duotone" aria-hidden className="size-4" />}
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
              className="mt-2 grid grid-cols-3 gap-1.5 narrow:grid-cols-1"
              value={live.residencyVerification}
              onValueChange={(value) => set({ residencyVerification: value })}
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
              <p className="mt-1.5 text-micro font-medium text-danger-600">
                {errors.residencyVerification}
              </p>
            ) : null}
          </fieldset>
        </Section>

        <Section
          collapsible
          icon={<MapPinIcon weight="duotone" aria-hidden className="size-4" />}
          title="Why we ask"
          defaultOpen={false}
          value="It decides your tuition rate, and where official post goes"
        >
          <Prose>
            Your permanent address decides your residency classification, which decides your tuition
            rate. It is also where anything official goes, including your enrolment confirmation and
            your first bill. It is not where you will be living during term. Housing Services
            handles that in the next Phase.
          </Prose>
        </Section>
      </Sections>
    </StepShell>
  );
}
