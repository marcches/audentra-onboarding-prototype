import {
  BookmarkSimpleIcon,
  MagnifyingGlassIcon,
  SlidersHorizontalIcon,
} from "@phosphor-icons/react";
import * as React from "react";

import { PricePill, useCelebration } from "@/components/celebration";
import { FairRoute } from "@/components/fair-route";
import { BackButton, ContinueAction, StepShell, useStepNav } from "@/components/step-shell";
import {
  Fact,
  FlatCard,
  OnGround,
  SectionFields,
  SelectionMark,
  Well,
} from "@/components/surfaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Overlay } from "@/components/ui/overlay";
import {
  activeFilterCount,
  type CatalogueFilter,
  categories,
  categoryLabel,
  costBands,
  costLabel,
  emptyFilter,
  filterOrganizations,
  involvementFair,
  joiningLabel,
  joiningRoutes,
  type Organization,
  organizationById,
  organizations,
  timeBands,
  timeLabel,
  toggleFilterValue,
} from "@/lib/catalogue";
import { aboveCompact, inCompactFlex } from "@/lib/layout";
import { stepById } from "@/lib/steps";
import { patch, useOnboarding } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * Campus life: ~420 organizations, and the Step whose whole job is to let
 * somebody *sweep* them.
 *
 * The filter is a **band of chips above the grid**, not a column beside it
 * (Shop). The column is what a catalogue normally gets and it is wrong here for
 * a measurable reason: the Rail already owns the left-hand side, and rail plus
 * filter column plus grid at 1366px leaves two columns of card on a screen
 * whose work is passing your eye over a lot of things. A chip band costs ~2.5rem
 * of height once; a filter column costs 14rem of width permanently. Zillow and
 * Unity both do the column, and both are cited in `docs/design-research.md` as
 * rejected so the argument does not have to be had again.
 *
 * The card carries four things and no more — name, category, weekly commitment,
 * cost per semester — because those are the four `CONTEXT.md` says an
 * Organization carries. The blurb went; it was two lines of prose per card
 * across four columns, which is what made the grid scan like a page of text.
 *
 * ADR 0004 still runs the register: nothing here says Join, Sign up, Apply or
 * Enroll, the toggle is neutral-toned and the same width in both states, and
 * what the Step produces is a route through the Involvement Fair.
 */
export function CampusLifeRoute() {
  const state = useOnboarding();
  const life = state.campusLife;
  const award = useCelebration();
  const { goNext } = useStepNav("campus-life");
  const step = stepById("campus-life");

  const [filter, setFilter] = React.useState<CatalogueFilter>(emptyFilter);
  const [detail, setDetail] = React.useState<string | null>(null);
  const [sheet, setSheet] = React.useState(false);
  const [route, setRoute] = React.useState(false);

  const results = React.useMemo(() => filterOrganizations(organizations, filter), [filter]);
  const active = activeFilterCount(filter);

  const toggleInterest = (id: string) => {
    patch("campusLife", {
      interests: life.interests.includes(id)
        ? life.interests.filter((entry) => entry !== id)
        : [...life.interests, id],
    });
  };

  const save = () => {
    patch("campusLife", { submitted: true });
    award?.celebrate("campus-life", step.points);
  };

  return (
    <StepShell
      current="campus-life"
      title="Campus life"
      lead={`Around ${involvementFair.organizationsTotal} student organizations. Marking interest does not sign you up — joining happens in person, at the fair.`}
      headerAside={<PricePill points={step.points} stepId="campus-life" earned={life.submitted} />}
      actions={
        <>
          <BackButton current="campus-life" />
          {life.interests.length > 0 ? (
            <Button type="button" variant="secondary" onClick={() => setRoute(true)}>
              My route · <span className="numeric">{life.interests.length}</span>
            </Button>
          ) : null}
          {life.submitted ? (
            <ContinueAction label="Continue" onClick={goNext} />
          ) : (
            <>
              <Button type="button" variant="ghost" onClick={goNext}>
                Skip for now
              </Button>
              <ContinueAction label="Save and continue" onClick={save} />
            </>
          )}
        </>
      }
    >
      {/* The fifth Presence row. Both halves are always in the DOM: the band on
          a desktop, one button on a phone. Opening either one is a portal, so
          nothing above the control moves when the filter appears. */}
      <div className="flex items-center gap-2">
        <div className="relative w-64 shrink-0 compact:w-auto compact:flex-1">
          <MagnifyingGlassIcon
            weight="bold"
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-ink-400"
          />
          <Input
            className="pl-8"
            placeholder="Search organizations"
            aria-label="Search organizations"
            value={filter.search}
            onChange={(event) => setFilter({ ...filter, search: event.target.value })}
          />
        </div>

        <div
          className={cn(
            "rail-scroll min-w-0 flex-1 items-center gap-1.5 overflow-x-auto",
            aboveCompact,
            "flex",
          )}
        >
          {categories.map((category) => {
            const on = filter.categories.includes(category.value);
            return (
              <button
                key={category.value}
                type="button"
                onClick={() => setFilter(toggleFilterValue(filter, "categories", category.value))}
                aria-pressed={on}
                className={cn(
                  "flex h-7 shrink-0 items-center rounded-[var(--radius-pill)] border px-2.5 text-small font-strong",
                  "transition-colors duration-[var(--duration-base)]",
                  /* Fill, never elevation and never a size change: a chip that
                     grows when it is picked moves every chip after it. */
                  on
                    ? "border-violet-500 bg-violet-500 text-white"
                    : "border-ink-200 bg-panel text-ink-700 hover:border-ink-300",
                )}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        <Button
          type="button"
          variant={active > filter.categories.length ? "primary" : "secondary"}
          size="sm"
          className="shrink-0"
          onClick={() => setSheet(true)}
        >
          <SlidersHorizontalIcon weight="bold" aria-hidden className="size-3.5" />
          <span className={aboveCompact}>More</span>
          <span className={inCompactFlex}>Filters</span>
          {active > 0 ? <span className="numeric">({active})</span> : null}
        </Button>

        <p className="shrink-0 text-micro text-ink-500 numeric">{results.length}</p>

        {active > 0 || filter.search ? (
          <Button type="button" variant="ghost" size="sm" onClick={() => setFilter(emptyFilter)}>
            Clear
          </Button>
        ) : null}
      </div>

      {/* The results area reserves a minimum height, so the chip band does not
          rise when the empty state appears. A bar that moves as you filter is
          the layout shifting for the most avoidable reason there is. */}
      <OnGround reason="catalogue" as="section" className="min-h-[24rem]">
        {results.length === 0 ? (
          <Well className="flex flex-col items-start gap-2">
            <p className="text-small text-ink-700">No organizations match.</p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setFilter(emptyFilter)}
            >
              Clear all
            </Button>
          </Well>
        ) : (
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(13rem,1fr))] gap-2">
            {results.map((org) => (
              <OrganizationCard
                key={org.id}
                organization={org}
                interested={life.interests.includes(org.id)}
                onToggle={() => toggleInterest(org.id)}
                onOpen={() => setDetail(org.id)}
              />
            ))}
          </ul>
        )}
      </OnGround>

      <FilterSheet
        open={sheet}
        onOpenChange={setSheet}
        filter={filter}
        onChange={setFilter}
        results={results.length}
      />

      <OrganizationDetail
        id={detail}
        interested={detail ? life.interests.includes(detail) : false}
        onToggle={() => detail && toggleInterest(detail)}
        onClose={() => setDetail(null)}
      />

      <Overlay
        open={route}
        onOpenChange={setRoute}
        title="Your fair route"
        description="Nothing here is a commitment. Turn up, or do not."
        className="max-w-[36rem]"
      >
        <FairRoute
          interests={life.interests}
          onRemove={toggleInterest}
          onBack={() => setRoute(false)}
        />
      </Overlay>
    </StepShell>
  );
}

/**
 * Everything the chip band cannot hold, in one sheet.
 *
 * Categories are in here too, and on purpose: on a phone the band is not drawn
 * at all, so the sheet has to be the whole filter rather than the leftovers of
 * it. There is no Apply — values apply on click and the count updates behind
 * (Care.com, Juicebox).
 */
function FilterSheet({
  open,
  onOpenChange,
  filter,
  onChange,
  results,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filter: CatalogueFilter;
  onChange: (next: CatalogueFilter) => void;
  results: number;
}) {
  const axes = [
    {
      axis: "categories" as const,
      label: "Category",
      options: categories,
      selected: filter.categories,
    },
    {
      axis: "costs" as const,
      label: "Cost per semester",
      options: costBands,
      selected: filter.costs,
    },
    { axis: "times" as const, label: "Weekly time", options: timeBands, selected: filter.times },
    {
      axis: "joining" as const,
      label: "Getting in",
      options: joiningRoutes,
      selected: filter.joining,
    },
  ];

  return (
    <Overlay
      open={open}
      onOpenChange={onOpenChange}
      title="Filters"
      description={`${results} organizations match.`}
      className="max-w-[30rem]"
    >
      <div className="mt-3 space-y-3">
        {axes.map((axis) => (
          <fieldset key={axis.axis}>
            <legend className="field-label">{axis.label}</legend>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {axis.options.map((option) => {
                const on = (axis.selected as string[]).includes(option.value);
                return (
                  <label
                    key={option.value}
                    className={cn(
                      "flex cursor-pointer items-center gap-1.5 rounded-[var(--radius-pill)] border px-2.5 py-1 text-small",
                      "transition-colors duration-[var(--duration-base)] compact:min-h-[var(--tap-target)]",
                      on ? "border-violet-400 bg-violet-50" : "border-ink-200 hover:border-ink-300",
                    )}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={on}
                      onChange={() =>
                        onChange(toggleFilterValue(filter, axis.axis, option.value as never))
                      }
                    />
                    <SelectionMark selected={on} />
                    {option.label}
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}

        <div className="flex justify-end gap-2 border-t border-ink-100 pt-3">
          <Button type="button" variant="ghost" onClick={() => onChange(emptyFilter)}>
            Clear all
          </Button>
          <Button type="button" onClick={() => onOpenChange(false)}>
            Show {results}
          </Button>
        </div>
      </div>
    </Overlay>
  );
}

/**
 * The card: the four things an Organization carries, and a toggle.
 *
 * Two blocks were deleted to buy the extra column — the two-line blurb, and
 * Getting in. The blurb was prose in a grid four columns wide, which is what
 * made sweeping read as reading. Getting in is still filterable and still on
 * the sheet, where a student who is close to deciding will look; on the card it
 * was a third line of qualifiers on something nobody has decided about yet.
 */
function OrganizationCard({
  organization,
  interested,
  onToggle,
  onOpen,
}: {
  organization: Organization;
  interested: boolean;
  onToggle: () => void;
  onOpen: () => void;
}) {
  return (
    <FlatCard as="li" className="flex flex-col gap-1.5 p-2.5">
      <button type="button" onClick={onOpen} className="min-w-0 text-left">
        <span className="block text-body font-strong text-ink-900">{organization.name}</span>
        <span className="block text-micro font-bold tracking-[0.06em] text-ink-400 uppercase">
          {categoryLabel(organization.category)}
        </span>
      </button>

      <p className="flex-1 text-micro text-ink-500">
        <span className="numeric">{timeLabel(organization.time, true)}</span> ·{" "}
        <span className="numeric">{costLabel(organization.cost, true)}</span>
      </p>

      <InterestToggle interested={interested} onToggle={onToggle} name={organization.name} />
    </FlatCard>
  );
}

/**
 * Never a full-width solid button, never a commitment verb, and the same width
 * in both states so the card cannot change size when it is pressed (ADR 0004).
 */
function InterestToggle({
  interested,
  onToggle,
  name,
}: {
  interested: boolean;
  onToggle: () => void;
  name: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={interested}
      className={cn(
        "flex h-6 w-full items-center justify-center gap-1.5 rounded-[var(--radius-pill)] border text-micro font-strong",
        "transition-colors duration-[var(--duration-base)] compact:min-h-[var(--tap-target)]",
        interested
          ? "border-transparent bg-ink-100 text-ink-600"
          : "border-ink-200 bg-panel text-ink-700 hover:border-ink-300",
      )}
    >
      <BookmarkSimpleIcon weight={interested ? "fill" : "regular"} aria-hidden className="size-3" />
      Interested
      <span className="sr-only">{interested ? ` in ${name}, remove` : ` in ${name}`}</span>
    </button>
  );
}

/**
 * The detail answers the four questions a student actually has before walking
 * up to a table: what it is, what it costs, how much time, and how you get in.
 * Where getting in is anything but automatic, the real next step is named in
 * words.
 */
function OrganizationDetail({
  id,
  interested,
  onToggle,
  onClose,
}: {
  id: string | null;
  interested: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const org = id ? organizationById(id) : undefined;
  if (!org) return null;

  return (
    <Overlay
      open={Boolean(id)}
      onOpenChange={(next) => !next && onClose()}
      title={org.name}
      description={`${categoryLabel(org.category)} · around ${org.members} members`}
      className="max-w-[30rem]"
    >
      <div className="mt-3 space-y-2.5">
        <p className="text-small leading-5 text-ink-700">{org.detail}</p>

        <Well>
          <SectionFields>
            <Fact label="Cost per semester">
              <span className="numeric">{costLabel(org.cost)}</span>
            </Fact>
            <Fact label="Weekly time">
              <span className="numeric">{timeLabel(org.time)}</span>
            </Fact>
            <Fact label="Getting in">{joiningLabel(org.joining)}</Fact>
            <Fact label="Meets">{org.meets}</Fact>
            <Fact label="Where" className="col-span-full">
              {org.where}
            </Fact>
          </SectionFields>
          {org.nextStep ? (
            <p className="mt-1.5 text-micro leading-4 text-ink-600">{org.nextStep}</p>
          ) : null}
        </Well>

        {/* Secondary, in the footer. A solid full-width button here would read
            as signing up, which is the one thing this screen must not say. */}
        <div className="flex justify-end border-t border-ink-100 pt-2.5">
          <div className="w-32">
            <InterestToggle interested={interested} onToggle={onToggle} name={org.name} />
          </div>
        </div>
      </div>
    </Overlay>
  );
}
