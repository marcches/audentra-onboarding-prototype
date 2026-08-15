import * as React from "react";

import { type HousingIntent, housingIntents } from "@/lib/fixtures";
import type { StepId } from "@/lib/steps";

/**
 * Everything the student has entered, in one object, mirrored to localStorage
 * on every write. That is the whole of "your progress is saved automatically"
 * (user story 26) for a prototype with no backend — and it is also what makes
 * a hard refresh mid-form non-destructive, which is the thing reviewers
 * actually poke at.
 */

/**
 * Bumped whenever a stored value can no longer be interpreted by this build.
 *
 * v3, for the Phases round: the `aboutYou` slice is now `identityContact`,
 * following the step it belongs to. The shallow merge below is forgiving about
 * *missing* keys, so a v2 blob would not error — it would quietly restore an
 * empty Identity & contact over answers the student had actually given, which
 * is worse than a clean slate because it looks like data loss rather than a
 * reset.
 *
 * v2, for round 3: two housing intents were removed, the review slice replaced
 * `readDocuments` with `documentRead` and gained the signature strokes, and the
 * deposit lost its paid flags. Keys whose *meaning* changed are exactly what
 * the merge cannot help with — a v1 blob would restore `intent: "commuting"`
 * against a list that no longer contains it.
 */
const STORAGE_KEY = "audentra.onboarding.v3";

export type EntryState = {
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
  /**
   * Has this device ever got someone in — created an account or signed in?
   *
   * This is the whole of the entry screen's memory, and it decides which tab
   * opens and which words the heading uses. It exists because the premise the
   * screen was built on turned out to be false: it assumed everyone arrived
   * from an invitation link and therefore had no account, so it always opened
   * on Create account and always addressed a stranger. A returning student
   * opening the portal for the fifth time is the ordinary case, not the edge
   * one.
   */
  hasAuthenticated: boolean;
};

export type OfferState = {
  response: "accepted" | "declined" | null;
  respondedAt: string | null;
  /** Whether the celebration's share prompt has been used. Awards points once — see `lib/points.ts`. */
  shared: boolean;
};

export type EmergencyContact = {
  id: string;
  fullName: string;
  relationship: string;
  dialCode: string;
  phone: string;
};

/**
 * One attached identity document. The file itself is never kept — this state is
 * mirrored to localStorage and a `File` does not survive that trip, nor should
 * it. What is kept is what the list needs to render and what the size limit
 * needs to add up.
 */
export type UploadedFile = {
  name: string;
  size: number;
};

export type IdentityContactState = {
  openSections: string[];
  /** Identity documents attached. Optional — the sheet marks this field `n`. */
  idDocuments: UploadedFile[];
  /** True once a document has been "read". The extraction itself is simulated. */
  idExtracted: boolean;
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
  familyMemberRelationship: string;
  disclosureScope: string[];
  submitted: boolean;
};

export type HousingState = {
  intent: HousingIntent | null;
  residenceRanking: string[];
  protectionInterest: string;
  submitted: boolean;
};

export type CampusLifeState = {
  clubs: string[];
  submitted: boolean;
};

/** Split out of Campus life — see `steps.ts`. Optional throughout: it never blocks Review & sign or Deposit. */
export type HealthState = {
  accommodations: "yes" | "no" | "";
  accommodationNote: string;
  medicalDocuments: UploadedFile[];
  immunizationDocuments: UploadedFile[];
  submitted: boolean;
};

/**
 * One sampled point of a drawn signature, with the moment it was made.
 *
 * The timestamp is what makes the replay the student's own hand rather than a
 * generic line-drawing animation: the pauses, the fast strokes and the slow
 * ones all come back at the speed they were made.
 */
export type SignaturePoint = { x: number; y: number; t: number };

export type ReviewState = {
  /** True once the agreement has been scrolled to the end. Consent unlocks with it. */
  documentRead: boolean;
  signatureMode: "type" | "draw";
  typedSignature: string;
  /** PNG data URL of the drawn signature — the still form of it. */
  drawnSignature: string;
  /** The same signature as strokes, for replaying it onto the document. */
  drawnStrokes: SignaturePoint[][];
  /** The pad's CSS size when it was drawn, so the replay can scale to the line. */
  drawnSize: { width: number; height: number };
  consented: boolean;
  signedAt: string | null;
  /** The reference the student can quote. Issued at signing, never regenerated. */
  reference: string;
  submitted: boolean;
};

export type DepositState = {
  choice: "pay-now" | "pay-by-deadline" | "waiver" | "";
  waiverReason: string;
  submitted: boolean;
};

export type OnboardingState = {
  entry: EntryState;
  offer: OfferState;
  identityContact: IdentityContactState;
  housing: HousingState;
  campusLife: CampusLifeState;
  health: HealthState;
  review: ReviewState;
  deposit: DepositState;
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
    email: "",
    registeredEmail: "",
    dialCode: "+1",
    phone: "",
    signInEmail: "",
    accountCreated: false,
    hasAuthenticated: false,
  },
  offer: {
    response: null,
    respondedAt: null,
    shared: false,
  },
  identityContact: {
    openSections: ["identity"],
    idDocuments: [],
    idExtracted: false,
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
    familyMemberRelationship: "",
    disclosureScope: [],
    submitted: false,
  },
  housing: {
    intent: null,
    residenceRanking: [],
    protectionInterest: "",
    submitted: false,
  },
  campusLife: {
    clubs: [],
    submitted: false,
  },
  health: {
    accommodations: "",
    accommodationNote: "",
    medicalDocuments: [],
    immunizationDocuments: [],
    submitted: false,
  },
  review: {
    documentRead: false,
    signatureMode: "type",
    typedSignature: "",
    drawnSignature: "",
    drawnStrokes: [],
    drawnSize: { width: 0, height: 0 },
    consented: false,
    signedAt: null,
    reference: "",
    submitted: false,
  },
  deposit: {
    choice: "",
    waiverReason: "",
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
    const merged: OnboardingState = {
      entry: { ...initialState.entry, ...parsed.entry },
      offer: { ...initialState.offer, ...parsed.offer },
      identityContact: { ...initialState.identityContact, ...parsed.identityContact },
      housing: { ...initialState.housing, ...parsed.housing },
      campusLife: { ...initialState.campusLife, ...parsed.campusLife },
      health: { ...initialState.health, ...parsed.health },
      review: { ...initialState.review, ...parsed.review },
      deposit: { ...initialState.deposit, ...parsed.deposit },
    };

    /* A stored answer that no longer exists as an option reads as "answered"
       to every check while the control shows nothing selected — so the step
       renders no follow-up, the Continue button stays enabled, and the
       agreement states an answer nobody can see. The version bump above is the
       first line of defence; this is the one that survives a fixture edit
       without one. */
    if (merged.housing.intent && !housingIntents.some((o) => o.value === merged.housing.intent)) {
      merged.housing.intent = null;
      merged.housing.submitted = false;
    }

    return merged;
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

/** The slices the Review & sign summary reads back and the packet covers. */
const SIGNED_OVER: (keyof OnboardingState)[] = [
  "offer",
  "identityContact",
  "housing",
  "campusLife",
  "health",
];

export function patch<K extends keyof OnboardingState>(
  slice: K,
  changes: Partial<OnboardingState[K]>,
) {
  state = { ...state, [slice]: { ...state[slice], ...changes } };

  /**
   * Editing an answer un-signs the packet.
   *
   * Review & sign tells the student "changing an answer above re-opens this for
   * signing", and until now nothing did that: the green "Signed on <date>"
   * notice and the ticked consent box survived any later edit, so a FERPA
   * release could sit there presented as signed against answers that had since
   * changed. The rule belongs here rather than in the review screen because
   * this is the one place every answer is written.
   *
   * `documentRead` resets with the rest of it. The answers are written into the
   * agreement's clauses, so editing one rewrites the document — and leaving the
   * read gate satisfied would let the student re-sign text they have never seen,
   * which is the one thing that gate exists to prevent.
   */
  if (SIGNED_OVER.includes(slice) && state.review.submitted) {
    state = {
      ...state,
      review: {
        ...state.review,
        submitted: false,
        consented: false,
        signedAt: null,
        documentRead: false,
      },
    };
  }

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
  if (current.identityContact.submitted) done.push("identity-contact");
  if (current.housing.submitted) done.push("housing");
  if (current.campusLife.submitted) done.push("campus-life");
  if (current.health.submitted) done.push("health");
  if (current.review.submitted) done.push("review");
  if (current.deposit.submitted) done.push("deposit");
  return done;
}
