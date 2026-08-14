import {
  CheckIcon,
  CopyIcon,
  FacebookLogoIcon,
  LinkedinLogoIcon,
  SparkleIcon,
  WhatsappLogoIcon,
  XLogoIcon,
} from "@phosphor-icons/react";
import confetti from "canvas-confetti";
import { useReducedMotion } from "motion/react";
import * as React from "react";

import SplitText from "@/components/reactbits/SplitText";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { institution, offer } from "@/lib/fixtures";
import { SHARE_POINTS } from "@/lib/points";
import { patch, useOnboarding } from "@/lib/store";

const CONFETTI_COLORS = ["#6a38ff", "#1e5bff", "#00c49a", "#a888ff", "#ffffff"];

const SHARE_TEXT = `I'm going to ${institution.name} for ${offer.programme}. See you in ${offer.startingTerm}.`;
const SHARE_URL = "https://aster.edu";

/**
 * The accept moment.
 *
 * Two things it deliberately does not do: navigate away, and demand the
 * share. Laura's ask was a popup in the middle of the screen with confetti,
 * so the student never loses the page they were on — and the social prompt is
 * an offer, not a gate. Closing this dialog with the X leaves the acceptance
 * recorded and the student exactly where they were.
 *
 * Round 2 grows the moment: a bigger footprint, the same confetti and
 * letter-by-letter headline, and a share prompt that leans into "you're
 * publicly joining a university" rather than a neutral "share if you'd like
 * to" — the framing from the call, and the specific ask for Facebook and
 * LinkedIn alongside it. Using it awards points once, through the same
 * mechanism steps use, because it is the one point-earning action in this
 * flow that isn't a step submission.
 */
export function CelebrationDialog({
  open,
  onOpenChange,
  onContinue,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
}) {
  const state = useOnboarding();
  const reduceMotion = useReducedMotion();
  const [copied, setCopied] = React.useState(false);
  const continueRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (!open || reduceMotion) return;

    const burst = (particleCount: number, spread: number, startVelocity: number) => {
      confetti({
        particleCount,
        spread,
        startVelocity,
        origin: { y: 0.42 },
        colors: CONFETTI_COLORS,
        disableForReducedMotion: true,
        scalar: 0.9,
        zIndex: 100,
      });
    };

    burst(80, 70, 45);
    const second = window.setTimeout(() => burst(50, 110, 30), 220);
    const third = window.setTimeout(() => burst(30, 130, 24), 460);

    return () => {
      window.clearTimeout(second);
      window.clearTimeout(third);
    };
  }, [open, reduceMotion]);

  React.useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);

  /* Marks the share as used, once. `patch` merges into the existing offer
     slice, so this can't accidentally clear anything else the step recorded —
     and a second share click is a no-op against `totalPoints`, which only
     ever reads the boolean, not how many times it's been set. */
  function markShared() {
    patch("offer", { shared: true });
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${SHARE_TEXT} ${SHARE_URL}`);
      setCopied(true);
      markShared();
    } catch {
      setCopied(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="text-center sm:max-w-[38rem] sm:p-10"
        /* Land on the way forward, not on a share button. The share is the
           optional thing in this dialog; the continue is the point of it. */
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          continueRef.current?.focus();
        }}
      >
        <div className="flex flex-col items-center gap-6">
          <span className="brand-gradient flex size-16 items-center justify-center rounded-full text-white shadow-lift">
            <CheckIcon weight="bold" aria-hidden className="size-8" />
          </span>

          {/* The sheet's approved acceptance text, split between the title and
              the line under it: "Welcome to {institution}. Your place is
              reserved." Its third sentence — "Next, create your account" — does
              not apply here, because the account already exists by the time
              anyone reaches this dialog. */}
          <div className="space-y-2">
            <DialogTitle className="text-display font-black tracking-[-0.03em] sm:text-[3rem] sm:leading-[1.05]">
              {reduceMotion ? (
                <span>Welcome to {institution.short}.</span>
              ) : (
                <SplitText
                  text={`Welcome to ${institution.short}.`}
                  tag="span"
                  splitType="chars"
                  delay={38}
                  duration={0.7}
                  ease="power3.out"
                  threshold={0.05}
                  rootMargin="0px"
                  from={{ opacity: 0, y: 28, filter: "blur(6px)" }}
                  to={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                />
              )}
            </DialogTitle>
            <DialogDescription className="text-lead">
              Your place in {offer.programme} for {offer.startingTerm} is reserved. Accepting does
              not commit you to payment yet.
            </DialogDescription>
          </div>

          <div className="w-full rounded-[var(--radius-card)] bg-ink-50 p-5">
            <p className="text-body font-bold text-ink-900">
              Make it official — tell people you're joining {institution.short}.
            </p>
            <p className="mt-1 text-small text-ink-600">
              Post it to Facebook or LinkedIn and make the news public. Entirely optional, and worth{" "}
              {SHARE_POINTS} points if you do.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <ShareLink
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHARE_URL)}&quote=${encodeURIComponent(SHARE_TEXT)}`}
                label="Facebook"
                icon={<FacebookLogoIcon weight="fill" aria-hidden className="size-4" />}
                onShare={markShared}
              />
              <ShareLink
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}`}
                label="LinkedIn"
                icon={<LinkedinLogoIcon weight="fill" aria-hidden className="size-4" />}
                onShare={markShared}
              />
              <ShareLink
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(SHARE_URL)}`}
                label="X"
                icon={<XLogoIcon weight="fill" aria-hidden className="size-4" />}
                onShare={markShared}
              />
              <ShareLink
                href={`https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${SHARE_URL}`)}`}
                label="WhatsApp"
                icon={<WhatsappLogoIcon weight="fill" aria-hidden className="size-4" />}
                onShare={markShared}
              />
              <Button type="button" variant="secondary" size="sm" onClick={copyLink}>
                {copied ? (
                  <CheckIcon weight="bold" aria-hidden className="size-4 text-mint-600" />
                ) : (
                  <CopyIcon aria-hidden className="size-4" />
                )}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>

            {state.offer.shared ? (
              <p className="mt-3 flex items-center justify-center gap-1.5 text-small font-bold text-mint-700">
                <SparkleIcon weight="fill" aria-hidden className="size-4" />+{SHARE_POINTS} points
                added
              </p>
            ) : null}
          </div>

          <Button ref={continueRef} type="button" size="lg" className="w-full" onClick={onContinue}>
            Next: about you
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ShareLink({
  href,
  label,
  icon,
  onShare,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  onShare: () => void;
}) {
  return (
    <Button asChild variant="secondary" size="sm">
      <a href={href} target="_blank" rel="noreferrer noopener" onClick={onShare}>
        {icon}
        {label}
      </a>
    </Button>
  );
}
