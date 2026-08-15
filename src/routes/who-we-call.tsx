import { EyeIcon, PhoneCallIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";
import * as React from "react";

import { PricePill, useCelebration } from "@/components/celebration";
import { Field } from "@/components/field";
import { PhoneInput } from "@/components/phone-input";
import {
  BackButton,
  ContinueAction,
  StepGuide,
  StepShell,
  useStepNav,
} from "@/components/step-shell";
import {
  Prose,
  Section,
  SectionFields,
  Sections,
  SelectionMark,
  Well,
} from "@/components/surfaces";
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
 * The emergency contact and Family access live together on purpose: Remote
 * separates them, but together they are about two minutes and they answer the
 * same question — *other people on your record* — and splitting them would
 * produce two Steps below the floor the evidence shows.
 *
 * Family access captures four fields, and the fourth is the one that had never
 * been built. Laura listed all four on the call: *"precisa do nome completo,
 * precisa do e-mail, precisa do parentesco, e o que vai ter acesso."*
 *
 * This is the Step where a collapsed Section carries the most weight in the
 * whole flow: closed, "Who can see your record" reads *"Maria Rivera — grades,
 * bill"*. A student who has granted access to three people can check what they
 * granted without opening anything, which is the entire argument of ADR 0010 in
 * one line of text.
 */
export function WhoWeCallRoute() {
  const state = useOnboarding();
  const call = state.whoWeCall;
  const award = useCelebration();
  const { goNext } = useStepNav("who-we-call");
  const step = stepById("who-we-call");

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const set = (changes: Partial<typeof call>) => patch("whoWeCall", changes);

  const contact = call.emergencyContacts[0];
  const missing = [
    !contact?.fullName.trim(),
    !contact?.relationship,
    !contact?.phone.trim(),
  ].filter(Boolean).length;

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

  const accessSummary = call.familyAccess.length
    ? call.familyAccess
        .map(
          (grant) =>
            `${grant.fullName || "Someone"} — ${
              grant.scope.length
                ? grant.scope
                    .map(
                      (value) =>
                        disclosureScopeOptions.find((option) => option.value === value)?.label ??
                        value,
                    )
                    .join(", ")
                : "nothing yet"
            }`,
        )
        .join(" · ")
    : "Nobody has access to your record";

  return (
    <StepShell
      current="who-we-call"
      title="Who we call, who can see"
      lead="One person we can reach in an emergency, and anyone you want us to be able to talk to."
      headerAside={<PricePill points={step.points} stepId="who-we-call" earned={call.submitted} />}
      guide={
        <StepGuide
          current="who-we-call"
          why="Two different people. The emergency contact is who Aster calls if something happens to you. Family access is who may ask Aster about your record — and by law that is your decision, not theirs."
          tasks={[
            { label: "Somebody we can reach in an emergency", done: missing === 0 },
            {
              label: "Anyone who may see your record",
              done: call.familyAccess.length > 0,
              optional: true,
            },
          ]}
        />
      }
      actions={
        <>
          <BackButton current="who-we-call" />
          {call.submitted ? (
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
          done={missing === 0}
          icon={<PhoneCallIcon weight="duotone" aria-hidden className="size-4" />}
          title="Emergency contact"
          value={
            contact?.fullName
              ? `${contact.fullName}${contact.phone ? ` · ${contact.dialCode} ${contact.phone}` : ""}`
              : undefined
          }
          action={
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                set({
                  emergencyContacts: [
                    ...call.emergencyContacts,
                    emptyEmergencyContact(newRowId("contact")),
                  ],
                })
              }
            >
              <PlusIcon weight="bold" aria-hidden className="size-3.5" />
              Add another
            </Button>
          }
        >
          <div className="space-y-2.5">
            {call.emergencyContacts.map((entry, index) => (
              <SectionFields key={entry.id}>
                <Field
                  width="medium"
                  label="Full name"
                  htmlFor={`contact-name-${entry.id}`}
                  error={errors[`emergencyContacts.${index}.fullName`]}
                >
                  <Input
                    id={`contact-name-${entry.id}`}
                    value={entry.fullName}
                    onChange={(event) =>
                      set({
                        emergencyContacts: call.emergencyContacts.map((row) =>
                          row.id === entry.id ? { ...row, fullName: event.target.value } : row,
                        ),
                      })
                    }
                  />
                </Field>

                <Field
                  width="short"
                  label="How you know them"
                  htmlFor={`contact-relationship-${entry.id}`}
                  error={errors[`emergencyContacts.${index}.relationship`]}
                >
                  <Select
                    value={entry.relationship}
                    onValueChange={(value) =>
                      set({
                        emergencyContacts: call.emergencyContacts.map((row) =>
                          row.id === entry.id ? { ...row, relationship: value } : row,
                        ),
                      })
                    }
                  >
                    <SelectTrigger id={`contact-relationship-${entry.id}`} className="w-full">
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
                  width="long"
                  label="Their mobile number"
                  htmlFor={`contact-phone-${entry.id}`}
                  error={errors[`emergencyContacts.${index}.phone`]}
                >
                  <div className="flex items-end gap-2">
                    <div className="min-w-0 flex-1">
                      <PhoneInput
                        id={`contact-phone-${entry.id}`}
                        dialCode={entry.dialCode}
                        onDialCodeChange={(value) =>
                          set({
                            emergencyContacts: call.emergencyContacts.map((row) =>
                              row.id === entry.id ? { ...row, dialCode: value } : row,
                            ),
                          })
                        }
                        value={entry.phone}
                        onChange={(event) =>
                          set({
                            emergencyContacts: call.emergencyContacts.map((row) =>
                              row.id === entry.id ? { ...row, phone: event.target.value } : row,
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
                        aria-label={`Remove ${entry.fullName || "this contact"}`}
                        onClick={() =>
                          set({
                            emergencyContacts: call.emergencyContacts.filter(
                              (row) => row.id !== entry.id,
                            ),
                          })
                        }
                      >
                        <TrashIcon aria-hidden className="size-4" />
                      </Button>
                    ) : null}
                  </div>
                </Field>
              </SectionFields>
            ))}
          </div>
        </Section>

        <Section
          step={2}
          done={call.familyAccess.length > 0}
          icon={<EyeIcon weight="duotone" aria-hidden className="size-4" />}
          title="Who can see your record"
          value={accessSummary}
          action={
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                set({ familyAccess: [...call.familyAccess, emptyFamilyAccess(newRowId("family"))] })
              }
            >
              <PlusIcon weight="bold" aria-hidden className="size-3.5" />
              Give someone access
            </Button>
          }
        >
          <FerpaExplanation />

          {call.familyAccess.length === 0 ? (
            <p className="mt-2 text-micro text-ink-500">Nobody has access to your record.</p>
          ) : (
            <div className="mt-2.5 space-y-2.5">
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
        </Section>
      </Sections>
    </StepShell>
  );
}

/**
 * The law, explained before it is exercised.
 *
 * The sentence in bold is the point, and it is why this explanation earns its
 * place rather than being legal decoration: it answers the question the screen
 * provokes in a seventeen-year-old and in the parent standing behind them —
 * *why am I the one deciding what my family can see?* Because the law moved the
 * right to the student on the day they enrolled. Without that sentence the
 * screen reads as the university arbitrarily cutting parents out.
 *
 * It is supporting text on the Section's own ground, never in a Well: a Well is
 * for data, and an explanation is not data.
 */
function FerpaExplanation() {
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <Prose>
        FERPA gives parents the right to see their children's education records.{" "}
        <strong className="font-strong text-ink-900">
          When you turn 18, or enter a postsecondary institution at any age, that right transfers
          from your parents to you.
        </strong>{" "}
        So this is your decision, not theirs.{" "}
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          className="font-strong text-violet-600 underline-offset-4 hover:underline"
        >
          What this means in practice
        </button>
      </Prose>

      {open ? (
        <Prose className="mt-1.5">
          Without your permission, Aster staff will decline to discuss your grades, your bill or
          your housing with anyone who asks, including a parent who is paying your fees. Naming
          someone here is how you change that. You can widen, narrow or withdraw it at any time in
          writing.
        </Prose>
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
    <Well strong className="space-y-2.5">
      <SectionFields>
        <Field
          width="medium"
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
          width="long"
          label="Email address"
          htmlFor={`family-email-${grant.id}`}
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
          width="short"
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
      </SectionFields>

      {/* The scope is a real choice with consequences, not a checkbox. Each
          option states what that person will and will not be able to see, in
          the flat register. Selection is fill and a check, never elevation. */}
      <fieldset>
        <legend className="field-label">What they can see</legend>
        <div className="mt-1.5 grid grid-cols-2 gap-1.5 narrow:grid-cols-1">
          {disclosureScopeOptions.map((option) => {
            const checked = grant.scope.includes(option.value);
            return (
              <label
                key={option.value}
                className={cn(
                  "flex cursor-pointer items-start gap-2 rounded-[var(--radius-field)] border bg-panel px-2 py-1.5",
                  "transition-[border-color,background-color] duration-[var(--duration-base)]",
                  "compact:min-h-[var(--tap-target)]",
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
                <SelectionMark selected={checked} className="mt-0.5" />
                <span className="min-w-0 flex-1">
                  <span className="block text-small font-strong text-ink-900">{option.label}</span>
                  <span className="block text-micro leading-4 text-ink-500">{option.hint}</span>
                </span>
              </label>
            );
          })}
        </div>
        {errors[`familyAccess.${index}.scope`] ? (
          <p className="mt-1.5 text-micro font-medium text-danger-600">
            {errors[`familyAccess.${index}.scope`]}
          </p>
        ) : null}
      </fieldset>

      <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
        <TrashIcon aria-hidden className="size-3.5" />
        Remove access
      </Button>
    </Well>
  );
}
