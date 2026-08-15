import { describe, expect, it } from "vitest";

import {
  activeFilterCount,
  buildFairRoute,
  categories,
  costBands,
  emptyFilter,
  fairRouteSummary,
  filterOrganizations,
  isFilterEmpty,
  joiningRoutes,
  organizations,
  timeBands,
  toggleFilterValue,
} from "@/lib/catalogue";

/**
 * The catalogue filter: the one new seam this delivery adds.
 *
 * With a declared catalogue of ~420 and a fixture of ~60 this is real logic,
 * and inside a route it would be untestable. Everything asserted here is
 * external behaviour — what a filter returns — never how the pills are drawn.
 */

describe("the fixture", () => {
  it("ships roughly sixty organizations", () => {
    /* Nine invented clubs was off by an order of magnitude. Sixty is what a
       real directory's first two pages look like, and the ~420 total is stated
       on screen rather than faked in data. */
    expect(organizations.length).toBeGreaterThanOrEqual(55);
    expect(organizations.length).toBeLessThanOrEqual(70);
  });

  it("uses a taxonomy of the size a real directory uses", () => {
    expect(categories.length).toBeGreaterThanOrEqual(8);
    expect(categories.length).toBeLessThanOrEqual(12);
  });

  it("gives every organization a value on all four axes", () => {
    for (const org of organizations) {
      expect(
        categories.some((entry) => entry.value === org.category),
        org.id,
      ).toBe(true);
      expect(
        costBands.some((entry) => entry.value === org.cost),
        org.id,
      ).toBe(true);
      expect(
        timeBands.some((entry) => entry.value === org.time),
        org.id,
      ).toBe(true);
      expect(
        joiningRoutes.some((entry) => entry.value === org.joining),
        org.id,
      ).toBe(true);
    }
  });

  it("gives every organization a unique id and a unique table", () => {
    expect(new Set(organizations.map((org) => org.id)).size).toBe(organizations.length);
    expect(new Set(organizations.map((org) => org.table)).size).toBe(organizations.length);
  });

  it("names the real next step wherever getting in is not automatic", () => {
    /* "Audition in September, sign up at the fair" is the sentence a student
       actually uses at a table; the enum is the field it derives from. */
    for (const org of organizations) {
      if (org.joining === "automatic") continue;
      expect(org.nextStep, org.id).toBeTruthy();
    }
  });
});

describe("filtering", () => {
  it("returns everything when nothing is chosen", () => {
    expect(filterOrganizations(organizations, emptyFilter)).toHaveLength(organizations.length);
    expect(isFilterEmpty(emptyFilter)).toBe(true);
  });

  it("narrows on one axis alone", () => {
    for (const axis of [
      { key: "categories" as const, value: "media" },
      { key: "costs" as const, value: "free" },
      { key: "times" as const, value: "heavy" },
      { key: "joining" as const, value: "audition" },
    ]) {
      const filter = toggleFilterValue(emptyFilter, axis.key, axis.value as never);
      const results = filterOrganizations(organizations, filter);
      expect(results.length, axis.key).toBeGreaterThan(0);
      expect(results.length, axis.key).toBeLessThan(organizations.length);
    }
  });

  it("widens within one axis and narrows across axes", () => {
    /* Values within an axis are OR, axes are AND. That is what every filter a
       student has used behaves like, and it is the only combination in which
       "Free" plus "1 to 2 hours" narrows rather than widens. */
    const free = toggleFilterValue(emptyFilter, "costs", "free" as never);
    const freeOrLow = toggleFilterValue(free, "costs", "low" as never);
    expect(filterOrganizations(organizations, freeOrLow).length).toBeGreaterThan(
      filterOrganizations(organizations, free).length,
    );

    const freeAndLight = toggleFilterValue(free, "times", "light" as never);
    expect(filterOrganizations(organizations, freeAndLight).length).toBeLessThanOrEqual(
      filterOrganizations(organizations, free).length,
    );
  });

  it("searches name and blurb together", () => {
    const results = filterOrganizations(organizations, { ...emptyFilter, search: "robotics" });
    expect(results.some((org) => org.id === "robotics-team")).toBe(true);
  });

  it("can return nothing, and says so through an empty list rather than a throw", () => {
    const impossible = filterOrganizations(organizations, {
      ...emptyFilter,
      search: "underwater basket weaving",
    });
    expect(impossible).toHaveLength(0);
  });

  it("clears back to the whole catalogue", () => {
    const filter = toggleFilterValue(
      toggleFilterValue(emptyFilter, "costs", "free" as never),
      "categories",
      "sport" as never,
    );
    expect(activeFilterCount(filter)).toBe(2);
    expect(filterOrganizations(organizations, emptyFilter)).toHaveLength(organizations.length);
  });

  it("toggles a value off as well as on", () => {
    const on = toggleFilterValue(emptyFilter, "categories", "greek" as never);
    const off = toggleFilterValue(on, "categories", "greek" as never);
    expect(off.categories).toHaveLength(0);
  });
});

describe("the fair route", () => {
  it("groups stops by fair zone rather than by the order they were marked", () => {
    /* That regrouping is the entire difference between a list of saves and a
       route: it turns "things I liked" into "where I walk". */
    const marked = ["robotics-team", "concert-choir", "chess-club", "jazz-ensemble"];
    const legs = buildFairRoute(marked);
    for (const leg of legs) {
      expect(new Set(leg.stops.map((stop) => stop.organization.zone))).toEqual(new Set([leg.zone]));
    }
    // The two arts organizations land in one leg, not two.
    const arts = legs.find((leg) => leg.zone === "arts-pavilion");
    expect(arts?.stops).toHaveLength(2);
  });

  it("numbers stops continuously across zones", () => {
    const legs = buildFairRoute(["robotics-team", "concert-choir", "chess-club"]);
    const numbers = legs.flatMap((leg) => leg.stops.map((stop) => stop.number));
    expect(numbers).toEqual([1, 2, 3]);
  });

  it("counts organizations, zones and walking time", () => {
    const legs = buildFairRoute(["robotics-team", "concert-choir", "chess-club"]);
    const summary = fairRouteSummary(legs);
    expect(summary.stops).toBe(3);
    expect(summary.zones).toBe(legs.length);
    expect(summary.minutes).toBeGreaterThan(0);
  });

  it("is empty when nothing has been marked", () => {
    expect(buildFairRoute([])).toHaveLength(0);
    expect(fairRouteSummary([])).toEqual({ stops: 0, zones: 0, minutes: 0 });
  });

  it("ignores an id that no longer resolves against the catalogue", () => {
    /* A stored interest from an older fixture would otherwise take a slot in
       the route and print as nothing. */
    expect(buildFairRoute(["robotics-team", "a-club-that-was-deleted"])).toHaveLength(1);
  });
});
