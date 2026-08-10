import { ArrowRightIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";

import { Notice } from "@/components/notice";
import { StepActions, StepShell } from "@/components/step-shell";
import { Button } from "@/components/ui/button";
import { nextStep, type StepId, stepIndex, steps } from "@/lib/steps";

/**
 * Campus life, Review & sign and Deposit are explicitly out of scope for this
 * round — they exist here so the six-step count and the sidebar are honest,
 * and so a reviewer can walk the whole flow end to end without hitting a 404.
 */
const CONTENT: Record<string, { title: string; today: string[] }> = {
  "campus-life": {
    title: "Clubs, people & support",
    today: [
      "Pick clubs and interest groups",
      "Say what kind of social setting suits you",
      "Ask Disability Services to get in touch",
      "Skippable — nothing here blocks enrollment",
    ],
  },
  review: {
    title: "Your document packet",
    today: [
      "A summary of every answer you've saved",
      "FERPA Information Release, read in full",
      "Enrollment Information Acknowledgment, read in full",
      "Sign by typing or drawing your legal name",
    ],
  },
  deposit: {
    title: "Secure your place",
    today: [
      "Pay the $500 deposit now",
      "Or accept now and pay by the deadline",
      "Or request a waiver or deferral",
      "Payment gateway is still undecided, so nothing was redesigned here",
    ],
  },
};

export function UnchangedStepRoute({ id }: { id: StepId }) {
  const content = CONTENT[id];
  const next = nextStep(id);
  const isLast = stepIndex(id) === steps.length - 1;

  return (
    <StepShell
      current={id}
      title={content?.title ?? "Step"}
      lead="This step wasn't part of the redesign. It's here so the flow and the step count stay honest — the real screen keeps working the way it does today."
    >
      <Notice tone="info" title="Out of scope for this round">
        Nothing about this step was criticised in the source call, so it was deliberately left
        alone. Here is what it does today:
      </Notice>

      <ul className="space-y-2.5">
        {content?.today.map((line) => (
          <li
            key={line}
            className="flex items-start gap-3 rounded-[var(--radius-card)] border border-dashed border-ink-200 bg-ink-50/50 px-4 py-3 text-body text-ink-700"
          >
            <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-ink-300" />
            {line}
          </li>
        ))}
      </ul>

      <StepActions saved={false}>
        {next ? (
          <Button asChild size="lg">
            <Link to={next.path}>
              Next: {next.label.toLowerCase()}
              <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
            </Link>
          </Button>
        ) : null}
        {isLast ? (
          <Button asChild variant="secondary" size="lg">
            <Link to="/onboarding/offer">Back to the start of the flow</Link>
          </Button>
        ) : null}
      </StepActions>
    </StepShell>
  );
}
