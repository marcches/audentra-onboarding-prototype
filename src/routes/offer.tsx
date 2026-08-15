import { ArrowRightIcon, CheckCircleIcon, ProhibitIcon } from "@phosphor-icons/react";
import * as React from "react";

import { StepShell, useStepNav } from "@/components/step-shell";
import { Button } from "@/components/ui/button";
import { campusPhotos, formatDeadline, formatMoney, institution, offer } from "@/lib/fixtures";
import { patch, useOnboarding } from "@/lib/store";
import { cn } from "@/lib/utils";

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
        {/* Hairline grid, five cells. The deadline joined them when the bar
            became a constant 4.5rem: it is a *fact of the offer* — the same
            kind of thing as the campus and the term — and it was only in the
            footer because the footer was where the decision was. The coloured
            tile stays last, and takes the full width on a phone where five
            cells leave it alone on its row anyway. */}
        <dl className="grid grid-cols-2 gap-px border-t border-ink-100 bg-ink-100 sm:grid-cols-5">
          <Fact label="Degree" value={offer.degree} />
          <Fact label="Starting term" value={offer.startingTerm} />
          <Fact label="Campus" value={offer.campus} />
          <Fact label="Respond by" value={DEADLINE} />
          {/* The one coloured tile, for the one number that changes what anybody
              does next. */}
          <Fact label="Enrollment deposit" value={DEPOSIT} tinted className="max-sm:col-span-2" />
        </dl>

        {/* The reassurance, beside the thing it reassures about. It answers a
            question asked while *reading* — "does this cost me anything?" — and
            the footer is where you decide, not where you read. The two
            sentences that used to say this in two places are one now; the
            "only Admissions can reopen it" half went with them, because the
            step's own lead already says it. */}
        <p className="border-t border-ink-100 px-5 py-3 text-small text-ink-500 sm:px-6">
          Nothing is charged today. Accepting reserves your place and opens the rest of enrollment;
          the deposit is asked for at the last step and credited against your first term's tuition.
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
  className,
}: {
  label: string;
  value: string;
  tinted?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("px-5 py-4", tinted ? "bg-violet-50" : "bg-surface", className)}>
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
 * The decision, in the fixed bar — one row, inside the constant 4.5rem.
 *
 * Upwork's shape, and for Upwork's reason: one solid button for the answer
 * almost everybody is giving, the other answer as a link that is plainly there
 * but is not competing for the eye.
 *
 * It used to be three rows — reassurance, buttons, deadline — which is why this
 * step asked the shell for a 6.5rem bar and then gave it back the moment an
 * answer was recorded, moving the column's bottom padding with it. Both extra
 * rows moved into the body: the deadline into the facts grid, the reassurance
 * beside the offer it reassures about. What does not fit in the bar is not bar.
 *
 * Declining is one click. The confirmation dialog it used to open asked for a
 * reason and a note before it would take the answer, which is a survey charging
 * admission to a door the student is trying to walk out of.
 */
function Decision({ onAccept, onDecline }: { onAccept: () => void; onDecline: () => void }) {
  return (
    <>
      <Button
        type="button"
        variant="link"
        size="sm"
        className="mr-auto px-0 text-ink-500 underline hover:text-ink-700"
        onClick={onDecline}
      >
        Decline<span className="hidden sm:inline"> this offer</span>
      </Button>
      <Button type="button" size="lg" onClick={onAccept}>
        <CheckCircleIcon weight="fill" aria-hidden className="size-5" />
        Accept<span className="hidden sm:inline"> my place</span>
      </Button>
    </>
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
