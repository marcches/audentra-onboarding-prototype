import { SealCheckIcon } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import * as React from "react";

import { formatDeadline, institution, offer, studentRecord } from "@/lib/fixtures";
import { cn } from "@/lib/utils";

const SplitText = React.lazy(() => import("@/components/reactbits/SplitText"));

/**
 * The offer, as an invitation.
 *
 * The entry screen is the first thing a student sees, and the one thing it has
 * to say is *you were chosen*. An earlier pass hung a 3D ID badge here — it
 * read as a technology demo, and the message got lost behind the physics. So
 * this is a printed invitation instead: flat, legible, addressed.
 *
 * The programme, campus, start and application number are on it because Aster
 * already knows them. The name line is left ruled and empty on purpose — that
 * blank is what creating an account fills in, and it is what makes the card
 * feel issued to a person rather than printed for anyone.
 */
export function OfferInvitation({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <article
      className={cn(
        "invitation relative w-full max-w-[clamp(28rem,30vw,38rem)] rounded-[var(--radius-slab)] bg-[#fdfcfa] text-ink-900 shadow-modal",
        !reduceMotion && "invitation-float",
        className,
      )}
    >
      {/* Foil bar. The brand gradient earns a place here — this is the seal on
          an envelope, not decoration sprayed across the screen. */}
      <div className="brand-gradient flex items-center gap-2.5 rounded-t-[var(--radius-slab)] px-6 py-3.5 text-white sm:px-8">
        <SealCheckIcon weight="fill" aria-hidden className="size-5 shrink-0" />
        <p className="text-micro font-bold tracking-[0.14em] uppercase">
          {institution.name} · Admissions
        </p>
      </div>

      <div className="space-y-6 px-6 py-6 sm:px-8 sm:py-7">
        <div className="space-y-2">
          <p className="text-body text-ink-600">You've been offered a place in</p>
          <h2 className="text-h1 font-black tracking-[-0.03em] text-ink-900 sm:text-display">
            {reduceMotion ? (
              offer.programme
            ) : (
              <React.Suspense fallback={offer.programme}>
                <SplitText
                  text={offer.programme}
                  tag="span"
                  splitType="words"
                  delay={90}
                  duration={0.8}
                  ease="power3.out"
                  threshold={0.05}
                  rootMargin="0px"
                  from={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                  to={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                />
              </React.Suspense>
            )}
          </h2>
          <p className="text-lead text-ink-600">{offer.degree}</p>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-y border-dashed border-ink-200 py-5">
          <Line label="Starts" value={offer.startingTerm} />
          <Line label="Campus" value={offer.campus} />
          <Line label="Respond by" value={formatDeadline(offer.responseDeadline)} />
          <Line label="Application" value={studentRecord.applicationId} />
        </dl>

        <div className="space-y-2">
          <p className="field-label">Issued to</p>
          {/* Ruled and blank. Everything else on this card is already filled in
              by Aster; this is the only line the student writes. */}
          <div aria-hidden className="h-9 rounded-sm border-b-2 border-ink-200 bg-ink-50/60" />
          <p className="text-small text-ink-500">
            This offer was made to you, and it can't be passed on. Create your account and the name
            is yours.
          </p>
        </div>
      </div>
    </article>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="field-label">{label}</dt>
      <dd className="text-body font-bold text-ink-900">{value}</dd>
    </div>
  );
}
