import { ArrowUpIcon, CheckIcon, ImagesIcon, PlusIcon, XIcon } from "@phosphor-icons/react";
import * as React from "react";

import { PricePill, useCelebration } from "@/components/celebration";
import { useImageViewer, type ViewerPhoto } from "@/components/image-viewer";
import { BackButton, ContinueAction, StepShell, useStepNav } from "@/components/step-shell";
import {
  Fact,
  FlatCard,
  OnGround,
  Section,
  SectionFields,
  SectionLabel,
  Sections,
  Well,
} from "@/components/surfaces";
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
  photoKindLabels,
  photoSections,
  type Residence,
  residenceById,
  residences,
  roomRate,
  roomTypes,
} from "@/lib/housing";
import { aboveCompact, inCompact } from "@/lib/layout";
import { stepById } from "@/lib/steps";
import { patch, useOnboarding } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * Housing: the `catalogue` archetype, and the fourth row of the Presence table.
 *
 * The complaint this round answers is that the student could not actually
 * *look* at a residence. Twelve photographs behind one thumbnail, opened as a
 * blind carousel, is not a way to compare a bedroom with a bedroom. So the sheet
 * opens on a **1 + 4 mosaic** whose last cell says how many photographs there
 * are and opens a viewer organised by room (Zillow for the mosaic, KAYAK and
 * Expedia for the categorised gallery). On a phone the same photographs are an
 * inline carousel and there is no viewer at all: opening full screen on top of
 * something that is already full screen is not magnification.
 *
 * The facts became label→value rows in two columns (Salesforce Task record).
 * They were a wrapped list of chips, which is the layout that made the sheet
 * twice as tall as its content and made two residences impossible to compare —
 * the same datum landed in a different place on each one.
 *
 * The grid sits directly on the Ground: one of the three documented exceptions,
 * because a catalogue that *is* the screen inside a white frame is a white box
 * on a grey page containing white cards (Kit).
 *
 * No filter. Eight residences do not need a control, and the Rail already owns
 * the left-hand side.
 */
export function HousingRoute() {
  const state = useOnboarding();
  const housing = state.housing;
  const award = useCelebration();
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

  /* The discreet exit ADR 0003 promised and the flow never drew: a student who
     already lives in the city should not have to rank a campus building to get
     out of this Step. It clears the shortlist rather than storing a fourth
     answer — an empty shortlist already means "no preference" everywhere else. */
  const arrangeOwn = () => {
    patch("housing", { residenceRanking: [], submitted: true });
    goNext();
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
          {housing.submitted ? (
            <ContinueAction label="Continue" onClick={goNext} />
          ) : (
            <ContinueAction
              label={ranking.length > 0 ? "Save my shortlist" : "Continue with no preference"}
              onClick={save}
            />
          )}
        </>
      }
    >
      <Shortlist
        ranking={ranking}
        onMove={move}
        onRemove={toggle}
        onCompare={() => setComparing(true)}
      />

      <OnGround reason="catalogue" as="section" className="flex flex-col gap-2">
        <SectionLabel
          description={`A preference is a request, not an assignment. ${institution.housingOffice} assigns rooms after the response deadline.`}
          action={
            <Button type="button" variant="ghost" size="sm" onClick={arrangeOwn}>
              I am arranging my own
            </Button>
          }
        >
          {residences.length} residences for {housingAvailability.academicYear}
        </SectionLabel>

        {/* `auto-fill` rather than a column count per breakpoint: the grid asks
            how much room it has instead of asking how wide the window is, so it
            gains a column on a big monitor without a fourth width class. */}
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-2.5">
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
    </StepShell>
  );
}

/** Every photograph of a residence, labelled and categorised for the viewer. */
function viewerPhotos(residence: Residence): ViewerPhoto[] {
  return residence.photos.map((photo) => ({
    ...photo,
    label: `${residence.name} · ${photoKindLabels[photo.kind]}`,
    category: photoKindLabels[photo.kind],
  }));
}

/**
 * The card: a flat card on the Ground, with the photo bleeding to its edge.
 *
 * The rate line is gone from here, which is ADR 0003 being obeyed rather than
 * quoted: *"with a price on each card the student compares spreadsheets;
 * without it they compare places to live."* The rates survive in the sheet,
 * where the student who wants them has asked for them.
 *
 * Ranking a residence does not lift it or change its size: fill, a check, and a
 * rank number that replaces the add control in place.
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
  const ranked = rank >= 0;

  return (
    <FlatCard as="li" selected={ranked} className="flex flex-col">
      <div className="relative">
        <button
          type="button"
          onClick={onOpen}
          className="block aspect-[3/2] w-full overflow-hidden"
          aria-label={`See ${residence.name}`}
        >
          <img
            src={residence.photos[0].src}
            alt={residence.photos[0].alt}
            className="size-full object-cover"
          />
        </button>

        {/* The counter is textual rather than dots: dots stop scaling somewhere
            around six, and this catalogue carries twelve frames a building. */}
        <span className="pointer-events-none absolute right-1.5 bottom-1.5 flex items-center gap-1 rounded-[var(--radius-pill)] bg-ink-950/70 px-1.5 py-0.5 text-micro font-bold text-white">
          <ImagesIcon weight="fill" aria-hidden className="size-3" />
          <span className="numeric">{residence.photos.length}</span>
        </span>

        {/* The Shortlist action sits on the photo, where the eye already is. */}
        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          className={cn(
            "absolute top-1.5 right-1.5 flex h-6 min-w-6 items-center gap-1 rounded-[var(--radius-pill)] px-1.5 text-micro font-bold",
            "transition-colors duration-[var(--duration-base)] disabled:opacity-40",
            ranked ? "bg-violet-500 text-white" : "bg-panel/95 text-ink-800 hover:bg-panel",
          )}
        >
          {ranked ? (
            <>
              <CheckIcon weight="bold" aria-hidden className="size-3" />
              <span className="numeric">Ranked {rank + 1}</span>
            </>
          ) : (
            <>
              <PlusIcon weight="bold" aria-hidden className="size-3" />
              <span className="sr-only">Add {residence.name} to shortlist</span>
            </>
          )}
        </button>
      </div>

      <div className="flex flex-1 flex-col p-2.5">
        <p className="text-body font-strong text-ink-900">{residence.name}</p>
        <p className="mt-0.5 line-clamp-2 flex-1 text-micro leading-4 text-ink-500">
          {residence.summary}
        </p>
        <p className="mt-1.5 text-micro text-ink-600">
          {bathroomShort[residence.bathroom]} ·{" "}
          <span className="numeric">{residence.walkMinutes} min walk</span> ·{" "}
          {residence.airConditioning ? "Air conditioned" : "No air con"}
        </p>
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
        <p className="text-micro text-ink-500">Pick three residences and rank them.</p>
      ) : (
        <div className="flex flex-wrap items-center gap-1.5">
          <ol className="flex min-w-0 flex-1 flex-wrap gap-1.5">
            {ranking.map((id, index) => {
              const residence = residenceById(id);
              if (!residence) return null;
              return (
                <li
                  key={id}
                  className="flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-ink-100 bg-panel py-0.5 pr-0.5 pl-1.5"
                >
                  <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-violet-500 text-[0.5625rem] font-bold text-white numeric">
                    {index + 1}
                  </span>
                  <span className="min-w-0 truncate text-small text-ink-800">{residence.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="size-6 px-0"
                    aria-label={`Move ${residence.name} up`}
                    disabled={index === 0}
                    onClick={() => onMove(id, -1)}
                  >
                    <ArrowUpIcon weight="bold" aria-hidden className="size-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="size-6 px-0"
                    aria-label={`Move ${residence.name} down`}
                    disabled={index === ranking.length - 1}
                    onClick={() => onMove(id, 1)}
                  >
                    <ArrowUpIcon weight="bold" aria-hidden className="size-3 rotate-180" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="size-6 px-0"
                    aria-label={`Remove ${residence.name} from shortlist`}
                    onClick={() => onRemove(id)}
                  >
                    <XIcon weight="bold" aria-hidden className="size-3" />
                  </Button>
                </li>
              );
            })}
          </ol>
          {ranking.length > 1 ? (
            <Button type="button" variant="secondary" size="sm" onClick={onCompare}>
              Compare
            </Button>
          ) : null}
        </div>
      )}
    </Well>
  );
}

/**
 * The gallery, which is the fourth Presence row drawn.
 *
 * Desktop gets Zillow's 1 + 4 mosaic with the count in the last cell; the phone
 * gets the same photographs as a snapping carousel and no viewer. Both halves
 * are always in the DOM — nothing here asks how wide the window is.
 */
function Gallery({ residence }: { residence: Residence }) {
  const viewer = useImageViewer();
  const photos = viewerPhotos(residence);
  const [hero, ...rest] = residence.photos;
  const tiles = rest.slice(0, 4);

  return (
    <>
      {/* The hero holds two columns by two rows and the tiles fill what is
          left, so the mosaic is whole at three photographs and at five. The
          fixture ships three a building today and the API will ship twelve;
          a hard 1 + 4 would have a hole in it now and a lie in it later. */}
      <div
        className={cn(
          "grid aspect-[3/1] grid-rows-2 gap-1.5",
          tiles.length >= 4 ? "grid-cols-4" : "grid-cols-3",
          aboveCompact,
        )}
      >
        <button
          type="button"
          onClick={(event) => viewer.open(photos, 0, event)}
          className="col-span-2 row-span-2 overflow-hidden rounded-l-[var(--radius-field)]"
          aria-label={`Open ${residence.name} photos`}
        >
          <img src={hero.src} alt={hero.alt} className="size-full object-cover" />
        </button>
        {tiles.map((photo, position) => (
          <button
            key={photo.src}
            type="button"
            onClick={(event) => viewer.open(photos, position + 1, event)}
            className="relative overflow-hidden only:row-span-2 last:rounded-br-[var(--radius-field)] [&:nth-child(2)]:rounded-tr-[var(--radius-field)]"
            aria-label={`Open ${residence.name} photos at ${photoKindLabels[photo.kind]}`}
          >
            <img src={photo.src} alt={photo.alt} className="size-full object-cover" />
            {/* The last cell carries the count and the invitation, which is
                what stops the mosaic reading as "there are three photos". */}
            {position === tiles.length - 1 ? (
              <span className="absolute inset-0 flex items-center justify-center gap-1.5 bg-ink-950/60 text-small font-bold text-white">
                <ImagesIcon weight="fill" aria-hidden className="size-4" />
                <span className="numeric">All {residence.photos.length}</span>
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* The phone's half: the same photographs inline, snapping, with the room
          named under each. No viewer — opening full screen on top of something
          that is already full screen is not magnification. */}
      <ul
        className={cn(
          "rail-scroll snap-x snap-mandatory gap-1.5 overflow-x-auto",
          inCompact,
          "compact:flex",
        )}
      >
        {residence.photos.map((photo) => (
          <li key={photo.src} className="w-[78%] shrink-0 snap-start">
            <figure>
              <img
                src={photo.src}
                alt={photo.alt}
                className="aspect-[3/2] w-full rounded-[var(--radius-field)] object-cover"
              />
              <figcaption className="mt-1 text-micro text-ink-500">
                {photoKindLabels[photo.kind]}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </>
  );
}

/**
 * The sheet: the gallery, then the facts as label→value rows, then everything
 * else folded away.
 *
 * Three Sections rather than one long scroll, and two of the three are closed
 * on arrival showing what they hold. That is what gets the sheet into a screen
 * and a half on a 1366×768 machine without removing a single fact.
 */
function ResidenceDetail({ id, onClose }: { id: string | null; onClose: () => void }) {
  const residence = id ? residenceById(id) : undefined;
  if (!residence) return null;

  const sections = photoSections(residence);

  return (
    <Overlay
      open={Boolean(id)}
      onOpenChange={(next) => !next && onClose()}
      title={residence.name}
      description={residence.summary}
      className="max-w-[42rem]"
    >
      <div className="mt-3 space-y-[var(--space-section)]">
        <Gallery residence={residence} />

        <Sections>
          <Section title="The room" collapsible={false}>
            <SectionFields>
              <Fact label="Room types">
                {residence.roomTypes.map((room) => roomTypes[room].label).join(", ")}
              </Fact>
              <Fact label="Bathroom">{bathroomLabels[residence.bathroom]}</Fact>
              <Fact label="Meal plan">
                From {formatMoney(housingAvailability.mealPlanFromUsd, "USD")} a year
              </Fact>
              <Fact label="Walk to campus">{residence.walkMinutes} minutes</Fact>
              <Fact label="Laundry">{laundryLabels[residence.laundry]}</Fact>
              <Fact label="Air conditioning">{residence.airConditioning ? "Yes" : "No"}</Fact>
            </SectionFields>
          </Section>

          <Section
            title="The building"
            defaultOpen={false}
            value={`${residence.campusArea} · ${residence.capacityBeds} beds · built ${residence.yearBuilt}`}
          >
            <SectionFields>
              <Fact label="Campus area">{residence.campusArea}</Fact>
              <Fact label="Beds">{residence.capacityBeds}</Fact>
              <Fact label="Built">
                {residence.yearBuilt}
                {residence.yearRenovated ? `, renovated ${residence.yearRenovated}` : ""}
              </Fact>
              <Fact label="Dining">{residence.diningHall}</Fact>
              <Fact label="Who can live here">{eligibilityLabels[residence.eligibility]}</Fact>
              <Fact label="Gender configuration">{genderConfigLabels[residence.genderConfig]}</Fact>
              <Fact label="Learning communities">
                {residence.learningCommunities.length
                  ? residence.learningCommunities.join(", ")
                  : "None"}
              </Fact>
              <Fact label="Photographs">
                {sections.map((section) => `${section.label} ${section.photos.length}`).join(" · ")}
              </Fact>
              <Fact label="Amenities" className="col-span-full">
                {residence.amenities.map((code) => amenityLabels[code]).join(", ")}
              </Fact>
            </SectionFields>
          </Section>

          <Section
            title="Rates, per person, per year"
            defaultOpen={false}
            value={`${formatMoney(roomRate(residence, residence.roomTypes[0]), "USD")}–${formatMoney(highestRate(residence), "USD")}, room only`}
          >
            <SectionFields>
              {residence.roomTypes.map((room) => (
                <Fact
                  key={room}
                  label={`${roomTypes[room].label} (${roomTypes[room].occupancy} ${
                    roomTypes[room].occupancy === 1 ? "person" : "people"
                  })`}
                >
                  <span className="numeric">{formatMoney(roomRate(residence, room), "USD")}</span>
                </Fact>
              ))}
            </SectionFields>
            <p className="mt-1.5 text-micro text-ink-500">
              Room only. A meal plan is priced separately, from{" "}
              {formatMoney(housingAvailability.mealPlanFromUsd, "USD")} a year.
            </p>
          </Section>
        </Sections>
      </div>
    </Overlay>
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
      description="Everything Housing Services publishes, side by side."
      className="max-w-[42rem]"
    >
      <div className="mt-3 overflow-x-auto">
        <table className="w-full border-collapse text-small">
          <thead>
            <tr>
              <th className="sticky left-0 z-[var(--z-sticky)] bg-panel py-1.5 pr-3 text-left font-strong text-ink-500">
                &nbsp;
              </th>
              {ranked.map((residence, index) => (
                <th
                  key={residence.id}
                  className="min-w-[8rem] py-1.5 pr-3 text-left font-strong text-ink-900"
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
                  className="sticky left-0 pt-3 pb-1 text-left field-label"
                >
                  {group.heading}
                </th>
              </tr>
              {group.rows.map((row) => (
                <tr key={row.label} className="border-t border-ink-100">
                  <th className="sticky left-0 z-[var(--z-sticky)] bg-panel py-1.5 pr-3 text-left font-normal text-ink-500">
                    {row.label}
                  </th>
                  {ranked.map((residence) => (
                    <td key={residence.id} className="py-1.5 pr-3 text-ink-800">
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
