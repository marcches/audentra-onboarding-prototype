import {
  ArrowRightIcon,
  CalendarBlankIcon,
  CheckCircleIcon,
  HouseLineIcon,
  ShieldCheckIcon,
  WalletIcon,
} from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";
import * as React from "react";

import { PricePill, useCelebration } from "@/components/celebration";
import { BackButton, ContinueAction, StepShell, useStepNav } from "@/components/step-shell";
import { Fact, IconTile, Prose, Section, SectionFields, Sections } from "@/components/surfaces";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Overlay } from "@/components/ui/overlay";
import { Textarea } from "@/components/ui/textarea";
import { campusPhotos, formatDeadline, formatMoney, institution, offer } from "@/lib/fixtures";
import { stepById } from "@/lib/steps";
import { patch, useOnboarding } from "@/lib/store";

/**
 * Your offer: the `decision` archetype's first instance, and the flow's biggest
 * emotional moment.
 *
 * **ADR 0009 is implemented here.** This screen used to carry `h-dvh
 * overflow-hidden`: it filled exactly one viewport at any width and, when the
 * content did not fit, it lost content rather than the constraint. That rule
 * was written against 452px of dead white measured in a 1440px window and it
 * worked there. Against the HD viewport of ADR 0008 it inverted — with ~640px
 * of usable height the clipping ate the programme description and the "what
 * accepting does" block, which are the two things that tell the student what
 * they are signing. The client saw it directly: *"tinha uns que tavam
 * cortados."*
 *
 * The constraint is now narrower and survives both viewports: **the decision
 * itself — the title, the facts and the two actions — is visible without
 * scrolling; its supporting material may sit below the fold.** The screen
 * scrolls. What answered the original complaint was never the clipping: it was
 * the 82rem archetype measure and the two-column composition, and both are
 * still here.
 *
 * Accepting is a **second, explicit moment** with the term in view (Upwork),
 * and it fits in a small object rather than taking the screen (Braintrust) —
 * which is exactly what ADR 0009 frees up. The celebration then happens on this
 * screen, over the UI the student was already looking at, with no route change
 * and no congratulations modal (Trello).
 */
export function OfferRoute() {
  const state = useOnboarding();
  const navigate = useNavigate();
  const celebration = useCelebration();
  const step = stepById("offer");
  const { goNext } = useStepNav("offer");

  const [declining, setDeclining] = React.useState(false);
  const [declineNote, setDeclineNote] = React.useState("");
  const [confirming, setConfirming] = React.useState(false);
  const [understood, setUnderstood] = React.useState(false);

  const answered = state.offer.response !== null;
  const accepted = state.offer.response === "accepted";

  const accept = () => {
    patch("offer", { response: "accepted", respondedAt: new Date().toISOString() });
    setConfirming(false);
    /* Full screen, on the screen they are already on. The layer owns the one
       canvas, so this leaves nothing behind to clean up. */
    celebration?.cheer("accept");
    celebration?.celebrate("offer", step.points);
  };

  const decline = () => {
    patch("offer", { response: "declined", respondedAt: new Date().toISOString() });
    setDeclining(false);
    navigate({ to: "/onboarding/who-you-are" });
  };

  return (
    <StepShell
      current="offer"
      title="Your place at Aster"
      lead="Everything below is the offer as it stands. Read it, then tell us."
      headerAside={<PricePill points={step.points} stepId="offer" earned={answered} />}
      saved={false}
      actions={
        <>
          <BackButton current="offer" />
          {accepted ? (
            <>
              <span className="flex items-center gap-1.5 text-small font-strong text-mint-deep">
                <CheckCircleIcon weight="fill" aria-hidden className="size-4" />
                Accepted
              </span>
              <ContinueAction label="Continue" onClick={goNext} />
            </>
          ) : (
            <>
              {/* Declining opens a confirmation because it is the irreversible
                  one; accepting opens one because a signature-shaped act
                  should not be the same click as reading. */}
              <Button type="button" variant="ghost" onClick={() => setDeclining(true)}>
                I am not taking this place
              </Button>
              <Button type="button" className="min-w-[10rem]" onClick={() => setConfirming(true)}>
                Accept my place
                <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
              </Button>
            </>
          )}
        </>
      }
    >
      <div className="grid grid-cols-12 gap-3 narrow:grid-cols-1">
        <ThePiece />

        <div className="col-span-7 flex flex-col gap-[var(--space-section)] narrow:col-span-1">
          <Sections signature>
            <Section title="The offer" collapsible={false}>
              <SectionFields>
                {FACTS.map((fact) => (
                  <Fact key={fact.label} label={fact.label}>
                    {fact.value}
                  </Fact>
                ))}
              </SectionFields>

              {/* The deposit is its own block with the deadline beside it, not
                  a loose line in a footer (Kiwi.com). */}
              <div className="mt-2 flex items-center gap-2.5 rounded-[var(--radius-field)] bg-well p-2.5">
                <IconTile size="md">
                  <WalletIcon weight="fill" aria-hidden className="size-5" />
                </IconTile>
                <div className="min-w-0 flex-1">
                  <p className="text-h3 text-ink-900 numeric">
                    {formatMoney(offer.depositAmount, offer.depositCurrency)}
                  </p>
                  <Prose size="note" className="text-ink-600">
                    Enrollment deposit, credited against your first term's tuition, not charged on
                    top of it.
                  </Prose>
                </div>
              </div>
            </Section>

            {/* Below the fold, and allowed to be — the two blocks the old
                `overflow-hidden` deleted rather than let scroll. */}
            <Section title="About the programme">
              <Prose>{offer.programmeDescription}</Prose>
            </Section>

            <Section title="What accepting does">
              <ul className="space-y-1.5">
                {CONSEQUENCES.map((line) => (
                  <li key={line.text} className="flex items-start gap-2">
                    <IconTile size="sm">
                      <line.Icon weight="fill" aria-hidden className="size-3.5" />
                    </IconTile>
                    <span className="pt-1 text-small leading-5 text-ink-700">{line.text}</span>
                  </li>
                ))}
              </ul>
            </Section>
          </Sections>

          {/* The reassurance, as a quiet block rather than as fine print
              (Artsy). */}
          <Prose size="note">
            Accepting does not lock you in for good. You can withdraw in writing any time before
            term starts.
          </Prose>
        </div>
      </div>

      {/* The second moment. Small, with the term in view, and the checkbox is
          what makes it a second act rather than a second click. */}
      <Overlay
        open={confirming}
        onOpenChange={setConfirming}
        title="Accept your place"
        description={`${offer.programme}, ${offer.degree}, starting ${offer.startingTerm}.`}
        className="max-w-[26rem]"
      >
        <div className="mt-3 space-y-3">
          <p className="text-small leading-5 text-ink-700">
            Accepting holds your place and starts the deposit clock. The{" "}
            {formatMoney(offer.depositAmount, offer.depositCurrency)} enrollment deposit is due by{" "}
            {formatDeadline(offer.responseDeadline)} and is credited against your first term's
            tuition. You may withdraw in writing at any time before term starts.
          </p>

          <label htmlFor="accept-understood" className="flex cursor-pointer items-start gap-2.5">
            <Checkbox
              id="accept-understood"
              checked={understood}
              onCheckedChange={(checked) => setUnderstood(checked === true)}
            />
            <span className="text-small leading-5 text-ink-700">
              I have read the terms above and I am accepting my place at {institution.short}.
            </span>
          </label>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setConfirming(false)}>
              Not yet
            </Button>
            <Button type="button" disabled={!understood} onClick={accept}>
              Accept my place
            </Button>
          </div>
        </div>
      </Overlay>

      <Overlay
        open={declining}
        onOpenChange={setDeclining}
        title="Turning down your place"
        description="We will let Admissions know. Nothing else happens, and you can write to them if you change your mind."
        className="max-w-[26rem]"
      >
        <div className="mt-3 space-y-3">
          <label htmlFor="decline-note" className="field-label block">
            Anything you want to tell us? (optional)
          </label>
          <Textarea
            id="decline-note"
            rows={2}
            value={declineNote}
            onChange={(event) => setDeclineNote(event.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setDeclining(false)}>
              Go back
            </Button>
            <Button type="button" variant="danger" onClick={decline}>
              Send my answer
            </Button>
          </div>
        </div>
      </Overlay>
    </StepShell>
  );
}

/**
 * The piece: art as a **band of fixed height**, never a background behind the
 * text (Frame.io, Runway). Nothing floats in the middle of the image; the
 * institution sits at the top and the programme at the base, in the art's own
 * footer.
 *
 * It stretches to the height of the column beside it, with a floor rather than
 * a ceiling. Capping it left ~340px of dead grey under the art at 1366×768,
 * which is the *original* complaint — 452px of dead white — coming back one
 * column to the left. It cannot push the actions off the screen because the
 * actions are not in the column: they float above it.
 */
function ThePiece() {
  return (
    <div className="relative col-span-5 isolate min-h-[12rem] overflow-hidden rounded-[var(--radius-card)] narrow:col-span-1 narrow:h-28 narrow:min-h-0">
      <img
        src={campusPhotos.offer.src}
        alt={campusPhotos.offer.alt}
        className="absolute inset-0 z-[var(--z-behind)] size-full object-cover"
      />
      <span
        aria-hidden
        className="absolute inset-0 z-[var(--z-behind)] bg-[linear-gradient(180deg,rgb(6_18_42/0.72)_0%,rgb(6_18_42/0.28)_45%,rgb(6_18_42/0.88)_100%)]"
      />

      <div className="flex h-full flex-col justify-between p-3 text-white">
        <p className="text-micro font-bold tracking-[0.14em] uppercase opacity-90">
          {institution.name}
        </p>
        <div>
          <p className="text-h2 font-bold">{offer.programme}</p>
          <p className="text-small opacity-90">
            {offer.degree} · {offer.startingTerm}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * The facts as `label → value` rows, at every width. The five used to be three
 * on a phone and five on a desktop — a Presence row that was never declared,
 * and a student on a phone being told less about their own offer than a student
 * on a laptop. Two dense columns fit all five in both places.
 */
const FACTS = [
  { label: "Programme", value: offer.programme },
  { label: "Degree", value: offer.degree },
  { label: "Starts", value: offer.startingTerm },
  { label: "Campus", value: offer.campus },
  { label: "Respond by", value: formatDeadline(offer.responseDeadline) },
];

const CONSEQUENCES = [
  {
    Icon: ShieldCheckIcon,
    text: `Holds your place in ${offer.programme} for ${offer.startingTerm}.`,
  },
  { Icon: HouseLineIcon, text: "Opens housing, so you can rank where you want to live." },
  {
    Icon: CalendarBlankIcon,
    text: `Starts the deposit clock. You have until ${formatDeadline(offer.responseDeadline)} to pay it.`,
  },
];
