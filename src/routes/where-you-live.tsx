import { ArrowRightIcon, MapPinIcon } from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";
import * as React from "react";

import { Field } from "@/components/field";
import { OptionCard } from "@/components/option-card";
import { AwardStage, PricePill, usePointsAward } from "@/components/points-award";
import { BackButton, StepShell, steadyAction, useStepNav } from "@/components/step-shell";
import { IconTile, Panel, PanelDivider } from "@/components/surfaces";
import { Button } from "@/components/ui/button";
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
 * endereço, já arranca fora."* This was specified in a previous spec and never
 * implemented; until now every student was shown a U.S. address block
 * regardless of the answer, which is the clearest example of the flow asking
 * for something it already knows cannot apply.
 *
 * The schema branches with it. `addressSchemaFor("international")` returns
 * `null` rather than a schema of optional fields, because a hidden required
 * field that blocks Continue with an error nobody can see is the worst version
 * of this.
 *
 * Density comes from pairing on one row rather than from compression, and the
 * second column takes what is not a field (Workable, Zillow).
 */
export function WhereYouLiveRoute() {
  const state = useOnboarding();
  const live = state.whereYouLive;
  const status = state.whoYouAre.studentStatus;
  const navigate = useNavigate();
  const award = usePointsAward();
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

  return (
    <StepShell
      current="where-you-live"
      title="Where you live now"
      lead="Your permanent address, which decides your residency classification and where official post goes."
      headerAside={
        <PricePill points={step.points} stepId="where-you-live" earned={live.submitted} />
      }
      actions={
        <>
          <BackButton current="where-you-live" />
          <Button type="button" size="lg" className={steadyAction} onClick={submit}>
            Save and continue
            <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
          </Button>
        </>
      }
    >
      <div className="grid gap-4 lg:grid-cols-12">
        <Panel as="fieldset" className="lg:col-span-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field
              className="sm:col-span-2"
              label="Street address"
              htmlFor="street"
              error={errors.street}
            >
              <Input
                id="street"
                autoComplete="address-line1"
                value={live.street}
                onChange={(event) => set({ street: event.target.value })}
              />
            </Field>
            <Field label="Apartment or unit" htmlFor="unit" optional>
              <Input
                id="unit"
                autoComplete="address-line2"
                value={live.unit}
                onChange={(event) => set({ unit: event.target.value })}
              />
            </Field>
          </div>

          {/* State and city are selects, and the city list is scoped to the
              state. The review call asked for the dropdown explicitly, so the
              registrar is not correcting free text. Changing the state clears
              the city: a city that no longer belongs to the chosen state is
              exactly the kind of well-formed nonsense a select exists to
              prevent. */}
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Field label="State" htmlFor="state" error={errors.state}>
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

            <Field label="City" htmlFor="city" error={errors.city}>
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

            <Field label="ZIP code" htmlFor="postal" error={errors.postalCode}>
              <Input
                id="postal"
                inputMode="numeric"
                autoComplete="postal-code"
                value={live.postalCode}
                onChange={(event) => set({ postalCode: event.target.value })}
              />
            </Field>
          </div>

          <Field
            className="mt-4 sm:max-w-xs"
            label="Country"
            htmlFor="country"
            error={errors.country}
          >
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

          <PanelDivider />

          <fieldset>
            <legend className="field-label">How should we check your residency?</legend>
            <RadioGroup
              className="mt-3 grid gap-2.5"
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
              <p className="mt-2 text-small font-medium text-danger-600">
                {errors.residencyVerification}
              </p>
            ) : null}
          </fieldset>
        </Panel>

        {/* The second column takes what is not a field, which is what stops the
            form column being half a screen wide with nothing beside it. */}
        <Panel aside className="lg:col-span-4">
          <IconTile size="lg">
            <MapPinIcon weight="fill" aria-hidden className="size-6" />
          </IconTile>
          <p className="mt-3 text-body font-strong text-ink-900">Why we ask</p>
          <p className="mt-1 text-small leading-5 text-ink-600">
            Your permanent address decides your residency classification, which decides your tuition
            rate. It is also where anything official goes, including your enrolment confirmation and
            your first bill.
          </p>
          <p className="mt-3 text-small leading-5 text-ink-600">
            It is not where you will be living during term. Housing Services handles that in the
            next Phase.
          </p>
        </Panel>
      </div>

      <AwardStage stepId="where-you-live" headline="Address on file.">
        <Button type="button" size="lg" onClick={goNext}>
          Continue
          <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
        </Button>
      </AwardStage>
    </StepShell>
  );
}
