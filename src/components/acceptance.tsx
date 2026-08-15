import { ArrowRightIcon, ShareNetworkIcon } from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import * as React from "react";

import { PricePill, usePointsAward } from "@/components/points-award";
import { ShareCard } from "@/components/share-card";
import { Button } from "@/components/ui/button";
import { offer } from "@/lib/fixtures";
import { SHARE_POINTS } from "@/lib/points";
import { patch, useOnboarding } from "@/lib/store";

/**
 * The moment of accepting: a full moment, not a dialog to dismiss.
 *
 * Laura asked for *"um popupzão"*, and the research says the same thing more
 * precisely: what gets celebrated has to be a **visible object in story
 * proportion** (Commons, Linktree), not a headline over a scrim. So the hero is
 * the share card itself — the thing that gets screenshotted is the thing that
 * gets designed.
 *
 * It carries **no information**. "What accepting does" moved to the offer
 * screen, where a consequence stated before a decision is honest rather than
 * decorative. What is left is emotion, Points and sharing, which is what the
 * client asked for.
 *
 * Sharing is itself a gain (Duolingo's "SHARE FOR A REWARD"), and it awards
 * Points through the same mechanism as every Quest — the pill that quotes the
 * price is the pill that flies.
 */
export function Acceptance({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const state = useOnboarding();
  const navigate = useNavigate();
  const award = usePointsAward();
  const reduceMotion = useReducedMotion();
  const shared = state.offer.shared;

  /* The Quest's own award runs as soon as the moment opens: the price pill on
     the offer header is already on screen, so beat 3 lands where the student
     was already looking. */
  React.useEffect(() => {
    if (open) award?.celebrate("offer", 25);
  }, [open, award]);

  if (!open) return null;

  const share = () => {
    if (shared) return;
    patch("offer", { shared: true });
    award?.celebrate("share", SHARE_POINTS);
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="You are an Aster student"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.3 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 overflow-y-auto bg-canvas/95 px-5 py-10 backdrop-blur-sm lg:left-56"
    >
      <div className="text-center">
        <p className="text-micro font-bold tracking-[0.16em] text-violet-600 uppercase">
          You are in
        </p>
        <h2 className="mt-2 text-h1 text-ink-900 sm:text-display">You are an Aster student.</h2>
        <p className="mt-2 text-lead text-ink-600">
          {offer.startingTerm} starts soon. Let's get you ready for it.
        </p>
      </div>

      <motion.div
        initial={reduceMotion ? false : { scale: 0.85, opacity: 0, rotate: -3 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ delay: 0.15, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <ShareCard
          eyebrow="Accepted"
          headline={`I am going to ${offer.campus === "Main Campus" ? "Aster" : offer.campus}.`}
          metrics={[
            { label: "Programme", value: offer.programme },
            { label: "Degree", value: offer.degree },
            { label: "Starts", value: offer.startingTerm },
            { label: "Campus", value: offer.campus },
          ]}
        />
      </motion.div>

      <div className="flex w-full max-w-xs flex-col items-center gap-3">
        {/* Warm register, from `copy-inventory.md`. The string "Entirely
            optional" is deleted: it is the exact register the client
            rejected. */}
        <p className="text-center text-body text-ink-700">
          {shared ? "Shared. Nice one." : "Faça parte desse time. Go on, tell people."}
        </p>

        <Button
          type="button"
          size="lg"
          className="w-full"
          onClick={share}
          disabled={shared}
          variant={shared ? "secondary" : "primary"}
        >
          <ShareNetworkIcon weight="fill" aria-hidden className="size-5" />
          {shared ? "Shared" : "Share the news"}
          {!shared ? (
            <PricePill points={SHARE_POINTS} stepId="share" size="rail" className="ml-1" />
          ) : null}
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            onOpenChange(false);
            navigate({ to: "/onboarding/who-you-are" });
          }}
        >
          Keep going
          <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
        </Button>
      </div>
    </motion.div>
  );
}
