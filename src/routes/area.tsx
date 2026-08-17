import { ArrowLeftIcon } from "@phosphor-icons/react";
import { Link, useParams } from "@tanstack/react-router";

import { PortalShell } from "@/components/portal-shell";
import { Prose, Section, Sections } from "@/components/surfaces";
import { Button } from "@/components/ui/button";
import { type AreaId, areaById } from "@/lib/areas";
import { requirements } from "@/lib/portal";

/**
 * The one placeholder, for every Area this cycle did not build.
 *
 * **One component rather than seven screens.** Seven bespoke empty screens cost
 * days, answer no design question, and are the *"entregando pouco"* the client
 * and the designer named on the call. What each Area supplies is one sentence
 * that is **true** about what will live there — `areas.ts` holds them — because
 * "coming soon" is filler and a student can tell.
 *
 * The anatomy is Render's empty state and Salesforce's `Nothing to see here`: a
 * centred card, what the thing is for, one way out. No invented illustration, no
 * fake count, no progress bar, and nothing that reads as an error — the client
 * has to be able to walk the whole map in front of the person this is presented
 * to without hitting anything that looks broken.
 */
export function AreaScreen({ id }: { id: AreaId }) {
  const area = areaById(id);

  return (
    <PortalShell current={id} title={area.label}>
      <Placeholder title={`${area.label} is not built yet`} sentence={area.future} />
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
            ? `${requirement.blurb} It will take about ${requirement.minutes} minutes when this screen is built.`
            : "Nothing under this address. The list of everything outstanding is in My Enrollment."
        }
      />
    </PortalShell>
  );
}

/**
 * A centred sheet, one true sentence, one way out.
 *
 * It is the system's own surface rather than a bespoke empty state: a `Sections`
 * sheet holding one `Section`, which is what every other screen in this repo is
 * made of. An empty screen drawn out of different parts is how "not built yet"
 * comes to read as "broken".
 */
function Placeholder({ title, sentence }: { title: string; sentence: string }) {
  return (
    <Sections className="mx-auto mt-6 w-full max-w-[34rem]">
      <Section title={title}>
        <Prose className="mx-auto text-center">{sentence}</Prose>
        <div className="mt-3 flex justify-center">
          <Button asChild variant="secondary" size="sm">
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
