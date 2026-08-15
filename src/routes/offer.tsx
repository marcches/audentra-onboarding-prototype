import {
  ArrowRightIcon,
  CalendarBlankIcon,
  HouseLineIcon,
  ShieldCheckIcon,
  WalletIcon,
} from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";
import * as React from "react";

import { Acceptance } from "@/components/acceptance";
import { PricePill } from "@/components/points-award";
import { BackButton, StepShell } from "@/components/step-shell";
import { IconTile, Panel } from "@/components/surfaces";
import { Button } from "@/components/ui/button";
import { Overlay } from "@/components/ui/overlay";
import { Textarea } from "@/components/ui/textarea";
import { campusPhotos, formatDeadline, formatMoney, institution, offer } from "@/lib/fixtures";
import { stepById } from "@/lib/steps";
import { patch, useOnboarding } from "@/lib/store";

/**
 * Your offer: the `decision` archetype's first instance, and the flow's biggest
 * emotional moment.
 *
 * Two problems, both measured rather than felt. **452px of dead canvas at
 * 1440×900** — measured last round and filed rather than fixed — and an
 * acceptance dialog the client wants to be, in Laura's words, *"um popupzão"*.
 *
 * The dead canvas is not solved by making the content taller. It is solved by
 * the composition Upwork uses: the right column is not a summary of the left,
 * it is **the other party**. The piece (photograph, wash, wordmark, programme)
 * and the act (facts, deposit, reassurance, consequence) are two halves that
 * stretch to the same height and fill the usable viewport between them. The
 * canvas beneath takes a very low gradient so the piece rests rather than
 * floats (Mistral).
 *
 * **"What accepting does" lives here, not in the celebration.** Stating the
 * consequence before the decision is the honest pattern (Preply), and it is
 * what fills the column. The consequence is that the celebration is now made of
 * emotion, Points and sharing rather than information, which is the thing the
 * client actually asked for.
 */
export function OfferRoute() {
  const state = useOnboarding();
  const navigate = useNavigate();
  const step = stepById("offer");

  const [declining, setDeclining] = React.useState(false);
  const [declineNote, setDeclineNote] = React.useState("");
  const [celebrating, setCelebrating] = React.useState(false);

  const answered = state.offer.response !== null;

  const accept = () => {
    patch("offer", { response: "accepted", respondedAt: new Date().toISOString() });
    setCelebrating(true);
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
      actions={
        <>
          <BackButton current="offer" />
          {/* One click, no two-step confirmation on the way in. Declining opens
              a confirmation because it is the irreversible one. */}
          <Button type="button" variant="ghost" onClick={() => setDeclining(true)}>
            I am not taking this place
          </Button>
          <Button type="button" size="lg" onClick={accept}>
            Accept my place
            <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
          </Button>
        </>
      }
    >
      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-12">
        <ThePiece />
        <TheAct />
      </div>

      <Acceptance open={celebrating} onOpenChange={setCelebrating} />

      <Overlay
        open={declining}
        onOpenChange={setDeclining}
        title="Turning down your place"
        description="We will let Admissions know. Nothing else happens, and you can write to them if you change your mind."
      >
        <div className="mt-5 space-y-4">
          <label htmlFor="decline-note" className="field-label block">
            Anything you want to tell us? (optional)
          </label>
          <Textarea
            id="decline-note"
            rows={3}
            value={declineNote}
            onChange={(event) => setDeclineNote(event.target.value)}
          />
          <div className="flex justify-end gap-2.5">
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
 * The piece: art as a **vertical band of fixed width**, never a background
 * behind the text (Frame.io, Runway). Nothing floats in the middle of the
 * image; the wordmark sits at the top and the programme at the base, in the
 * art's own footer.
 *
 * On a phone the band **shrinks rather than disappearing** (Monzo), and the
 * programme description is cut — the first thing a `decision` screen loses when
 * it will not fit.
 */
function ThePiece() {
  return (
    <div className="relative isolate overflow-hidden rounded-[var(--radius-card)] lg:col-span-5">
      <img
        src={campusPhotos.offer.src}
        alt={campusPhotos.offer.alt}
        className="absolute inset-0 -z-10 size-full object-cover"
      />
      <span
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(6_18_42/0.72)_0%,rgb(6_18_42/0.28)_45%,rgb(6_18_42/0.88)_100%)]"
      />

      <div className="flex h-24 flex-col justify-between p-4 text-white sm:h-28 lg:h-full lg:p-6">
        <p className="text-micro font-bold tracking-[0.14em] uppercase opacity-90">
          {institution.name}
        </p>
        <div>
          <p className="text-h3 font-bold sm:text-h2">{offer.programme}</p>
          <p className="text-small opacity-90">
            {offer.degree} · {offer.startingTerm}
          </p>
          {/* Cut on mobile. The description is the first thing to go when a
              decision screen has to lose content rather than the constraint. */}
          <p className="mt-2 hidden max-w-sm text-small leading-5 opacity-85 lg:block">
            {offer.programmeDescription}
          </p>
        </div>
      </div>
    </div>
  );
}

const FACTS = [
  { label: "Programme", value: offer.programme },
  { label: "Degree", value: offer.degree },
  { label: "Starts", value: offer.startingTerm },
  { label: "Campus", value: offer.campus },
  { label: "Respond by", value: formatDeadline(offer.responseDeadline) },
];

/** The three rows mobile keeps. Five label→value rows do not fit beside a bar. */
const MOBILE_FACTS = new Set(["Programme", "Starts", "Respond by"]);

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

/**
 * The act: stacked bands separated by hairlines inside one Panel, because they
 * are sequential parts of one subject with no independent actions (lululemon).
 * Four framed boxes in a column is the stacking the client has objected to
 * twice.
 *
 * The facts are `label → value` **rows**, not a five-cell grid. A grid of five
 * makes the reader scan in two directions to answer "when does it start".
 */
function TheAct() {
  return (
    <Panel className="flex flex-col lg:col-span-7" bodyClassName="flex flex-1 flex-col">
      <dl className="divide-y divide-ink-100">
        {FACTS.map((fact) => (
          <div
            key={fact.label}
            className={
              MOBILE_FACTS.has(fact.label)
                ? "flex items-baseline justify-between gap-4 py-2"
                : "hidden items-baseline justify-between gap-4 py-2 lg:flex"
            }
          >
            <dt className="text-small text-ink-500">{fact.label}</dt>
            <dd className="text-body font-strong text-ink-900">{fact.value}</dd>
          </div>
        ))}
      </dl>

      {/* The deposit is its own block with the deadline beside it, not a loose
          line in a footer (Kiwi.com). */}
      <div className="mt-4 flex items-center gap-4 rounded-[var(--radius-field)] bg-well p-4">
        <IconTile size="lg">
          <WalletIcon weight="fill" aria-hidden className="size-6" />
        </IconTile>
        <div className="min-w-0 flex-1">
          <p className="text-h3 text-ink-900 numeric">
            {formatMoney(offer.depositAmount, offer.depositCurrency)}
          </p>
          <p className="text-small text-ink-600">
            Enrollment deposit, credited against your first term's tuition, not charged on top of
            it.
          </p>
        </div>
      </div>

      {/* Migrated out of the celebration. Stating the consequence before the
          decision is the honest place for it. Not carried to mobile. */}
      <div className="mt-5 hidden border-t border-ink-100 pt-4 lg:block">
        <p className="field-label">What accepting does</p>
        <ul className="mt-3 space-y-2.5">
          {CONSEQUENCES.map((line) => (
            <li key={line.text} className="flex items-start gap-3">
              <IconTile size="sm">
                <line.Icon weight="fill" aria-hidden className="size-4" />
              </IconTile>
              <span className="pt-1.5 text-body text-ink-700">{line.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* The reassurance sits immediately above the bar, as a quiet block
          rather than as fine print (Artsy). */}
      <p className="mt-auto pt-4 text-small text-ink-500">
        Accepting does not lock you in for good. You can withdraw in writing any time before term
        starts.
      </p>
    </Panel>
  );
}
