import { Link } from "@tanstack/react-router";
import type * as React from "react";

import { CompactBalance } from "@/components/balance";
import { InstitutionCrest } from "@/components/institution-badge";
import { type AreaId, areaGroups, areas } from "@/lib/areas";
import { studentRecord } from "@/lib/fixtures";
import { aboveCompact, inCompactFlex } from "@/lib/layout";
import { useOnboarding } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * The portal's shell: the whole map at the left, the Area you are standing in
 * beside it, and the Balance in the one place it never leaves.
 *
 * Three fixed slots, the same shape as the gate's Rail one surface across: **who
 * this is** (the institution's mark and the student's own name), **where you can
 * go** (nine Areas in three groups), **what you have earned** (the compact
 * Balance at the foot).
 *
 * The Balance here is compact rather than rich (ADR 0013) and does not pass
 * `celebrates`. A permanent shell element must not animate on change while the
 * student is reading something else, and the rich block — the ladder rung and
 * the distance to it — is the Dashboard's, where there is room for it.
 *
 * Nothing in this file measures the window. The sidebar and the bottom
 * navigation are the two halves of one Presence row (`portal-layout.ts`), both
 * always in the DOM, swapped by the width classes ADR 0008 declares.
 */
export function PortalShell({
  current,
  title,
  lead,
  children,
}: {
  current: AreaId;
  title: string;
  /** The one line beside the title. Never a second row above the work. */
  lead?: React.ReactNode;
  children: React.ReactNode;
}) {
  const state = useOnboarding();
  const name = state.whoYouAre.preferredName.trim() || studentRecord.legalFirstName;

  return (
    <>
      {/* 14rem against the gate's 16 and the production portal's wider one. The
          grouping is what pays for it: the headings do the work the vertical
          space was doing, so the rows come down too (Remote). */}
      <aside className={cn("w-56 shrink-0 border-r border-ink-100 bg-surface", aboveCompact)}>
        <div className="sticky top-0 flex h-dvh flex-col gap-2.5 px-2.5 py-3">
          <div className="flex items-center gap-2 px-1">
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

          <nav
            aria-label="Areas"
            className="min-h-0 overflow-y-auto border-t border-ink-100 pt-2.5"
          >
            <ul className="flex flex-col gap-2.5">
              {areaGroups.map((group) => (
                <li key={group.label ?? group.areas[0].id}>
                  {group.label ? (
                    <p className="px-2 pb-1 text-meta font-bold tracking-[0.08em] text-ink-400 uppercase">
                      {group.label}
                    </p>
                  ) : null}
                  <ul className="flex flex-col">
                    {group.areas.map((area) => {
                      const Icon = area.icon;
                      const here = area.id === current;

                      return (
                        <li key={area.id}>
                          <Link
                            to={area.path as never}
                            aria-current={here ? "page" : undefined}
                            className={cn(
                              "row-nudge flex items-center gap-2 rounded-[var(--radius-field)] px-2 py-1 text-body transition-colors",
                              /* Where you are, said twice: the fill and the
                                 weight. A highlight you have to hunt for is the
                                 same defect as a missing one. */
                              here
                                ? "bg-violet-50 font-bold text-violet-700"
                                : "text-ink-700 hover:bg-ink-50",
                            )}
                          >
                            <Icon
                              weight={here ? "fill" : "regular"}
                              aria-hidden
                              className="size-4 shrink-0"
                            />
                            <span className="min-w-0 flex-1 truncate">{area.label}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          </nav>

          {/* Against the last Area rather than at the bottom of the column.
              Pinned to the foot it sat 334px below the thing above it, which is
              not "permanent", it is orphaned — and the flight that justified a
              fixed pixel in the gate does not happen here. */}
          <div className="flex flex-col gap-1 border-t border-ink-100 pt-2.5">
            <p className="px-1 text-meta font-bold tracking-[0.08em] text-ink-400 uppercase">
              Your balance
            </p>
            <div className="flex">
              <CompactBalance />
            </div>
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

        {/* The Audentra signature, once per screen (ADR 0012).

            The gate signs the screen's work sheet. The portal has no single work
            sheet — its screens are a shell with a column in it — so the mark
            lands at the head of the content column, which is the same claim
            about frequency: one per screen, and nothing else on the screen
            carries it. Without this the portal was the only surface in the
            product with no signature at all, which is a fair part of why it read
            as somebody else's work. */}
        <span aria-hidden className="brand-gradient h-0.5 shrink-0" />

        <main className="flex flex-1 flex-col px-4 pt-3 pb-6 compact:px-3 compact:pb-[5.5rem]">
          <div className="mx-auto flex w-full max-w-[var(--catalogue-measure)] flex-1 flex-col gap-2.5">
            {/* Greeting and progress on one line. A section that celebrates
                progress before showing the next action is doing the opposite of
                what was asked for — and it is what puts the first card below the
                fold at 1366×768. The `h1` is the gate's own token: the portal
                setting its own title size was typed rather than decided. */}
            <header className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
              <h1 className="text-h1 text-ink-900">{title}</h1>
              {lead ? <div className="min-w-0 flex-1">{lead}</div> : null}
            </header>
            {children}
          </div>
        </main>

        {/* The phone's half of the same Presence row. Every Area is here, in the
            sidebar's own order, on a bar that scrolls sideways rather than a
            bar that hides four of them behind `More` — the complaint that
            started this work was something being reachable and not findable. */}
        <nav
          aria-label="Areas"
          className={cn(
            "fixed inset-x-0 bottom-0 z-[var(--z-actions)] border-t border-ink-100 bg-surface/95 backdrop-blur",
            inCompactFlex,
          )}
        >
          <ul className="rail-scroll flex flex-1 overflow-x-auto px-1 py-1">
            {areas.map((area) => {
              const Icon = area.icon;
              const here = area.id === current;

              return (
                <li key={area.id} className="shrink-0">
                  <Link
                    to={area.path as never}
                    aria-current={here ? "page" : undefined}
                    className={cn(
                      "flex min-h-[var(--tap-target)] w-[4.75rem] flex-col items-center justify-center gap-0.5 rounded-[var(--radius-field)] px-1 text-meta",
                      here ? "bg-violet-50 font-bold text-violet-700" : "text-ink-500",
                    )}
                  >
                    <Icon
                      weight={here ? "fill" : "regular"}
                      aria-hidden
                      className="size-5 shrink-0"
                    />
                    <span className="w-full truncate text-center leading-3">{area.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}
