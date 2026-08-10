import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  BuildingApartmentIcon,
  CarIcon,
  HouseLineIcon,
  ImagesIcon,
  PlusIcon,
  QuestionIcon,
  UsersThreeIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";
import { motion, Reorder, useDragControls, useReducedMotion } from "motion/react";
import * as React from "react";

import { Notice } from "@/components/notice";
import { OptionCard } from "@/components/option-card";
import { ResidenceGallery } from "@/components/residence-gallery";
import { StepActions, StepShell } from "@/components/step-shell";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import {
  type HousingIntent,
  housingIntents,
  institution,
  protectionOptions,
  type Residence,
  residences,
} from "@/lib/fixtures";
import { patch, useOnboarding } from "@/lib/store";

const INTENT_ICONS: Record<HousingIntent, React.ReactNode> = {
  "on-campus": <BuildingApartmentIcon weight="duotone" className="size-5 text-violet-500" />,
  "off-campus": <HouseLineIcon weight="duotone" className="size-5 text-violet-500" />,
  "not-sure": <QuestionIcon weight="duotone" className="size-5 text-violet-500" />,
  commuting: <CarIcon weight="duotone" className="size-5 text-violet-500" />,
  "family-housing": <UsersThreeIcon weight="duotone" className="size-5 text-violet-500" />,
};

/**
 * Housing, reduced.
 *
 * The live step stacks four blocks of questions — room type, bathroom,
 * roommate matching, a lifestyle questionnaire, themed communities — behind the
 * single "on campus" answer. None of that is here. On campus asks one thing;
 * off campus asks one thing; the other three answers ask nothing at all.
 */
export function HousingRoute() {
  const state = useOnboarding();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const intent = state.housing.intent;

  return (
    <StepShell
      current="housing"
      title="Where you'll live"
      lead="One question, and then at most one more. Nothing here is an assignment — it tells Housing what to plan for."
    >
      <fieldset className="space-y-4">
        <legend className="text-h3 mb-3 text-ink-900">
          Where do you picture starting your day?
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
          {intent === "on-campus" ? <ResidenceRanking /> : null}
          {intent === "off-campus" ? <ProtectionQuestion /> : null}
          {intent !== "on-campus" && intent !== "off-campus" ? (
            <NothingElse intent={intent} />
          ) : null}
        </motion.section>
      ) : null}

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
    </StepShell>
  );
}

const ORDINALS = ["1st choice", "2nd choice", "3rd choice"];

/**
 * Ranking, as a visual decision.
 *
 * Round one made this a text list you tapped into position, on the argument
 * that drag is the control that fails hardest on touch and with a keyboard.
 * Half of that argument still holds — so drag is added, not substituted: the
 * cards reorder by dragging, and the same reorder is available from two
 * buttons on every card. What round one got wrong was the other half. You
 * cannot choose where to live from three lines of text, so each option is now
 * a photograph with a gallery behind it, and the room shot is in there because
 * that is the picture the student actually wants.
 */
function ResidenceRanking() {
  const state = useOnboarding();
  const [gallery, setGallery] = React.useState<Residence | null>(null);
  const [announcement, setAnnouncement] = React.useState("");

  const ranking = state.housing.residenceRanking;
  const ranked = ranking
    .map((id) => residences.find((residence) => residence.id === id))
    .filter((residence): residence is Residence => Boolean(residence));
  /**
   * Everything below indexes this, never the raw stored `ranking`. A stored id
   * that no longer resolves against the fixture — the exact case store.ts's
   * shallow merge is built to survive — would otherwise sit invisibly in the
   * list and make the arrows reorder a row nobody can see.
   */
  const rankedIds = ranked.map((residence) => residence.id);
  const unranked = residences.filter((residence) => !rankedIds.includes(residence.id));

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
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-h3 text-ink-900">Rank up to three residences</h2>
        <p className="text-body text-ink-600">
          Drag by the number to reorder them, or use the arrows. First choice at the top. Housing
          considers this, it doesn't guarantee it — rooms are assigned after the deadline.
        </p>
      </div>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {ranked.length > 0 ? (
        <Reorder.Group
          axis="y"
          as="ol"
          values={rankedIds}
          onReorder={(next: string[]) => setRanking(next)}
          className="space-y-3"
        >
          {ranked.map((residence, index) => (
            <RankedResidence
              key={residence.id}
              residence={residence}
              index={index}
              total={ranked.length}
              onMove={(direction) => move(index, direction)}
              onRemove={() => {
                const next = rankedIds.filter((id) => id !== residence.id);
                setRanking(next);
                announce(next, residence);
              }}
              onOpenGallery={() => setGallery(residence)}
            />
          ))}
        </Reorder.Group>
      ) : null}

      {unranked.length > 0 ? (
        <div className="space-y-3">
          {ranked.length > 0 ? <p className="field-label">Also available</p> : null}
          {unranked.map((residence) => (
            <UnrankedResidence
              key={residence.id}
              residence={residence}
              onAdd={() => {
                const next = [...rankedIds, residence.id];
                setRanking(next);
                announce(next, residence);
              }}
              onOpenGallery={() => setGallery(residence)}
            />
          ))}
        </div>
      ) : null}

      {ranked.length === 0 ? (
        <p className="text-small text-ink-500">
          Skip it if you'd rather. {institution.housingOffice} will place you and tell you where.
        </p>
      ) : null}

      <ResidenceGallery
        residence={gallery}
        open={gallery !== null}
        onOpenChange={(open) => {
          if (!open) setGallery(null);
        }}
      />
    </div>
  );
}

function RankedResidence({
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
      /* The grab/release feel is Stack's: a little lift and tilt on pick-up,
         a spring on release. Stack itself is a shuffling deck and expresses no
         order, which is the one thing this step exists to capture — so the
         physics is borrowed and the component is not.

         Drag starts from the handle only (`dragListener={false}` plus
         `dragControls`). Making the whole card draggable takes over the
         vertical axis on touch, so a swipe anywhere on these full-width cards
         lifts the card instead of scrolling the page — and with three of them
         stacked on a 390px screen there is barely any page left to swipe on.
         That is the exact objection round one raised against drag, and it is
         answered by narrowing the target rather than by dropping the gesture. */
      dragListener={false}
      dragControls={dragControls}
      whileDrag={
        reduceMotion ? undefined : { scale: 1.02, rotate: -0.8, boxShadow: "var(--shadow-lift)" }
      }
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="overflow-hidden rounded-[var(--radius-card)] border border-violet-500 bg-surface shadow-[0_0_0_1px_var(--color-violet-500)]"
    >
      <div className="flex flex-col sm:flex-row">
        <img
          src={residence.images.exterior.src}
          alt={residence.images.exterior.alt}
          loading="lazy"
          draggable={false}
          className="h-36 w-full shrink-0 object-cover sm:h-auto sm:w-44"
        />

        <div className="flex flex-1 items-start gap-3 p-4">
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
          <div className="flex-1 space-y-1">
            <p className="text-micro font-bold tracking-[0.06em] text-violet-600 uppercase">
              {ORDINALS[index] ?? `Choice ${index + 1}`}
            </p>
            <p className="text-body font-bold text-ink-900">{residence.name}</p>
            <p className="text-small text-ink-500">{residence.detail}</p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="-ml-2"
              onClick={onOpenGallery}
            >
              <ImagesIcon weight="duotone" aria-hidden className="size-4" />
              See the room
            </Button>
          </div>

          <span className="flex shrink-0 flex-col items-center">
            <IconAction
              label={`Move ${residence.name} up`}
              disabled={index === 0}
              onClick={() => onMove(-1)}
            >
              <ArrowUpIcon weight="bold" aria-hidden className="size-4" />
            </IconAction>
            <IconAction
              label={`Move ${residence.name} down`}
              disabled={index === total - 1}
              onClick={() => onMove(1)}
            >
              <ArrowDownIcon weight="bold" aria-hidden className="size-4" />
            </IconAction>
            <IconAction label={`Remove ${residence.name} from your ranking`} onClick={onRemove}>
              <XIcon weight="bold" aria-hidden className="size-4" />
            </IconAction>
          </span>
        </div>
      </div>
    </Reorder.Item>
  );
}

function UnrankedResidence({
  residence,
  onAdd,
  onOpenGallery,
}: {
  residence: Residence;
  onAdd: () => void;
  onOpenGallery: () => void;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-ink-200 bg-surface transition-[border-color,box-shadow] hover:border-ink-300 hover:shadow-soft sm:flex-row">
      <img
        src={residence.images.exterior.src}
        alt={residence.images.exterior.alt}
        loading="lazy"
        className="h-36 w-full shrink-0 object-cover sm:h-auto sm:w-44"
      />
      <div className="flex flex-1 flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="flex-1 space-y-1">
          <p className="text-body font-bold text-ink-900">{residence.name}</p>
          <p className="text-small text-ink-600">{residence.blurb}</p>
          <p className="text-small text-ink-400">{residence.detail}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={onOpenGallery}>
            <ImagesIcon weight="duotone" aria-hidden className="size-4" />
            See the room
          </Button>
          <Button type="button" size="sm" onClick={onAdd}>
            <PlusIcon weight="bold" aria-hidden className="size-4" />
            Rank it
          </Button>
        </div>
      </div>
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
        Optional cover that refunds part of what you've paid if you have to withdraw mid-term.
        Saying yes here just means someone sends you the details.
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

function NothingElse({ intent }: { intent: HousingIntent }) {
  const copy: Partial<Record<HousingIntent, string>> = {
    "not-sure":
      "Fine. Confirm housing plans lands on your enrollment checklist and you can settle it later.",
    commuting:
      "Nothing else needed here. Parking and commuter details come from Student Life closer to the term.",
    "family-housing": `Nothing else needed here. ${institution.housingOffice} will contact you about family and dependent options.`,
  };

  return (
    <Notice tone="success" title="That's everything for this step">
      {copy[intent]}
    </Notice>
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
      className="flex size-9 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-surface hover:text-ink-900 disabled:pointer-events-none disabled:opacity-35"
    >
      {children}
      <span className="sr-only">{label}</span>
    </button>
  );
}
