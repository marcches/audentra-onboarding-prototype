import { PortalShell } from "@/components/portal-shell";
import { QuestCard } from "@/components/quest-card";
import { Well } from "@/components/surfaces";
import { studentRecord } from "@/lib/fixtures";
import { availableInOrder, portalProgress } from "@/lib/portal";
import { usePortal } from "@/lib/portal-store";
import { useOnboarding } from "@/lib/store";

/**
 * The landing screen, answering its own first question.
 *
 * The defect it closes is the client's, watching a student open the portal that
 * shipped: *"eu aqui quando eu abro ele, eu não tenho direcionamento"* — and the
 * fix she named in the same breath: *"ele já traz de cara, sem conversa, o que
 * que tá faltando? Próximos passos."* So the first thing on the screen is the
 * work, not a financial snapshot and not what is on campus this week.
 *
 * The greeting and the progress figure share **one line**. A progress ring, a
 * momentum block and a next-task sentence above the first card is what puts that
 * card below the fold at 1366×768 — the reference prototype does exactly that,
 * and it is the one thing in it this design refuses.
 */
export function DashboardRoute() {
  const state = usePortal();
  const gate = useOnboarding();
  const name = gate.whoYouAre.preferredName.trim() || studentRecord.legalFirstName;
  const progress = portalProgress(state);
  const [next] = availableInOrder(state);

  return (
    <PortalShell
      current="dashboard"
      title={`Hello, ${name}`}
      lead={
        <p className="text-small text-ink-500 numeric">
          {progress.complete === 0
            ? `${progress.total} things to do before term starts`
            : `${progress.complete} of ${progress.total} done · ${progress.percent}%`}
        </p>
      }
    >
      <p className="text-small text-ink-600">
        The one worth doing first, because it opens the most.
      </p>

      {/* The Well is the local ground for the collection, which is what lets
          the card be flat. Twelve shadows in a column is the stacking ADR 0010
          reserves shadow against. */}
      <Well flush className="p-2.5">
        {next ? (
          <QuestCard requirement={next} lead />
        ) : (
          <p className="px-1 py-6 text-center text-small text-ink-500">
            Nothing is waiting on you right now.
          </p>
        )}
      </Well>
    </PortalShell>
  );
}
