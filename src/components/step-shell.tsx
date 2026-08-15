import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUUpLeftIcon,
  CheckIcon,
  ClockIcon,
  CloudCheckIcon,
  CompassIcon,
} from "@phosphor-icons/react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import * as React from "react";

import { PhaseBar, StepRail } from "@/components/step-rail";
import { Prose, Section, Sections } from "@/components/surfaces";
import { Button } from "@/components/ui/button";
import { aboveCompact, inCompactFlex, RAIL_OFFSET } from "@/lib/layout";
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
 * A button that reads "2 fields to go" while you work and "Save and continue"
 * once you are done resizes itself as you type, which is the same defect as a
 * block being born mid-column — moved into the one piece of furniture that is
 * supposed to never move.
 */
export const steadyAction = "min-w-[13rem] justify-between";

/** Did we get here from the Review & sign summary's edit link? */
function useArrivedFromReview() {
  const search = useSearch({ strict: false }) as { from?: string };
  return search.from === "review";
}

/**
 * Back. Absent on the first step, where there is nowhere to go, and absent when
 * the student arrived from the Review summary — there `ReturnToReview` occupies
 * this slot instead.
 */
export function BackButton({ current }: { current: StepId }) {
  const { back, goBack } = useStepNav(current);
  const fromReview = useArrivedFromReview();
  if (!back || fromReview) return null;

  return (
    <Button type="button" variant="ghost" onClick={goBack}>
      <ArrowLeftIcon weight="bold" aria-hidden className="size-4" />
      <span className="compact:hidden">Back</span>
      <span className="sr-only">Back to {back.label}</span>
    </Button>
  );
}

/**
 * The return half of the Review & sign round trip.
 *
 * It lives with the actions, not above the title. Rendered in the column it was
 * a block born from a query parameter, so the same step's `h1` sat ~2.5rem
 * lower when reached from the summary than when reached by Next — the exact
 * drift the ruler's second line forbids.
 */
function ReturnToReview() {
  const fromReview = useArrivedFromReview();
  if (!fromReview) return null;

  return (
    <Button asChild variant="ghost">
      <Link to="/onboarding/review">
        <ArrowUUpLeftIcon weight="bold" aria-hidden className="size-4" />
        <span className="compact:hidden">Back to review &amp; sign</span>
        <span className="hidden compact:inline">Review</span>
      </Link>
    </Button>
  );
}

/**
 * The primary action, narrating what is left.
 *
 * Two rules of this round in one component. It is **disabled rather than
 * hidden** (Deputy), so the way out of the Step is visible before it can be
 * taken. And while it cannot be taken it says *why* — "2 fields to go" — which
 * is the whole of the round's guidance budget on a form, alongside the entry
 * beat and the automatic focus. There is no coach-mark tour; the client
 * reserved that for the platform.
 */
export function ContinueAction({
  remaining = 0,
  label,
  pending,
  onClick,
}: {
  /** Fields still to answer before this Step can be saved. */
  remaining?: number;
  label: string;
  /**
   * What to say instead of counting. A Step whose gates are not fields —
   * Review & sign asks you to read, to sign and to agree — should name the one
   * thing standing in the way, because "3 fields to go" on a screen with no
   * fields left on it tells the student nothing they can act on.
   */
  pending?: string;
  onClick: () => void;
}) {
  const ready = remaining === 0;

  return (
    <Button type="button" className={steadyAction} disabled={!ready} onClick={onClick}>
      {ready ? label : (pending ?? `${remaining} ${remaining === 1 ? "field" : "fields"} to go`)}
      <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
    </Button>
  );
}

/** One thing a Step asks for, and whether it has been answered. */
export type StepTask = { label: string; done: boolean; optional?: boolean };

/**
 * The guide: the second column of every form Step, and the round's answer to
 * "the system should be conducting the student".
 *
 * It exists for two reasons at once, and it is the same fix for both.
 *
 * The first is conduction. There is no coach-mark tour — the client reserved
 * that for the platform, and anchoring a tooltip to an element re-introduces
 * measure-then-position, which is the root cause of half the flicks being fixed
 * here. What replaces it is standing, unmoving, and always in the same place:
 * *why this screen is asking*, *the parts of it, ticking themselves off*, and
 * *what comes next*.
 *
 * The second is composition. A short Step — Health asks two questions — left a
 * white card ending halfway down a 768px screen with a slab of grey under it.
 * Two columns of real content is a composition; one column beside nothing is a
 * card adrift on a background.
 *
 * What this is **not** is an answer to the void. The comment that used to stand
 * here claimed the white space had been solved by "putting something worth
 * reading in the space", and it had not: stretching the sheet to reach the fold
 * moved the white *inside* the sheet, which is the version of it the client
 * photographed. A sheet is now the height of its content and the Ground shows
 * under a short one. The guide earns its column by being worth reading, not by
 * being the thing that fills the row.
 */
export function StepGuide({
  current,
  why,
  tasks = [],
}: {
  current: StepId;
  /** One or two sentences: what this screen is for, in the student's terms. */
  why: React.ReactNode;
  /** The parts of this Step. Empty for a Step that is one indivisible thing. */
  tasks?: StepTask[];
}) {
  const { next } = useStepNav(current);
  const step = stepById(current);
  const done = tasks.filter((task) => task.done).length;

  return (
    <Sections
      className="sticky top-3"
      footer={
        next ? (
          <p className="text-small text-ink-400">
            Next · <span className="font-strong text-ink-600">{next.label}</span>
            <span className="numeric"> · {next.minutes} min</span>
          </p>
        ) : (
          <p className="text-small text-ink-400">Last screen before the deposit.</p>
        )
      }
    >
      <Section
        title="This screen"
        icon={<CompassIcon weight="duotone" aria-hidden className="size-4" />}
        count={tasks.length ? [done, tasks.length] : undefined}
      >
        <Prose>{why}</Prose>

        {tasks.length ? (
          <ol className="mt-2.5 space-y-1.5 border-t border-ink-100 pt-2.5">
            {tasks.map((task, index) => (
              <li key={task.label} className="flex items-start gap-2">
                <span
                  className={cn(
                    "mt-px flex size-4 shrink-0 items-center justify-center rounded-full text-[0.5625rem] font-bold numeric",
                    "transition-colors duration-[var(--duration-base)]",
                    task.done ? "bg-mint-500 text-white" : "bg-ink-200 text-ink-600",
                  )}
                >
                  {task.done ? (
                    <CheckIcon weight="bold" aria-hidden className="size-2.5" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={cn(
                    "flex-1 text-small leading-4",
                    task.done ? "text-ink-400 line-through" : "text-ink-700",
                  )}
                >
                  {task.label}
                  {task.optional ? (
                    <span className="text-micro text-ink-400"> · optional</span>
                  ) : null}
                </span>
              </li>
            ))}
          </ol>
        ) : null}

        <p className="mt-2.5 flex items-baseline gap-1.5 border-t border-ink-100 pt-2.5 text-micro text-ink-400">
          <ClockIcon weight="duotone" aria-hidden className="size-3.5 self-center" />
          <span className="numeric">About {step.minutes} minutes</span>
          <span>· saved as you go</span>
        </p>
      </Section>
    </Sections>
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
 */
const MEASURE: Record<Exclude<Archetype, "celebration">, string> = {
  decision: "max-w-[var(--decision-measure)]",
  form: "max-w-[var(--step-measure)]",
  catalogue: "max-w-[var(--catalogue-measure)]",
  review: "max-w-[var(--catalogue-measure)]",
};

/**
 * The entry beat: the one piece of guidance the client asked for and the round
 * agreed to build.
 *
 * The title, then the work, 400ms apart by 60ms — and **nothing else moves**.
 * A screen where six things fade in at once is not conducting anybody's eye
 * anywhere; two things in sequence say "start here". Only `transform` and
 * `opacity`, keyed on the Step so it plays once per arrival rather than on
 * every keystroke.
 */
function useBeat(current: StepId) {
  const reduceMotion = useReducedMotion();
  return React.useMemo(
    () => ({
      key: current,
      enter: (delay: number) =>
        reduceMotion
          ? {}
          : {
              initial: { opacity: 0, y: 6 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.4, delay, ease: [0.22, 0.61, 0.36, 1] as const },
            },
    }),
    [current, reduceMotion],
  );
}

/**
 * Focus the first thing a student can type into, on arrival.
 *
 * Only on a `form`: on a catalogue or a decision the first control is a filter
 * or an irreversible answer, and focusing either of those would be the product
 * making a choice on the student's behalf. `preventScroll` because a focus that
 * scrolls is a screen that moves on arrival, which is the whole class of bug
 * this round exists to remove.
 */
function useFocusFirstField(active: boolean, current: StepId) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!active) return;
    const first = ref.current?.querySelector<HTMLElement>(
      "input:not([type='hidden']):not([disabled]), textarea:not([disabled])",
    );
    first?.focus({ preventScroll: true });
  }, [active, current]);

  return ref;
}

/**
 * The step layout: Rail, one measured column on the Ground, and the actions at
 * the foot — a fixed bar on a phone, a floating pill above it.
 *
 * The shell has no escape hatches, and that is the point. It used to take
 * `centered` (only Offer set it) and `actionBarHeight` (only Offer set it, and
 * only while unanswered), and between them a step could move its own `h1` by
 * half a viewport and change the column's bottom padding mid-answer. Both are
 * gone: the foot is a constant and the column's width comes from the archetype
 * rather than from the screen, so divergence is not a rule anyone has to
 * remember — it is unexpressible.
 *
 * One DOM, at every width. The Rail and the PhaseBar are the two halves of one
 * Presence row and nothing here reads the window in JS; everything inside the
 * column responds to the *column*, through the single container query declared
 * in `app.css`.
 */
export function StepShell({
  current,
  title,
  lead,
  actions,
  saved = true,
  headerAside,
  guide,
  children,
}: {
  current: StepId;
  title: string;
  lead?: React.ReactNode;
  /**
   * Back/Continue and anything else that ends the step. Rendered into the pill
   * or the bar rather than at the bottom of the column — on a long step the
   * actions used to be a scroll away from wherever the student had finished
   * reading.
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
  /**
   * The `StepGuide` for this Step. Present, the column becomes two panes and
   * the screen becomes a composition; absent — a catalogue, a checkout, a
   * review — the work already fills the width on its own.
   */
  guide?: React.ReactNode;
  children: React.ReactNode;
}) {
  const step = stepById(current);
  const archetype = step.archetype === "celebration" ? "form" : step.archetype;
  const beat = useBeat(current);
  const workRef = useFocusFirstField(archetype === "form", current);

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
        {/* The foot is reserved rather than overlapped: `--action-bar-height`
            is the one number both sides read. ADR 0009 names a bar covering the
            foot of the column as the second cause of "cortado", and this is
            where it stops being possible. */}
        <main className="flex flex-1 flex-col px-4 pt-3 pb-[calc(var(--action-bar-height)+1.5rem)] compact:px-3">
          {/* `header` is the first child, and the ruler says nothing may be
              born above it. Anything that appears by state goes with the
              actions, on the header's own row, or is an overlay — a block that
              grows above the title moves the whole screen.

              `step-column` is the container query's context. Nothing
              `position: fixed` may live inside it. */}
          <div
            className={cn(
              "step-column mx-auto flex w-full flex-1 flex-col gap-3",
              MEASURE[archetype],
            )}
          >
            <motion.header key={beat.key} {...beat.enter(0)} className="flex items-baseline gap-3">
              <div className="min-w-0 flex-1">
                <h1 className="text-h1 text-ink-900">{title}</h1>
                {lead ? <p className="mt-0.5 text-small text-ink-500">{lead}</p> : null}
              </div>
              {headerAside ? <div className="shrink-0">{headerAside}</div> : null}
            </motion.header>
            <motion.div
              key={`${beat.key}-work`}
              {...beat.enter(0.06)}
              ref={workRef}
              className={cn(
                "flex flex-col gap-[var(--space-section)]",
                /* Two panes: the work, and the guide beside it. Neither
                   stretches — `items-start` is the whole rule, and it is why
                   the two panes end at different heights and that is fine. A
                   pane stretched past its own content is a void with a border
                   around it, whichever column it is in. */
                guide &&
                  "grid grid-cols-[minmax(0,1fr)_17rem] items-start gap-3 narrow:grid-cols-1",
              )}
            >
              {children}
              {guide}
            </motion.div>
          </div>
        </main>
        {actions ? (
          <StepActions saved={saved}>
            <ReturnToReview />
            {actions}
          </StepActions>
        ) : null}
      </div>
    </>
  );
}

/**
 * The second row of the Presence table: the same actions, twice.
 *
 * On a phone a fixed bar across the foot, which is where a thumb is. From
 * `medium` up a floating pill that clears the Rail and carries the autosave
 * line as its own text (Clerk) — a full-width bar there spends 4rem of a 640px
 * viewport saying nothing, and vertical space is the scarce resource (ADR
 * 0008). Shadow is admitted on the pill and only on the pill, because a pill is
 * one of the three things in this system that genuinely floats (ADR 0010).
 *
 * Both halves are always in the DOM. Nothing here measures the window.
 */
export function StepActions({
  saved = true,
  children,
}: {
  saved?: boolean;
  children: React.ReactNode;
}) {
  const autosave = saved ? (
    <span className="flex items-center gap-1.5 text-small text-ink-500">
      <CloudCheckIcon weight="fill" aria-hidden className="size-3.5 text-mint-600" />
      Saved automatically
    </span>
  ) : null;

  return (
    <>
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-[var(--z-actions)] border-t border-ink-100 bg-surface/95 backdrop-blur",
          inCompactFlex,
          "h-[var(--action-bar-height)] items-center gap-2 px-3",
        )}
      >
        {autosave}
        <div className="flex flex-1 items-center justify-end gap-2">{children}</div>
      </div>

      <div
        className={cn(
          "pointer-events-none fixed right-0 bottom-4 z-[var(--z-actions)] flex justify-center px-4",
          RAIL_OFFSET,
          aboveCompact,
        )}
      >
        <div className="pointer-events-auto flex max-w-full items-center gap-2 overflow-x-auto rounded-[var(--radius-pill)] border border-ink-100 bg-surface/95 py-1.5 pr-1.5 pl-4 shadow-lift backdrop-blur">
          {autosave}
          {children}
        </div>
      </div>
    </>
  );
}
