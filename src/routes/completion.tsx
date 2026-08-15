import { ArrowRightIcon, CheckIcon, ShareNetworkIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import * as React from "react";

import { PricePill, useCelebration } from "@/components/celebration";
import { IconTile } from "@/components/surfaces";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/wordmark";
import { enrollment, institution, studentRecord } from "@/lib/fixtures";
import { residenceById } from "@/lib/housing";
import { creditReleased, formatCredit, SHARE_POINTS, totalPoints } from "@/lib/points";
import { groups as spine } from "@/lib/steps";
import { completedSteps, patch, useOnboarding } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * Enrolled: the dark stage, and the only screen in the flow that changes its
 * ground.
 *
 * That is deliberate and it contradicts the density ruler on purpose. The
 * Salesforce ruler is for screens where somebody is working, and this is not
 * one — it is the end of something. Over a dark stage confetti also renders far
 * more for far fewer particles (Codecademy), which is what lets the rain run
 * for three seconds on a phone without stuttering.
 *
 * The research was unanimous on the rest, and it is not what a bigger burst
 * would suggest: the products that end a flow well **hand over a thing**. CRED
 * activates a membership, Qonto and Zing deliver a card, Qantas delivers a
 * membership number, Mercury gives an object, one line and two actions. None of
 * them delivers a sentence.
 *
 * The eyebrow and the belonging line survive from the CRED reference; what does
 * not survive is that reference's *absence of confetti* — the client asked for
 * it back explicitly, and the reversal is recorded in `docs/design-research.md`
 * rather than quietly applied.
 */
export function CompletionRoute() {
  const state = useOnboarding();
  const celebration = useCelebration();
  const reduceMotion = useReducedMotion();

  const points = totalPoints(state);
  const credit = creditReleased(points);
  const done = new Set(completedSteps(state));
  const groups = spine.filter((group) => group.kind !== "after");
  const residence = residenceById(state.housing.residenceRanking[0] ?? "");
  const shared = state.offer.shared;

  /* Three seconds of sustained rain, behind the card, through the one
     celebration layer. It starts a beat after the card has begun to land so the
     object arrives first and the party is around it, not instead of it. */
  const cheer = celebration?.cheer;
  React.useEffect(() => {
    if (!cheer) return;
    const timer = window.setTimeout(() => cheer("arrival"), 400);
    return () => window.clearTimeout(timer);
  }, [cheer]);

  return (
    <main className="on-dark relative isolate min-h-dvh bg-ink-950">
      {/* The stage's own light. Not the brand gradient — that is a signal, and
          this is a ground. */}
      <span
        aria-hidden
        className="absolute inset-0 z-[var(--z-behind)] bg-[radial-gradient(60%_50%_at_50%_0%,rgb(106_56_255/0.35),transparent_70%),radial-gradient(50%_40%_at_85%_60%,rgb(30_91_255/0.25),transparent_70%)]"
      />

      <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-10">
        <p className="text-micro font-bold tracking-[0.18em] text-violet-300 uppercase">Enrolled</p>
        <h1 className="mt-1.5 text-center text-display text-white text-balance">
          That is it. You are an {institution.short} student.
        </h1>
        <p className="mt-1.5 max-w-sm text-center text-body text-white/70">
          We will write to you in July with your room and your move-in window.
        </p>

        {/* The object, at the centre, arriving with a single flip. */}
        <motion.div
          initial={reduceMotion ? false : { rotateY: 92, opacity: 0, y: 24 }}
          animate={{ rotateY: 0, opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ perspective: 1200 }}
          className="mt-6"
        >
          <StudentCard residence={residence?.name} />
        </motion.div>

        {/* Two concrete actions, and the primary one is **spending** the credit
            rather than closing the page (Alan's "Use your berries"). */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Button type="button" size="lg">
            {credit > 0 ? `Spend ${formatCredit(credit)} at the bookstore` : "Open the bookstore"}
            <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
          </Button>
          <Button
            asChild
            variant="secondary"
            size="lg"
            className="border-white/20 bg-white/10 text-white hover:border-white/30 hover:bg-white/15"
          >
            <Link to="/onboarding/review">See what I signed</Link>
          </Button>
        </div>

        {/* The journey as a receipt: Phases with checks and their Points. On the
            stage it is quiet, at the foot, under the object — it is the proof,
            not the point. */}
        <div className="mt-8 w-full rounded-[var(--radius-card)] border border-white/10 bg-white/5 p-3">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-micro font-bold tracking-[0.06em] text-white/60 uppercase">
              What you did
            </p>
            <p className="text-small text-white/80 numeric">
              {points} points = {formatCredit(credit)} in bookstore credit
            </p>
          </div>

          <ol className="mt-2 grid grid-cols-3 gap-x-4 gap-y-2 compact:grid-cols-1">
            {groups.map((group) => (
              <li key={group.id}>
                <p className="text-micro font-bold tracking-[0.06em] text-white/50 uppercase">
                  {group.label}
                </p>
                <ul className="mt-1 space-y-0.5">
                  {group.steps.map((step) => {
                    const complete = done.has(step.id);
                    return (
                      <li key={step.id} className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            "flex size-3 shrink-0 items-center justify-center rounded-full",
                            complete ? "bg-mint-500 text-ink-950" : "bg-white/15",
                          )}
                        >
                          {complete ? (
                            <CheckIcon weight="bold" aria-hidden className="size-2" />
                          ) : null}
                        </span>
                        <span
                          className={cn(
                            "flex-1 truncate text-small",
                            complete ? "text-white/85" : "text-white/40",
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
        </div>

        <Button
          type="button"
          variant="ghost"
          className="mt-3 text-white/70 hover:bg-white/10 hover:text-white"
          disabled={shared}
          onClick={() => {
            if (shared) return;
            patch("offer", { shared: true });
            celebration?.celebrate("share", SHARE_POINTS);
          }}
        >
          <ShareNetworkIcon weight="fill" aria-hidden className="size-4" />
          {shared ? "Shared" : "Tell people"}
          {!shared ? <PricePill points={SHARE_POINTS} stepId="share" size="rail" /> : null}
        </Button>
      </div>
    </main>
  );
}

/**
 * The object itself: name, enrolment ID, the Residence they ranked first, and
 * the entry year. This is what gets screenshotted, and designing for that is
 * the point.
 */
function StudentCard({ residence }: { residence?: string }) {
  return (
    <div className="brand-gradient relative isolate flex aspect-[1.586/1] w-[22rem] flex-col justify-between overflow-hidden rounded-[var(--radius-slab)] p-4 text-white shadow-lift compact:w-[19rem]">
      <span
        aria-hidden
        className="absolute inset-0 z-[var(--z-behind)] bg-[radial-gradient(70%_60%_at_85%_10%,rgb(255_255_255/0.26),transparent_70%)]"
      />

      <div className="flex items-start justify-between gap-3">
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
        <p className="text-h1 font-bold">
          {studentRecord.legalFirstName} {studentRecord.legalLastName}
        </p>
        {/* Uneven columns: the enrolment ID is the longest string on the card
            and an even third wraps it onto two lines, which on a card that is
            meant to be screenshotted is the one thing that must not happen. */}
        {/* `pr-14` keeps the last column clear of the wordmark in the corner.
            On a card that exists to be screenshotted, a mark sitting on top of
            the enrolment year is the one thing that must not happen. */}
        <dl className="mt-2 grid grid-cols-[1.5fr_1fr_0.6fr] gap-2 pr-14">
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

      <Wordmark className="absolute right-4 bottom-4 h-3 opacity-70" tone="knockout" />
    </div>
  );
}
