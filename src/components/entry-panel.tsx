import { useReducedMotion } from "motion/react";
import * as React from "react";

import { OfferInvitation } from "@/components/offer-invitation";
import { Wordmark } from "@/components/wordmark";
import { institution, offer } from "@/lib/fixtures";
import { cn } from "@/lib/utils";

/* WebGL and a shader compile, for a background. Splitting it out of the entry
   chunk keeps the email field interactive while it arrives. */
const Aurora = React.lazy(() => import("@/components/reactbits/Aurora"));

/** The brand stops, from the guidelines: violet → azure → mint. */
const AURORA_STOPS = ["#6A38FF", "#1E5BFF", "#00C49A"];

/**
 * The entry screen's left-hand panel.
 *
 * It absorbs every spare pixel (`flex-1`) while the form column stays fixed —
 * the reverse of the first round, where the form grew and the extra width piled
 * up as dead margin around a 26rem card.
 *
 * What fills it is the offer as an object: the invitation, held up against an
 * aurora in the brand colours. The aurora is canvas, so it has a still
 * fallback — `.brand-panel` underneath it. That is a demo guarantee before it
 * is an accessibility one: a reviewer with reduced motion on has to see a
 * finished panel, not an empty rectangle where the effect was.
 */
export function EntryPanel({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "brand-panel relative isolate flex flex-col justify-between gap-6 overflow-hidden px-6 py-8 text-white sm:px-10 lg:px-14 lg:py-10",
        className,
      )}
    >
      {reduceMotion ? null : (
        <div aria-hidden className="absolute inset-0 -z-10 opacity-80">
          <React.Suspense fallback={null}>
            <Aurora colorStops={AURORA_STOPS} amplitude={0.9} blend={0.6} speed={0.6} />
          </React.Suspense>
        </div>
      )}

      {/* The wordmark is already at the top of the page on a phone, where the
          form comes first — repeating it here would be the second one on the
          same screen. The eyebrow stays either way. */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <Wordmark tone="on-dark" className="hidden lg:inline-flex" />
        <span aria-hidden className="hidden h-4 w-px bg-white/25 lg:block" />
        <p className="text-micro font-bold tracking-[0.14em] text-white/55 uppercase">
          {institution.name} · {offer.startingTerm} intake
        </p>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center py-2">
        <OfferInvitation />
      </div>

      {/* Two weights, not one paragraph: the first line is the claim and the
          second is the qualifier, and setting them the same size flattened both
          into fine print under the card. */}
      <div className="max-w-[36rem] space-y-1">
        <p className="text-lead font-bold tracking-[-0.01em] text-white text-balance">
          Admissions has already put your name forward.
        </p>
        <p className="text-body text-white/60">
          What's left is yours to answer — and nobody else can answer it for you.
        </p>
      </div>
    </div>
  );
}
