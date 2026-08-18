/**
 * Whole-day arithmetic on ISO dates, and nothing else.
 *
 * Extracted from `portal.ts` when the Streak arrived, because `points.ts`
 * needed to know that two days are consecutive and must not be given the
 * deadline clock to find out. The note at the top of `portal.ts` is the one
 * being honoured: putting the reward ladder and the deadline clock in the same
 * module is how the Bookstore ladder — which the gate also draws — comes to
 * break when a portal deadline moves.
 *
 * This module has no fixtures and no opinions. `TODAY` stays in `portal.ts`,
 * where the thing it is a fixture *of* lives.
 */

const DAY_MS = 86_400_000;

/** Midnight UTC of an ISO date. Parsing a fixture is not reading a clock. */
export function atMidnight(iso: string): number {
  return Date.parse(`${iso}T00:00:00Z`);
}

/** Whole days from one ISO date to another. Negative when `to` is earlier. */
export function daysBetween(from: string, to: string): number {
  return Math.round((atMidnight(to) - atMidnight(from)) / DAY_MS);
}

/** The same date, `days` later, as an ISO date. */
export function addDays(iso: string, days: number): string {
  return new Date(atMidnight(iso) + days * DAY_MS).toISOString().slice(0, 10);
}
