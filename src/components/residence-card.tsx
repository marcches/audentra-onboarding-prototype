import {
  BedIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CheckIcon,
  ForkKnifeIcon,
  PersonSimpleWalkIcon,
  PlusIcon,
  ShowerIcon,
  UsersThreeIcon,
  WashingMachineIcon,
} from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  bathroomLabels,
  firstYearPolicyLabels,
  laundryLabels,
  mealPlanLabels,
  type Residence,
  residencePhotoLabels,
  roomTypeLabels,
} from "@/lib/fixtures";
import { cn } from "@/lib/utils";

/**
 * One residence, as a horizontal card.
 *
 * This is where the Booking resemblance the client asked for actually lives
 * (ADR-0003): carousel with ‹ › on the left, name and facts in the middle, the
 * action on the right — Expedia's property card, more or less literally. What
 * is not borrowed is the selection model. Booking books one room; a U.S.
 * housing office takes a preference and assigns the room itself, so the card
 * adds to a Shortlist rather than committing to anything.
 *
 * Below `sm` it reflows to vertical, photo on top, because a 15rem photo beside
 * 15rem of text at 390px is two unreadable columns rather than one card.
 */
export function ResidenceCard({
  residence,
  position,
  disabled,
  onAdd,
  onRemove,
}: {
  residence: Residence;
  /** Its place in the Shortlist, 0-based, or -1 if it isn't on it. */
  position: number;
  /** The Shortlist is full and this one isn't on it. */
  disabled: boolean;
  onAdd: () => void;
  onRemove: () => void;
}) {
  const shortlisted = position !== -1;

  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-[var(--radius-card)] border bg-surface transition-[border-color,box-shadow] sm:flex-row",
        shortlisted
          ? "border-violet-500 shadow-[0_0_0_1px_var(--color-violet-500)]"
          : "border-ink-100 shadow-soft hover:border-ink-300",
      )}
    >
      <PhotoCarousel residence={residence} />

      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
        <div className="space-y-0.5">
          <h3 className="text-body font-bold text-ink-900">{residence.name}</h3>
          <p className="text-small text-ink-600">{residence.summary}</p>
        </div>

        {/* The facts a student decides on, and no price — ADR-0003. Chips
            rather than a table: six values that are each two words read faster
            wrapped than they do in labelled rows, and the card has to stay
            shorter than the phone. */}
        <ul className="flex flex-wrap gap-1.5">
          <Chip icon={<BedIcon weight="duotone" aria-hidden className="size-3.5" />}>
            {residence.roomTypes.map((type) => roomTypeLabels[type]).join(" or ")}
          </Chip>
          <Chip icon={<ShowerIcon weight="duotone" aria-hidden className="size-3.5" />}>
            {bathroomLabels[residence.bathroom]}
          </Chip>
          <Chip icon={<ForkKnifeIcon weight="duotone" aria-hidden className="size-3.5" />}>
            {mealPlanLabels[residence.mealPlan]}
          </Chip>
          <Chip icon={<PersonSimpleWalkIcon weight="duotone" aria-hidden className="size-3.5" />}>
            {residence.walkMinutes} min walk
          </Chip>
          <Chip icon={<WashingMachineIcon weight="duotone" aria-hidden className="size-3.5" />}>
            {laundryLabels[residence.laundry]}
          </Chip>
          <Chip icon={<UsersThreeIcon weight="duotone" aria-hidden className="size-3.5" />}>
            {firstYearPolicyLabels[residence.firstYearPolicy]}
          </Chip>
        </ul>

        <div className="mt-auto flex justify-end pt-0.5">
          {shortlisted ? (
            <Button type="button" variant="secondary" size="sm" onClick={onRemove}>
              <CheckIcon weight="bold" aria-hidden className="size-4 text-mint-600" />
              Shortlisted #{position + 1} — remove
            </Button>
          ) : (
            <Button type="button" size="sm" disabled={disabled} onClick={onAdd}>
              <PlusIcon weight="bold" aria-hidden className="size-4" />
              Add to shortlist
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

function Chip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-ink-50 px-2.5 py-1 text-micro font-bold text-ink-700">
      <span className="text-violet-500">{icon}</span>
      {children}
    </li>
  );
}

/**
 * The carousel, inline on the card and not behind a modal (Airbnb).
 *
 * A scroll-snapping row rather than a JS slider: the swipe on a phone is then
 * the browser's own, at the browser's own speed, and the arrows are a
 * `scrollBy` over the same mechanism rather than a second source of truth about
 * which photo is showing. `ResidenceGallery` — the dialog this replaces — was
 * the only way to see a room, which put the deciding photograph one tap further
 * away than the deciding button.
 */
function PhotoCarousel({ residence }: { residence: Residence }) {
  const track = React.useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = React.useState(0);
  const total = residence.photos.length;

  function scrollTo(next: number) {
    const element = track.current;
    if (!element) return;
    element.scrollTo({
      left: element.clientWidth * next,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }

  const photo = residence.photos[index];

  return (
    <div className="group/carousel relative shrink-0 sm:w-60">
      <div
        ref={track}
        onScroll={(event) => {
          const element = event.currentTarget;
          setIndex(Math.round(element.scrollLeft / Math.max(1, element.clientWidth)));
        }}
        className="flex h-44 snap-x snap-mandatory overflow-x-auto scroll-smooth sm:h-full sm:min-h-45 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {residence.photos.map((frame) => (
          <img
            key={frame.src}
            src={frame.src}
            alt={frame.alt}
            loading="lazy"
            draggable={false}
            className="h-full w-full shrink-0 snap-center object-cover"
          />
        ))}
      </div>

      {/* Named, because "photo 2 of 3" tells nobody whether they have seen the
          room yet — which is the only reason to page through these at all. */}
      <p className="pointer-events-none absolute top-2 left-2 rounded-[var(--radius-pill)] bg-ink-950/65 px-2 py-0.5 text-micro font-bold text-white backdrop-blur-sm">
        {residencePhotoLabels[photo?.kind ?? "room"]}
      </p>

      {/* Always visible on touch, where there is no hover to reveal them. */}
      <CarouselArrow
        side="left"
        label={`Previous photo of ${residence.name}`}
        disabled={index === 0}
        onClick={() => scrollTo(index - 1)}
      />
      <CarouselArrow
        side="right"
        label={`Next photo of ${residence.name}`}
        disabled={index === total - 1}
        onClick={() => scrollTo(index + 1)}
      />

      <div aria-hidden className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
        {residence.photos.map((frame, dot) => (
          <span
            key={frame.src}
            className={cn(
              "size-1.5 rounded-full transition-colors",
              dot === index ? "bg-white" : "bg-white/45",
            )}
          />
        ))}
      </div>
    </div>
  );
}

function CarouselArrow({
  side,
  label,
  disabled,
  onClick,
}: {
  side: "left" | "right";
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "absolute top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-ink-800 shadow-soft transition-opacity hover:bg-surface disabled:opacity-0",
        side === "left" ? "left-2" : "right-2",
      )}
    >
      {side === "left" ? (
        <CaretLeftIcon weight="bold" aria-hidden className="size-4" />
      ) : (
        <CaretRightIcon weight="bold" aria-hidden className="size-4" />
      )}
      <span className="sr-only">{label}</span>
    </button>
  );
}
