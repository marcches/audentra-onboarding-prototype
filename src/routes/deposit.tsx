import {
  BankIcon,
  CheckCircleIcon,
  CreditCardIcon,
  HourglassMediumIcon,
} from "@phosphor-icons/react";
import type * as React from "react";

import { PricePill, useCelebration } from "@/components/celebration";
import { Field } from "@/components/field";
import { OptionCard } from "@/components/option-card";
import { BackButton, ContinueAction, StepShell, useStepNav } from "@/components/step-shell";
import {
  Fact,
  OnGround,
  Prose,
  Reveal,
  Section,
  SectionFields,
  Sections,
  Well,
} from "@/components/surfaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { depositTerms, formatDeadline, formatMoney, institution } from "@/lib/fixtures";
import { stepById } from "@/lib/steps";
import { type DepositChoice, patch, useOnboarding } from "@/lib/store";
import { cn } from "@/lib/utils";

const AMOUNT = formatMoney(depositTerms.amount, depositTerms.currency);
const DEADLINE = formatDeadline(depositTerms.refundableUntil);
const BALANCE_DUE = formatDeadline(depositTerms.balanceDue);

/**
 * The Deposit, as a checkout the student has already used somewhere else.
 *
 * Three screens behind **one rail entry**, because a checkout is one thing to
 * anyone who has bought something online, and three rail entries would make the
 * Closing larger than a Phase.
 *
 * The composition is the checkout asymmetry: methods on the Ground at the left,
 * **only the summary framed**, at the right, where it stays put (Babbel,
 * Squarespace). Framing both halves would erase the emphasis that makes the
 * summary the summary. Choosing a method expands it in place through
 * `grid-template-rows` — never `height` — and nothing above it moves (Turo,
 * lululemon).
 *
 * What deliberately does **not** come across from e-commerce, and the first is
 * a matter of ethics rather than taste:
 *
 * - **No urgency of any kind.** No countdown, no "held for 09:58", no scarcity.
 *   Applying purchase pressure to a financial obligation, from an institution
 *   that has already admitted the student, is coercive and reads as a scam.
 * - No cart vocabulary, no upsells, no promo code field, no BNPL branding, and
 *   no confetti on the receipt: the celebration belongs on Enrolled.
 * - The three ways out — pay now, pay by the deadline, request a waiver — are
 *   equally visible, and the screen says none of them is giving up.
 */
export function DepositRoute() {
  const state = useOnboarding();
  const deposit = state.deposit;

  switch (deposit.screen) {
    case "double-check":
      return <DoubleCheck />;
    case "receipt":
      return <Receipt />;
    default:
      return <SecureYourPlace />;
  }
}

/* -------------------------------------------------------------------------
   1 · Secure your place
   ---------------------------------------------------------------------- */

function SecureYourPlace() {
  const state = useOnboarding();
  const deposit = state.deposit;
  const step = stepById("deposit");

  const set = (changes: Partial<typeof deposit>) => patch("deposit", changes);

  const waiver = deposit.choice === "waiver";
  const payingNow = deposit.choice === "pay-now";
  const ready =
    (payingNow && deposit.method !== "") ||
    deposit.choice === "pay-by-deadline" ||
    (waiver && deposit.waiverReason.trim().length > 0);

  return (
    <StepShell
      current="deposit"
      title="Secure your place"
      lead={`One payment of ${AMOUNT}, credited against your first term's tuition.`}
      headerAside={<PricePill points={step.points} stepId="deposit" earned={deposit.submitted} />}
      actions={
        <>
          <BackButton current="deposit" />
          <ContinueAction
            remaining={ready ? 0 : 1}
            label="Review before paying"
            onClick={() => set({ screen: "double-check" })}
          />
        </>
      }
    >
      {/* `items-start`, because a grid row stretches its items to the tallest
          of them by default — which is `fill` reintroduced by CSS after the
          prop was deleted. It put 76px of white inside "What happens next"
          on the receipt, beside a taller receipt sheet. */}
      <div className="grid grid-cols-12 items-start gap-3 narrow:grid-cols-1">
        <OnGround
          reason="checkout-asymmetry"
          as="section"
          className="col-span-7 space-y-3 narrow:col-span-1"
        >
          <div>
            <p className="field-label">How you want to pay</p>
            <Prose size="note" className="mt-1">
              Three ways to finish this. None of them is giving up your place.
            </Prose>
            <RadioGroup
              className="mt-2 grid gap-2"
              value={deposit.choice}
              onValueChange={(value) =>
                set({
                  choice: value as DepositChoice,
                  method: value === "pay-now" ? deposit.method : "",
                })
              }
            >
              <OptionCard
                id="choice-now"
                value="pay-now"
                label={`Pay ${AMOUNT} now`}
                consequence={`Card or bank transfer. Refundable until ${DEADLINE}.`}
              />
              <OptionCard
                id="choice-deadline"
                value="pay-by-deadline"
                label={`Pay by ${DEADLINE}`}
                consequence="Student Accounts will invoice you. Your place is held either way."
              />
              <OptionCard
                id="choice-waiver"
                value="waiver"
                label="Request a waiver"
                consequence={`For students for whom the deposit is a barrier. Reviewed within ${depositTerms.waiverReviewDays} working days.`}
              />
            </RadioGroup>
          </div>

          {/* Both follow-ups are always mounted and reveal in place, so choosing
              a way to pay never moves the option list the student just used. */}
          <Reveal open={payingNow}>
            <div>
              <p className="field-label">Payment method</p>
              <div className="mt-2 space-y-2">
                <MethodRow
                  id="card"
                  icon={<CreditCardIcon weight="fill" aria-hidden className="size-4" />}
                  label="Card"
                  selected={deposit.method === "card"}
                  onSelect={() => set({ method: "card" })}
                >
                  <SectionFields className="pt-2">
                    <Field width="medium" label="Name on card" htmlFor="card-name">
                      <Input
                        id="card-name"
                        value={deposit.cardName}
                        onChange={(event) => set({ cardName: event.target.value })}
                      />
                    </Field>
                    <Field width="medium" label="Card number" htmlFor="card-number">
                      <Input
                        id="card-number"
                        inputMode="numeric"
                        placeholder="4242 4242 4242 4242"
                        value={deposit.cardNumber}
                        onChange={(event) => set({ cardNumber: event.target.value })}
                      />
                    </Field>
                  </SectionFields>
                  <p className="pt-2 text-meta text-ink-400">
                    No gateway is connected in this prototype. Nothing is charged.
                  </p>
                </MethodRow>

                <MethodRow
                  id="bank-transfer"
                  icon={<BankIcon weight="fill" aria-hidden className="size-4" />}
                  label="Bank transfer"
                  selected={deposit.method === "bank-transfer"}
                  onSelect={() => set({ method: "bank-transfer" })}
                >
                  <Prose size="note" className="pt-2 text-ink-600">
                    Takes two to three working days to clear. Your place is held from the moment you
                    confirm.
                  </Prose>
                </MethodRow>
              </div>
            </div>
          </Reveal>

          <Reveal open={waiver}>
            <Field
              width="full"
              label="Why are you requesting a waiver?"
              htmlFor="waiver-reason"
              hint="A sentence is enough. Student Accounts reads these."
            >
              <Textarea
                id="waiver-reason"
                rows={2}
                value={deposit.waiverReason}
                onChange={(event) => set({ waiverReason: event.target.value })}
              />
            </Field>
          </Reveal>
        </OnGround>

        <DepositSummary waiver={waiver} />
      </div>
    </StepShell>
  );
}

/**
 * One method, expanding in place.
 *
 * `Reveal` rather than a conditional render, so the row that was clicked does
 * not jump as its neighbour unmounts, and so the expansion is `0fr → 1fr`
 * rather than a height animation.
 */
function MethodRow({
  id,
  icon,
  label,
  selected,
  onSelect,
  children,
}: {
  id: string;
  icon: React.ReactNode;
  label: string;
  selected: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-field)] border bg-panel px-2 py-2",
        "transition-[border-color,background-color] duration-[var(--duration-base)]",
        selected ? "border-violet-400 bg-violet-50/50" : "border-ink-200",
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-expanded={selected}
        aria-controls={`method-${id}`}
        className="flex w-full items-center gap-2 text-left compact:min-h-[var(--tap-target)]"
      >
        <span className="text-ink-500">{icon}</span>
        <span className="flex-1 text-body font-strong text-ink-900">{label}</span>
      </button>
      <Reveal open={selected}>
        <div id={`method-${id}`}>{children}</div>
      </Reveal>
    </div>
  );
}

/**
 * The Deposit summary, beside the form and never scrolling away, ending in a
 * bolded **Due today** on its own line, distinct from the subtotal (Airbnb,
 * Squarespace, Fresha). The one framed half of the checkout.
 */
function DepositSummary({ waiver }: { waiver: boolean }) {
  return (
    <div className="col-span-5 narrow:col-span-1">
      <Sections className="sticky top-3">
        <Section title="Deposit" collapsible={false}>
          <dl>
            <Fact label="Enrollment deposit">
              <span className="numeric">{AMOUNT}</span>
            </Fact>
            <Fact label="Credited against your first term's tuition">
              <span className="text-mint-deep numeric">-{AMOUNT}</span>
            </Fact>
          </dl>

          <div className="mt-2 flex items-baseline justify-between gap-3 border-t border-ink-100 pt-2">
            <span className="text-small font-strong text-ink-900">Due today</span>
            <span className="text-h3 font-bold text-ink-900 numeric">
              {waiver ? "$0, pending review" : AMOUNT}
            </span>
          </div>

          <Prose size="note" className="mt-2">
            {waiver
              ? `Student Accounts reviews waiver requests within ${depositTerms.waiverReviewDays} working days. Your place is held while they do.`
              : `Refundable in full until ${DEADLINE}.`}
          </Prose>
        </Section>
      </Sections>
    </div>
  );
}

/* -------------------------------------------------------------------------
   2 · Double check
   ---------------------------------------------------------------------- */

function DoubleCheck() {
  const state = useOnboarding();
  const deposit = state.deposit;
  const step = stepById("deposit");
  const award = useCelebration();

  const set = (changes: Partial<typeof deposit>) => patch("deposit", changes);
  const waiver = deposit.choice === "waiver";

  const confirm = () => {
    set({
      screen: "receipt",
      submitted: true,
      settledAt: new Date().toISOString(),
      reference:
        deposit.reference ||
        `DEP-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`,
    });
    award?.celebrate("deposit", step.points);
  };

  const label =
    deposit.choice === "pay-now"
      ? `Pay ${AMOUNT}`
      : deposit.choice === "pay-by-deadline"
        ? "Confirm and invoice me"
        : "Send my waiver request";

  return (
    <StepShell
      current="deposit"
      title="Double check"
      lead="Nothing has been charged yet."
      headerAside={<PricePill points={step.points} stepId="deposit" earned={deposit.submitted} />}
      actions={
        <>
          <Button type="button" variant="ghost" onClick={() => set({ screen: "secure" })}>
            Back
          </Button>
          <ContinueAction label={label} onClick={confirm} />
        </>
      }
    >
      <div className="grid grid-cols-12 items-start gap-3 narrow:grid-cols-1">
        <OnGround
          reason="checkout-asymmetry"
          as="section"
          className="col-span-7 space-y-2 narrow:col-span-1"
        >
          {/* Both prior steps collapsed to one line each with Change
              (lululemon). */}
          <CollapsedStep
            label="How you are paying"
            value={
              deposit.choice === "pay-now"
                ? `Now, by ${deposit.method === "bank-transfer" ? "bank transfer" : "card"}`
                : deposit.choice === "pay-by-deadline"
                  ? `By ${DEADLINE}`
                  : "Requesting a waiver"
            }
            onChange={() => set({ screen: "secure" })}
          />
          {waiver ? (
            <CollapsedStep
              label="Your reason"
              value={deposit.waiverReason}
              onChange={() => set({ screen: "secure" })}
            />
          ) : null}

          <Well label="The deposit policy, in short">
            <ul className="space-y-1 text-meta leading-4 text-ink-700">
              <li>The deposit is {AMOUNT} and it is credited against your first term's bill.</li>
              <li>It is refundable in full until {DEADLINE}, and not after it.</li>
              <li>If you withdraw after that date you forfeit the deposit and nothing else.</li>
            </ul>
          </Well>
        </OnGround>

        <DepositSummary waiver={waiver} />
      </div>
    </StepShell>
  );
}

function CollapsedStep({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center gap-2 rounded-[var(--radius-field)] border border-ink-100 bg-panel px-2 py-2">
      <CheckCircleIcon weight="fill" aria-hidden className="size-4 shrink-0 text-mint-600" />
      <span className="flex min-w-0 flex-1 items-baseline gap-2">
        <span className="shrink-0 text-meta text-ink-500">{label}</span>
        <span className="truncate text-small text-ink-900">{value}</span>
      </span>
      <Button type="button" variant="ghost" size="sm" onClick={onChange}>
        Change
      </Button>
    </div>
  );
}

/* -------------------------------------------------------------------------
   3 · Receipt
   ---------------------------------------------------------------------- */

/**
 * Every branch reaches a receipt, including paying by the deadline and
 * requesting a waiver, each with its own copy and status. A bank transfer shows
 * as **processing**, not as paid (Deel).
 */
function Receipt() {
  const state = useOnboarding();
  const deposit = state.deposit;
  const { goNext } = useStepNav("deposit");

  const outcome = receiptCopy(deposit.choice, deposit.method);

  return (
    <StepShell
      current="deposit"
      title={outcome.title}
      lead={outcome.sentence}
      saved={false}
      actions={<ContinueAction label="Finish" onClick={goNext} />}
    >
      <div className="grid grid-cols-12 items-start gap-3 narrow:grid-cols-1">
        <Sections className="col-span-7 narrow:col-span-1">
          <Section title="Your receipt" collapsible={false}>
            <div className="flex items-center gap-2">
              {outcome.processing ? (
                <HourglassMediumIcon weight="fill" aria-hidden className="size-6 text-amber-500" />
              ) : (
                <CheckCircleIcon weight="fill" aria-hidden className="size-6 text-mint-600" />
              )}
              <p className="text-h2 text-ink-900 numeric">{outcome.amount}</p>
            </div>

            <Well strong className="mt-2">
              <dl>
                <Fact label="Reference">
                  <span className="font-mono">{deposit.reference || "pending"}</span>
                </Fact>
                <Fact label="Date">
                  {deposit.settledAt
                    ? new Date(deposit.settledAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "today"}
                </Fact>
                <Fact label="Method">{outcome.method}</Fact>
                <Fact label="Amount">
                  <span className="numeric">{outcome.amount}</span>
                </Fact>
              </dl>
            </Well>
          </Section>
        </Sections>

        <Sections className="col-span-5 narrow:col-span-1">
          <Section title="What happens next" collapsible={false}>
            <ol className="space-y-2">
              {outcome.next.map((line, index) => (
                <li key={line} className="flex items-start gap-2">
                  <span className="mt-1 flex size-4 shrink-0 items-center justify-center rounded-full bg-ink-100 text-[0.5625rem] font-bold text-ink-600 numeric">
                    {index + 1}
                  </span>
                  <span className="text-meta leading-4 text-ink-700">{line}</span>
                </li>
              ))}
            </ol>
            <p className="mt-2 text-meta text-ink-400">
              Questions about the money go to {institution.admissionsEmail}.
            </p>
          </Section>
        </Sections>
      </div>
    </StepShell>
  );
}

/** One outcome per branch, so no branch is left without a confirmation. */
export function receiptCopy(choice: DepositChoice, method: string) {
  if (choice === "waiver") {
    return {
      title: "Waiver requested",
      sentence: `Your request is with Student Accounts. They reply within ${depositTerms.waiverReviewDays} working days, and your place is held while they do.`,
      amount: "$0, pending review",
      method: "Waiver request",
      processing: true,
      next: [
        "Student Accounts reviews your request",
        "They write to you with a decision",
        `If it is declined, the deposit is due by ${DEADLINE}`,
      ],
    };
  }

  if (choice === "pay-by-deadline") {
    return {
      title: "Scheduled",
      sentence: `Nothing has been charged. Student Accounts will invoice you ${AMOUNT}, due ${DEADLINE}.`,
      amount: AMOUNT,
      method: "Invoice from Student Accounts",
      processing: true,
      next: [
        "Student Accounts sends your invoice",
        `You pay ${AMOUNT} by ${DEADLINE}`,
        `The rest of your first term's bill is due ${BALANCE_DUE}`,
      ],
    };
  }

  if (method === "bank-transfer") {
    return {
      title: "Processing",
      sentence: `Your bank transfer of ${AMOUNT} is on its way. It usually clears in two to three working days.`,
      amount: AMOUNT,
      method: "Bank transfer",
      processing: true,
      next: [
        "Your transfer clears, usually in two to three working days",
        "The deposit is credited to your first term's bill",
        `The balance is due ${BALANCE_DUE}`,
      ],
    };
  }

  return {
    title: "Paid",
    sentence: `We charged ${AMOUNT} to your card. Your place is confirmed.`,
    amount: AMOUNT,
    method: "Card",
    processing: false,
    next: [
      "Deposit received",
      "Credited to your first term's bill",
      `The balance is due ${BALANCE_DUE}`,
    ],
  };
}
