import { ArrowLeftIcon, ArrowUUpLeftIcon, CloudCheckIcon } from "@phosphor-icons/react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import type * as React from "react";

import { PhaseBar, StepRail } from "@/components/step-rail";
import { Button } from "@/components/ui/button";
import { type Archetype, nextStep, previousStep, type StepId, stepById } from "@/lib/steps";
import { studentStatus, useOnboarding } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * Where Back and Continue actually go, derived from `steps.ts` *and* from the
 * student's own answer.
 *
 * Every step used to name its neighbour as a literal path, which meant the flow
 * order lived in seven files as well as in `steps.ts`. It now also depends on
 * Student status: `Where you live now` does not exist for an international
 * student, so Continue from Health information lands on `Who we call` for them
 * and on the address Step for everyone else. A literal path would have walked
 * that student into a screen the spine says they do not have.
 */
export function useStepNav(current: StepId) {
  const navigate = useNavigate();
  const status = studentStatus(useOnboarding());
  const back = previousStep(current, status);
  const next = nextStep(current, status);

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
 * A button that reads "Skip for now" at zero and "Continue with 3 residences"
 * after three picks resizes itself as you work, which is the same defect as a
 * block being born mid-column — moved into the one piece of furniture that is
 * supposed to never move.
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
 * `ReturnToReview` occupies this slot instead.
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
 * It lives in the bar, not above the title. Rendered in the column it was a
 * block born from a query parameter, so the same step's `h1` sat ~2.5rem lower
 * when reached from the summary than when reached by Next — the exact drift the
 * ruler's second line forbids.
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
 * How wide each archetype's column is.
 *
 * The archetype is read from `steps.ts`, never passed by the route, which is
 * what "a route cannot compose outside its archetype" has to mean if it is to
 * mean anything: a screen cannot decide to be wider than the kind of screen it
 * is. `celebration` is absent because a celebration is not a Step layout — it
 * has no rail and no action bar, and it renders outside this shell.
 *
 * The drift invariant this does *not* break: the ruler says the same Step lands
 * in the same place however you arrived at it (user story 60). Two different
 * archetypes composing differently is the archetype doing its job.
 */
const MEASURE: Record<Exclude<Archetype, "celebration">, string> = {
  decision: "max-w-[var(--decision-measure)]",
  form: "max-w-[var(--step-measure)]",
  catalogue: "max-w-[var(--catalogue-measure)]",
  review: "max-w-[var(--catalogue-measure)]",
};

/**
 * The step layout: rail, one column on a recessed Ground, and a fixed action
 * bar at the foot.
 *
 * The shell has no escape hatches, and that is the point. It used to take
 * `centered` (only Offer set it) and `actionBarHeight` (only Offer set it, and
 * only while unanswered), and between them a step could move its own `h1` by
 * half a viewport and change the column's bottom padding mid-answer. Both are
 * gone: the bar is a constant 4.5rem and the column's width comes from the
 * archetype rather than from the screen, so divergence is not a rule anyone has
 * to remember — it is unexpressible.
 *
 * Mobile is a layout, not a narrowing: segmented Phase bar at the top, one
 * column, the same action bar pinned to the bottom.
 */
export function StepShell({
  current,
  title,
  lead,
  actions,
  saved = true,
  headerAside,
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
  /** The autosave line. Steps with nothing to save turn it off. */
  saved?: boolean;
  /**
   * Sits on the title's own row, at the right — the Quest's price, and nothing
   * else. It is beside the `h1` rather than above it, so it cannot move the
   * title down when it appears.
   */
  headerAside?: React.ReactNode;
  children: React.ReactNode;
}) {
  const step = stepById(current);
  const archetype = step.archetype === "celebration" ? "form" : step.archetype;

  return (
    <>
      <StepRail current={current} />
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col bg-canvas",
          /* The one non-signal gradient admitted under a whole screen. A
             decision with 450px of white beneath it reads as unfinished; the
             same decision resting on a very low wash reads as placed. */
          archetype === "decision" && "decision-ground",
        )}
      >
        <PhaseBar current={current} />
        {/* The bar is fixed, so the column ends above it rather than under it.
            `--action-bar-height` is the one number both sides read, and it is a
            constant — nothing sets it per step. */}
        <main
          className={cn(
            "flex flex-1 flex-col px-4 pt-5 pb-[calc(var(--action-bar-height)+1.5rem)] sm:px-6 lg:px-8 lg:pt-7",
            /* A `decision` occupies exactly one viewport at any width. If it
               does not fit it loses content, not the constraint — which is why
               the mobile offer cuts the programme description and the "what
               accepting does" block rather than letting the page scroll. */
            archetype === "decision" && "h-dvh overflow-hidden",
          )}
        >
          {/* `header` is the first child, and the ruler says nothing may be
              born above it. Anything that appears by state goes in the bar, on
              the header's own row, or is an overlay — a block that grows above
              the title moves the whole screen. */}
          <div className={cn("mx-auto flex w-full flex-1 flex-col gap-4", MEASURE[archetype])}>
            <header className="flex items-start gap-4">
              <div className="min-w-0 flex-1 space-y-1">
                <h1 className="text-h2 text-ink-900 sm:text-h1">{title}</h1>
                {lead ? <div className="text-body text-ink-600">{lead}</div> : null}
              </div>
              {headerAside ? <div className="shrink-0">{headerAside}</div> : null}
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
 * and in both layouts — the way out of a step should not depend on where you
 * have scrolled to.
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
      <div className="mx-auto flex h-[var(--action-bar-height)] w-full max-w-[var(--catalogue-measure)] items-center gap-3 px-4 sm:px-6 lg:px-8">
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

export { Panel, PanelDivider, SectionLabel, Well } from "@/components/surfaces";
