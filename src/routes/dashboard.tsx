import { ArrowRightIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";

import { RichBalance } from "@/components/balance";
import { PortalShell } from "@/components/portal-shell";
import { QuestCard } from "@/components/quest-card";
import { Well } from "@/components/surfaces";
import { studentRecord } from "@/lib/fixtures";
import { availableInOrder, portalProgress, requirementsInState } from "@/lib/portal";
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

  return (
    <PortalShell
      current="dashboard"
      title={`Hello, ${name}`}
      lead={
        <p className="text-small text-ink-500 numeric">
          {/* A student who has finished nothing yet is at a beginning, not
              looking at a backlog, and the line says so rather than opening
              with `0%`. */}
          {progress.complete === 0
            ? `${progress.total} things to do before term starts`
            : `${progress.complete} of ${progress.total} done · ${progress.percent}%`}
        </p>
      }
    >
      <div className="grid grid-cols-[minmax(0,1fr)_17rem] items-start gap-3 compact:grid-cols-1">
        <div className="flex min-w-0 flex-col gap-2">
          {/* The one orientation line, and nothing else between the header and
              the work. It says what the order is doing for the student, which
              is what makes the first card's badge a claim rather than magic. */}
          <p className="text-small text-ink-600">
            {shown.length > 0
              ? "What you can do now, best first. The top one opens the most."
              : "Nothing is waiting on you at the moment."}
          </p>

          {/* The Well is the local ground for the collection, which is what
              lets the cards be flat. Twelve shadows in a column is the
              stacking ADR 0010 reserves shadow against. */}
          <Well flush strong className="flex flex-col gap-2 p-2.5">
            {shown.length > 0 ? (
              shown.map((requirement, index) => (
                <QuestCard key={requirement.id} requirement={requirement} lead={index === 0} />
              ))
            ) : (
              <p className="px-1 py-6 text-center text-small text-ink-500">
                {waiting > 0
                  ? `Everything you can act on is done. ${waiting} ${waiting === 1 ? "requirement is" : "requirements are"} with the university.`
                  : "Everything is finished. There is nothing left before term starts."}
              </p>
            )}
          </Well>

          {/* The way to the rest of it. The list itself is My Enrollment's. */}
          <p className="text-small">
            <Link
              to="/portal/enrollment"
              className="inline-flex items-center gap-1 font-strong text-violet-600 hover:underline"
            >
              See all {progress.total} requirements
              <ArrowRightIcon weight="bold" aria-hidden className="size-3.5" />
            </Link>
          </p>
        </div>

        {/* The secondary column. The rich Balance is Dashboard-only (ADR 0013):
            it does not follow the student into an Area where the compact figure
            in the sidebar already answers the question it answers at length. */}
        <div className="flex flex-col gap-2.5">
          <RichBalance size="full" />
        </div>
      </div>
    </PortalShell>
  );
}
