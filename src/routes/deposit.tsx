import {
  ArrowRightIcon,
  CalendarCheckIcon,
  CreditCardIcon,
  HandHeartIcon,
  LockSimpleIcon,
  SealCheckIcon,
} from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";
import { useReducedMotion } from "motion/react";
import * as React from "react";

import { Field } from "@/components/field";
import { Notice } from "@/components/notice";
import { SectionTitle, StepActions, StepShell } from "@/components/step-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatDeadline, formatMoney, institution, offer } from "@/lib/fixtures";
import { patch, useOnboarding } from "@/lib/store";

const CountUp = React.lazy(() => import("@/components/reactbits/CountUp"));

const AMOUNT = formatMoney(offer.depositAmount, offer.depositCurrency);

/** Digits only, grouped in fours — the formatting a card field is expected to do. */
function formatCardNumber(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

/**
 * Deposit.
 *
 * The three answers are unchanged — pay now, accept now and pay by the
 * deadline, or ask for a waiver — plus the skip that already existed. What's
 * new is that "pay now" goes somewhere: a card form and a confirmation, both
 * simulated. There is no gateway behind it and no decision about which one
 * there will be; the screen validates the moment, not the integration. If that
 * question comes up in the demo, that is the answer.
 */
export function DepositRoute() {
  const state = useOnboarding();
  const navigate = useNavigate();
  const deposit = state.deposit;

  /**
   * Answering the deposit and skipping it are not the same event.
   *
   * Both used to call this with `submitted: true`, which marked an untouched,
   * unpaid deposit as a done step — the rail then read "6 of 6 saved" with a
   * tick on Deposit, and the arrival screen told a student who had just
   * declined to pay that nothing was waiting on them. Skipping now leaves the
   * step open, which is what it is.
   */
  const finish = (answered: boolean) => {
    if (answered) patch("deposit", { submitted: true });
    navigate({ to: "/done" });
  };

  return (
    <StepShell
      current="deposit"
      title="Hold your place"
      lead={`The deposit is credited against your first term's tuition — it isn't an extra charge. Refundable up to ${formatDeadline(offer.responseDeadline)}.`}
    >
      <AmountCard />

      {deposit.paid ? (
        <PaidReceipt />
      ) : (
        <section className="space-y-4">
          <SectionTitle>How would you like to handle it?</SectionTitle>
          <div className="grid gap-3">
            <ChoiceCard
              value="pay-now"
              current={deposit.choice}
              icon={<CreditCardIcon weight="duotone" aria-hidden className="size-5" />}
              title={`Pay ${AMOUNT} now`}
              hint="Takes a minute. Your place is confirmed straight away."
            />
            <ChoiceCard
              value="pay-by-deadline"
              current={deposit.choice}
              icon={<CalendarCheckIcon weight="duotone" aria-hidden className="size-5" />}
              title="Accept now, pay by the deadline"
              hint={`Your place is held until ${formatDeadline(offer.responseDeadline)}. Student Accounts will send a reminder.`}
            />
            <ChoiceCard
              value="waiver"
              current={deposit.choice}
              icon={<HandHeartIcon weight="duotone" aria-hidden className="size-5" />}
              title="Ask for a waiver or a later date"
              hint="If paying now isn't possible. Asking doesn't affect your offer."
            />
          </div>

          {deposit.choice === "pay-now" ? <CardForm /> : null}
          {deposit.choice === "pay-by-deadline" ? (
            <Notice tone="info" title="Nothing to pay today">
              Your place is held. The {AMOUNT} is due by {formatDeadline(offer.responseDeadline)},
              and Student Accounts will email you before then.
            </Notice>
          ) : null}
          {deposit.choice === "waiver" ? <WaiverRequest /> : null}
        </section>
      )}

      <StepActions>
        <Button type="button" variant="ghost" size="lg" onClick={() => finish(false)}>
          Skip for now
        </Button>
        <Button
          type="button"
          size="lg"
          disabled={!deposit.choice && !deposit.paid}
          onClick={() => finish(true)}
        >
          Finish enrollment
          <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
        </Button>
      </StepActions>
    </StepShell>
  );
}

/**
 * The amount, counted up. It is the one number on the screen that matters, and
 * the whole screen is about whether you can find it right now.
 */
function AmountCard() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="flex flex-col gap-4 rounded-[var(--radius-slab)] border border-ink-100 bg-surface p-6 shadow-card sm:flex-row sm:items-center sm:p-7">
      <div className="flex-1">
        <p className="field-label">Enrollment deposit</p>
        <p className="text-display font-black tracking-[-0.03em] text-ink-900">
          {reduceMotion ? (
            AMOUNT
          ) : (
            <React.Suspense fallback={AMOUNT}>
              {/* The odometer is decoration over a plain, always-correct
                  string: a screen reader should be told $500, not read a
                  number that is still climbing. */}
              <span className="sr-only">{AMOUNT}</span>
              <span aria-hidden>
                $
                <CountUp to={offer.depositAmount} duration={0.85} separator="," />
              </span>
            </React.Suspense>
          )}
        </p>
        <p className="text-small text-ink-500">
          Credited against tuition · Refundable until {formatDeadline(offer.responseDeadline)}
        </p>
      </div>
      <span className="brand-gradient flex size-12 shrink-0 items-center justify-center rounded-[var(--radius-card)] text-white">
        <SealCheckIcon weight="fill" aria-hidden className="size-6" />
      </span>
    </section>
  );
}

function ChoiceCard({
  value,
  current,
  icon,
  title,
  hint,
}: {
  value: "pay-now" | "pay-by-deadline" | "waiver";
  current: string;
  icon: React.ReactNode;
  title: string;
  hint: string;
}) {
  const selected = current === value;

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => patch("deposit", { choice: value })}
      className={`flex items-start gap-3.5 rounded-[var(--radius-card)] border p-4 text-left transition-[border-color,box-shadow] ${
        selected
          ? "border-violet-500 bg-violet-50/50 shadow-[0_0_0_1px_var(--color-violet-500)]"
          : "border-ink-200 bg-surface hover:border-ink-300 hover:shadow-soft"
      }`}
    >
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-violet-50 text-violet-600">
        {icon}
      </span>
      <span className="flex-1">
        <span className="block text-body font-bold text-ink-900">{title}</span>
        <span className="block text-small text-ink-500">{hint}</span>
      </span>
    </button>
  );
}

/**
 * A simulated card form. It formats, it validates shape, and it talks to
 * nobody — no gateway, no network call, no card number kept beyond the last
 * four in localStorage for the receipt line.
 */
function CardForm() {
  const [number, setNumber] = React.useState("");
  const [expiry, setExpiry] = React.useState("");
  const [cvc, setCvc] = React.useState("");
  const [name, setName] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const digits = number.replace(/\D/g, "");
  const expiryValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry);
  const complete = digits.length === 16 && expiryValid && cvc.length >= 3 && name.trim().length > 1;

  /**
   * The "processing" beat is cancelled if this form goes away, because a
   * pending timer writing to a module-level store outlives the component that
   * scheduled it. Without the cleanup, clicking "Pay" and then changing your
   * mind inside 900ms — picking the waiver, or skipping the step — still marks
   * the deposit paid, which is the worst possible moment to be told you paid.
   */
  const timer = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  const pay = () => {
    setSubmitting(true);
    // A beat of "processing", because an instant success reads as a button that
    // did nothing. It is a timer, not a request.
    timer.current = window.setTimeout(() => {
      timer.current = null;
      patch("deposit", {
        paid: true,
        paidAt: new Date().toISOString(),
        cardLast4: digits.slice(-4),
      });
    }, 900);
  };

  return (
    <div className="space-y-5 rounded-[var(--radius-card)] border border-ink-200 bg-surface p-5">
      <Notice tone="info" title="This payment is simulated">
        No gateway is connected in this prototype and nothing is charged. Type any 16 digits — the
        number isn't stored.
      </Notice>

      <Field label="Card number" htmlFor="card-number">
        <Input
          id="card-number"
          inputMode="numeric"
          autoComplete="off"
          placeholder="4242 4242 4242 4242"
          value={number}
          onChange={(event) => setNumber(formatCardNumber(event.target.value))}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Expiry" htmlFor="card-expiry" hint="MM/YY">
          <Input
            id="card-expiry"
            inputMode="numeric"
            autoComplete="off"
            placeholder="09/29"
            value={expiry}
            onChange={(event) => {
              const raw = event.target.value.replace(/\D/g, "").slice(0, 4);
              setExpiry(raw.length > 2 ? `${raw.slice(0, 2)}/${raw.slice(2)}` : raw);
            }}
          />
        </Field>
        <Field label="Security code" htmlFor="card-cvc">
          <Input
            id="card-cvc"
            inputMode="numeric"
            autoComplete="off"
            placeholder="123"
            value={cvc}
            onChange={(event) => setCvc(event.target.value.replace(/\D/g, "").slice(0, 4))}
          />
        </Field>
      </div>

      <Field label="Name on card" htmlFor="card-name">
        <Input
          id="card-name"
          autoComplete="off"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </Field>

      <Button
        type="button"
        size="lg"
        className="w-full"
        disabled={!complete || submitting}
        onClick={pay}
      >
        <LockSimpleIcon weight="fill" aria-hidden className="size-4" />
        {submitting ? "Taking payment…" : `Pay ${AMOUNT}`}
      </Button>
    </div>
  );
}

function PaidReceipt() {
  const state = useOnboarding();
  const paidAt = state.deposit.paidAt;

  return (
    <Notice tone="success" title={`${AMOUNT} paid`}>
      Card ending {state.deposit.cardLast4 || "••••"}, on{" "}
      {new Date(paidAt ?? Date.now()).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })}
      . Your place is confirmed and the amount is credited against your first term. A receipt goes
      to your {institution.short} address once email is switched on.
    </Notice>
  );
}

function WaiverRequest() {
  const state = useOnboarding();

  return (
    <div className="space-y-4 rounded-[var(--radius-card)] border border-ink-200 bg-surface p-5">
      <Notice tone="info" title="Asking costs you nothing">
        Student Accounts reviews these individually and it has no bearing on your offer. Most
        answers come back within five working days.
      </Notice>

      <Field
        label="What's going on?"
        htmlFor="waiver-reason"
        optional
        hint="A sentence is plenty. You don't need to prove anything here."
      >
        <Textarea
          id="waiver-reason"
          value={state.deposit.waiverReason}
          onChange={(event) => patch("deposit", { waiverReason: event.target.value })}
          placeholder="I can pay, but not before my student loan lands in September."
        />
      </Field>
    </div>
  );
}
