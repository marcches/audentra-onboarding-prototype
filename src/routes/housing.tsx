import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  HouseLineIcon,
  XIcon,
} from "@phosphor-icons/react";
import { motion, Reorder, useDragControls, useReducedMotion } from "motion/react";
import * as React from "react";

import { FilterPill } from "@/components/filter-pill";
import { Notice } from "@/components/notice";
import { OptionCard } from "@/components/option-card";
import { ResidenceCard } from "@/components/residence-card";
import { BackButton, Panel, StepShell, useStepNav } from "@/components/step-shell";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import {
  type BathroomCode,
  bathroomFilters,
  housingAvailability,
  institution,
  protectionOptions,
  type Residence,
  type RoomTypeCode,
  residences,
  roomTypeFilters,
} from "@/lib/fixtures";
import { patch, useOnboarding } from "@/lib/store";

const ORDINALS = ["1st choice", "2nd choice", "3rd choice"];
const SLOTS = housingAvailability.shortlistSize;

/**
 * Housing.
 *
 * The step the last round did not touch at all. It used to open with a
 * three-way question — on campus, off campus, not decided — with the eight
 * residences hidden down one arm of it, which meant the screen's first act was
 * to ask a student to commit before showing them anything to commit to. The
 * residences are now the step. The student who has already found a flat in the
 * city takes the exit at the bottom.
 *
 * What they build is a **Shortlist**: three ranked preferences, not a booking.
 * `Housing Services` assigns rooms, and the screen says so twice — once at the
 * top where the ranking is made and once inside the Shortlist itself, because
 * "I chose this" is what a ranked list looks like to anyone who has used the
 * internet.
 */
export function HousingRoute() {
  const state = useOnboarding();
  const { next, goNext } = useStepNav("housing");
  const [announcement, setAnnouncement] = React.useState("");

  const arrangingOwn = state.housing.arrangingOwn;

  const ranked = state.housing.residenceRanking
    .map((id) => residences.find((residence) => residence.id === id))
    .filter((residence): residence is Residence => Boolean(residence));
  const rankedIds = ranked.map((residence) => residence.id);

  function setRanking(next: string[]) {
    patch("housing", { residenceRanking: next });
  }

  /** Position changes are invisible to a screen reader otherwise. */
  function announce(next: string[], residence: Residence) {
    const position = next.indexOf(residence.id);
    setAnnouncement(
      position === -1
        ? `${residence.name} removed from your shortlist.`
        : `${residence.name} is now ${ORDINALS[position] ?? `choice ${position + 1}`}.`,
    );
  }

  function add(residence: Residence) {
    if (rankedIds.length >= SLOTS || rankedIds.includes(residence.id)) return;
    const next = [...rankedIds, residence.id];
    setRanking(next);
    announce(next, residence);
  }

  function remove(residence: Residence) {
    const next = rankedIds.filter((id) => id !== residence.id);
    setRanking(next);
    announce(next, residence);
  }

  function move(index: number, direction: -1 | 1) {
    const next = [...rankedIds];
    const target = index + direction;
    const moved = next[index];
    const displaced = next[target];
    if (moved === undefined || displaced === undefined) return;
    next[index] = displaced;
    next[target] = moved;
    setRanking(next);
    const residence = residences.find((item) => item.id === moved);
    if (residence) announce(next, residence);
  }

  return (
    <StepShell
      current="housing"
      title="Where you'll live"
      lead={
        <>
          Rank {SLOTS} of the {residences.length}. {institution.housingOffice} assigns rooms after
          the response deadline. A shortlist is considered, never guaranteed.
        </>
      }
      actions={
        <>
          <BackButton current="housing" />
          <Button
            type="button"
            size="lg"
            onClick={() => {
              patch("housing", { submitted: true });
              goNext();
            }}
          >
            <span className="hidden sm:inline">Next: {next?.label.toLowerCase()}</span>
            <span className="sm:hidden">Next</span>
            <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
          </Button>
        </>
      }
    >
      {arrangingOwn ? (
        <ArrangingOwn onReturn={() => patch("housing", { arrangingOwn: false })} />
      ) : (
        <>
          <Shortlist ranked={ranked} onMove={move} onRemove={remove} onReorder={setRanking} />
          <ResidenceCatalogue rankedIds={rankedIds} onAdd={add} onRemove={remove} />

          {/* The exit, kept discreet on purpose: it is the right path for a
              small minority and the wrong one for everybody else, and it used
              to be a third of the step. */}
          <p className="pb-1 text-center text-small text-ink-500">
            Already have a place in the city?{" "}
            <button
              type="button"
              onClick={() => patch("housing", { arrangingOwn: true, residenceRanking: [] })}
              className="font-bold text-violet-600 underline underline-offset-4 hover:text-violet-700"
            >
              I'll arrange my own housing
            </button>
          </p>
        </>
      )}

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </StepShell>
  );
}

/**
 * The Shortlist, above the catalogue it is built from.
 *
 * It sits above rather than beside because there is no third column any more,
 * and above rather than below because "what have I picked so far" is asked
 * while looking at the cards, not after scrolling past all eight of them.
 */
function Shortlist({
  ranked,
  onMove,
  onRemove,
  onReorder,
}: {
  ranked: Residence[];
  onMove: (index: number, direction: -1 | 1) => void;
  onRemove: (residence: Residence) => void;
  onReorder: (next: string[]) => void;
}) {
  const rankedIds = ranked.map((residence) => residence.id);
  const empty = Math.max(0, SLOTS - ranked.length);

  return (
    <Panel
      title="Your shortlist"
      description="First choice at the top. Reorder with the arrows, or drag the number."
    >
      {ranked.length === 0 ? (
        /* Empty state, per the Message Library rule: why it is empty and what
           would fill it. Never a blank box — but never three empty boxes
           either: the sentence says the same thing in a tenth of the height,
           and 200px of dashed placeholder above the first photograph is
           exactly the bulk the client was complaining about. The numbered
           slots appear as soon as one of them means something. */
        <p className="text-small text-ink-500">
          Nothing shortlisted yet. Choose <strong className="text-ink-700">Add to shortlist</strong>{" "}
          on a residence and it takes the first slot.
        </p>
      ) : null}

      <Reorder.Group
        axis="y"
        as="ol"
        values={rankedIds}
        onReorder={onReorder}
        className="space-y-2"
      >
        {ranked.map((residence, index) => (
          <RankedSlot
            key={residence.id}
            residence={residence}
            index={index}
            total={ranked.length}
            onMove={(direction) => onMove(index, direction)}
            onRemove={() => onRemove(residence)}
          />
        ))}
      </Reorder.Group>

      {empty > 0 && ranked.length > 0 ? (
        <ol className="mt-2 space-y-2">
          {Array.from({ length: empty }, (_, offset) => {
            const position = ranked.length + offset;
            return (
              <li
                key={ORDINALS[position]}
                className="flex items-center gap-3 rounded-[var(--radius-card)] border border-dashed border-ink-200 px-3 py-3"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-ink-200 text-small font-bold text-ink-300">
                  {position + 1}
                </span>
                <span className="text-small text-ink-400">{ORDINALS[position]} — empty</span>
              </li>
            );
          })}
        </ol>
      ) : null}
    </Panel>
  );
}

function RankedSlot({
  residence,
  index,
  total,
  onMove,
  onRemove,
}: {
  residence: Residence;
  index: number;
  total: number;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={residence.id}
      /* The grab/release feel is Stack's: a little lift and tilt on pick-up, a
         spring on release. Stack itself is a shuffling deck and expresses no
         order, which is the one thing this step exists to capture — so the
         physics is borrowed and the component is not.

         Drag starts from the handle only. Making the whole row draggable takes
         over the vertical axis on touch, so a swipe anywhere on it lifts the
         row instead of scrolling the page. The arrows are the equivalent path
         for anyone not dragging — and the ticket asks for reordering to work
         without a drag at all. */
      dragListener={false}
      dragControls={dragControls}
      whileDrag={
        reduceMotion ? undefined : { scale: 1.02, rotate: -0.8, boxShadow: "var(--shadow-lift)" }
      }
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="overflow-hidden rounded-[var(--radius-card)] border border-violet-500 bg-surface"
    >
      <div className="flex items-center gap-2.5 p-2.5">
        {/* The number doubles as the grip: it is already the thing that says
            "this is position N", so it is the thing to take hold of. */}
        <button
          type="button"
          aria-label={`Drag to reorder ${residence.name}`}
          onPointerDown={(event) => dragControls.start(event)}
          className="brand-gradient flex size-7 shrink-0 cursor-grab touch-none items-center justify-center rounded-full text-small font-bold text-white active:cursor-grabbing"
        >
          {index + 1}
        </button>

        <img
          src={residence.photos[0]?.src}
          alt=""
          loading="lazy"
          draggable={false}
          className="size-11 shrink-0 rounded-[8px] object-cover"
        />

        <span className="min-w-0 flex-1">
          <span className="block truncate text-body font-bold text-ink-900">{residence.name}</span>
          <span className="block text-micro font-bold tracking-[0.06em] text-violet-600 uppercase">
            {ORDINALS[index] ?? `Choice ${index + 1}`}
          </span>
        </span>

        <span className="flex shrink-0 flex-col">
          <IconAction
            label={`Move ${residence.name} up`}
            disabled={index === 0}
            onClick={() => onMove(-1)}
          >
            <ArrowUpIcon weight="bold" aria-hidden className="size-3.5" />
          </IconAction>
          <IconAction
            label={`Move ${residence.name} down`}
            disabled={index === total - 1}
            onClick={() => onMove(1)}
          >
            <ArrowDownIcon weight="bold" aria-hidden className="size-3.5" />
          </IconAction>
        </span>

        <IconAction label={`Remove ${residence.name} from your shortlist`} onClick={onRemove}>
          <XIcon weight="bold" aria-hidden className="size-4" />
        </IconAction>
      </div>
    </Reorder.Item>
  );
}

/** The eight residences, filtered by the two things a student narrows on first. */
function ResidenceCatalogue({
  rankedIds,
  onAdd,
  onRemove,
}: {
  rankedIds: string[];
  onAdd: (residence: Residence) => void;
  onRemove: (residence: Residence) => void;
}) {
  const [roomTypes, setRoomTypes] = React.useState<string[]>([]);
  const [bathrooms, setBathrooms] = React.useState<string[]>([]);
  const full = rankedIds.length >= SLOTS;

  const visible = residences.filter(
    (residence) =>
      (roomTypes.length === 0 ||
        residence.roomTypes.some((type) => roomTypes.includes(type as RoomTypeCode))) &&
      (bathrooms.length === 0 || bathrooms.includes(residence.bathroom as BathroomCode)),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <FilterPill
          label="Room type"
          options={roomTypeFilters}
          selected={roomTypes}
          onChange={setRoomTypes}
        />
        <FilterPill
          label="Bathroom"
          options={bathroomFilters}
          selected={bathrooms}
          onChange={setBathrooms}
        />
        <p className="ml-auto text-small text-ink-500">
          {visible.length} of {residences.length}
        </p>
      </div>

      {full ? (
        <p className="text-small text-ink-500">
          All {SLOTS} slots are full. Remove one to shortlist a different residence.
        </p>
      ) : null}

      {visible.length === 0 ? (
        <Notice tone="info" title="Nothing matches both filters">
          No residence offers that room type with that bathroom. Widening either one brings
          residences back.
        </Notice>
      ) : null}

      <div className="space-y-3">
        {visible.map((residence) => (
          <ResidenceCard
            key={residence.id}
            residence={residence}
            position={rankedIds.indexOf(residence.id)}
            disabled={full}
            onAdd={() => onAdd(residence)}
            onRemove={() => onRemove(residence)}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * The off-campus path, which is now one screen rather than half the step.
 *
 * Tuition and housing protection lives here: it was the whole content of the
 * old "off campus" branch, it is in the institution's field inventory, and the
 * person arranging their own place is exactly the person it is for.
 */
function ArrangingOwn({ onReturn }: { onReturn: () => void }) {
  const state = useOnboarding();
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4"
    >
      <Notice tone="success" title="Noted — you're housing yourself">
        {institution.housingOffice} won't assign you a room, and there's no shortlist to build.
        Nothing else in enrollment depends on this.
      </Notice>

      <Panel as="fieldset" className="space-y-4">
        <legend className="text-h3 mb-1 text-ink-900">
          Want to look at tuition or housing protection?
        </legend>
        <p className="mb-3 text-body text-ink-600">
          Optional cover that refunds part of what you have paid if you have to withdraw mid-term.
          Saying yes means someone sends you the details.
        </p>
        <RadioGroup
          value={state.housing.protectionInterest}
          onValueChange={(value) => patch("housing", { protectionInterest: value })}
        >
          {protectionOptions.map((option) => (
            <OptionCard
              key={option.value}
              value={option.value}
              id={`protection-${option.value}`}
              label={option.label}
            />
          ))}
        </RadioGroup>
      </Panel>

      <Button type="button" variant="secondary" onClick={onReturn} className="w-full sm:w-auto">
        <HouseLineIcon weight="duotone" aria-hidden className="size-4" />
        Show me the residences after all
      </Button>
    </motion.div>
  );
}

function IconAction({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex size-7 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-ink-50 hover:text-ink-900 disabled:pointer-events-none disabled:opacity-35"
    >
      {children}
      <span className="sr-only">{label}</span>
    </button>
  );
}
