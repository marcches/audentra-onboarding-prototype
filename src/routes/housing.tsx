import {
  ArrowRightIcon,
  ArrowUpIcon,
  CheckIcon,
  ImagesIcon,
  PlusIcon,
  XIcon,
} from "@phosphor-icons/react";
import * as React from "react";

import { useImageViewer } from "@/components/image-viewer";
import { AwardStage, PricePill, usePointsAward } from "@/components/points-award";
import { BackButton, StepShell, steadyAction, useStepNav } from "@/components/step-shell";
import { FlatCard, OnGround, SectionLabel, Well } from "@/components/surfaces";
import { Button } from "@/components/ui/button";
import { Overlay } from "@/components/ui/overlay";
import { formatMoney, institution } from "@/lib/fixtures";
import {
  amenityLabels,
  bathroomLabels,
  bathroomShort,
  eligibilityLabels,
  genderConfigLabels,
  highestRate,
  housingAvailability,
  laundryLabels,
  lowestRate,
  photoKindLabels,
  photoSections,
  type Residence,
  residenceById,
  residences,
  roomRate,
  roomTypes,
} from "@/lib/housing";
import { stepById } from "@/lib/steps";
import { patch, useOnboarding } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * Housing: the `catalogue` archetype's first instance.
 *
 * The previous spec declared this screen already correct and touched nothing.
 * The **record** was the part that was wrong, and the record is what every
 * comparison on the screen is made of — see `housing.ts`, where the fixture now
 * carries what a U.S. university actually publishes and the rates are derived
 * from the sector's real ratios rather than typed.
 *
 * The grid sits directly on the Ground. That is one of the three documented
 * exceptions, not an accident: a catalogue that *is* the screen inside a white
 * Panel is a white box on a grey page containing white cards, which is border
 * around border and the reason catalogues have been reading as thrown down
 * (Kit). Ticket 01 revoked the "`Panel` never wraps a gallery" line and
 * replaced it with this narrower one.
 */
export function HousingRoute() {
  const state = useOnboarding();
  const housing = state.housing;
  const award = usePointsAward();
  const { goNext } = useStepNav("housing");
  const step = stepById("housing");

  const [detail, setDetail] = React.useState<string | null>(null);
  const [comparing, setComparing] = React.useState(false);

  const ranking = housing.residenceRanking;
  const full = ranking.length >= housingAvailability.shortlistSize;

  const toggle = (id: string) => {
    if (ranking.includes(id)) {
      patch("housing", { residenceRanking: ranking.filter((entry) => entry !== id) });
    } else if (!full) {
      patch("housing", { residenceRanking: [...ranking, id] });
    }
  };

  const move = (id: string, delta: number) => {
    const index = ranking.indexOf(id);
    const next = index + delta;
    if (index === -1 || next < 0 || next >= ranking.length) return;
    const reordered = [...ranking];
    [reordered[index], reordered[next]] = [reordered[next], reordered[index]];
    patch("housing", { residenceRanking: reordered });
  };

  const save = () => {
    patch("housing", { submitted: true });
    award?.celebrate("housing", step.points);
  };

  return (
    <StepShell
      current="housing"
      title="Housing"
      lead={`Eight residences. Rank your three favourites and ${institution.housingOffice} will work from that.`}
      headerAside={<PricePill points={step.points} stepId="housing" earned={housing.submitted} />}
      actions={
        <>
          <BackButton current="housing" />
          <Button type="button" size="lg" className={steadyAction} onClick={save}>
            {ranking.length > 0 ? "Save my shortlist" : "Continue without a preference"}
            <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
          </Button>
        </>
      }
    >
      {/* Stated plainly, in the words every university researched uses. It is
          the sentence that stops a student being surprised in July. */}
      <p className="text-small text-ink-500">
        A preference is a request, not an assignment. {institution.housingOffice} assigns rooms
        after the response deadline. Room rates are per person, per academic year, and meal plans
        are priced separately from {formatMoney(housingAvailability.mealPlanFromUsd, "USD")}.
      </p>

      <Shortlist
        ranking={ranking}
        onMove={move}
        onRemove={toggle}
        onCompare={() => setComparing(true)}
      />

      <OnGround reason="catalogue" as="section">
        <SectionLabel
          description={`${residences.length} residences for ${housingAvailability.academicYear}`}
        >
          The catalogue
        </SectionLabel>
        <ul className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {residences.map((residence) => (
            <ResidenceCard
              key={residence.id}
              residence={residence}
              rank={ranking.indexOf(residence.id)}
              disabled={full && !ranking.includes(residence.id)}
              onToggle={() => toggle(residence.id)}
              onOpen={() => setDetail(residence.id)}
            />
          ))}
        </ul>
      </OnGround>

      <ResidenceDetail id={detail} onClose={() => setDetail(null)} />
      <Comparison
        open={comparing}
        onOpenChange={setComparing}
        residences={ranking
          .map(residenceById)
          .filter((entry): entry is Residence => Boolean(entry))}
      />

      <AwardStage stepId="housing" headline="Shortlist filed.">
        <Button type="button" size="lg" onClick={goNext}>
          Continue
          <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
        </Button>
      </AwardStage>
    </StepShell>
  );
}

/**
 * The card: a flat card on the Ground, with the photo bleeding to its edge.
 *
 * The photo counter is a **textual pill** in the corner rather than dots
 * (Agoda), because dots stop scaling somewhere around six and this catalogue
 * will carry twelve frames per building when the API is real. Every photograph
 * here opens the viewer from ticket 10 — that is the client's request, by name.
 *
 * Ranking a residence does not lift it or change its size: fill, a check, and
 * a rank number that replaces the add control in place.
 */
function ResidenceCard({
  residence,
  rank,
  disabled,
  onToggle,
  onOpen,
}: {
  residence: Residence;
  /** 0-based position in the Shortlist, or -1. */
  rank: number;
  disabled: boolean;
  onToggle: () => void;
  onOpen: () => void;
}) {
  const viewer = useImageViewer();
  const ranked = rank >= 0;
  const photos = residence.photos.map((photo) => ({
    ...photo,
    label: `${residence.name} · ${photoKindLabels[photo.kind]}`,
  }));

  return (
    <FlatCard as="li" selected={ranked} className="flex flex-col">
      <div className="relative">
        <button
          type="button"
          onClick={(event) => viewer.open(photos, 0, event)}
          className="block aspect-video w-full overflow-hidden"
          aria-label={`See photos of ${residence.name}`}
        >
          <img
            src={residence.photos[0].src}
            alt={residence.photos[0].alt}
            className="size-full object-cover"
          />
        </button>

        <span className="pointer-events-none absolute right-2 bottom-2 rounded-[var(--radius-pill)] bg-ink-950/70 px-2 py-0.5 text-[0.6875rem] font-bold text-white numeric">
          1/{residence.photos.length}
        </span>

        {/* The Shortlist action sits on the photo, where the eye already is. */}
        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          className={cn(
            "absolute top-2 right-2 flex h-8 min-w-8 items-center gap-1 rounded-[var(--radius-pill)] px-2 text-small font-bold",
            "transition-colors duration-[var(--duration-base)] disabled:opacity-40",
            ranked ? "bg-violet-500 text-white" : "bg-panel/95 text-ink-800 hover:bg-panel",
          )}
        >
          {ranked ? (
            <>
              <CheckIcon weight="bold" aria-hidden className="size-3.5" />
              <span className="numeric">Ranked {rank + 1}</span>
            </>
          ) : (
            <>
              <PlusIcon weight="bold" aria-hidden className="size-3.5" />
              <span className="sr-only">Add {residence.name} to shortlist</span>
            </>
          )}
        </button>
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <p className="text-body font-strong text-ink-900">{residence.name}</p>
        <p className="mt-0.5 line-clamp-2 text-small text-ink-500">{residence.summary}</p>

        <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-small text-ink-600">
          <div className="flex gap-1">
            <dt className="sr-only">Bathroom</dt>
            <dd>{bathroomShort[residence.bathroom]}</dd>
          </div>
          <div className="flex gap-1">
            <dt className="sr-only">Walk</dt>
            <dd className="numeric">{residence.walkMinutes} min walk</dd>
          </div>
          <div className="flex gap-1">
            <dt className="sr-only">Air conditioning</dt>
            <dd>{residence.airConditioning ? "Air conditioned" : "No air con"}</dd>
          </div>
        </dl>

        <div className="mt-3 flex items-end justify-between gap-3 border-t border-ink-100 pt-3">
          <p className="text-small text-ink-500">
            <span className="text-body font-strong text-ink-900 numeric">
              {formatMoney(lowestRate(residence), "USD")}
            </span>{" "}
            a year, room only
          </p>
          <Button type="button" variant="ghost" size="sm" onClick={onOpen}>
            Details
          </Button>
        </div>
      </div>
    </FlatCard>
  );
}

/** The three ranked, in a Well, reorderable. Nothing lifts when it moves. */
function Shortlist({
  ranking,
  onMove,
  onRemove,
  onCompare,
}: {
  ranking: string[];
  onMove: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCompare: () => void;
}) {
  return (
    <Well
      label={`Your shortlist · ${ranking.length} of ${housingAvailability.shortlistSize} ranked`}
    >
      {ranking.length === 0 ? (
        <p className="text-small text-ink-500">Pick three residences and rank them.</p>
      ) : (
        <>
          <ol className="space-y-2">
            {ranking.map((id, index) => {
              const residence = residenceById(id);
              if (!residence) return null;
              return (
                <li
                  key={id}
                  className="flex items-center gap-3 rounded-[var(--radius-field)] border border-ink-100 bg-panel px-3 py-2"
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-violet-500 text-[0.6875rem] font-bold text-white numeric">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-body text-ink-800">
                    {residence.name}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Move ${residence.name} up`}
                    disabled={index === 0}
                    onClick={() => onMove(id, -1)}
                  >
                    <ArrowUpIcon weight="bold" aria-hidden className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Move ${residence.name} down`}
                    disabled={index === ranking.length - 1}
                    onClick={() => onMove(id, 1)}
                  >
                    <ArrowUpIcon weight="bold" aria-hidden className="size-4 rotate-180" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove ${residence.name} from shortlist`}
                    onClick={() => onRemove(id)}
                  >
                    <XIcon weight="bold" aria-hidden className="size-4" />
                  </Button>
                </li>
              );
            })}
          </ol>
          {ranking.length > 1 ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="mt-3"
              onClick={onCompare}
            >
              Compare your {ranking.length === 2 ? "two" : "three"}
            </Button>
          ) : null}
        </>
      )}
    </Well>
  );
}

/**
 * The detail: hero with an overlaid counter and an explicit "See all photos",
 * then the **room-shortcut row** with background thumbnails, each opening the
 * gallery at that section (Realtor.com). Then the facts, and the meal plan line
 * that makes the room rate comparable to any other room rate.
 */
function ResidenceDetail({ id, onClose }: { id: string | null; onClose: () => void }) {
  const viewer = useImageViewer();
  const residence = id ? residenceById(id) : undefined;
  if (!residence) return null;

  const photos = residence.photos.map((photo) => ({
    ...photo,
    label: `${residence.name} · ${photoKindLabels[photo.kind]}`,
  }));
  const sections = photoSections(residence);

  return (
    <Overlay
      open={Boolean(id)}
      onOpenChange={(next) => !next && onClose()}
      title={residence.name}
      description={residence.summary}
      className="md:max-w-[46rem]"
    >
      <div className="mt-4 space-y-5">
        <div className="relative overflow-hidden rounded-[var(--radius-card)]">
          <button
            type="button"
            onClick={(event) => viewer.open(photos, 0, event)}
            className="block aspect-video w-full"
            aria-label={`Open ${residence.name} photos full screen`}
          >
            <img
              src={residence.photos[0].src}
              alt={residence.photos[0].alt}
              className="size-full object-cover"
            />
          </button>
          <span className="pointer-events-none absolute right-3 bottom-3 flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-ink-950/70 px-2.5 py-1 text-small font-bold text-white">
            <ImagesIcon weight="fill" aria-hidden className="size-4" />
            <span className="numeric">See all {residence.photos.length} photos</span>
          </span>
        </div>

        {/* The room-shortcut row. Each opens the gallery already at that
            section, and each carries its own count so a nearly empty category
            says so before the click (Trip.com). */}
        <ul className="grid grid-cols-3 gap-2">
          {sections.map((section) => {
            const start = residence.photos.indexOf(section.photos[0]);
            return (
              <li key={section.kind}>
                <button
                  type="button"
                  onClick={(event) => viewer.open(photos, start, event)}
                  className="relative block h-16 w-full overflow-hidden rounded-[var(--radius-field)] text-left"
                >
                  <img
                    src={section.photos[0].src}
                    alt=""
                    className="absolute inset-0 size-full object-cover"
                  />
                  <span aria-hidden className="absolute inset-0 bg-ink-950/50" />
                  <span className="relative block p-2 text-small font-bold text-white">
                    {section.label}{" "}
                    <span className="numeric opacity-80">({section.photos.length})</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <Well label="The facts">
          <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
            <Fact label="Room types">
              {residence.roomTypes
                .map((room) => `${roomTypes[room].label} (${roomTypes[room].occupancy})`)
                .join(", ")}
            </Fact>
            <Fact label="Bathroom">{bathroomLabels[residence.bathroom]}</Fact>
            <Fact label="Air conditioning">{residence.airConditioning ? "Yes" : "No"}</Fact>
            <Fact label="Laundry">{laundryLabels[residence.laundry]}</Fact>
            <Fact label="Walk to the middle of campus">{residence.walkMinutes} minutes</Fact>
            <Fact label="Dining">{residence.diningHall}</Fact>
            <Fact label="Beds">{residence.capacityBeds}</Fact>
            <Fact label="Built">
              {residence.yearBuilt}
              {residence.yearRenovated ? `, renovated ${residence.yearRenovated}` : ""}
            </Fact>
            <Fact label="Who can live here">{eligibilityLabels[residence.eligibility]}</Fact>
            <Fact label="Gender configuration">{genderConfigLabels[residence.genderConfig]}</Fact>
            <Fact label="Learning communities">
              {residence.learningCommunities.length
                ? residence.learningCommunities.join(", ")
                : "None"}
            </Fact>
            <Fact label="Amenities">
              {residence.amenities.map((code) => amenityLabels[code]).join(", ")}
            </Fact>
          </dl>
        </Well>

        <div>
          <p className="field-label">Rates, per person, per year</p>
          <ul className="mt-2 divide-y divide-ink-100">
            {residence.roomTypes.map((room) => (
              <li key={room} className="flex items-baseline justify-between gap-4 py-2">
                <span className="text-body text-ink-700">
                  {roomTypes[room].label}{" "}
                  <span className="text-small text-ink-400">
                    ({roomTypes[room].occupancy}{" "}
                    {roomTypes[room].occupancy === 1 ? "person" : "people"})
                  </span>
                </span>
                <span className="text-body font-strong text-ink-900 numeric">
                  {formatMoney(roomRate(residence, room), "USD")}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-small text-ink-500">
            Room only. A meal plan is priced separately, from{" "}
            {formatMoney(housingAvailability.mealPlanFromUsd, "USD")} a year.
          </p>
        </div>
      </div>
    </Overlay>
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-ink-100/70 py-1 last:border-0">
      <dt className="text-small text-ink-500">{label}</dt>
      <dd className="text-right text-small font-strong text-ink-800">{children}</dd>
    </div>
  );
}

/**
 * Comparison of the ranked three: a **frozen label column**, one column per
 * Residence, rows grouped by subject (Zillow). Without the frozen column the
 * third residence's row is a number with nothing attached to it.
 */
const COMPARE_GROUPS: {
  heading: string;
  rows: { label: string; read: (r: Residence) => string }[];
}[] = [
  {
    heading: "The room",
    rows: [
      {
        label: "Room types",
        read: (r) => r.roomTypes.map((room) => roomTypes[room].label).join(", "),
      },
      { label: "Bathroom", read: (r) => bathroomShort[r.bathroom] },
      { label: "Air conditioning", read: (r) => (r.airConditioning ? "Yes" : "No") },
      { label: "Laundry", read: (r) => laundryLabels[r.laundry] },
    ],
  },
  {
    heading: "The building",
    rows: [
      { label: "Campus area", read: (r) => r.campusArea },
      { label: "Walk", read: (r) => `${r.walkMinutes} min` },
      { label: "Beds", read: (r) => String(r.capacityBeds) },
      {
        label: "Built",
        read: (r) =>
          r.yearRenovated ? `${r.yearBuilt}, ren. ${r.yearRenovated}` : String(r.yearBuilt),
      },
    ],
  },
  {
    heading: "Living there",
    rows: [
      { label: "Dining", read: (r) => r.diningHall },
      { label: "Who can live here", read: (r) => eligibilityLabels[r.eligibility] },
      {
        label: "Learning communities",
        read: (r) => (r.learningCommunities.length ? r.learningCommunities.join(", ") : "None"),
      },
    ],
  },
  {
    heading: "Rates, room only",
    rows: [
      { label: "From", read: (r) => formatMoney(lowestRate(r), "USD") },
      { label: "To", read: (r) => formatMoney(highestRate(r), "USD") },
    ],
  },
];

function Comparison({
  open,
  onOpenChange,
  residences: ranked,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  residences: Residence[];
}) {
  return (
    <Overlay
      open={open}
      onOpenChange={onOpenChange}
      title="Compare your shortlist"
      description="Room rates are per person, per year, and exclude the meal plan."
      className="md:max-w-[46rem]"
    >
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-small">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-panel py-2 pr-3 text-left font-strong text-ink-500">
                &nbsp;
              </th>
              {ranked.map((residence, index) => (
                <th
                  key={residence.id}
                  className="min-w-[9rem] py-2 pr-3 text-left font-strong text-ink-900"
                >
                  <span className="numeric text-ink-400">{index + 1}. </span>
                  {residence.name}
                </th>
              ))}
            </tr>
          </thead>
          {COMPARE_GROUPS.map((group) => (
            <tbody key={group.heading}>
              <tr>
                <th
                  colSpan={ranked.length + 1}
                  className="sticky left-0 pt-4 pb-1 text-left field-label"
                >
                  {group.heading}
                </th>
              </tr>
              {group.rows.map((row) => (
                <tr key={row.label} className="border-t border-ink-100">
                  <th className="sticky left-0 z-10 bg-panel py-2 pr-3 text-left font-normal text-ink-500">
                    {row.label}
                  </th>
                  {ranked.map((residence) => (
                    <td key={residence.id} className="py-2 pr-3 text-ink-800">
                      {row.read(residence)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </Overlay>
  );
}
