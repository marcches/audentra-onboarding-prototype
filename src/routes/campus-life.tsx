import {
  ArrowRightIcon,
  BookmarkSimpleIcon,
  CaretDownIcon,
  MagnifyingGlassIcon,
  MapTrifoldIcon,
} from "@phosphor-icons/react";
import * as React from "react";

import { FairRoute } from "@/components/fair-route";
import { AwardStage, PricePill, usePointsAward } from "@/components/points-award";
import { BackButton, StepShell, steadyAction, useStepNav } from "@/components/step-shell";
import { FlatCard, OnGround, SelectionMark, Well } from "@/components/surfaces";
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
import { stepById } from "@/lib/steps";
import { patch, useOnboarding } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * Campus life: the Step whose premise was wrong.
 *
 * **No U.S. university has students join organizations during enrolment.** They
 * join in person at the Involvement Fair after classes begin. What exists
 * during onboarding is an interest survey, so the verb changed: the student
 * declares interest, and nothing on this screen is a commitment. That is also
 * why the old modal was useless — it was built to confirm a choice that does
 * not happen here.
 *
 * The rule that keeps the screen honest: **the control is never a full-width
 * solid button, and the label is never a commitment verb.** "Join", "Sign up",
 * "Apply" and "Enroll" appear nowhere as a control (Nextdoor is the reference
 * for what not to do). Where an organization requires an application, that is
 * information in Getting in.
 */
export function CampusLifeRoute() {
  const state = useOnboarding();
  const life = state.campusLife;
  const award = usePointsAward();
  const { goNext } = useStepNav("campus-life");
  const step = stepById("campus-life");

  const [filter, setFilter] = React.useState<CatalogueFilter>(emptyFilter);
  const [detail, setDetail] = React.useState<string | null>(null);
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
      lead={`Aster has around ${involvementFair.organizationsTotal} student organizations. Mark the ones you want to look at, and we will turn it into a route through the Involvement Fair.`}
      headerAside={<PricePill points={step.points} stepId="campus-life" earned={life.submitted} />}
      actions={
        <>
          <BackButton current="campus-life" />
          <Button type="button" variant="ghost" onClick={goNext}>
            Skip for now
          </Button>
          <Button type="button" size="lg" className={steadyAction} onClick={save}>
            Save and continue
            <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
          </Button>
        </>
      }
    >
      {/* One supporting line, on first visit and every visit, because it is the
          fact the whole screen depends on being understood. */}
      <p className="text-small text-ink-500">
        Marking interest does not sign you up. Joining happens in person, at the fair, after classes
        begin.
      </p>

      {/* The header line: search, four axis pills, the count, and Clear all.
          The count lives in this line and is the feedback when a filter lands
          (Klook, Going). The pill bar never wraps to two rows. */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full min-w-[12rem] sm:w-auto sm:max-w-xs sm:flex-1">
          <MagnifyingGlassIcon
            weight="bold"
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-400"
          />
          <Input
            className="pl-9"
            placeholder="Search organizations"
            aria-label="Search organizations"
            value={filter.search}
            onChange={(event) => setFilter({ ...filter, search: event.target.value })}
          />
        </div>

        {/* Horizontal overflow, never a second row (Tripadvisor). A pill bar
            that wraps grows the header and pushes the catalogue down as you
            filter. */}
        <div className="rail-scroll flex w-full min-w-0 gap-2 overflow-x-auto sm:w-auto sm:flex-1">
          <AxisPill
            label="Category"
            options={categories}
            selected={filter.categories}
            onToggle={(value) => setFilter(toggleFilterValue(filter, "categories", value as never))}
          />
          <AxisPill
            label="Cost"
            options={costBands}
            selected={filter.costs}
            onToggle={(value) => setFilter(toggleFilterValue(filter, "costs", value as never))}
          />
          <AxisPill
            label="Weekly time"
            options={timeBands}
            selected={filter.times}
            onToggle={(value) => setFilter(toggleFilterValue(filter, "times", value as never))}
          />
          <AxisPill
            label="Getting in"
            options={joiningRoutes}
            selected={filter.joining}
            onToggle={(value) => setFilter(toggleFilterValue(filter, "joining", value as never))}
          />
        </div>

        {/* The count lives in this line and is the feedback when a filter lands
            (Klook, Going). On a phone it takes its own row rather than
            squeezing in beside a bar that is already scrolling. */}
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <p className="shrink-0 text-small text-ink-600 numeric">
            {results.length} {results.length === 1 ? "organization" : "organizations"}
          </p>

          {active > 0 || filter.search ? (
            <Button type="button" variant="ghost" size="sm" onClick={() => setFilter(emptyFilter)}>
              Clear all
            </Button>
          ) : null}

          {life.interests.length > 0 ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="ml-auto"
              onClick={() => setRoute(true)}
            >
              <MapTrifoldIcon weight="fill" aria-hidden className="size-4" />
              Interested · <span className="numeric">{life.interests.length}</span>
            </Button>
          ) : null}
        </div>
      </div>

      {/* The results area reserves a minimum height, so the filter bar does not
          rise when the empty state appears. A bar that moves as you filter is
          the layout shifting for the most avoidable reason there is. */}
      <OnGround reason="catalogue" as="section" className="min-h-[28rem]">
        {results.length === 0 ? (
          <Well className="flex flex-col items-start gap-3">
            <p className="text-body text-ink-700">No organizations match.</p>
            {/* The chips that caused the zero stay on screen for individual
                removal (OpenSea), and there is one Clear all. */}
            <div className="flex flex-wrap gap-2">
              {chipsFor(filter).map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={chip.remove(filter, setFilter)}
                  className="rounded-[var(--radius-pill)] bg-violet-50 px-2.5 py-1 text-small text-violet-700"
                >
                  {chip.label} ×
                </button>
              ))}
            </div>
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
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
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
        description={`Nothing here is a commitment. Turn up, or do not.`}
        className="md:max-w-[40rem]"
      >
        <FairRoute
          interests={life.interests}
          onRemove={toggleInterest}
          onBack={() => setRoute(false)}
        />
      </Overlay>

      <AwardStage stepId="campus-life" headline="Route ready for August.">
        <Button type="button" size="lg" onClick={goNext}>
          Continue
          <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
        </Button>
      </AwardStage>
    </StepShell>
  );
}

/** The chips that caused a zero, so each can be removed on its own. */
function chipsFor(filter: CatalogueFilter) {
  const axes = [
    { axis: "categories" as const, values: filter.categories, label: categoryLabel },
    { axis: "costs" as const, values: filter.costs, label: (v: string) => costLabel(v as never) },
    { axis: "times" as const, values: filter.times, label: (v: string) => timeLabel(v as never) },
    {
      axis: "joining" as const,
      values: filter.joining,
      label: (v: string) => joiningLabel(v as never),
    },
  ];

  return axes.flatMap((entry) =>
    entry.values.map((value) => ({
      key: `${entry.axis}-${value}`,
      label: entry.label(value as never),
      remove: (current: CatalogueFilter, set: (next: CatalogueFilter) => void) => () =>
        set(toggleFilterValue(current, entry.axis, value as never)),
    })),
  );
}

/**
 * One axis, as a pill opening an anchored popover (Care.com). The active pill
 * goes solid and carries its own count, so the state of the filter reads
 * without opening anything (Juicebox). There is no Apply: values apply on click
 * and the count updates behind.
 *
 * On a phone the same pill opens a sheet for **that axis only**, sized to
 * content. One axis per sheet is what keeps it from eating half the screen.
 */
function AxisPill({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: readonly { value: string; label: string }[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const count = selected.length;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "flex h-9 shrink-0 items-center gap-1.5 rounded-[var(--radius-pill)] border px-3 text-small font-strong",
          "transition-colors duration-[var(--duration-base)]",
          count > 0
            ? "border-violet-500 bg-violet-500 text-white"
            : "border-ink-200 bg-panel text-ink-700 hover:border-ink-300",
        )}
      >
        {label}
        {count > 0 ? <span className="numeric">({count})</span> : null}
        <CaretDownIcon weight="bold" aria-hidden className="size-3" />
      </button>

      <Overlay open={open} onOpenChange={setOpen} title={label} className="md:max-w-[24rem]">
        <ul className="mt-4 space-y-1">
          {options.map((option) => {
            const checked = selected.includes(option.value);
            return (
              <li key={option.value}>
                <label className="flex cursor-pointer items-center gap-3 rounded-[var(--radius-field)] px-2 py-2 hover:bg-ink-50">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => onToggle(option.value)}
                  />
                  <SelectionMark selected={checked} />
                  <span className="text-body text-ink-800">{option.label}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </Overlay>
    </>
  );
}

/**
 * The card. Getting in appears **here**, not only in the detail: it is what
 * separates "I can turn up tomorrow" from "there is an audition in September".
 *
 * The interest toggle is neutral-toned and the pill is the same width in both
 * states, so the card never changes height or position (Etsy's past-tense
 * ghost pill). Brand colour stays reserved for the screen's primary navigation
 * action.
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
    <FlatCard as="li" className="flex flex-col p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-body font-strong text-ink-900">{organization.name}</p>
          <p className="text-[0.6875rem] font-bold tracking-[0.06em] text-ink-400 uppercase">
            {categoryLabel(organization.category)}
          </p>
        </div>
      </div>

      <p className="mt-2 line-clamp-2 flex-1 text-small text-ink-600">{organization.blurb}</p>

      <p className="mt-3 text-small text-ink-500">
        <span className="numeric">{costLabel(organization.cost, true)}</span> ·{" "}
        <span className="numeric">{timeLabel(organization.time, true)}</span> ·{" "}
        {joiningLabel(organization.joining, true)}
      </p>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-ink-100 pt-3">
        <Button type="button" variant="ghost" size="sm" onClick={onOpen}>
          Details
        </Button>
        <InterestToggle interested={interested} onToggle={onToggle} name={organization.name} />
      </div>
    </FlatCard>
  );
}

/**
 * Never a full-width solid button, never a commitment verb, and the same width
 * in both states so the card cannot change size when it is pressed.
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
        "flex h-8 w-[7.5rem] shrink-0 items-center justify-center gap-1.5 rounded-[var(--radius-pill)] border text-small font-strong",
        "transition-colors duration-[var(--duration-base)]",
        interested
          ? "border-transparent bg-ink-100 text-ink-600"
          : "border-ink-200 bg-panel text-ink-700 hover:border-ink-300",
      )}
    >
      <BookmarkSimpleIcon weight={interested ? "fill" : "regular"} aria-hidden className="size-4" />
      {interested ? "Interested" : "Interested"}
      <span className="sr-only">{interested ? ` in ${name}, remove` : ` in ${name}`}</span>
    </button>
  );
}

/**
 * The detail answers the four questions a student actually has before walking
 * up to a table: what it is, what it costs, how much time, and how you get in.
 * The three structured ones sit in a labelled three-column block (Blackbird),
 * and where getting in is anything but automatic, the real next step is named
 * in words.
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
    >
      <div className="mt-4 space-y-4">
        <Well>
          <dl className="grid grid-cols-3 gap-3">
            <div>
              <dt className="text-[0.625rem] font-bold tracking-[0.06em] text-ink-400 uppercase">
                Cost per semester
              </dt>
              <dd className="mt-0.5 text-body font-strong text-ink-900 numeric">
                {costLabel(org.cost)}
              </dd>
            </div>
            <div>
              <dt className="text-[0.625rem] font-bold tracking-[0.06em] text-ink-400 uppercase">
                Weekly time
              </dt>
              <dd className="mt-0.5 text-body font-strong text-ink-900 numeric">
                {timeLabel(org.time)}
              </dd>
            </div>
            <div>
              <dt className="text-[0.625rem] font-bold tracking-[0.06em] text-ink-400 uppercase">
                Getting in
              </dt>
              <dd className="mt-0.5 text-body font-strong text-ink-900">
                {joiningLabel(org.joining)}
              </dd>
            </div>
          </dl>
          {org.nextStep ? <p className="mt-3 text-small text-ink-600">{org.nextStep}</p> : null}
        </Well>

        <p className="text-body leading-6 text-ink-700">{org.detail}</p>

        <dl className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
          <div className="flex items-baseline justify-between gap-3 py-1">
            <dt className="text-small text-ink-500">Meets</dt>
            <dd className="text-small font-strong text-ink-800">{org.meets}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3 py-1">
            <dt className="text-small text-ink-500">Where</dt>
            <dd className="text-small font-strong text-ink-800">{org.where}</dd>
          </div>
        </dl>

        {/* Secondary, in the footer. A solid full-width button here would read
            as signing up, which is the one thing this screen must not say. */}
        <div className="flex justify-end border-t border-ink-100 pt-4">
          <InterestToggle interested={interested} onToggle={onToggle} name={org.name} />
        </div>
      </div>
    </Overlay>
  );
}
