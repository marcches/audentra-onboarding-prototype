import { ArrowRightIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";
import * as React from "react";

import { Field } from "@/components/field";
import { PhoneInput } from "@/components/phone-input";
import { AwardStage, PricePill, usePointsAward } from "@/components/points-award";
import { BackButton, StepShell, steadyAction, useStepNav } from "@/components/step-shell";
import { Panel, PanelDivider, SelectionMark, Well } from "@/components/surfaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { disclosureScopeOptions, relationshipOptions } from "@/lib/fixtures";
import { stepById } from "@/lib/steps";
import {
  emptyEmergencyContact,
  emptyFamilyAccess,
  type FamilyAccessGrant,
  newRowId,
  patch,
  useOnboarding,
} from "@/lib/store";
import { cn } from "@/lib/utils";
import { whoWeCallSchema } from "@/lib/validation";

/**
 * Who we call, who can see.
 *
 * The last of the three Steps replacing `identity-contact`. The emergency
 * contact and Family access live together on purpose: Remote separates them,
 * but together they are about two minutes and they answer the same question —
 * *other people on your record* — and splitting them would produce two Steps
 * below the floor the evidence shows.
 *
 * Family access captures four fields, and the fourth is the one that had never
 * been built. Laura listed all four on the call: *"precisa do nome completo,
 * precisa do e-mail, precisa do parentesco, e o que vai ter acesso."* The
 * screen's own lead had been promising the fourth for two rounds.
 */
export function WhoWeCallRoute() {
  const state = useOnboarding();
  const call = state.whoWeCall;
  const award = usePointsAward();
  const { goNext } = useStepNav("who-we-call");
  const step = stepById("who-we-call");

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const set = (changes: Partial<typeof call>) => patch("whoWeCall", changes);

  const submit = () => {
    const result = whoWeCallSchema.safeParse({
      emergencyContacts: call.emergencyContacts,
      familyAccess: call.familyAccess,
    });

    if (!result.success) {
      const next: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join(".");
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setErrors({});
    patch("whoWeCall", { submitted: true });
    award?.celebrate("who-we-call", step.points);
  };

  return (
    <StepShell
      current="who-we-call"
      title="Who we call, who can see"
      lead="One person we can reach in an emergency, and anyone you want us to be able to talk to."
      headerAside={<PricePill points={step.points} stepId="who-we-call" earned={call.submitted} />}
      actions={
        <>
          <BackButton current="who-we-call" />
          <Button type="button" size="lg" className={steadyAction} onClick={submit}>
            Save and continue
            <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
          </Button>
        </>
      }
    >
      <Panel as="fieldset">
        <legend className="field-label">Emergency contact</legend>

        <div className="mt-3 space-y-4">
          {call.emergencyContacts.map((contact, index) => (
            <div key={contact.id} className="grid gap-4 sm:grid-cols-12">
              <Field
                className="sm:col-span-4"
                label="Full name"
                htmlFor={`contact-name-${contact.id}`}
                error={errors[`emergencyContacts.${index}.fullName`]}
              >
                <Input
                  id={`contact-name-${contact.id}`}
                  value={contact.fullName}
                  onChange={(event) =>
                    set({
                      emergencyContacts: call.emergencyContacts.map((entry) =>
                        entry.id === contact.id
                          ? { ...entry, fullName: event.target.value }
                          : entry,
                      ),
                    })
                  }
                />
              </Field>

              <Field
                className="sm:col-span-3"
                label="How you know them"
                htmlFor={`contact-relationship-${contact.id}`}
                error={errors[`emergencyContacts.${index}.relationship`]}
              >
                <Select
                  value={contact.relationship}
                  onValueChange={(value) =>
                    set({
                      emergencyContacts: call.emergencyContacts.map((entry) =>
                        entry.id === contact.id ? { ...entry, relationship: value } : entry,
                      ),
                    })
                  }
                >
                  <SelectTrigger id={`contact-relationship-${contact.id}`} className="w-full">
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

              <Field
                className="sm:col-span-5"
                label="Their mobile number"
                htmlFor={`contact-phone-${contact.id}`}
                error={errors[`emergencyContacts.${index}.phone`]}
              >
                <div className="flex items-end gap-2">
                  <div className="min-w-0 flex-1">
                    <PhoneInput
                      id={`contact-phone-${contact.id}`}
                      dialCode={contact.dialCode}
                      onDialCodeChange={(value) =>
                        set({
                          emergencyContacts: call.emergencyContacts.map((entry) =>
                            entry.id === contact.id ? { ...entry, dialCode: value } : entry,
                          ),
                        })
                      }
                      value={contact.phone}
                      onChange={(event) =>
                        set({
                          emergencyContacts: call.emergencyContacts.map((entry) =>
                            entry.id === contact.id
                              ? { ...entry, phone: event.target.value }
                              : entry,
                          ),
                        })
                      }
                    />
                  </div>
                  {call.emergencyContacts.length > 1 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove ${contact.fullName || "this contact"}`}
                      onClick={() =>
                        set({
                          emergencyContacts: call.emergencyContacts.filter(
                            (entry) => entry.id !== contact.id,
                          ),
                        })
                      }
                    >
                      <TrashIcon aria-hidden className="size-4" />
                    </Button>
                  ) : null}
                </div>
              </Field>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-3"
          onClick={() =>
            set({
              emergencyContacts: [
                ...call.emergencyContacts,
                emptyEmergencyContact(newRowId("contact")),
              ],
            })
          }
        >
          <PlusIcon weight="bold" aria-hidden className="size-4" />
          Add another contact
        </Button>

        <PanelDivider />

        <FerpaExplanation />

        <div className="mt-5">
          <p className="field-label">Family access</p>

          {call.familyAccess.length === 0 ? (
            <p className="mt-2 text-small text-ink-500">Nobody has access to your record.</p>
          ) : (
            <div className="mt-3 space-y-4">
              {call.familyAccess.map((grant, index) => (
                <FamilyAccessRow
                  key={grant.id}
                  grant={grant}
                  index={index}
                  errors={errors}
                  onChange={(changes) =>
                    set({
                      familyAccess: call.familyAccess.map((entry) =>
                        entry.id === grant.id ? { ...entry, ...changes } : entry,
                      ),
                    })
                  }
                  onRemove={() =>
                    set({
                      familyAccess: call.familyAccess.filter((entry) => entry.id !== grant.id),
                    })
                  }
                />
              ))}
            </div>
          )}

          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-3"
            onClick={() =>
              set({ familyAccess: [...call.familyAccess, emptyFamilyAccess(newRowId("family"))] })
            }
          >
            <PlusIcon weight="bold" aria-hidden className="size-4" />
            Give someone access
          </Button>
        </div>
      </Panel>

      <AwardStage stepId="who-we-call" headline="People on your record, recorded.">
        <Button type="button" size="lg" onClick={goNext}>
          Continue
          <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
        </Button>
      </AwardStage>
    </StepShell>
  );
}

/**
 * The law, explained before it is exercised.
 *
 * Added 2026-08-15 from Laura's annotation on the screen. The sentence in bold
 * is the point, and it is why this explanation earns its place rather than
 * being legal decoration: it answers the question the screen provokes in a
 * seventeen-year-old and in the parent standing behind them — *why am I the one
 * deciding what my family can see?* Because the law moved the right to the
 * student on the day they enrolled. Without that sentence the screen reads as
 * the university arbitrarily cutting parents out.
 *
 * It sits as supporting text on the Panel's own ground, never in a Well: a Well
 * is for data, and an explanation is not data. It is always visible, never
 * behind the disclosure. The disclosure carries the practical detail only.
 */
function FerpaExplanation() {
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <p className="field-label">Why this is yours to decide</p>
      <p className="mt-2 max-w-prose text-small leading-6 text-ink-600">
        The Family Educational Rights and Privacy Act gives parents the right to see their
        children's education records.{" "}
        <strong className="font-strong text-ink-900">
          When you turn 18, or enter a postsecondary institution at any age, that right transfers
          from your parents to you.
        </strong>{" "}
        So this is your decision, not theirs.
      </p>

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="mt-2 text-small font-strong text-violet-600 underline-offset-4 hover:underline"
      >
        What this means in practice
      </button>

      {open ? (
        <p className="mt-2 max-w-prose text-small leading-6 text-ink-600">
          Without your permission, Aster staff will decline to discuss your grades, your bill or
          your housing with anyone who asks, including a parent who is paying your fees. Naming
          someone here is how you change that. You can widen, narrow or withdraw it at any time in
          writing.
        </p>
      ) : null}
    </div>
  );
}

/** One person, one record. Four fields, and the fourth is a real choice. */
function FamilyAccessRow({
  grant,
  index,
  errors,
  onChange,
  onRemove,
}: {
  grant: FamilyAccessGrant;
  index: number;
  errors: Record<string, string>;
  onChange: (changes: Partial<FamilyAccessGrant>) => void;
  onRemove: () => void;
}) {
  const toggleScope = (value: string) => {
    onChange({
      scope: grant.scope.includes(value)
        ? grant.scope.filter((entry) => entry !== value)
        : [...grant.scope, value],
    });
  };

  return (
    <Well strong className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-12">
        <Field
          className="sm:col-span-4"
          label="Full name"
          htmlFor={`family-name-${grant.id}`}
          error={errors[`familyAccess.${index}.fullName`]}
        >
          <Input
            id={`family-name-${grant.id}`}
            value={grant.fullName}
            onChange={(event) => onChange({ fullName: event.target.value })}
          />
        </Field>

        <Field
          className="sm:col-span-5"
          label="Email address"
          htmlFor={`family-email-${grant.id}`}
          hint="This is where their access confirmation goes."
          error={errors[`familyAccess.${index}.email`]}
        >
          <Input
            id={`family-email-${grant.id}`}
            type="email"
            value={grant.email}
            onChange={(event) => onChange({ email: event.target.value })}
          />
        </Field>

        <Field
          className="sm:col-span-3"
          label="How you know them"
          htmlFor={`family-relationship-${grant.id}`}
          error={errors[`familyAccess.${index}.relationship`]}
        >
          <Select
            value={grant.relationship}
            onValueChange={(value) => onChange({ relationship: value })}
          >
            <SelectTrigger id={`family-relationship-${grant.id}`} className="w-full">
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

      {/* The scope is a real choice with consequences, not a checkbox. Each
          option states what that person will and will not be able to see, in
          the flat register. Selection is fill and a check, never elevation. */}
      <fieldset>
        <legend className="field-label">What they can see</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {disclosureScopeOptions.map((option) => {
            const checked = grant.scope.includes(option.value);
            return (
              <label
                key={option.value}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-[var(--radius-field)] border bg-panel p-3",
                  "transition-[border-color,background-color] duration-[var(--duration-base)]",
                  checked
                    ? "border-violet-400 bg-violet-50/70"
                    : "border-ink-100 hover:border-ink-200",
                  /* Health and conduct are the two a student is most likely to
                     hand a parent by reflex and regret specifically. Drawn
                     apart, never pre-ticked, never ticked in a batch. */
                  option.sensitive && !checked && "border-amber-500/30",
                )}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() => toggleScope(option.value)}
                />
                <SelectionMark selected={checked} />
                <span className="min-w-0 flex-1">
                  <span className="block text-body font-strong text-ink-900">{option.label}</span>
                  <span className="block text-small leading-5 text-ink-500">{option.hint}</span>
                </span>
              </label>
            );
          })}
        </div>
        {errors[`familyAccess.${index}.scope`] ? (
          <p className="mt-2 text-small font-medium text-danger-600">
            {errors[`familyAccess.${index}.scope`]}
          </p>
        ) : null}
      </fieldset>

      <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
        <TrashIcon aria-hidden className="size-4" />
        Remove access
      </Button>
    </Well>
  );
}
