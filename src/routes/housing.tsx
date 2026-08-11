import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  BuildingApartmentIcon,
  CheckIcon,
  HouseLineIcon,
  ImagesIcon,
  PlusIcon,
  QuestionIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";
import { motion, Reorder, useDragControls, useReducedMotion } from "motion/react";
import * as React from "react";

import { Notice } from "@/components/notice";
import { OptionCard } from "@/components/option-card";
import { ResidenceGallery } from "@/components/residence-gallery";
import { ContextPanel, StepActions, StepShell } from "@/components/step-shell";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import {
  formatDeadline,
  type HousingIntent,
  housingIntents,
  institution,
  offer,
  protectionOptions,
  type Residence,
  residences,
} from "@/lib/fixtures";
import { patch, useOnboarding } from "@/lib/store";
import { cn } from "@/lib/utils";

const INTENT_ICONS: Record<HousingIntent, React.ReactNode> = {
  "on-campus": <BuildingApartmentIcon weight="duotone" className="size-5 text-violet-500" />,
  "off-campus": <HouseLineIcon weight="duotone" className="size-5 text-violet-500" />,
  "not-sure": <QuestionIcon weight="duotone" className="size-5 text-violet-500" />,
};

const ORDINALS = ["1st choice", "2nd choice", "3rd choice"];
const SLOTS = 3;

/**
 * Housing, reduced.
 *
 * The live step stacks four blocks of questions — room type, bathroom, roommate
 * matching, a lifestyle questionnaire, themed communities — behind the single
 * "on campus" answer. None of that is here. On campus asks one thing; off
 * campus asks one thing; "not decided yet" asks nothing at all.
 *
 * The two columns exist for one reason on this step: the ranking slots stay in
 * view while the photographs scroll past them. Choosing where to live from a
 * list you cannot see while you look at the options is the thing that was
 * broken.
 */
export function HousingRoute() {
  const state = useOnboarding();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [gallery, setGallery] = React.useState<Residence | null>(null);
  const [announcement, setAnnouncement] = React.useState("");

  const intent = state.housing.intent;

  const ranked = state.housing.residenceRanking
    .map((id) => residences.find((residence) => residence.id === id))
    .filter((residence): residence is Residence => Boolean(residence));
  /**
   * Everything below indexes this, never the raw stored ranking. A stored id
   * that no longer resolves against the fixture — the exact case store.ts's
   * shallow merge is built to survive — would otherwise sit invisibly in the
   * list and make the arrows reorder a row nobody can see.
   */
  const rankedIds = ranked.map((residence) => residence.id);

  function setRanking(next: string[]) {
    patch("housing", { residenceRanking: next });
  }

  /** Position changes are invisible to a screen reader otherwise. */
  function announce(next: string[], residence: Residence) {
    const position = next.indexOf(residence.id);
    setAnnouncement(
      position === -1
        ? `${residence.name} removed from your ranking.`
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
      context={
        <HousingContext
          intent={intent}
          ranked={ranked}
          onMove={move}
          onRemove={remove}
          onReorder={setRanking}
          onOpenGallery={setGallery}
        />
      }
    >
      <fieldset className="space-y-4">
        {/* The sheet's own wording for this field. What was here — "Where do you
            picture starting your day?" — Laura read out loud and laughed at. */}
        <legend className="text-h3 mb-3 text-ink-900">
          Will you live on campus or off campus?
        </legend>
        <RadioGroup
          value={intent ?? ""}
          onValueChange={(value) => patch("housing", { intent: value as HousingIntent })}
        >
          {housingIntents.map((option) => (
            <OptionCard
              key={option.value}
              value={option.value}
              id={`housing-${option.value}`}
              label={option.label}
              hint={option.hint}
              icon={INTENT_ICONS[option.value]}
            />
          ))}
        </RadioGroup>
      </fieldset>

      {/* Enter-only, no AnimatePresence: changing the key swaps the branch on
          the same frame as the answer. An exit animation here just puts a
          delay between "I picked off campus" and seeing what that means. */}
      {intent ? (
        <motion.section
          key={intent}
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-5"
        >
          {intent === "on-campus" ? (
            <ResidenceCatalogue
              rankedIds={rankedIds}
              onAdd={add}
              onRemove={remove}
              onOpenGallery={setGallery}
            />
          ) : null}
          {intent === "off-campus" ? <ProtectionQuestion /> : null}
          {intent === "not-sure" ? (
            <Notice tone="success" title="No problem">
              Confirm housing plans is now on your enrollment checklist, due{" "}
              {formatDeadline(offer.responseDeadline)}.
            </Notice>
          ) : null}
        </motion.section>
      ) : null}

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      <StepActions>
        <Button
          type="button"
          size="lg"
          disabled={!intent}
          onClick={() => {
            patch("housing", { submitted: true });
            navigate({ to: "/onboarding/campus-life" });
          }}
        >
          Next: campus life
          <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
        </Button>
      </StepActions>

      <ResidenceGallery
        residence={gallery}
        open={gallery !== null}
        onOpenChange={(open) => {
          if (!open) setGallery(null);
        }}
      />
    </StepShell>
  );
}

/**
 * The fixed column.
 *
 * On campus it is the three slots, which is the whole reason this step has a
 * second column: you can see what you have already chosen while you are still
 * looking at the photographs. On the other two answers there is nothing to
 * rank, so it says what the answer means instead of showing empty furniture.
 */
function HousingContext({
  intent,
  ranked,
  onMove,
  onRemove,
  onReorder,
  onOpenGallery,
}: {
  intent: HousingIntent | null;
  ranked: Residence[];
  onMove: (index: number, direction: -1 | 1) => void;
  onRemove: (residence: Residence) => void;
  onReorder: (next: string[]) => void;
  onOpenGallery: (residence: Residence) => void;
}) {
  if (intent === "on-campus") {
    return (
      <RankingSlots
        ranked={ranked}
        onMove={onMove}
        onRemove={onRemove}
        onReorder={onReorder}
        onOpenGallery={onOpenGallery}
      />
    );
  }

  return (
    <ContextPanel title="Your housing plan">
      <p className="text-small text-ink-600">
        {intent === "off-campus"
          ? `Nothing else is needed here. ${institution.housingOffice} does not assign rooms to students living off campus.`
          : intent === "not-sure"
            ? `You can decide later. The deadline is ${formatDeadline(offer.responseDeadline)}.`
            : "Answer the question and what happens next appears here."}
      </p>
    </ContextPanel>
  );
}

function RankingSlots({
  ranked,
  onMove,
  onRemove,
  onReorder,
  onOpenGallery,
}: {
  ranked: Residence[];
  onMove: (index: number, direction: -1 | 1) => void;
  onRemove: (residence: Residence) => void;
  onReorder: (next: string[]) => void;
  onOpenGallery: (residence: Residence) => void;
}) {
  const rankedIds = ranked.map((residence) => residence.id);
  const empty = Math.max(0, SLOTS - ranked.length);

  return (
    <ContextPanel
      title="Your ranking"
      description="First choice at the top. Housing considers this, it does not guarantee it — rooms are assigned after the deadline."
    >
      {ranked.length === 0 ? (
        /* Empty state, per the Message Library rule: why it is empty and what
           would fill it. Never a blank box. */
        <p className="text-small text-ink-500">
          Nothing ranked yet. Choose <strong className="text-ink-700">Rank it</strong> on a
          residence and it takes the first slot.
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
            onOpenGallery={() => onOpenGallery(residence)}
          />
        ))}
      </Reorder.Group>

      {empty > 0 ? (
        <ol className="space-y-2">
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
    </ContextPanel>
  );
}

function RankedSlot({
  residence,
  index,
  total,
  onMove,
  onRemove,
  onOpenGallery,
}: {
  residence: Residence;
  index: number;
  total: number;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
  onOpenGallery: () => void;
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
         for anyone not dragging. */
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

        <button
          type="button"
          onClick={onOpenGallery}
          className="size-11 shrink-0 overflow-hidden rounded-[8px]"
        >
          <img
            src={residence.images.room.src}
            alt=""
            loading="lazy"
            draggable={false}
            className="size-full object-cover"
          />
          <span className="sr-only">See photos of {residence.name}</span>
        </button>

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

        <IconAction label={`Remove ${residence.name} from your ranking`} onClick={onRemove}>
          <XIcon weight="bold" aria-hidden className="size-4" />
        </IconAction>
      </div>
    </Reorder.Item>
  );
}

/**
 * The scrolling column: the residences as photographs.
 *
 * Round one made this three lines of text and a dropdown, which is not a choice
 * anyone can make — "where would I live" is answered by a picture of the room,
 * not by a sentence about the walk to the department.
 */
function ResidenceCatalogue({
  rankedIds,
  onAdd,
  onRemove,
  onOpenGallery,
}: {
  rankedIds: string[];
  onAdd: (residence: Residence) => void;
  onRemove: (residence: Residence) => void;
  onOpenGallery: (residence: Residence) => void;
}) {
  const full = rankedIds.length >= SLOTS;

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-h3 text-ink-900">These are the options open for your year</h2>
        <p className="text-body text-ink-600">
          This is a preference, not an assignment. Rank up to three — your ranking is beside them as
          you go.
        </p>
      </div>

      <div className="space-y-4">
        {residences.map((residence) => {
          const position = rankedIds.indexOf(residence.id);
          const isRanked = position !== -1;

          return (
            <article
              key={residence.id}
              className={cn(
                "overflow-hidden rounded-[var(--radius-card)] border bg-surface transition-[border-color,box-shadow]",
                isRanked
                  ? "border-violet-500 shadow-[0_0_0_1px_var(--color-violet-500)]"
                  : "border-ink-200 hover:border-ink-300 hover:shadow-soft",
              )}
            >
              <button
                type="button"
                onClick={() => onOpenGallery(residence)}
                className="relative block w-full"
              >
                <img
                  src={residence.images.exterior.src}
                  alt={residence.images.exterior.alt}
                  loading="lazy"
                  className="h-44 w-full object-cover sm:h-52"
                />
                <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-ink-950/70 px-3 py-1.5 text-small font-bold text-white backdrop-blur-sm">
                  <ImagesIcon weight="duotone" aria-hidden className="size-4" />
                  See the room
                </span>
              </button>

              <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="text-body font-bold text-ink-900">{residence.name}</p>
                  <p className="text-small text-ink-600">{residence.blurb}</p>
                  <p className="text-small text-ink-400">{residence.detail}</p>
                </div>

                {isRanked ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="shrink-0"
                    onClick={() => onRemove(residence)}
                  >
                    <CheckIcon weight="bold" aria-hidden className="size-4 text-mint-600" />
                    {ORDINALS[position]} — remove
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    className="shrink-0"
                    disabled={full}
                    onClick={() => onAdd(residence)}
                  >
                    <PlusIcon weight="bold" aria-hidden className="size-4" />
                    Rank it
                  </Button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {full ? (
        <p className="text-small text-ink-500">
          All three slots are full. Remove one to rank a different residence.
        </p>
      ) : null}

      {rankedIds.length === 0 ? (
        <p className="text-small text-ink-500">
          Skip it if you would rather. {institution.housingOffice} will place you and tell you
          where.
        </p>
      ) : null}
    </div>
  );
}

function ProtectionQuestion() {
  const state = useOnboarding();

  return (
    <fieldset className="space-y-4">
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
    </fieldset>
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
