import {
  ArrowRightIcon,
  CalendarCheckIcon,
  CreditCardIcon,
  HandHeartIcon,
  SealCheckIcon,
} from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";
import { useReducedMotion } from "motion/react";
import * as React from "react";

import { Field } from "@/components/field";
import { Notice } from "@/components/notice";
import { ContextPanel, SectionTitle, StepActions, StepShell } from "@/components/step-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDeadline, formatMoney, institution, offer } from "@/lib/fixtures";
import { patch, useOnboarding } from "@/lib/store";

const CountUp = React.lazy(() => import("@/components/reactbits/CountUp"));

const AMOUNT = formatMoney(offer.depositAmount, offer.depositCurrency);

/**
 * Deposit.
 *
 * The three answers are unchanged — pay now, accept now and pay by the
 * deadline, or ask for a waiver — plus the skip that already existed.
 *
 * What is gone is the simulated card form. Laura, in the third Jam: "aqui essa
 * parte você pode tirar, tá, que a gente não sabe como vai ser, pode tirar toda
 * essa parte de pagamento aqui." Fifteen seconds later she clicked "Skip for
 * now" and approved the rest — so what leaves is the form, not the step. The
 * reason she gave is indefinition about the production gateway, which was
 * already out of scope, and prototyping card capture pretends to settle
 * something nobody has decided.
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
      title="Your enrollment deposit"
      lead={`This secures your place and is credited against your balance. Refundable up to ${formatDeadline(offer.responseDeadline)}.`}
      context={<AmountPanel />}
    >
      <section className="space-y-4">
        <SectionTitle>How would you like to handle it?</SectionTitle>
        <div className="grid gap-3">
          <ChoiceCard
            value="pay-now"
            current={deposit.choice}
            icon={<CreditCardIcon weight="duotone" aria-hidden className="size-5" />}
            title={`Pay ${AMOUNT} now`}
            hint="Your place is confirmed as soon as the payment clears."
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
            hint="If paying now is not possible. Asking does not affect your offer."
          />
        </div>

        {/* No card fields behind "pay now". The prototype says what would
            happen and stops there — a simulated number, expiry and security
            code would be inventing the one decision the client has not
            made. */}
        {deposit.choice === "pay-now" ? (
          <Notice tone="info" title="Payment is not connected in this prototype">
            Nothing is charged and no card details are asked for. In the live portal this is where
            checkout opens. Your answer is recorded either way, and the deposit stays outstanding
            until it is paid.
          </Notice>
        ) : null}

        {deposit.choice === "pay-by-deadline" ? (
          <Notice tone="info" title="Nothing to pay today">
            Your place is held. The {AMOUNT} is due by {formatDeadline(offer.responseDeadline)}, and
            Student Accounts will email you before then.
          </Notice>
        ) : null}

        {deposit.choice === "waiver" ? <WaiverRequest /> : null}
      </section>

      <StepActions>
        <Button type="button" variant="ghost" size="lg" onClick={() => finish(false)}>
          Skip for now
        </Button>
        <Button type="button" size="lg" disabled={!deposit.choice} onClick={() => finish(true)}>
          Finish enrollment
          <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
        </Button>
      </StepActions>
    </StepShell>
  );
}

/**
 * The fixed column: the amount and the date it is due.
 *
 * The two facts every one of the three options is a decision about, kept beside
 * the options rather than scrolled past above them.
 */
function AmountPanel() {
  const reduceMotion = useReducedMotion();

  return (
    <ContextPanel title="What is owed">
      <div className="flex items-center gap-3">
        <span className="brand-gradient flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-card)] text-white">
          <SealCheckIcon weight="fill" aria-hidden className="size-5" />
        </span>
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
      </div>

      <dl className="space-y-3 border-t border-ink-100 pt-4">
        <div>
          <dt className="field-label">Due by</dt>
          <dd className="text-body font-bold text-ink-900">
            {formatDeadline(offer.responseDeadline)}
          </dd>
        </div>
        <div>
          <dt className="field-label">What it does</dt>
          <dd className="text-small text-ink-600">
            Secures your place in {offer.programme} for {offer.startingTerm} and is credited against
            your first term's tuition.
          </dd>
        </div>
      </dl>
    </ContextPanel>
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

function WaiverRequest() {
  const state = useOnboarding();

  return (
    <div className="space-y-4 rounded-[var(--radius-card)] border border-ink-200 bg-surface p-5">
      <Notice tone="info" title="Asking costs you nothing">
        Student Accounts reviews these individually and it has no bearing on your offer. Most
        answers come back within five working days, to your {institution.short} address.
      </Notice>

      <Field
        label="What is going on?"
        htmlFor="waiver-reason"
        optional
        hint="A sentence is plenty. You do not need to prove anything here."
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
