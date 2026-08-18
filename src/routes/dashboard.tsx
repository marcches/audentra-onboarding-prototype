import { ArrowRightIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";

import { RichBalance } from "@/components/balance";
import { PortalShell } from "@/components/portal-shell";
import { QuestCard } from "@/components/quest-card";
import { QuestRow } from "@/components/quest-row";
import { Fact, Prose, Section, Sections, Well } from "@/components/surfaces";
import { Button } from "@/components/ui/button";
import {
  campusPhotos,
  enrollment,
  institution,
  keyDates,
  offer,
  studentRecord,
} from "@/lib/fixtures";
import {
  availableInOrder,
  carriedOver,
  formatDeadlineShort,
  portalProgress,
  type RequirementId,
  requirementsInState,
  stateOf,
  waitingOn,
} from "@/lib/portal";
import { usePortal } from "@/lib/portal-store";
import { useOnboarding } from "@/lib/store";

/**
 * The landing screen, answering its own first question above the fold.
 *
 * The defect it closes is the client's, watching a student open the portal that
 * shipped: *"eu aqui quando eu abro ele, eu não tenho direcionamento"* — and the
 * fix she named in the same breath: *"ele já traz de cara, sem conversa, o que
 * que tá faltando? Próximos passos. Eu não fico tendo que procurar."* So the
 * first thing on the screen is the work, not a financial snapshot and not what
 * is on campus this week.
 *
 * **The vertical budget is the constraint, not a preference.** ADR 0008 measures
 * ~640px of usable height at 1366×768. The reference prototype stacks a
 * greeting, a progress bar, a next-task sentence, a momentum block and three
 * tabs before its first card, which puts that card below the fold — a screen
 * that celebrates progress before showing the next action is doing the opposite
 * of what was asked for. The cut here: greeting and progress on one line (the
 * shell's header), the rich Balance in the secondary column, and the primary
 * column running header → one orientation line → cards, with nothing between.
 *
 * **Three cards, not more.** The fourth is below the fold at HD, and a landing
 * screen whose list continues past the fold recreates the problem it was built
 * to fix. The full twelve, the ordering tabs and the state groups are My
 * Enrollment's, which is the next cycle's.
 */
const SHOWN = 3;

export function DashboardRoute() {
  const state = usePortal();
  const gate = useOnboarding();
  const name = gate.whoYouAre.preferredName.trim() || studentRecord.legalFirstName;
  const progress = portalProgress(state);
  const available = availableInOrder(state);
  const shown = available.slice(0, SHOWN);
  const waiting = requirementsInState("under-review", state).length;

  const [first, ...rest] = shown;

  return (
    <PortalShell
      current="dashboard"
      title={`Hello, ${name}`}
      lead={<ProgressLine complete={progress.complete} total={progress.total} />}
      /* The band contains the lead Quest card (ADR 0015). It is the screen's
         first unit and it is inside the colour rather than under it, which is
         what makes the band cost its own padding instead of 140–180px of the
         fold. It is also the only raised thing on the screen besides the band
         itself: shadow contains the subject, and there is one subject. */
      opens={
        first ? (
          <QuestCard requirement={first} lead />
        ) : (
          <p className="rounded-[var(--radius-card)] bg-panel px-4 py-4 text-body text-ink-600 shadow-[var(--shadow-contains)]">
            {waiting > 0
              ? `Everything you can act on is done. ${waiting} ${waiting === 1 ? "requirement is" : "requirements are"} with the university.`
              : "Everything is finished. There is nothing left before term starts."}
          </p>
        )
      }
    >
      <div className="grid grid-cols-[minmax(0,1fr)_17rem] items-start gap-4 compact:grid-cols-1">
        <div className="flex min-w-0 flex-col gap-2">
          {/* The one orientation line, and nothing else between the band and
              the work. It says what the order is doing for the student, which
              is what makes the lead card's badge a claim rather than magic. */}
          {rest.length > 0 ? (
            <p className="text-small text-ink-600">
              What else you can do now, best first. The one above opens the most.
            </p>
          ) : null}

          {/* The Well is the local ground for the collection, which is what
              lets the cards be flat. Twelve shadows in a column is the
              stacking shadow is reserved against — under ADR 0015 it marks
              the one object a screen is about, and that object is in the
              band. */}
          {rest.length > 0 ? (
            <Well flush strong className="flex flex-col gap-2 p-2">
              {rest.map((requirement) => (
                <QuestCard key={requirement.id} requirement={requirement} />
              ))}
            </Well>
          ) : null}

          <TheRest shown={shown.map((one) => one.id)} />
        </div>

        {/* The secondary column. The rich Balance is Dashboard-only (ADR 0013):
            it does not follow the student into an Area where the compact figure
            in the sidebar already answers the question it answers at length. */}
        <div className="flex flex-col gap-2.5">
          <RichBalance size="full" />
          <WhoYouAreHere />
          <NothingWasLost />
        </div>
      </div>
    </PortalShell>
  );
}

/**
 * Everything the three cards do not show, as lines.
 *
 * This is what closes the 195px of Ground measured under the Dashboard's
 * content, and it closes it with **information** rather than with air — the
 * client asked to be denser, and a screen showing three of twelve and then
 * stopping is the opposite of dense however tightly the three are set.
 *
 * The order is whose move it is: what the student can act on, then what the
 * university is holding, then what has not opened yet. Complete Requirements are
 * not here at all — a finished thing at the top of a list of things to do is
 * information nobody can act on, occupying the position of highest value, which
 * is the defect the portal was built to fix.
 *
 * It is deliberately **not** My Enrollment: no ordering tabs, no collapsible
 * groups, no completed-work summary. Those are the next cycle's, and a link
 * still goes there.
 */
function TheRest({ shown }: { shown: RequirementId[] }) {
  const state = usePortal();
  const seen = new Set(shown);

  const rows = [
    ...availableInOrder(state).filter((one) => !seen.has(one.id)),
    ...requirementsInState("under-review", state),
    ...requirementsInState("upcoming", state),
  ];
  if (rows.length === 0) return null;

  return (
    <Sections>
      <Section
        title={`The rest of your list · ${rows.length}`}
        action={
          <Link
            to="/portal/enrollment"
            className="inline-flex items-center gap-1 text-meta font-bold text-violet-600 hover:underline"
          >
            See all
            <ArrowRightIcon weight="bold" aria-hidden className="size-3" />
          </Link>
        }
        bodyClassName="py-1"
      >
        <ul className="flex flex-col">
          {rows.map((requirement) => {
            const rowState = stateOf(requirement, state);
            return (
              <QuestRow
                key={requirement.id}
                requirement={requirement}
                state={rowState}
                waiting={rowState === "upcoming" ? waitingOn(requirement, state) : undefined}
              />
            );
          })}
        </ul>
      </Section>
    </Sections>
  );
}

/**
 * How far through, as a figure and a bar, on the line the greeting already
 * occupies.
 *
 * What the last cycle cut was the *ring* — Langdock's `0 / 595` crowning the
 * page and pushing the first card below the fold. The instrument itself is in
 * four of the six dashboards in the catalogue (Square, Wix, Google Workspace,
 * Circle), and on an existing line it costs no height at all.
 *
 * A student who has finished nothing reads a beginning rather than `0%`: the bar
 * is still drawn, because an empty track is what says there is a track.
 */
function ProgressLine({ complete, total }: { complete: number; total: number }) {
  const percent = Math.round((complete / total) * 100);

  return (
    <span className="flex items-center gap-2">
      {/* On the band, so the tones are the band's. White at 80% rather than a
          second hue: colour on this screen is material, and a figure that
          picked its own would be a signal the student has to decode. */}
      <span className="text-small text-white/80 numeric">
        {complete === 0
          ? `${total} things to do before term starts`
          : `${complete} of ${total} done · ${percent}%`}
      </span>
      <span
        role="progressbar"
        aria-valuenow={complete}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`${complete} of ${total} requirements complete`}
        className="h-1 w-28 shrink-0 overflow-hidden rounded-full bg-white/25"
      >
        {/* `scaleX`, not `width`: no animation rule in this system touches a
            layout property. */}
        <span
          className="block h-full origin-left rounded-full bg-white transition-transform duration-[var(--duration-stage)] ease-[var(--ease-out-expo)]"
          style={{ transform: `scaleX(${complete / total})` }}
        />
      </span>
    </span>
  );
}

/**
 * Which university this is, what the student was admitted to, when it starts,
 * and what their number is.
 *
 * **This is the whole of the difference between a violet SaaS with a crest in
 * the corner and a system a university runs.** Before it, the only institutional
 * facts anywhere in the portal were the crest, the university's name and the
 * student's first name — while `fixtures.ts` already held the programme, the
 * degree, the term, the campus, the student number and the class year, and the
 * most institutional artefact in the repo was the student card on the *gate's*
 * arrival screen. The surface where the student actually lives inherited none of
 * it.
 *
 * Every fact is read from the fixture and none is typed here: they are the same
 * facts the offer letter and the enrolment record carry, and a third copy on a
 * screen is how a portal comes to disagree with the letter that produced it.
 *
 * **The photograph is contained** — a band at the head of the block, in a 17rem
 * column, not a hero across the top of the page. The fold budget is the
 * constraint that survived the last cycle and the first Quest card ending above
 * y≈300 is the number this must not break, which is also why the block is in the
 * secondary column: it spends the 365px of Ground measured there rather than any
 * of the primary column's height. It is the lawn from the Offer screen, the same
 * file deliberately (`campusPhotos`).
 *
 * **Key dates sit under it**, from `academicCalendar`, and they are not
 * decoration: they are the ruler every Requirement deadline is now measured
 * against. A university portal that cannot say when term starts is not one — and
 * the first thing the calendar exposed, once written down, was that `Secure your
 * place` had been due twelve weeks after the first lecture.
 *
 * The anatomy is the system's own `Fact` row, at full width (Portrait's profile
 * block: label→value pairs, short, none of them competing with the work in the
 * main column). One sheet with two Sections rather than two sheets, so the
 * column reads as one frame with a rule across it (Uxcel's stacked right-hand
 * column).
 */
function WhoYouAreHere() {
  return (
    <Sections>
      <Section title="Your place at Aster">
        <figure className="relative isolate mb-2 h-24 overflow-hidden rounded-[var(--radius-field)]">
          <img
            src={campusPhotos.lawn.src}
            alt={campusPhotos.lawn.alt}
            className="absolute inset-0 z-[var(--z-behind)] size-full object-cover"
          />
          <span
            aria-hidden
            className="absolute inset-0 z-[var(--z-behind)] bg-[linear-gradient(180deg,rgb(6_18_42/0.05)_35%,rgb(6_18_42/0.82)_100%)]"
          />
          <figcaption className="absolute inset-x-0 bottom-0 flex items-baseline justify-between gap-2 px-2 py-1.5 text-white">
            <span className="min-w-0 truncate text-micro font-bold tracking-[0.06em] uppercase">
              {institution.name}
            </span>
            {/* The year alone, not `Founded 1867`: the crest two feet up the
                sidebar already carries the word, and at 17rem the label was
                what truncated the university's own name. */}
            <span className="shrink-0 text-micro opacity-80 numeric">{institution.founded}</span>
          </figcaption>
        </figure>

        <dl className="flex flex-col">
          <Fact label="Programme" className="col-span-full">
            {offer.programme}
          </Fact>
          <Fact label="Degree" className="col-span-full">
            {offer.degree}
          </Fact>
          <Fact label="Starting" className="col-span-full">
            {offer.startingTerm}
          </Fact>
          <Fact label="Campus" className="col-span-full">
            {offer.campus}
          </Fact>
          <Fact label="Student number" className="col-span-full">
            <span className="numeric">{enrollment.id}</span>
          </Fact>
          <Fact label="Class of" className="col-span-full">
            <span className="numeric">{enrollment.classOf}</span>
          </Fact>
        </dl>
      </Section>

      <Section title="Key dates">
        <dl className="flex flex-col">
          {keyDates.map((entry) => (
            <Fact key={entry.id} label={entry.label} className="col-span-full">
              <span className="numeric">{formatDeadlineShort(entry.date)}</span>
            </Fact>
          ))}
        </dl>
      </Section>
    </Sections>
  );
}

/** One, two, three — the most a student can carry over, so no fourth is needed. */
const COUNTED = ["nothing", "one thing", "two things", "three things"];

/**
 * The only place the two contexts touch, and the emotional hinge of the whole
 * checklist.
 *
 * The gate lets a student skip *Health information*, *Campus life* and the
 * *Deposit* by design. If the portal shows those back without saying why they
 * are there, skipping turns out to have been quietly costly and the permission
 * the gate offered was a trap. So the portal says it in one sentence, once.
 *
 * **What is separate is the explanation, not the work.** The carried-over
 * Requirements sit in the ordinary list with everything else rather than in a
 * penalty box — Vercel's Production Checklist marks an item `Skipped` in the
 * same list as `Done`, and Portrait leaves unfinished items at full weight
 * rather than demoting them.
 *
 * **Conditional on there being any.** A student who skipped nothing sees no
 * block, because an empty "you skipped nothing" state invents a problem they do
 * not have — and the gate already knows the answer.
 *
 * The count is read from the gate's store and nothing is written back to it:
 * the portal never marks a Quest as seen, resumed or acknowledged.
 */
function NothingWasLost() {
  const state = usePortal();
  const carried = carriedOver(state);
  if (carried.length === 0) return null;

  const [first] = carried;

  return (
    <Sections>
      <Section title="Nothing was lost">
        <Prose>
          You skipped {COUNTED[carried.length] ?? `${carried.length} things`} while accepting your
          offer. We saved your place, so nothing you entered was lost — they are in your list, with
          everything else.
        </Prose>
        <div className="mt-2.5">
          <Button asChild variant="secondary" size="sm">
            <Link to={first.path as never}>
              {first.action}
              <ArrowRightIcon weight="bold" aria-hidden className="size-3.5" />
            </Link>
          </Button>
        </div>
      </Section>
    </Sections>
  );
}
