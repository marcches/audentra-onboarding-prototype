import {
  ArrowRightIcon,
  BankIcon,
  CheckCircleIcon,
  CreditCardIcon,
  HourglassMediumIcon,
} from "@phosphor-icons/react";
import type * as React from "react";

import { Field } from "@/components/field";
import { OptionCard } from "@/components/option-card";
import { AwardStage, PricePill, usePointsAward } from "@/components/points-award";
import { BackButton, StepShell, steadyAction, useStepNav } from "@/components/step-shell";
import { OnGround, Panel, Well } from "@/components/surfaces";
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
 * The Deposit, redrawn from nothing as a checkout.
 *
 * The client's brief: make it an experience the user has already had. Three
 * screens behind **one rail entry**, because a checkout is one thing to anyone
 * who has bought something online, and three rail entries would make the
 * Closing larger than a Phase.
 *
 * What deliberately does **not** come across from e-commerce, and the first is
 * a matter of ethics rather than taste:
 *
 * - **No urgency of any kind.** No countdown, no "held for 09:58", no scarcity.
 *   Applying purchase pressure to a financial obligation, from an institution
 *   that has already admitted the student, is coercive and reads as a scam.
 * - No cart vocabulary, no upsells, no promo code field, no BNPL branding, no
 *   marketing opt-ins, and no confetti on the receipt.
 * - The button says the amount. The confirmation says a place is confirmed. A
 *   seat is not an order.
 *
 * The gateway is not connected: screen two simulates and screen three is real.
 * The sequence survives unchanged when a gateway lands.
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
          <Button
            type="button"
            size="lg"
            className={steadyAction}
            disabled={!ready}
            onClick={() => set({ screen: "double-check" })}
          >
            Review before paying
            <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
          </Button>
        </>
      }
    >
      {/* The checkout's asymmetry: the form is on the Ground and only the
          summary is framed. Framing both halves would erase the emphasis that
          makes the summary the summary (Squarespace). This is the third
          documented Ground exception. */}
      <div className="grid gap-5 lg:grid-cols-12">
        <OnGround reason="checkout-asymmetry" as="section" className="space-y-6 lg:col-span-7">
          <NumberedCard number={1} title="How you want to pay">
            <RadioGroup
              className="grid gap-2.5"
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
          </NumberedCard>

          {/* Choosing the waiver collapses what follows rather than leaving the
              checkout. Requesting a waiver is a valid outcome, not an exit. */}
          {waiver ? (
            <NumberedCard number={2} title="Why are you requesting a waiver?">
              <Field
                label="Your reason"
                htmlFor="waiver-reason"
                hint="A sentence is enough. Student Accounts reads these."
              >
                <Textarea
                  id="waiver-reason"
                  rows={3}
                  value={deposit.waiverReason}
                  onChange={(event) => set({ waiverReason: event.target.value })}
                />
              </Field>
            </NumberedCard>
          ) : payingNow ? (
            <NumberedCard number={2} title="Payment method">
              {/* Collapsed accordion rows: only the chosen one expands
                  (Codecademy). Method and schedule are one decision, not two
                  screens (Shop). */}
              <div className="space-y-2.5">
                <MethodRow
                  id="card"
                  icon={<CreditCardIcon weight="fill" aria-hidden className="size-5" />}
                  label="Card"
                  selected={deposit.method === "card"}
                  onSelect={() => set({ method: "card" })}
                >
                  <div className="grid gap-3 pt-3 sm:grid-cols-2">
                    <Field label="Name on card" htmlFor="card-name">
                      <Input
                        id="card-name"
                        value={deposit.cardName}
                        onChange={(event) => set({ cardName: event.target.value })}
                      />
                    </Field>
                    <Field label="Card number" htmlFor="card-number">
                      <Input
                        id="card-number"
                        inputMode="numeric"
                        placeholder="4242 4242 4242 4242"
                        value={deposit.cardNumber}
                        onChange={(event) => set({ cardNumber: event.target.value })}
                      />
                    </Field>
                  </div>
                  <p className="pt-2 text-small text-ink-400">
                    No gateway is connected in this prototype. Nothing is charged.
                  </p>
                </MethodRow>

                <MethodRow
                  id="bank-transfer"
                  icon={<BankIcon weight="fill" aria-hidden className="size-5" />}
                  label="Bank transfer"
                  selected={deposit.method === "bank-transfer"}
                  onSelect={() => set({ method: "bank-transfer" })}
                >
                  <p className="pt-3 text-small text-ink-600">
                    Takes two to three working days to clear. Your place is held from the moment you
                    confirm.
                  </p>
                </MethodRow>
              </div>
            </NumberedCard>
          ) : (
            /* Card two exists before it can be answered, muted. Without it the
               numbering jumps from 1 to 3 the moment the screen loads, which
               reads as a step having gone missing. */
            <NumberedCard number={2} title="Payment method" muted>
              <p className="text-small text-ink-600">Choose how you want to pay first.</p>
            </NumberedCard>
          )}

          <NumberedCard number={3} title="Review" muted={!ready}>
            <p className="text-small text-ink-600">
              {ready
                ? "Nothing has been charged yet. The next screen shows what you are about to do."
                : "Answer the steps above and this opens."}
            </p>
          </NumberedCard>
        </OnGround>

        <DepositSummary waiver={waiver} className="lg:col-span-5" />
      </div>
    </StepShell>
  );
}

function NumberedCard({
  number,
  title,
  muted = false,
  children,
}: {
  number: number;
  title: string;
  muted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={cn(muted && "opacity-50")}>
      <h2 className="flex items-center gap-2.5 text-h3 text-ink-900">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-ink-900 text-[0.6875rem] font-bold text-white numeric">
          {number}
        </span>
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

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
        "rounded-[var(--radius-field)] border bg-panel px-4 py-3",
        "transition-[border-color,background-color] duration-[var(--duration-base)]",
        selected ? "border-violet-400 bg-violet-50/50" : "border-ink-200",
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-expanded={selected}
        aria-controls={`method-${id}`}
        className="flex w-full items-center gap-3 text-left"
      >
        <span className="text-ink-500">{icon}</span>
        <span className="flex-1 text-body font-strong text-ink-900">{label}</span>
      </button>
      {selected ? <div id={`method-${id}`}>{children}</div> : null}
    </div>
  );
}

/**
 * The Deposit summary, pinned beside the form and never scrolling away, ending
 * in a bolded **Due today** on its own line, distinct from the subtotal
 * (Airbnb, Squarespace, Fresha).
 *
 * This replaces a full-width amount band. A number that large with no price
 * context reads as a banner rather than as a total.
 */
function DepositSummary({ waiver, className }: { waiver: boolean; className?: string }) {
  return (
    <div className={className}>
      <Panel title="Deposit" className="lg:sticky lg:top-6">
        <dl className="space-y-2">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-small text-ink-600">Enrollment deposit</dt>
            <dd className="text-body text-ink-800 numeric">{AMOUNT}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-small text-ink-600">Credited against your first term's tuition</dt>
            <dd className="text-body text-mint-deep numeric">-{AMOUNT}</dd>
          </div>
        </dl>

        <div className="mt-3 flex items-baseline justify-between gap-4 border-t border-ink-100 pt-3">
          <span className="text-body font-strong text-ink-900">Due today</span>
          <span className="text-h3 font-bold text-ink-900 numeric">
            {waiver ? "$0, pending review" : AMOUNT}
          </span>
        </div>

        <p className="mt-3 text-small text-ink-500">
          {waiver
            ? `Student Accounts reviews waiver requests within ${depositTerms.waiverReviewDays} working days. Your place is held while they do.`
            : `Refundable in full until ${DEADLINE}.`}
        </p>
      </Panel>
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
  const award = usePointsAward();

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
          <Button type="button" size="lg" className={steadyAction} onClick={confirm}>
            {label}
            <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
          </Button>
        </>
      }
    >
      <div className="grid gap-5 lg:grid-cols-12">
        <OnGround reason="checkout-asymmetry" as="section" className="space-y-3 lg:col-span-7">
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

          <Well label="The deposit policy, in short" className="mt-2">
            <ul className="space-y-1.5 text-small leading-5 text-ink-700">
              <li>The deposit is {AMOUNT} and it is credited against your first term's bill.</li>
              <li>It is refundable in full until {DEADLINE}, and not after it.</li>
              <li>If you withdraw after that date you forfeit the deposit and nothing else.</li>
            </ul>
          </Well>
        </OnGround>

        <DepositSummary waiver={waiver} className="lg:col-span-5" />
      </div>

      <AwardStage stepId="deposit" headline="Your place is secured.">
        <Button type="button" size="lg" onClick={() => set({ screen: "receipt" })}>
          See your receipt
          <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
        </Button>
      </AwardStage>
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
    <div className="flex items-center gap-3 rounded-[var(--radius-field)] border border-ink-100 bg-panel px-4 py-3">
      <CheckCircleIcon weight="fill" aria-hidden className="size-5 shrink-0 text-mint-600" />
      <span className="min-w-0 flex-1">
        <span className="block text-small text-ink-500">{label}</span>
        <span className="block truncate text-body text-ink-900">{value}</span>
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
 *
 * No confetti. The sober next-steps timeline is the right register here; the
 * celebration lives on Enrolled.
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
      actions={
        <Button type="button" size="lg" onClick={goNext}>
          Finish
          <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
        </Button>
      }
    >
      <div className="grid gap-5 lg:grid-cols-12">
        <Panel className="lg:col-span-7">
          <div className="flex items-center gap-3">
            {outcome.processing ? (
              <HourglassMediumIcon weight="fill" aria-hidden className="size-8 text-amber-500" />
            ) : (
              <CheckCircleIcon weight="fill" aria-hidden className="size-8 text-mint-600" />
            )}
            <p className="text-h3 text-ink-900 numeric">{outcome.amount}</p>
          </div>

          <Well strong className="mt-4">
            <dl className="space-y-1.5">
              <ReceiptRow label="Reference" value={deposit.reference || "pending"} />
              <ReceiptRow
                label="Date"
                value={
                  deposit.settledAt
                    ? new Date(deposit.settledAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "today"
                }
              />
              <ReceiptRow label="Method" value={outcome.method} />
              <ReceiptRow label="Amount" value={outcome.amount} />
            </dl>
          </Well>
        </Panel>

        <Panel title="What happens next" className="lg:col-span-5">
          <ol className="space-y-3">
            {outcome.next.map((line, index) => (
              <li key={line} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-ink-100 text-[0.625rem] font-bold text-ink-600 numeric">
                  {index + 1}
                </span>
                <span className="text-small leading-5 text-ink-700">{line}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-small text-ink-400">
            Questions about the money go to {institution.admissionsEmail}.
          </p>
        </Panel>
      </div>
    </StepShell>
  );
}

function ReceiptRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-small text-ink-500">{label}</dt>
      <dd className="font-mono text-small text-ink-800">{value}</dd>
    </div>
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
