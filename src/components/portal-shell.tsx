import { Link } from "@tanstack/react-router";

import { CompactBalance } from "@/components/balance";
import { InstitutionCrest } from "@/components/institution-badge";
import { studentRecord } from "@/lib/fixtures";
import { aboveCompact, inCompactFlex } from "@/lib/layout";
import { useOnboarding } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * The portal's shell: a sidebar the student never leaves, and the Area they are
 * standing in beside it.
 *
 * Enough of a shell to hold one page, which is all this cycle's tracer bullet
 * needs. The nine Areas, the three groups and the bottom navigation are the
 * next ticket's — what is here is the frame they hang off, plus the one element
 * that has to be present in every Area from the start: the compact Balance.
 *
 * It is compact rather than rich (ADR 0013), and it does not pass `celebrates`.
 * A permanent shell element must not animate on change while the student is
 * reading something else — the award's flight belongs to the moment of earning,
 * which happens in the gate.
 */
export function PortalShell({
  title,
  lead,
  children,
}: {
  title: string;
  lead?: React.ReactNode;
  children: React.ReactNode;
}) {
  const state = useOnboarding();
  const name = state.whoYouAre.preferredName.trim() || studentRecord.legalFirstName;

  return (
    <>
      <aside className={cn("w-56 shrink-0 border-r border-ink-100 bg-surface", aboveCompact)}>
        <div className="sticky top-0 flex h-dvh flex-col gap-3 px-3 py-3">
          <div className="flex items-center gap-2">
            <InstitutionCrest className="size-8 shrink-0" />
            <span className="flex min-w-0 flex-col">
              <span className="truncate font-display text-body font-black tracking-[-0.015em] text-ink-900">
                Aster University
              </span>
              <span className="truncate text-meta tracking-[0.06em] text-ink-500 uppercase">
                {name}
              </span>
            </span>
          </div>

          <nav aria-label="Areas" className="min-h-0 flex-1 border-t border-ink-100 pt-3">
            <Link
              to="/portal/dashboard"
              activeProps={{ className: "bg-violet-50 font-bold text-violet-700" }}
              className="flex items-center rounded-[var(--radius-field)] px-2 py-1.5 text-body text-ink-700 hover:bg-ink-50"
            >
              Dashboard
            </Link>
          </nav>

          <div className="flex border-t border-ink-100 pt-2.5">
            <CompactBalance />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col bg-canvas">
        <header
          className={cn(
            "sticky top-0 z-[var(--z-rail)] items-center gap-2 border-b border-ink-100 bg-surface/90 px-4 py-2 backdrop-blur",
            inCompactFlex,
          )}
        >
          <InstitutionCrest className="size-6 shrink-0" />
          <span className="min-w-0 flex-1 truncate font-display text-small font-black tracking-[-0.015em] text-ink-900">
            Aster University
          </span>
          <CompactBalance />
        </header>

        <main className="flex flex-1 flex-col px-4 pt-3 pb-6 compact:px-3">
          <div className="mx-auto flex w-full max-w-[var(--catalogue-measure)] flex-1 flex-col gap-2.5">
            <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h1 className="text-h2 text-ink-900">{title}</h1>
              {lead ? <div className="min-w-0 flex-1">{lead}</div> : null}
            </header>
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
