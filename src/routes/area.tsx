import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { Link, useParams } from "@tanstack/react-router";

import { Illustration } from "@/components/illustration";
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
    <PortalShell
      current={id}
      title={area.label}
      /* The placeholder is this screen's first unit, so the band contains it
         the same way the Dashboard's band contains the lead card. An unbuilt
         Area held inside the colour reads as a room that is empty; the same
         card sitting under a grey header reads as a room that is broken. */
      opens={
        <Placeholder area={area} title={`${area.label} is not built yet`} sentence={area.future} />
      }
    />
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
    <PortalShell
      current="enrollment"
      title={requirement?.label ?? "Requirement"}
      opens={
        <Placeholder
          title={
            requirement
              ? `${requirement.label} is not built yet`
              : "That requirement does not exist"
          }
          sentence={
            requirement
              ? `${requirement.blurb} It will take about ${requirement.minutes} minutes when this screen is built, and ${requirement.office} is who receives it.`
              : "Nothing under this address. The list of everything outstanding is in My Enrollment."
          }
        />
      }
    />
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
    <Sections className="mx-auto w-full max-w-[36rem]">
      <Section title={title}>
        {/* **Illustration, because there is nothing real to show** (ADR 0015).
            An Area that is not built yet has no photograph by definition, and
            the drawing is what turns "not built" from a screen that looks
            broken into a room somebody is still furnishing. It sits *inside*
            the card, beside the sentence, rather than as a banner across the
            top of the screen — a drawing that spans a screen spends the fold
            budget on decoration (Brilliant, Cloaked). */}
        <div className="flex items-start gap-4">
          <Illustration scene="unbuilt" size="md" className="compact:hidden" />
          <div className="min-w-0 flex-1">
            {Icon ? (
              <IconTile size="lg" className="mb-2 hidden compact:inline-flex">
                <Icon weight="bold" aria-hidden className="size-5" />
              </IconTile>
            ) : null}
            <Prose>{sentence}</Prose>
          </div>
        </div>

        {area?.willLive.length ? (
          <>
            <p className="mt-4 mb-1 text-meta font-bold text-ink-500">What will live here</p>
            <ul className="flex flex-col">
              {area.willLive.map((thing) => (
                <li
                  key={thing}
                  className="flex items-baseline gap-2 border-t border-ink-100 py-2 text-small text-ink-700 first:border-t-0"
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
          <Well label="Meanwhile" className="mt-4">
            <Prose className={area.pointer ? "mb-2" : undefined}>{area.meanwhile}</Prose>
            {area.pointer ? (
              <Button asChild variant="secondary" size="sm">
                <Link to={area.pointer.path as never}>
                  {area.pointer.label}
                  <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
                </Link>
              </Button>
            ) : null}
          </Well>
        ) : null}

        <div className="mt-4 border-t border-ink-100 pt-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/portal/dashboard">
              <ArrowLeftIcon weight="bold" aria-hidden className="size-4" />
              Back to the Dashboard
            </Link>
          </Button>
        </div>
      </Section>
    </Sections>
  );
}
