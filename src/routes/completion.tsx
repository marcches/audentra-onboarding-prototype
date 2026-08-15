import { ArrowRightIcon, CaretDownIcon, CheckIcon, ShareNetworkIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import confetti from "canvas-confetti";
import { motion, useReducedMotion } from "motion/react";
import * as React from "react";

import { Balance } from "@/components/balance";
import { PricePill, usePointsAward } from "@/components/points-award";
import { ShareCard } from "@/components/share-card";
import { IconTile, Panel, Well } from "@/components/surfaces";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/wordmark";
import { enrollment, institution, studentRecord } from "@/lib/fixtures";
import { residenceById } from "@/lib/housing";
import { creditReleased, formatCredit, SHARE_POINTS, totalPoints } from "@/lib/points";
import { groupsFor } from "@/lib/steps";
import { completedSteps, patch, studentStatus, useOnboarding } from "@/lib/store";
import { cn } from "@/lib/utils";
import { receiptCopy } from "@/routes/deposit";

/**
 * Enrolled: hand over an object, not a message.
 *
 * The research was unanimous, and it is not what a bigger confetti burst would
 * suggest: the products that end a flow well **hand over a thing**. CRED
 * activates a membership, Qonto and Zing deliver a card, Qantas delivers a
 * membership number. None of them delivers a sentence.
 *
 * It absorbs the deposit receipt, so the flow has **one** ending rather than
 * two in a row with opposing registers. A sober receipt followed by a
 * celebration is an anticlimax; the receipt lives here as a collapsible Well,
 * subordinate to the object, and the tax-relevant information is a section
 * rather than a screen.
 *
 * The primary action is **spending** the credit, not closing the page (Alan's
 * "Use your berries"). Done is secondary, sharing is tertiary.
 */
export function CompletionRoute() {
  const state = useOnboarding();
  const award = usePointsAward();
  const reduceMotion = useReducedMotion();

  const points = totalPoints(state);
  const credit = creditReleased(points);
  const done = new Set(completedSteps(state));
  const groups = groupsFor(studentStatus(state)).filter((group) => group.kind !== "after");
  const residence = residenceById(state.housing.residenceRanking[0] ?? "");
  const shared = state.offer.shared;

  const [showReceipt, setShowReceipt] = React.useState(false);

  /* Short, and behind the card. The weight comes from the object arriving, not
     from particles: nine hundred milliseconds is enough to register and short
     enough that it is over before the card has finished landing. */
  React.useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setTimeout(() => {
      confetti({
        particleCount: 90,
        spread: 70,
        startVelocity: 32,
        ticks: 120,
        origin: { y: 0.42 },
        zIndex: 0,
        colors: ["#6a38ff", "#1e5bff", "#00c49a"],
      });
    }, 320);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  const outcome = receiptCopy(state.deposit.choice, state.deposit.method);

  return (
    <main className="relative isolate min-h-dvh bg-canvas decision-ground">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-5 py-12">
        {/* Voice carries this, not an illustration. */}
        <p className="text-micro font-bold tracking-[0.18em] text-violet-600 uppercase">Enrolled</p>
        <h1 className="mt-2 text-center text-h1 text-ink-900 text-balance sm:text-display">
          That is it. You are an {institution.short} student.
        </h1>
        <p className="mt-2 max-w-md text-center text-lead text-ink-600">
          We will write to you in July with your room and your move-in window.
        </p>

        {/* The object. It arrives with a flip-in from nothing, and this is the
            one screen where a real timeline would earn `gsap` — a single
            rotateY with an overshoot does not, so `motion` keeps it. */}
        <motion.div
          initial={reduceMotion ? false : { rotateY: 92, opacity: 0, y: 24 }}
          animate={{ rotateY: 0, opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ perspective: 1200 }}
          className="mt-8"
        >
          <StudentCard residence={residence?.name} />
        </motion.div>

        {/* The journey as a receipt: Phases with checks and their Points,
            totalling into a full-size Balance with its conversion (Headway,
            Greenlight). */}
        <Panel title="What you did" className="mt-10 w-full">
          <ol className="space-y-4">
            {groups.map((group) => (
              <li key={group.id}>
                <p className="field-label">{group.label}</p>
                <ul className="mt-1.5 space-y-1">
                  {group.steps.map((step) => {
                    const complete = done.has(step.id);
                    return (
                      <li key={step.id} className="flex items-center gap-2.5">
                        <span
                          className={cn(
                            "flex size-4 shrink-0 items-center justify-center rounded-full",
                            complete ? "bg-mint-500 text-white" : "bg-ink-100",
                          )}
                        >
                          {complete ? (
                            <CheckIcon weight="bold" aria-hidden className="size-2.5" />
                          ) : null}
                        </span>
                        <span
                          className={cn(
                            "flex-1 text-body",
                            complete ? "text-ink-800" : "text-ink-400",
                          )}
                        >
                          {step.label}
                        </span>
                        {complete && step.points > 0 ? (
                          <PricePill points={step.points} size="rail" earned />
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ol>

          <div className="mt-6 border-t border-ink-100 pt-5">
            <Balance variant="full" />
          </div>
        </Panel>

        {/* The deposit receipt, subordinate. Collapsed by default, so it does
            not force a long scroll past the thing being celebrated. */}
        <div className="mt-4 w-full">
          <button
            type="button"
            onClick={() => setShowReceipt((current) => !current)}
            aria-expanded={showReceipt}
            className="row-nudge flex w-full items-center gap-2 rounded-[var(--radius-field)] bg-well px-4 py-3 text-left"
          >
            <CaretDownIcon
              weight="bold"
              aria-hidden
              className={cn(
                "size-4 text-ink-400 transition-transform duration-[var(--duration-base)]",
                !showReceipt && "-rotate-90",
              )}
            />
            <span className="flex-1 text-body font-strong text-ink-800">Your deposit receipt</span>
            <span className="text-small text-ink-500 numeric">{outcome.amount}</span>
          </button>

          {showReceipt ? (
            <Well className="mt-2 space-y-3">
              <dl className="space-y-1.5">
                <Row label="Reference" value={state.deposit.reference || "pending"} />
                <Row label="Method" value={outcome.method} />
                <Row label="Amount" value={outcome.amount} />
              </dl>
              <ol className="space-y-1.5 border-t border-ink-100 pt-3">
                {outcome.next.map((line, index) => (
                  <li key={line} className="flex gap-2.5 text-small text-ink-600">
                    <span className="numeric text-ink-400">{index + 1}.</span>
                    {line}
                  </li>
                ))}
              </ol>
            </Well>
          ) : null}
        </div>

        {/* Primary action is spending, not closing. */}
        <div className="mt-8 flex w-full flex-col items-center gap-3">
          {/* Spending is the primary action, not closing. At zero credit the
              verb still points at the bookstore rather than offering to spend
              nothing, which would read as a bug rather than as a balance. */}
          <Button type="button" size="lg" className="w-full max-w-sm">
            {credit > 0 ? `Spend ${formatCredit(credit)} at the bookstore` : "Open the bookstore"}
            <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
          </Button>

          <div className="flex items-center gap-3">
            <Button asChild variant="ghost">
              <Link to="/onboarding/review">Done for now</Link>
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={shared}
              onClick={() => {
                if (shared) return;
                patch("offer", { shared: true });
                award?.celebrate("share", SHARE_POINTS);
              }}
            >
              <ShareNetworkIcon weight="fill" aria-hidden className="size-4" />
              {shared ? "Shared" : "Share this"}
            </Button>
          </div>
        </div>

        {/* The 4:5 card with four metrics, over a gradient ground. */}
        <div className="mt-10">
          <ShareCard
            eyebrow="Enrolled"
            headline={`I am an ${institution.short} student.`}
            metrics={[
              { label: "Quests", value: String(done.size) },
              { label: "Points", value: String(points) },
              { label: "Residence", value: residence?.name ?? "To be assigned" },
              { label: "Enrolled", value: String(enrollment.entryYear) },
            ]}
          />
        </div>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-small text-ink-500">{label}</dt>
      <dd className="font-mono text-small text-ink-800">{value}</dd>
    </div>
  );
}

/**
 * The object itself: name, enrolment ID, the Residence they ranked first, and
 * the entry year. This is what gets screenshotted, and designing for that is
 * the point.
 */
function StudentCard({ residence }: { residence?: string }) {
  return (
    <div className="brand-gradient relative isolate flex aspect-[1.586/1] w-[22rem] flex-col justify-between overflow-hidden rounded-[var(--radius-slab)] p-5 text-white shadow-lift sm:w-[26rem]">
      <span
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_85%_10%,rgb(255_255_255/0.26),transparent_70%)]"
      />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.625rem] font-bold tracking-[0.14em] uppercase opacity-80">
            {institution.name}
          </p>
          <p className="text-small opacity-80">Student card</p>
        </div>
        <IconTile size="sm" className="bg-white/20 text-white">
          <span className="text-small font-bold">
            {studentRecord.legalFirstName[0]}
            {studentRecord.legalLastName[0]}
          </span>
        </IconTile>
      </div>

      <div>
        <p className="text-h2 font-bold">
          {studentRecord.legalFirstName} {studentRecord.legalLastName}
        </p>
        {/* Uneven columns: the enrolment ID is the longest string on the card
            and an even third wraps it onto two lines, which on a card that is
            meant to be screenshotted is the one thing that must not happen. */}
        <dl className="mt-3 grid grid-cols-[1.5fr_1fr_0.6fr] gap-3">
          <div>
            <dt className="text-[0.5625rem] font-bold tracking-[0.1em] uppercase opacity-70">
              Enrolment ID
            </dt>
            <dd className="text-small font-bold numeric">{enrollment.id}</dd>
          </div>
          <div>
            <dt className="text-[0.5625rem] font-bold tracking-[0.1em] uppercase opacity-70">
              Residence
            </dt>
            <dd className="truncate text-small font-bold">{residence ?? "To be assigned"}</dd>
          </div>
          <div>
            <dt className="text-[0.5625rem] font-bold tracking-[0.1em] uppercase opacity-70">
              Class of
            </dt>
            <dd className="text-small font-bold numeric">{enrollment.classOf}</dd>
          </div>
        </dl>
      </div>

      <Wordmark className="absolute right-5 bottom-5 h-3 opacity-70" tone="knockout" />
    </div>
  );
}
