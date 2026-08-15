import { ArrowRightIcon, CheckCircleIcon, ProhibitIcon } from "@phosphor-icons/react";
import * as React from "react";

import { StepShell, useStepNav } from "@/components/step-shell";
import { Button } from "@/components/ui/button";
import { campusPhotos, formatDeadline, formatMoney, institution, offer } from "@/lib/fixtures";
import { patch, useOnboarding } from "@/lib/store";

/* The celebration drags in GSAP and canvas-confetti — a third of the bundle for
   one moment nobody reaches on first paint. Loaded when it is actually needed. */
const CelebrationDialog = React.lazy(() =>
  import("@/components/celebration-dialog").then((module) => ({
    default: module.CelebrationDialog,
  })),
);

const DEPOSIT = formatMoney(offer.depositAmount, offer.depositCurrency);
const DEADLINE = formatDeadline(offer.responseDeadline);

/**
 * The offer, in one viewport.
 *
 * What this replaces was a 200px hero, a four-cell grid with a line of prose
 * under every cell, a deposit section, and a numbered "What happens when you
 * accept" — four full-width slabs and about two and a half screens. Laura's
 * constraint was specific about the fix: "esses cards estão muito grandes… eu
 * não quero também empilhar" — the cards get *smaller*, they do not get turned
 * into a taller column. So the facts are now one hairline grid of small cells
 * (Cake Equity), with the deposit as the single coloured tile because it is the
 * number that decides anything; the hero is a 96px band; and the consequences
 * of accepting moved into the celebration, where the student has actually asked
 * the question.
 */
export function OfferRoute() {
  const state = useOnboarding();
  const { goNext } = useStepNav("offer");
  const [celebrating, setCelebrating] = React.useState(false);

  const response = state.offer.response;

  function respond(answer: "accepted" | "declined") {
    patch("offer", { response: answer, respondedAt: new Date().toISOString() });
    if (answer === "accepted") setCelebrating(true);
  }

  return (
    <StepShell
      current="offer"
      title="Your offer"
      lead="Read it, then accept or decline. You answer once — changing it afterwards goes through Admissions."
      saved={false}
      centered
      /* Three rows rather than one: the reassurance, the buttons, the deadline. */
      actionBarHeight={response === null ? "6.5rem" : undefined}
      actions={
        response === null ? (
          <Decision onAccept={() => respond("accepted")} onDecline={() => respond("declined")} />
        ) : (
          <RecordedResponse />
        )
      }
    >
      <section className="overflow-hidden rounded-[var(--radius-slab)] border border-ink-100 bg-surface shadow-card">
        {/* The photo survives; the 200px of it does not. A band is enough to say
            "this is a place you would go to" — which is the whole job it was
            doing — and it is the cheapest 100px on the screen to give back. */}
        <div className="relative isolate flex h-24 flex-col justify-center px-5 text-white sm:px-6">
          <img
            src={campusPhotos.offer.src}
            alt={campusPhotos.offer.alt}
            className="absolute inset-0 -z-20 size-full object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950/95 via-ink-950/85 to-violet-700/60"
          />
          <p className="text-micro font-bold tracking-[0.06em] text-white/70 uppercase">
            Offer of admission · {institution.name}
          </p>
          <h2 className="mt-1 text-h2 font-black tracking-[-0.03em] text-white">
            {offer.programme}
          </h2>
          {/* One line, and only where a line's worth of it actually fits: a
              truncated half-sentence on a phone reads as a bug, not as brevity. */}
          <p className="mt-0.5 hidden truncate text-small text-white/75 sm:block">
            {offer.programmeDescription}
          </p>
        </div>

        {/* Hairline grid: the gap *is* the border, so four facts cost four small
            cells and no card chrome. No line of explanation under any of them —
            "The degree awarded" under Degree was the label read back slowly,
            and that per-field commentary is exactly what she was asking about
            when she said "será que é necessário isso mesmo?". */}
        <dl className="grid grid-cols-2 gap-px border-t border-ink-100 bg-ink-100 sm:grid-cols-4">
          <Fact label="Degree" value={offer.degree} />
          <Fact label="Starting term" value={offer.startingTerm} />
          <Fact label="Campus" value={offer.campus} />
          {/* The one coloured tile, for the one number that changes what anybody
              does next. */}
          <Fact label="Enrollment deposit" value={DEPOSIT} tinted />
        </dl>

        <p className="border-t border-ink-100 px-5 py-3 text-small text-ink-500 sm:px-6">
          The deposit is asked for at the last step of enrollment, it secures your place, and it is
          credited against your first term's tuition.
        </p>
      </section>

      <React.Suspense fallback={null}>
        {celebrating ? (
          <CelebrationDialog
            open
            onOpenChange={setCelebrating}
            onContinue={() => {
              setCelebrating(false);
              goNext();
            }}
          />
        ) : null}
      </React.Suspense>
    </StepShell>
  );
}

function Fact({
  label,
  value,
  tinted = false,
}: {
  label: string;
  value: string;
  tinted?: boolean;
}) {
  return (
    <div className={tinted ? "bg-violet-50 px-5 py-4" : "bg-surface px-5 py-4"}>
      <dt className="field-label">{label}</dt>
      <dd
        className={
          tinted
            ? "text-lead font-black tracking-[-0.02em] text-violet-700"
            : "text-lead font-bold text-ink-900"
        }
      >
        {value}
      </dd>
    </div>
  );
}

/**
 * The decision, in the fixed bar.
 *
 * Upwork's shape, and for Upwork's reason: one solid button for the answer
 * almost everybody is giving, the other answer as a link that is plainly there
 * but is not competing for the eye. The reassurance sits above the pair rather
 * than under each of them, and the deadline sits below — the two questions
 * ("does this cost me anything?", "how long do I have?") answered in the place
 * where they are actually being asked.
 *
 * Declining is one click. The confirmation dialog it used to open asked for a
 * reason and a note before it would take the answer, which is a survey charging
 * admission to a door the student is trying to walk out of.
 */
function Decision({ onAccept, onDecline }: { onAccept: () => void; onDecline: () => void }) {
  return (
    <div className="flex w-full flex-col gap-1.5 sm:items-end">
      <p className="text-small text-ink-500">
        <span className="sm:hidden">Nothing is charged today.</span>
        <span className="hidden sm:inline">
          Nothing is charged today — accepting reserves your place and opens the rest of enrollment.
        </span>
      </p>
      <div className="flex w-full items-center gap-4 sm:w-auto">
        <Button
          type="button"
          variant="link"
          size="sm"
          className="px-0 text-ink-500 underline hover:text-ink-700"
          onClick={onDecline}
        >
          Decline this offer
        </Button>
        <Button type="button" size="lg" className="ml-auto" onClick={onAccept}>
          <CheckCircleIcon weight="fill" aria-hidden className="size-5" />
          Accept my place
        </Button>
      </div>
      <p className="text-micro text-ink-400">
        Respond by {DEADLINE}.
        <span className="hidden sm:inline"> After that only Admissions can reopen it.</span>
      </p>
    </div>
  );
}

function RecordedResponse() {
  const state = useOnboarding();
  const { next, goNext } = useStepNav("offer");
  const accepted = state.offer.response === "accepted";
  const when = formatRespondedAt(state.offer.respondedAt);

  return (
    <>
      <p className="mr-auto flex items-center gap-2 text-small text-ink-600">
        {accepted ? (
          <CheckCircleIcon weight="fill" aria-hidden className="size-4 shrink-0 text-mint-600" />
        ) : (
          <ProhibitIcon weight="fill" aria-hidden className="size-4 shrink-0 text-ink-400" />
        )}
        <span className="hidden sm:inline">
          {accepted ? "Accepted" : "Declined"} on {when}
        </span>
      </p>
      <Button type="button" size="lg" onClick={goNext}>
        <span className="hidden sm:inline">Next: {next?.label.toLowerCase()}</span>
        <span className="sm:hidden">Next</span>
        <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
      </Button>
    </>
  );
}

function formatRespondedAt(iso: string | null) {
  if (!iso) return "today";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
