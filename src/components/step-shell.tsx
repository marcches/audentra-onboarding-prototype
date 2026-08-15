import { ArrowLeftIcon, ArrowUUpLeftIcon, CloudCheckIcon } from "@phosphor-icons/react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import type * as React from "react";

import { PhaseBar, StepRail } from "@/components/step-rail";
import { Button } from "@/components/ui/button";
import { nextStep, previousStep, type StepId } from "@/lib/steps";
import { cn } from "@/lib/utils";

/**
 * Where Back and Continue actually go, derived from `steps.ts`.
 *
 * Every step used to name its neighbour as a literal path, which meant the flow
 * order lived in seven files as well as in `steps.ts`. Reordering the spine
 * into Phases moved three of those neighbours, and a literal would have been
 * wrong in each place without anything failing to build.
 */
export function useStepNav(current: StepId) {
  const navigate = useNavigate();
  const back = previousStep(current);
  const next = nextStep(current);

  return {
    back,
    next,
    /* `to` is typed against the generated route union and these paths are
       strings from a fixture; the cast is the one seam between the two. The
       test suite asserts every path is unique and the router declares each of
       them, so a wrong string cannot survive a run of the app. */
    goBack: () => back && navigate({ to: back.path as never }),
    goNext: () => navigate({ to: (next?.path ?? "/done") as never }),
  };
}

/**
 * The floor width for a primary action whose label changes with state.
 *
 * A button that reads "Skip for now" at zero and "Continue with 3 clubs" after
 * three picks resizes itself as you work, which is the same defect as a block
 * being born mid-column — moved into the one piece of furniture that is
 * supposed to never move. The floor is measured, not guessed: the widest label
 * the flow produces is "Continue with 9 clubs" at 249px, so the floor is 16rem
 * with a couple of pixels to spare and every label lays out inside it.
 */
export const steadyAction = "min-w-[16rem] justify-between";

/** Did we get here from the Review & sign summary's edit link? */
function useArrivedFromReview() {
  const search = useSearch({ strict: false }) as { from?: string };
  return search.from === "review";
}

/**
 * Back, in the fixed bar. Absent on the first step, where there is nowhere to
 * go, and absent when the student arrived from the Review summary — there
 * `ReturnToReview` occupies this slot instead. Two answers to "where do I go
 * back to?" in one bar is the student choosing between two returns, and the
 * `steps.ts`-derived one is the wrong answer when you did not arrive by Next.
 */
export function BackButton({ current }: { current: StepId }) {
  const { back, goBack } = useStepNav(current);
  const fromReview = useArrivedFromReview();
  if (!back || fromReview) return null;

  return (
    <Button type="button" variant="ghost" size="lg" onClick={goBack}>
      <ArrowLeftIcon weight="bold" aria-hidden className="size-4" />
      <span className="hidden sm:inline">Back</span>
      <span className="sr-only sm:hidden">Back to {back.label}</span>
    </Button>
  );
}

/**
 * The return half of the Review & sign round trip.
 *
 * The summary's edit links carry `?from=review`; without something reading it,
 * "the edit link takes you straight to it and brings you back here" was only
 * half true.
 *
 * It lives in the bar, not above the title. Rendered in the column it was a
 * block born from a query parameter, so the same step's `h1` sat ~2.5rem lower
 * when reached from the summary than when reached by Next — one of the four
 * causes of the position flick the client reported. The bar is where the
 * question "where do I go back to?" already has a button, so it takes that one
 * over rather than adding a row. Rendered by the shell so every step gets it,
 * including Offer, which has no Back of its own but is in the summary.
 */
function ReturnToReview() {
  const fromReview = useArrivedFromReview();
  if (!fromReview) return null;

  return (
    <Button asChild variant="ghost" size="lg">
      <Link to="/onboarding/review">
        <ArrowUUpLeftIcon weight="bold" aria-hidden className="size-4" />
        <span className="hidden sm:inline">Back to review &amp; sign</span>
        <span className="sm:hidden">Review</span>
      </Link>
    </Button>
  );
}

/**
 * The step layout: rail, one column of panels on a recessed ground, and a fixed
 * action bar at the foot.
 *
 * Two things went out with this rewrite. The third column — `context` — is
 * gone: it was a place to put things, which meant every step found something to
 * put there, and it cost the layout 1280px before it could exist at all.
 * Anything that lived there now has a home in the single column, above the fold
 * where it is actually read. And the step no longer renders on a white canvas:
 * the ground is recessed and the content sits in white panels, which is what
 * makes it read as an application rather than as a document (Deel, Mixpanel,
 * Clay).
 *
 * Mobile is a layout, not a narrowing: segmented Phase bar at the top, one
 * column, the same action bar pinned to the bottom.
 *
 * The shell has no escape hatches, and that is the point. It used to take
 * `centered` (only Offer set it) and `actionBarHeight` (only Offer set it, and
 * only while unanswered), and between them a step could move its own `h1` by
 * half a viewport and change the column's bottom padding mid-answer. Both are
 * gone: every step anchors its title at the same pixel and the bar is a
 * constant 4.5rem, so divergence is not a rule anyone has to remember — it is
 * unexpressible. See the stillness ruler in `docs/design-research.md`.
 */
export function StepShell({
  current,
  title,
  lead,
  actions,
  saved = true,
  children,
}: {
  current: StepId;
  title: string;
  lead?: React.ReactNode;
  /**
   * Back/Continue and anything else that ends the step. Rendered into the fixed
   * bar rather than at the bottom of the column — on a long step the actions
   * used to be a scroll away from wherever the student had finished reading.
   */
  actions?: React.ReactNode;
  /** The autosave line. Steps with nothing to save (Review's signed state) turn it off. */
  saved?: boolean;
  children: React.ReactNode;
}) {
  return (
    <>
      <StepRail current={current} />
      <div className="flex min-w-0 flex-1 flex-col bg-canvas">
        <PhaseBar current={current} />
        {/* The bar is fixed, so the column ends above it rather than under it.
            `--action-bar-height` is the one number both sides read, and it is a
            constant — nothing sets it per step. */}
        <main className="flex flex-1 flex-col px-4 pt-5 pb-[calc(var(--action-bar-height)+1.5rem)] sm:px-6 lg:px-8 lg:pt-7">
          {/* `header` is the first child, and the ruler says nothing may be born
              above it. Anything that appears by state — the return to Review
              was the one offender — goes in the bar or is an overlay, because a
              block that grows above the title moves the whole screen. */}
          <div className="mx-auto flex w-full max-w-[var(--step-measure)] flex-col gap-4">
            {/* No "Step N of 7". The rail and the segmented bar both show
                position already, and it was being repeated in text besides. */}
            <header className="space-y-1">
              <h1 className="text-h2 text-ink-900 sm:text-h1">{title}</h1>
              {lead ? <div className="text-body text-ink-600">{lead}</div> : null}
            </header>
            {children}
          </div>
        </main>
        {actions ? (
          <ActionBar saved={saved}>
            <ReturnToReview />
            {actions}
          </ActionBar>
        ) : null}
      </div>
    </>
  );
}

/**
 * The fixed action bar. One piece of furniture, in the same place on every step
 * and in both layouts — Deel puts Exit/Continue in a footer bar, Zopa and Alan
 * pin the button to the bottom on the phone, and the reason is the same in both
 * cases: the way out of a step should not depend on where you have scrolled to.
 *
 * The autosave line rides along because "did that save?" is a question people
 * ask at the moment they are about to leave, not a moment earlier.
 */
export function ActionBar({
  saved = true,
  children,
}: {
  saved?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink-100 bg-surface/95 backdrop-blur lg:left-56">
      <div className="mx-auto flex h-[var(--action-bar-height)] w-full max-w-[var(--step-measure)] items-center gap-3 px-4 sm:px-6 lg:px-8">
        {saved ? (
          <p className="hidden items-center gap-2 text-small text-ink-500 sm:flex">
            <CloudCheckIcon weight="fill" aria-hidden className="size-4 text-mint-600" />
            Saved automatically
          </p>
        ) : null}
        <div className="flex flex-1 items-center justify-end gap-2.5">{children}</div>
      </div>
    </div>
  );
}

/**
 * A white panel on the recessed ground. The unit the whole flow is built from —
 * no step renders content directly onto the canvas.
 *
 * This replaces both `ContextPanel` (which only ever appeared in the dead third
 * column) and the loose sections that used to sit on white. `title` is
 * optional: plenty of panels are a single group of fields that the step's own
 * heading has already introduced, and a heading per panel was a good part of
 * the bulk the client was complaining about.
 */
export function Panel({
  as: Tag = "section",
  title,
  description,
  aside = false,
  className,
  children,
}: {
  /**
   * `fieldset` where the panel *is* a group of related controls — a panel with
   * a legend that isn't a fieldset is a heading pretending to be one.
   */
  as?: "section" | "fieldset";
  title?: string;
  description?: React.ReactNode;
  /**
   * A panel carrying context rather than input — what used to be the third
   * column. Tinted rather than white so it reads as reference beside the work,
   * now that it no longer has a column of its own to say so.
   */
  aside?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag
      className={cn(
        "rounded-[var(--radius-card)] border p-4 sm:p-5",
        aside ? "border-ink-100 bg-ink-50/60" : "border-ink-100 bg-surface shadow-soft",
        className,
      )}
    >
      {title ? (
        <div className="mb-3 space-y-0.5">
          <h2 className="text-h3 text-ink-900">{title}</h2>
          {description ? <p className="text-small text-ink-500">{description}</p> : null}
        </div>
      ) : null}
      {children}
    </Tag>
  );
}

export function SectionTitle({
  children,
  description,
}: {
  children: React.ReactNode;
  description?: React.ReactNode;
}) {
  return (
    <div className="space-y-0.5">
      <h2 className="text-h3 text-ink-900">{children}</h2>
      {description ? <p className="text-small text-ink-600">{description}</p> : null}
    </div>
  );
}
