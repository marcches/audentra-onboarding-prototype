import {
  CalendarBlankIcon,
  EnvelopeSimpleIcon,
  HouseLineIcon,
  IdentificationCardIcon,
  WalletIcon,
} from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/wordmark";
import { legalName } from "@/lib/agreement";
import { formatDeadline, formatMoney, institution, offer } from "@/lib/fixtures";
import { resetOnboarding, useOnboarding } from "@/lib/store";

const LEGAL_NAME = legalName();

const SplitText = React.lazy(() => import("@/components/reactbits/SplitText"));
const LightRays = React.lazy(() => import("@/components/reactbits/LightRays"));

/**
 * The deposit is the only thing on this screen that can still be outstanding.
 * Skipping the step leaves it unanswered, and an arrival screen that says
 * "nothing else is waiting on you today" over an unpaid deposit is how a
 * student misses the deadline believing their place is held.
 */
const OUTSTANDING_DEPOSIT = {
  icon: <WalletIcon weight="duotone" aria-hidden className="size-5" />,
  when: `By ${formatDeadline(offer.responseDeadline)}`,
  title: `Your ${formatMoney(offer.depositAmount, offer.depositCurrency)} deposit`,
  detail:
    "Still outstanding. Your place is held until the deadline and not after it. Pay it, or ask for a waiver, from the Deposit step.",
};

const NEXT_STEPS = [
  {
    icon: <EnvelopeSimpleIcon weight="duotone" aria-hidden className="size-5" />,
    when: "Within 3 working days",
    title: "Your Aster account",
    detail:
      "Login details for email, the library and the student portal arrive at the address you signed up with.",
  },
  {
    icon: <IdentificationCardIcon weight="duotone" aria-hidden className="size-5" />,
    when: "From July",
    title: "Your student ID",
    detail: "We will ask you for a photo. Nothing to do until then.",
  },
  {
    icon: <HouseLineIcon weight="duotone" aria-hidden className="size-5" />,
    when: "After the response deadline",
    title: "Your room",
    detail: `${institution.housingOffice} assigns rooms once everyone has answered, and emails you the building and the move-in window.`,
  },
  {
    icon: <CalendarBlankIcon weight="duotone" aria-hidden className="size-5" />,
    when: "Two weeks before term",
    title: "Registration opens",
    detail: `You'll pick courses for ${offer.startingTerm} with an advisor. Nothing to prepare before then.`,
  },
];

/**
 * The completion screen.
 *
 * Not a step — the trail still counts six, and this is deliberately absent from
 * `steps.ts`. It is the arrival, and the live product has none: the finish
 * button sticks on "Finishing onboarding…" and nobody has ever seen what is on
 * the other side.
 *
 * It plays as a sequence rather than appearing all at once, because arriving is
 * a moment and a moment has an order to it: the ground, the eyebrow, then the
 * sentence completing itself across two lines, then what happens next.
 *
 * Two earlier drafts are worth knowing about. The first put the headline on a
 * split-flap board — mechanical and legible, but it read as a departures screen
 * when what this needed was to speak to a person. The second ran a campus
 * photograph behind everything, which put mid-tones under the largest type on
 * the screen and gave the most important words the worst contrast on the page.
 *
 * Still no confetti. That belongs to accepting the offer; running it twice
 * devalues both.
 */
export function CompletionRoute() {
  const reduceMotion = useReducedMotion();
  const state = useOnboarding();
  /* Beat 0 is everything static. Beat 1 brings the headline in after the
     greeting has had a moment to land. Reduced motion starts at the end. */
  const [beat, setBeat] = React.useState(reduceMotion ? 1 : 0);

  // Paid, or explicitly deferred to the deadline, both count as handled.
  const depositOutstanding = !state.deposit.paid && state.deposit.choice !== "pay-by-deadline";
  const nextSteps = depositOutstanding ? [OUTSTANDING_DEPOSIT, ...NEXT_STEPS] : NEXT_STEPS;

  React.useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setTimeout(() => setBeat(1), 620);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  const rise = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <main className="relative isolate flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-10 text-white">
      {/* Near-black ground rather than a photograph.
          A campus shot was tried here and pulled: every candidate put mid-tones
          straight behind the headline, so the biggest type on the screen had
          the worst contrast on it, and no amount of scrim fixed that without
          reducing the photo to a texture. A dark field with light moving
          through it says "arrival" without competing for the same pixels. */}
      <div aria-hidden className="absolute inset-0 -z-20 bg-ink-950" />

      {reduceMotion ? null : (
        <div aria-hidden className="absolute inset-0 -z-10 opacity-70">
          <React.Suspense fallback={null}>
            <LightRays
              raysOrigin="top-center"
              raysColor="#8a5cff"
              raysSpeed={0.7}
              lightSpread={1.1}
              rayLength={2.4}
              fadeDistance={1.4}
              saturation={0.85}
              followMouse={false}
              noiseAmount={0.06}
              distortion={0.04}
            />
          </React.Suspense>
        </div>
      )}

      {/* The still floor under the rays, and what the screen is when the canvas
          never boots. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_50%_0%,color-mix(in_oklab,var(--color-violet-500)_26%,transparent),transparent_70%),radial-gradient(60%_50%_at_50%_100%,color-mix(in_oklab,var(--color-azure-500)_16%,transparent),transparent_70%)]"
      />

      <div className="flex w-full max-w-[52rem] flex-col items-center gap-7 text-center">
        <motion.div {...rise(0)}>
          <Wordmark tone="on-dark" />
        </motion.div>

        <div className="space-y-4">
          <motion.p
            {...rise(0.1)}
            className="text-micro font-bold tracking-[0.18em] text-white/55 uppercase"
          >
            {institution.name} · {offer.startingTerm}
          </motion.p>

          {/* The h1 carries the sentence for assistive tech in one go; the two
              animated lines below it are the same words, drawn. */}
          <h1 className="sr-only">You're enrolled</h1>

          {/* One line, set the way the wordmark is set: caps, black weight,
              wide tracking. It ties the biggest words in the product back to
              the mark at the top of the same screen, and it reads as a stamp
              rather than as a sentence.

              Still delivered in two beats — the pronoun, then the word that
              carries the news — so the line completes in front of you instead
              of arriving finished. The verb takes the mint the rest of the flow
              uses for "done". */}
          <p
            aria-hidden
            className="arrival-headline flex flex-wrap items-baseline justify-center gap-x-[0.3em] pb-2 text-[clamp(1.9rem,6.4vw,4.25rem)] leading-[1.05] font-black tracking-[0.06em] uppercase"
          >
            <ArrivalLine text="You're" reduceMotion={reduceMotion} />
            <span className="text-mint-500">
              {beat === 0 ? (
                /* Holds the width the word will occupy, so its arrival doesn't
                   re-centre the line under the reader. */
                <span className="invisible">enrolled</span>
              ) : (
                <ArrivalLine text="enrolled" reduceMotion={reduceMotion} lift />
              )}
            </span>
          </p>

          <motion.p {...rise(1.5)} className="mx-auto max-w-[36rem] text-lead text-white/75">
            {depositOutstanding
              ? "Your record is live. One thing is still open — your deposit, in the first card below."
              : "Your record is live. Nothing needs you right now. We will tell you when something does."}
          </motion.p>
        </div>

        <ul className="grid w-full gap-3 text-left sm:grid-cols-2">
          {nextSteps.map((entry, index) => (
            <motion.li
              key={entry.title}
              {...rise(1.55 + index * 0.09)}
              className="flex gap-3.5 rounded-[var(--radius-card)] border border-white/15 bg-white/8 p-4 backdrop-blur-sm"
            >
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-white/12 text-white">
                {entry.icon}
              </span>
              <div className="space-y-1">
                <p className="text-micro font-bold tracking-[0.06em] text-mint-500 uppercase">
                  {entry.when}
                </p>
                <p className="text-body font-bold text-white">{entry.title}</p>
                <p className="text-small text-white/65">{entry.detail}</p>
              </div>
            </motion.li>
          ))}
        </ul>

        {/* The signature, as a record.
            The link here used to go back to an editable pad, which undoes the
            feeling of having signed something: the thing you are shown when you
            ask "what did I sign" should be the signed article, with its date and
            its reference, not the control that made it. */}
        {state.review.submitted ? (
          <motion.div
            {...rise(1.9)}
            className="w-full rounded-[var(--radius-card)] border border-white/15 bg-white/8 p-5 text-left backdrop-blur-sm"
          >
            <p className="text-micro font-bold tracking-[0.06em] text-white/55 uppercase">
              Enrollment Agreement · signed
            </p>
            <div className="mt-2 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
              <p
                className="text-[2rem] leading-none text-white"
                style={{ fontFamily: "var(--font-script)" }}
              >
                {state.review.signatureMode === "draw" && state.review.drawnSignature ? (
                  <img
                    src={state.review.drawnSignature}
                    alt={`Signature of ${LEGAL_NAME}`}
                    /* The pad draws in navy on a light ground; on this dark
                       field it has to be inverted to be visible at all. */
                    className="h-14 w-auto max-w-full invert"
                  />
                ) : (
                  state.review.typedSignature.trim() || LEGAL_NAME
                )}
              </p>
              <p className="text-small text-white/60">
                {new Date(state.review.signedAt ?? Date.now()).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
                {state.review.reference ? ` · ${state.review.reference}` : ""}
              </p>
            </div>
          </motion.div>
        ) : null}

        <motion.div {...rise(2)} className="flex flex-col items-center gap-3">
          <Button asChild size="lg" variant="secondary">
            <Link to="/onboarding/review">Read my agreement again</Link>
          </Button>
          {/* A prototype gets walked through more than once. This is the reset,
              labelled as what it is rather than dressed up as a product link. */}
          <button
            type="button"
            onClick={() => {
              resetOnboarding();
              window.location.href = "/entry";
            }}
            className="text-small text-white/50 underline underline-offset-4 transition-colors hover:text-white/80"
          >
            Prototype: clear everything and start again
          </button>
        </motion.div>
      </div>
    </main>
  );
}

/**
 * One line of the headline. `lift` is the second line's bigger entrance — it is
 * the word carrying the news, so it travels further and lands later.
 */
function ArrivalLine({
  text,
  reduceMotion,
  lift = false,
}: {
  text: string;
  reduceMotion: boolean | null;
  lift?: boolean;
}) {
  if (reduceMotion) return <span>{text}</span>;

  return (
    <React.Suspense fallback={<span className="invisible">{text}</span>}>
      <SplitText
        text={text}
        tag="span"
        splitType="chars"
        delay={lift ? 38 : 30}
        duration={lift ? 1 : 0.85}
        ease="power4.out"
        threshold={0}
        rootMargin="0px"
        from={{ opacity: 0, y: lift ? 72 : 48, scale: 0.94, filter: "blur(12px)" }}
        to={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      />
    </React.Suspense>
  );
}
