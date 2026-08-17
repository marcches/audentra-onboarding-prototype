import { describe, expect, it } from "vitest";

import {
  daysFor,
  formatDay,
  formatTime,
  SLOT_TIMES,
  serviceById,
  services,
  soonestSlot,
} from "@/lib/appointments";
import { daysBetween, TODAY } from "@/lib/portal";

/**
 * The one tested seam in Appointments: the run of days, and the slots in them.
 *
 * The screen itself takes no decision worth asserting — it lists what this
 * module derives and writes one object to the store. What *is* worth holding is
 * that the derivation reads no clock and rolls no die: a prototype whose free
 * slots move between two screenshots is a prototype nobody can review, and a
 * fixture that offers an appointment in the past is worse than one that offers
 * none.
 *
 * Nothing here asserts that student support runs 45 minutes. That would be a
 * test restating the fixture, which fails when the fixture is corrected and
 * trains people to edit the test — the same rule `portal.test.ts` opens with.
 */

describe("the three services", () => {
  it("gives each a unique id, and finds every one of them", () => {
    expect(new Set(services.map((one) => one.id)).size).toBe(services.length);
    for (const service of services) {
      expect(() => serviceById(service.id), service.id).not.toThrow();
    }
  });
});

describe("the run of days", () => {
  it("starts tomorrow, because an office cannot honour a slot today", () => {
    for (const service of services) {
      const [first] = daysFor(service.id);
      expect(daysBetween(TODAY, first.date), service.id).toBeGreaterThan(0);
    }
  });

  it("offers weekdays only", () => {
    for (const day of daysFor("financial-aid")) {
      const weekday = new Date(`${day.date}T00:00:00Z`).getUTCDay();
      expect(weekday, day.date).not.toBe(0);
      expect(weekday, day.date).not.toBe(6);
    }
  });

  it("runs forwards, with no day repeated", () => {
    const days = daysFor("student-support").map((day) => day.date);
    expect(new Set(days).size).toBe(days.length);
    expect([...days].sort()).toEqual(days);
  });

  it("gives every day the same hours and every slot a unique id", () => {
    const days = daysFor("academic-advising");
    const ids = days.flatMap((day) => day.slots.map((slot) => slot.id));
    expect(new Set(ids).size).toBe(ids.length);
    for (const day of days) {
      expect(
        day.slots.map((slot) => slot.time),
        day.date,
      ).toEqual([...SLOT_TIMES]);
    }
  });

  it("reads no clock and rolls no die — the same run twice", () => {
    // Which is what lets a screenshot taken today and one taken in March show
    // the same screen, and what stops `taken` being a coin flip on every render.
    expect(daysFor("financial-aid")).toEqual(daysFor("financial-aid"));
  });

  it("leaves something bookable in every service", () => {
    // A fixture whose pattern of taken slots happened to fill a fortnight would
    // demonstrate an office that cannot be booked, on the one screen built to
    // prove the opposite.
    for (const service of services) {
      expect(soonestSlot(service.id), service.id).toBeDefined();
    }
  });
});

describe("how a time reads", () => {
  it("puts the fixture's 24-hour times into the clock a student uses", () => {
    expect(formatTime("09:00")).toBe("9:00 am");
    expect(formatTime("13:30")).toBe("1:30 pm");
  });

  it("renders a day in UTC, like every other date in this repo", () => {
    // Rendering a midnight-UTC fixture in the machine's own zone shows the day
    // before to half of North America.
    expect(formatDay("2027-08-09")).toBe("Mon, Aug 9");
  });
});
