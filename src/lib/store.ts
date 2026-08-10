import * as React from "react";

import type { HousingIntent } from "@/lib/fixtures";
import type { StepId } from "@/lib/steps";

/**
 * Everything the student has entered, in one object, mirrored to localStorage
 * on every write. That is the whole of "your progress is saved automatically"
 * (user story 26) for a prototype with no backend — and it is also what makes
 * a hard refresh mid-form non-destructive, which is the thing reviewers
 * actually poke at.
 */

const STORAGE_KEY = "audentra.onboarding.v1";

export type EntryState = {
  activeTab: "create" | "signin";
  /** Live draft of the create-account email field — changes on every keystroke. */
  email: string;
  /**
   * The address an account was actually created with. Kept separate from the
   * draft above: conflating the two makes "this address already has an account"
   * compare the draft against itself, which is true for anything you type.
   */
  registeredEmail: string;
  dialCode: string;
  phone: string;
  signInEmail: string;
  accountCreated: boolean;
};

export type OfferState = {
  response: "accepted" | "declined" | null;
  respondedAt: string | null;
  declineReason: string;
  declineNote: string;
};

export type EmergencyContact = {
  id: string;
  fullName: string;
  relationship: string;
  dialCode: string;
  phone: string;
};

export type AboutYouState = {
  openSections: string[];
  preferredName: string;
  pronouns: string;
  dialCode: string;
  phone: string;
  citizenship: string;
  street: string;
  unit: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  residencyVerification: string;
  emergencyContacts: EmergencyContact[];
  grantsFamilyAccess: boolean;
  familyMemberName: string;
  familyMemberEmail: string;
  disclosureScope: string[];
  submitted: boolean;
};

export type HousingState = {
  intent: HousingIntent | null;
  residenceRanking: string[];
  protectionInterest: string;
  submitted: boolean;
};

export type OnboardingState = {
  entry: EntryState;
  offer: OfferState;
  aboutYou: AboutYouState;
  housing: HousingState;
};

/** Unique per contact, independent of position — rows can be removed. */
export function newContactId() {
  return `contact-${crypto.randomUUID()}`;
}

export const emptyEmergencyContact = (id: string): EmergencyContact => ({
  id,
  fullName: "",
  relationship: "",
  dialCode: "+1",
  phone: "",
});

const initialState: OnboardingState = {
  entry: {
    activeTab: "create",
    email: "",
    registeredEmail: "",
    dialCode: "+1",
    phone: "",
    signInEmail: "",
    accountCreated: false,
  },
  offer: {
    response: null,
    respondedAt: null,
    declineReason: "",
    declineNote: "",
  },
  aboutYou: {
    openSections: ["identity"],
    preferredName: "",
    pronouns: "",
    dialCode: "+1",
    phone: "",
    citizenship: "",
    street: "",
    unit: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    residencyVerification: "",
    emergencyContacts: [emptyEmergencyContact("contact-1")],
    grantsFamilyAccess: false,
    familyMemberName: "",
    familyMemberEmail: "",
    disclosureScope: [],
    submitted: false,
  },
  housing: {
    intent: null,
    residenceRanking: [],
    protectionInterest: "",
    submitted: false,
  },
};

function read(): OnboardingState {
  if (typeof window === "undefined") return initialState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as Partial<OnboardingState>;
    // Shallow-merge per slice: a stored blob written by an older shape must not
    // strip keys the current build expects.
    return {
      entry: { ...initialState.entry, ...parsed.entry },
      offer: { ...initialState.offer, ...parsed.offer },
      aboutYou: { ...initialState.aboutYou, ...parsed.aboutYou },
      housing: { ...initialState.housing, ...parsed.housing },
    };
  } catch {
    return initialState;
  }
}

let state: OnboardingState = read();
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // A full or blocked storage quota must not take the form down with it.
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return state;
}

export function patch<K extends keyof OnboardingState>(
  slice: K,
  changes: Partial<OnboardingState[K]>,
) {
  state = { ...state, [slice]: { ...state[slice], ...changes } };
  persist();
  emit();
}

export function resetOnboarding() {
  state = initialState;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to recover from — the in-memory reset already happened.
  }
  emit();
}

export function useOnboarding(): OnboardingState {
  return React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/** Which steps count as done, for the sidebar's progress read-out. */
export function completedSteps(current: OnboardingState): StepId[] {
  const done: StepId[] = [];
  if (current.offer.response !== null) done.push("offer");
  if (current.aboutYou.submitted) done.push("about-you");
  if (current.housing.submitted) done.push("housing");
  return done;
}
