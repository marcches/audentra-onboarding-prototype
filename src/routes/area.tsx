import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { Link, useParams } from "@tanstack/react-router";

import { PortalShell } from "@/components/portal-shell";
import { IconTile, Prose, Section, Sections, Well } from "@/components/surfaces";
import { Button } from "@/components/ui/button";
import { type Area, type AreaId, areaById } from "@/lib/areas";
import { requirements } from "@/lib/portal";

/**
 * The one placeholder, for every Area this cycle did not build.
 *
 * **One component rather than seven screens.** Seven bespoke empty screens cost
 * days, answer no design question, and are the *"entregando pouco"* the client
 * and the designer named on the call. What each Area supplies is data —
 * `areas.ts` holds the sentence, the list and the pointer — because "coming
 * soon" is filler and a student can tell.
 *
 * **What changed this cycle: honest was right, empty is not the same as
 * honest.** These screens ended at y=188 with 580px of Ground under them, on
 * seven of the nine Areas, and that is most of why the portal read as unfinished
 * in a walkthrough. So the card now says *what will live here* as three or four
 * named things, and — where there genuinely is one — points at the one place the
 * student can act on the subject today. Where there is nowhere, it says nothing
 * rather than inventing a destination.
 *
 * The anatomy is Render's empty state and Salesforce's `Nothing to see here`:
 * one card, what the thing is for, one way out, at a size that does not read as
 * a defect. Still no invented illustration, no fake count, no progress bar, and
 * nothing that reads as an error — the client has to be able to walk the whole
 * map in front of the person this is presented to without hitting anything that
 * looks broken. The list lives *inside* the same card rather than in a second
 * block below it, which is the part of Render's template that stops an empty
 * state becoming a stack.
 */
export function AreaScreen({ id }: { id: AreaId }) {
  const area = areaById(id);

  return (
    <PortalShell current={id} title={area.label}>
      <Placeholder area={area} title={`${area.label} is not built yet`} sentence={area.future} />
    </PortalShell>
  );
}

/**
 * A Requirement's own screen, which is the next cycle's work.
 *
 * It exists now for the same reason the seven placeholders do: every card on the
 * Dashboard carries a primary action, and an action leading nowhere is the dead
 * item this cycle set out to remove. The three carried-over Requirements do not
 * come here — their action goes back to the Quest in the gate, which is a real
 * screen that really finishes the work.
 *
 * It has no `willLive` list: a Requirement's screen will hold the Requirement,
 * and listing "the form" as a thing that will live there is padding.
 */
export function RequirementScreen() {
  const { requirement: slug } = useParams({ strict: false }) as { requirement?: string };
  const requirement = requirements.find((candidate) => candidate.id === slug);

  return (
    <PortalShell current="enrollment" title={requirement?.label ?? "Requirement"}>
      <Placeholder
        title={
          requirement ? `${requirement.label} is not built yet` : "That requirement does not exist"
        }
        sentence={
          requirement
            ? `${requirement.blurb} It will take about ${requirement.minutes} minutes when this screen is built, and ${requirement.office} is who receives it.`
            : "Nothing under this address. The list of everything outstanding is in My Enrollment."
        }
      />
    </PortalShell>
  );
}

/**
 * One sheet: what this is, what will be in it, where to go meanwhile.
 *
 * It is the system's own surface rather than a bespoke empty state — a
 * `Sections` sheet holding one `Section`, which is what every other screen in
 * this repo is made of. An empty screen drawn out of different parts is how "not
 * built yet" comes to read as "broken".
 */
function Placeholder({ area, title, sentence }: { area?: Area; title: string; sentence: string }) {
  const Icon = area?.icon;

  return (
    <Sections className="mx-auto mt-5 w-full max-w-[36rem]">
      <Section title={title}>
        <div className="flex items-start gap-3">
          {Icon ? (
            <IconTile size="lg">
              <Icon weight="duotone" aria-hidden className="size-5" />
            </IconTile>
          ) : null}
          <Prose>{sentence}</Prose>
        </div>

        {area?.willLive.length ? (
          <>
            <p className="mt-3.5 mb-1 text-micro font-bold tracking-[0.08em] text-ink-500 uppercase">
              What will live here
            </p>
            <ul className="flex flex-col">
              {area.willLive.map((thing) => (
                <li
                  key={thing}
                  className="flex items-baseline gap-2 border-t border-ink-100 py-1.5 text-small text-ink-700 first:border-t-0"
                >
                  {/* A dot rather than a tick: a tick would say this is done,
                      and a numeral would say there is an order to it. */}
                  <span aria-hidden className="size-1 shrink-0 rounded-full bg-ink-300" />
                  <span className="min-w-0">{thing}</span>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {/* Where the student can act today — or why nowhere. A Well rather than
            a Section of its own: a second frame under the first is the stacking
            three rounds of review have objected to, and this is one card.

            The two Areas with no destination still get the block, because the
            sentence in it is a fact the student can use. What they do not get is
            a button: the rule that survives is that a pointer goes somewhere
            real, never to another placeholder. */}
        {area?.meanwhile ? (
          <Well label="Meanwhile" className="mt-3.5">
            <Prose className={area.pointer ? "mb-2" : undefined}>{area.meanwhile}</Prose>
            {area.pointer ? (
              <Button asChild variant="secondary" size="sm">
                <Link to={area.pointer.path as never}>
                  {area.pointer.label}
                  <ArrowRightIcon weight="bold" aria-hidden className="size-3.5" />
                </Link>
              </Button>
            ) : null}
          </Well>
        ) : null}

        <div className="mt-3.5 border-t border-ink-100 pt-2.5">
          <Button asChild variant="ghost" size="sm">
            <Link to="/portal/dashboard">
              <ArrowLeftIcon weight="bold" aria-hidden className="size-3.5" />
              Back to the Dashboard
            </Link>
          </Button>
        </div>
      </Section>
    </Sections>
  );
}
