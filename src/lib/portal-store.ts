import * as React from "react";

import type { Booking } from "@/lib/appointments";
import type { RequirementId } from "@/lib/portal";
import { type OnboardingState, useOnboarding } from "@/lib/store";

/**
 * What the portal has of its own, mirrored to localStorage beside the gate's.
 *
 * **A second store rather than a slice of the first**, and the reason is the
 * one-way relationship in `CONTEXT-MAP.md`. The gate produces the portal's
 * starting state and never reads it back; the portal reads the gate constantly
 * and must never write to it. Two objects with two keys make that direction a
 * property of the code rather than a rule somebody remembers — there is no
 * `patch("portal", …)` on the gate's store to reach for, and the gate's own
 * shape does not move in a cycle that was not supposed to touch it.
 *
 * It holds only what cannot be derived. Everything else about a Requirement —
 * its state, its value today, what it unlocks, whether it carried over — is
 * computed in `portal.ts` from these two lists, the gate's answers, and the
 * fixture's today.
 */
export type PortalState = {
  /** Finished in the portal. The gate's own finished Quests are read, not copied. */
  completed: RequirementId[];
  /**
   * Submitted, and waiting on the institution rather than on the student. The
   * final transcript starts here because a school sends it before the student
   * ever opens the portal — the one Requirement whose state at fixture time is
   * not the student's own doing.
   */
  underReview: RequirementId[];
  /**
   * The one appointment the student holds, or none.
   *
   * Singular on purpose. A list would need a cancellation policy, a past
   * / upcoming split and a rule about double-booking the same hour — three
   * decisions this cycle deliberately does not take. Booking a second time
   * replaces the first, and the screen says so.
   */
  booking: Booking | null;
};

const STORAGE_KEY = "audentra.portal.v1";

const initialState: PortalState = {
  completed: [],
  underReview: ["final-transcript"],
  booking: null,
};

function read(): PortalState {
  if (typeof window === "undefined") return initialState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as Partial<PortalState>;
    return { ...initialState, ...parsed };
  } catch {
    return initialState;
  }
}

let state: PortalState = read();
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return state;
}

export function patchPortal(changes: Partial<PortalState>) {
  state = { ...state, ...changes };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // A full or blocked storage quota must not take the screen down with it.
  }
  for (const listener of listeners) listener();
}

export function resetPortal() {
  state = initialState;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to recover from — the in-memory reset already happened.
  }
  for (const listener of listeners) listener();
}

export function usePortalState(): PortalState {
  return React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/**
 * Both halves of what the portal needs to know, in one object.
 *
 * Every derivation in `portal.ts` takes one of these rather than two arguments,
 * so no call site can pass the gate's answers and forget the portal's — and so
 * the direction is legible at every seam: `gate` is read, `portal` is the only
 * thing anything writes.
 */
export type PortalContext = {
  gate: OnboardingState;
  portal: PortalState;
};

export function usePortal(): PortalContext {
  return { gate: useOnboarding(), portal: usePortalState() };
}
