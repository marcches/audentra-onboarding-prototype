import { describe, expect, it } from "vitest";

import { academicCalendar } from "@/lib/fixtures";
import {
  addDays,
  availableInOrder,
  carriedOver,
  compareSmart,
  completedRequirements,
  daysBetween,
  floorValue,
  pointsAtRisk,
  type Requirement,
  type RequirementId,
  requirementById,
  requirementCount,
  requirementGroups,
  requirements,
  requirementsInState,
  stateOf,
  TODAY,
  unlockCount,
  valueOn,
  valueToday,
  valueTomorrow,
} from "@/lib/portal";
import type { PortalContext } from "@/lib/portal-store";
import type { OnboardingState } from "@/lib/store";

/**
 * The portal's spine, tested because everything derives from it.
 *
 * The same seam `steps.test.ts` covers, one surface across: the Dashboard's
 * ordering, every "N of 12", every value on a card and every reason an item is
 * not actionable all come out of `portal.ts`. So the assertions are about the
 * **shape** — derivation, exhaustiveness, ordering, arithmetic at its
 * boundaries — and never about whether the meal plan is worth fifty Points. A
 * test that restates the fixture fails when the fixture is corrected, which
 * trains people to edit the test.
 *
 * Two of these could not be written against the fixture honestly and build
 * their own: transitive unlocks needs a *chain*, and the Decay boundaries need
 * a Requirement a hundred days stale. Both are constructed inline rather than
 * added to the twelve, because a fixture row existing only for a test is a row
 * the design has to keep explaining.
 */

/* A gate walked to the end, with the three optional Quests skipped — the state
   a student most often lands in the portal with. */
const gate: OnboardingState = {
  entry: {
    email: "",
    registeredEmail: "",
    dialCode: "+1",
    phone: "",
    signInEmail: "",
    accountCreated: true,
    hasAuthenticated: true,
  },
  offer: { response: "accepted", respondedAt: "2027-08-01", shared: false },
  whoYouAre: {
    preferredName: "",
    pronouns: "",
    dialCode: "+1",
    phone: "",
    studentStatus: "us-citizen",
    idDocuments: [],
    submitted: true,
  },
  health: {
    accommodations: "",
    accommodationNote: "",
    medicalDocuments: [],
    immunizationDocuments: [],
    submitted: false,
  },
  whereYouLive: {
    street: "",
    unit: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    residencyVerification: "",
  },
  whoWeCall: { emergencyContacts: [], familyAccess: [], submitted: true },
  housing: { residenceRanking: [], submitted: true },
  campusLife: { interests: [], submitted: false },
  review: {
    documentRead: true,
    signatureMode: "type",
    typedSignature: "Alex Rivera",
    drawnSignature: "",
    drawnStrokes: [],
    drawnSize: { width: 0, height: 0 },
    consented: true,
    signedAt: "2027-08-02",
    reference: "AST-SIGN-1",
    submitted: true,
  },
  deposit: {
    screen: "secure",
    choice: "",
    method: "",
    cardName: "",
    cardNumber: "",
    waiverReason: "",
    reference: "",
    settledAt: null,
    submitted: false,
  },
};

const fresh: PortalContext = {
  gate,
  portal: { completed: [], underReview: ["final-transcript"] },
};

/** The same student, having skipped nothing in the gate. */
const skippedNothing: PortalContext = {
  ...fresh,
  gate: {
    ...gate,
    health: { ...gate.health, submitted: true },
    campusLife: { ...gate.campusLife, submitted: true },
    deposit: { ...gate.deposit, submitted: true },
  },
};

/** The same student, a good way in. */
const partway: PortalContext = {
  ...fresh,
  portal: { completed: ["financial-aid", "student-id-photo"], underReview: ["final-transcript"] },
};

const stores: Record<string, PortalContext> = { fresh, skippedNothing, partway };

/** A Requirement built for one assertion, with the fixture's defaults. */
function make(id: string, changes: Partial<Requirement> = {}): Requirement {
  return {
    id: id as RequirementId,
    path: `/portal/enrollment/${id}`,
    label: id,
    blurb: "",
    action: "Start",
    office: "the Registrar",
    category: "Academics",
    availableOn: TODAY,
    deadline: addDays(TODAY, 30),
    minutes: 5,
    points: 100,
    prerequisites: [],
    ...changes,
  };
}

/* ---------------------------------------------------------------------------
   The twelve
   ------------------------------------------------------------------------ */

describe("the twelve", () => {
  it("derives the flat list from the grouping rather than keeping a second one", () => {
    // The bug this shape exists to prevent, and the one `steps.ts` already
    // avoids: two lists that have to agree.
    expect(requirements).toEqual(requirementGroups.flatMap((group) => group.requirements));
    expect(requirementCount).toBe(requirements.length);
  });

  it("gives every Requirement a unique id and a unique path", () => {
    expect(new Set(requirements.map((one) => one.id)).size).toBe(requirements.length);
    expect(new Set(requirements.map((one) => one.path)).size).toBe(requirements.length);
  });

  it("names every prerequisite as a Requirement that exists", () => {
    for (const requirement of requirements) {
      for (const id of requirement.prerequisites) {
        expect(() => requirementById(id), requirement.id).not.toThrow();
      }
    }
  });

  it("carries three that came from the gate, and points each back at its Quest", () => {
    const carried = requirements.filter((one) => one.from);
    expect(carried).toHaveLength(3);
    for (const requirement of carried) {
      expect(requirement.path, requirement.id).toMatch(/^\/onboarding\//);
    }
  });

  it("wants nothing after teaching begins", () => {
    // The defect this cycle found, written so it cannot come back. The twelve
    // deadlines were set to make one card read `100 days` and were never
    // checked against a term, which put `Secure your place` on Nov 16 — twelve
    // weeks after the student would have started classes. A deadline after the
    // first lecture is not a deadline.
    for (const requirement of requirements) {
      expect(
        daysBetween(requirement.deadline, academicCalendar.teachingBegins),
        requirement.id,
      ).toBeGreaterThan(0);
    }
  });

  it("opens every Requirement on or before the day it is wanted", () => {
    // The weaker invariant that should always have been there: a Requirement
    // the student cannot start until after it was due is a row that can only
    // ever be shown overdue.
    for (const requirement of requirements) {
      expect(
        daysBetween(requirement.availableOn, requirement.deadline),
        requirement.id,
      ).toBeGreaterThanOrEqual(0);
    }
  });

  it("reads no clock", () => {
    // `TODAY` is a fixture so a screenshot taken in November and one taken in
    // March show the same screen, and so nothing here depends on the day it
    // runs. The assertion is on the source: a rule that cannot be reached for
    // is stronger than one caught afterwards.
    expect(TODAY).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

/* ---------------------------------------------------------------------------
   State
   ------------------------------------------------------------------------ */

describe("the four states", () => {
  it("puts every Requirement in exactly one, for every state of the store", () => {
    for (const [name, store] of Object.entries(stores)) {
      const groups = [
        requirementsInState("complete", store),
        requirementsInState("under-review", store),
        requirementsInState("upcoming", store),
        requirementsInState("available", store),
      ];
      const counted = groups.reduce((total, group) => total + group.length, 0);
      expect(counted, name).toBe(requirementCount);
      const ids = groups.flatMap((group) => group.map((one) => one.id));
      expect(new Set(ids).size, name).toBe(requirementCount);
    }
  });

  it("derives Upcoming from an unmet prerequisite, not from a stored flag", () => {
    const blocked = requirements.find((one) => one.prerequisites.length > 0);
    if (!blocked) throw new Error("The fixture has no prerequisite to test");
    const [prerequisite] = blocked.prerequisites;

    expect(stateOf(blocked, fresh)).toBe("upcoming");

    // Nothing is written about `blocked` itself: completing what it waits on is
    // the whole of the change.
    const met: PortalContext = {
      ...fresh,
      portal: { ...fresh.portal, completed: [prerequisite], underReview: [] },
    };
    const stillWaiting = daysFromToday(blocked.availableOn) > 0;
    expect(stateOf(blocked, met)).toBe(stillWaiting ? "upcoming" : "available");
  });

  it("derives Upcoming from an availability date in the future", () => {
    const later = make("later", { availableOn: addDays(TODAY, 3) });
    expect(stateOf(later, fresh)).toBe("upcoming");
    expect(stateOf(make("now"), fresh)).toBe("available");
  });

  it("counts the gate's finished Quests as Complete, and writes nothing back", () => {
    const before = JSON.stringify(skippedNothing);
    const done = completedRequirements(skippedNothing);
    for (const requirement of requirements) {
      if (requirement.from) expect(done.has(requirement.id), requirement.id).toBe(true);
    }
    expect(JSON.stringify(skippedNothing)).toBe(before);
  });
});

function daysFromToday(iso: string) {
  return Math.round(
    (Date.parse(`${iso}T00:00:00Z`) - Date.parse(`${TODAY}T00:00:00Z`)) / 86_400_000,
  );
}

/* ---------------------------------------------------------------------------
   Decay
   ------------------------------------------------------------------------ */

describe("decay", () => {
  const requirement = make("decaying", { points: 100, availableOn: TODAY });

  it("is the original value on the availability date", () => {
    expect(valueToday(requirement)).toBe(100);
  });

  it("takes one Point a day", () => {
    expect(valueOn(requirement, addDays(TODAY, 1))).toBe(99);
    expect(valueOn(requirement, addDays(TODAY, 10))).toBe(90);
    expect(valueTomorrow(requirement)).toBe(99);
  });

  it("stops at half the original, however late the student is", () => {
    expect(floorValue(requirement)).toBe(50);
    expect(valueOn(requirement, addDays(TODAY, 50))).toBe(50);
    expect(valueOn(requirement, addDays(TODAY, 51))).toBe(50);
    expect(valueOn(requirement, addDays(TODAY, 5_000))).toBe(50);
  });

  it("never reaches zero and never goes negative, for any Requirement", () => {
    for (const one of requirements) {
      const late = valueOn(one, addDays(TODAY, 3_650));
      expect(late, one.id).toBeGreaterThan(0);
      expect(late, one.id).toBe(floorValue(one));
    }
  });

  it("is whole Points, including for an odd original value", () => {
    const odd = make("odd", { points: 45 });
    expect(Number.isInteger(floorValue(odd))).toBe(true);
    expect(Number.isInteger(valueOn(odd, addDays(TODAY, 100)))).toBe(true);
  });

  it("does not start the clock before the Requirement is available", () => {
    const later = make("later", { points: 80, availableOn: addDays(TODAY, 30) });
    expect(valueToday(later)).toBe(80);
  });

  it("puts one Point a day at risk until the floor, and nothing after it", () => {
    expect(pointsAtRisk(requirement)).toBe(1);
    const stale = make("stale", { points: 30, availableOn: addDays(TODAY, -60) });
    expect(valueToday(stale)).toBe(floorValue(stale));
    // Which is what stops a stale Requirement climbing Smart order forever.
    expect(pointsAtRisk(stale)).toBe(0);
  });
});

/* ---------------------------------------------------------------------------
   Unlocks
   ------------------------------------------------------------------------ */

describe("unlocks", () => {
  it("counts transitively, against a chain rather than a flat list", () => {
    // a → b → c, d; and e on its own. Counting direct dependents only would
    // say a opens one, which understates the thing the badge exists to justify.
    const chain = [
      make("a"),
      make("b", { prerequisites: ["a" as RequirementId] }),
      make("c", { prerequisites: ["b" as RequirementId] }),
      make("d", { prerequisites: ["b" as RequirementId] }),
      make("e"),
    ];
    expect(unlockCount("a" as RequirementId, chain)).toBe(3);
    expect(unlockCount("b" as RequirementId, chain)).toBe(2);
    expect(unlockCount("c" as RequirementId, chain)).toBe(0);
    expect(unlockCount("e" as RequirementId, chain)).toBe(0);
  });

  it("counts a Requirement released by two others once", () => {
    const diamond = [
      make("a"),
      make("b", { prerequisites: ["a" as RequirementId] }),
      make("c", { prerequisites: ["a" as RequirementId] }),
      make("d", { prerequisites: ["b" as RequirementId, "c" as RequirementId] }),
    ];
    expect(unlockCount("a" as RequirementId, diamond)).toBe(3);
  });
});

/* ---------------------------------------------------------------------------
   Ordering
   ------------------------------------------------------------------------ */

describe("smart order", () => {
  it("is a total order — no two Requirements compare equal", () => {
    for (const a of requirements) {
      for (const b of requirements) {
        if (a.id === b.id) continue;
        expect(compareSmart(a, b), `${a.id} vs ${b.id}`).not.toBe(0);
      }
    }
  });

  it("is antisymmetric, so the sort cannot depend on the engine", () => {
    for (const a of requirements) {
      for (const b of requirements) {
        if (a.id === b.id) continue;
        expect(Math.sign(compareSmart(a, b))).toBe(-Math.sign(compareSmart(b, a)));
      }
    }
  });

  it("excludes Upcoming entirely rather than ranking it last", () => {
    const ordering = availableInOrder(fresh);
    const upcoming = new Set(requirementsInState("upcoming", fresh).map((one) => one.id));
    expect(upcoming.size).toBeGreaterThan(0);
    for (const requirement of ordering) {
      expect(upcoming.has(requirement.id), requirement.id).toBe(false);
    }
  });

  it("puts what opens the most doors first", () => {
    const [first, ...rest] = availableInOrder(fresh);
    for (const other of rest) {
      expect(unlockCount(first.id)).toBeGreaterThanOrEqual(unlockCount(other.id));
    }
  });

  it("never ranks a Complete or Under review Requirement", () => {
    const ordering = availableInOrder(partway);
    for (const requirement of ordering) {
      expect(stateOf(requirement, partway), requirement.id).toBe("available");
    }
  });
});

/* ---------------------------------------------------------------------------
   What the gate left behind
   ------------------------------------------------------------------------ */

describe("carried over", () => {
  it("derives from the gate's store", () => {
    const carried = carriedOver(fresh).map((one) => one.id);
    expect(carried).toHaveLength(3);
    expect(carried).toContain("secure-your-place");
  });

  it("produces none for a student who skipped nothing", () => {
    expect(carriedOver(skippedNothing)).toHaveLength(0);
  });

  it("leaves the carried-over three in the ordinary list, not in a penalty box", () => {
    const available = availableInOrder(fresh).map((one) => one.id);
    for (const requirement of carriedOver(fresh)) {
      expect(available, requirement.id).toContain(requirement.id);
    }
  });
});
