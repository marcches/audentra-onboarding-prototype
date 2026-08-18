import {
  CaretDownIcon,
  EyeIcon,
  EyeSlashIcon,
  PhoneCallIcon,
  PlusIcon,
  ProhibitIcon,
  TrashIcon,
} from "@phosphor-icons/react";
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
  IconTile,
  Prose,
  Reveal,
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
import { MAX_EMERGENCY_CONTACTS, whoWeCallSchema } from "@/lib/validation";

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
  /* One required, a second optional, capped at two. `Add another` was already
     on screen with no rule behind it, and an uncapped list turns a two-minute
     Quest into a list manager. Two is what U.S. institutions collect. */
  const atCap = call.emergencyContacts.length >= MAX_EMERGENCY_CONTACTS;
  /* Counted across every contact on screen rather than just the first: a second
     one that has been added and left blank is work still to do, and the button
     should say so rather than letting Continue fail into an error. */
  const missing = call.emergencyContacts.reduce(
    (total, entry) =>
      total +
      [!entry.fullName.trim(), !entry.relationship, !entry.phone.trim()].filter(Boolean).length,
    0,
  );

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
          icon={<PhoneCallIcon weight="bold" aria-hidden className="size-4" />}
          title="Emergency contact"
          value={
            contact?.fullName
              ? `${contact.fullName}${contact.phone ? ` · ${contact.dialCode} ${contact.phone}` : ""}`
              : undefined
          }
          action={
            atCap ? null : (
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
                <PlusIcon weight="bold" aria-hidden className="size-4" />
                Add a second
              </Button>
            )
          }
        >
          <div className="space-y-2">
            {call.emergencyContacts.map((entry, index) => (
              <SectionFields key={entry.id}>
                {/* The optionality is said in the heading rather than in a
                    footnote under the group (Oyster's "Backup contact
                    (optional)"). The first contact needs no heading: it is what
                    the Section is called. */}
                {index > 0 ? (
                  <p className="field-label col-span-12">Second contact (optional)</p>
                ) : null}
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
          icon={<EyeIcon weight="bold" aria-hidden className="size-4" />}
          title="Who can see your record"
          value={accessSummary}
          action={
            /* The header keeps the add control only while there is a list to add
               to. With nobody named, the one action that changes that belongs
               inside the empty state and nowhere else — the same control twice
               on one Section makes the empty state read as decoration. */
            call.familyAccess.length === 0 ? null : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  set({
                    familyAccess: [...call.familyAccess, emptyFamilyAccess(newRowId("family"))],
                  })
                }
              >
                <PlusIcon weight="bold" aria-hidden className="size-4" />
                Give someone access
              </Button>
            )
          }
        >
          <FerpaExplanation />

          {call.familyAccess.length === 0 ? (
            <NobodyHasAccess
              onAdd={() =>
                set({ familyAccess: [...call.familyAccess, emptyFamilyAccess(newRowId("family"))] })
              }
            />
          ) : (
            <div className="mt-2 space-y-2">
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
 * The law, explained before it is exercised — rewritten to the four rules.
 *
 * This was the worst-set paragraph in the flow, and the client photographed it:
 * 89 characters per line, a bold clause that opened and closed inside a line so
 * the reader could not tell what it was scoped to, and a link welded to the tail
 * of the last line with an orphan under it. All three are the same defect, which
 * is that nobody had decided what a paragraph in this system is.
 *
 * Now: **one block, at measure** (`Prose`, ~68 characters); **emphasis on a
 * whole sentence**, and that sentence is the point of the whole screen — it
 * answers the question the screen provokes in a seventeen-year-old and in the
 * parent standing behind them, *why am I the one deciding what my family can
 * see?*, and without it the screen reads as the university arbitrarily cutting
 * parents out; and **the link on its own line**, which is also the only way it
 * reads as a link rather than as the end of a sentence.
 *
 * The disclosure is a **list**, not a second paragraph. That is rule four doing
 * real work rather than being obeyed: the substance of it is three nouns —
 * grades, bill, housing — and three nouns in a sentence is a sentence you have
 * to parse to find a list in.
 *
 * The prose is on the Section's own ground and never in a Well: a Well is for
 * data, and an explanation is not data. The list that follows it is data, which
 * is why that one may be.
 */
const WITHHELD = ["Your grades", "Your bill", "Your housing"];

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
        So this is your decision, not theirs.
      </Prose>

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="mt-1 flex items-center gap-1 text-small font-strong text-violet-600 underline-offset-4 hover:underline"
      >
        What this means in practice
        <CaretDownIcon
          weight="bold"
          aria-hidden
          className={cn(
            "size-3",
            "transition-transform duration-[var(--duration-quick)] ease-[var(--ease-out-soft)]",
            !open && "-rotate-90",
          )}
        />
      </button>

      <Reveal open={open}>
        <Well label="Without your permission, Aster staff will not discuss" className="mt-2">
          <ul className="flex flex-wrap gap-x-4 gap-y-1">
            {WITHHELD.map((item) => (
              <li key={item} className="flex items-center gap-2 text-small text-ink-700">
                <ProhibitIcon weight="bold" aria-hidden className="size-4 text-ink-400" />
                {item}
              </li>
            ))}
          </ul>
          <Prose size="note" className="mt-2 border-t border-ink-100 pt-2">
            Not with anyone who asks, including a parent who is paying your fees. Naming someone
            below is how you change that, and you can widen, narrow or withdraw it at any time in
            writing.
          </Prose>
        </Well>
      </Reveal>
    </div>
  );
}

/**
 * The true thing, drawn, with the one action that changes it.
 *
 * "Nobody has access to your record." was a grey sentence floating under a
 * paragraph — which is the state of the record stated as an aside, in the
 * typeface the system uses for footnotes. It is not an aside: for most students
 * it is the answer, and it is the answer FERPA gives them the right to keep.
 *
 * The anatomy is Tally's and Typeform's: a drawing, the sentence, and exactly
 * one action. Neither of them pads the space around it, and neither does this —
 * the Step still ends where the work ends.
 */
function NobodyHasAccess({ onAdd }: { onAdd: () => void }) {
  return (
    <Well className="mt-2 flex flex-col items-center gap-2 py-4 text-center">
      <IconTile size="lg">
        <EyeSlashIcon weight="bold" aria-hidden className="size-6" />
      </IconTile>
      <div>
        <p className="text-small font-strong text-ink-900">Nobody has access to your record.</p>
        <Prose size="note" className="mt-1">
          That is the default, and it is fine to leave it that way.
        </Prose>
      </div>
      <Button type="button" variant="secondary" size="sm" onClick={onAdd}>
        <PlusIcon weight="bold" aria-hidden className="size-4" />
        Give someone access
      </Button>
    </Well>
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
    <Well strong className="space-y-2">
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
        <div className="mt-2 grid grid-cols-2 gap-2 narrow:grid-cols-1">
          {disclosureScopeOptions.map((option) => {
            const checked = grant.scope.includes(option.value);
            return (
              <label
                key={option.value}
                className={cn(
                  "flex cursor-pointer items-start gap-2 rounded-[var(--radius-field)] border bg-panel px-2 py-2",
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
                <SelectionMark selected={checked} className="mt-1" />
                <span className="min-w-0 flex-1">
                  <span className="block text-small font-strong text-ink-900">{option.label}</span>
                  <span className="block text-meta leading-4 text-ink-500">{option.hint}</span>
                </span>
              </label>
            );
          })}
        </div>
        {errors[`familyAccess.${index}.scope`] ? (
          <p className="mt-2 text-meta font-medium text-danger-600">
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
