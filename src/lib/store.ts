import * as React from "react";

import { housingAvailability, residences } from "@/lib/housing";
import type { StepId, StudentStatusAnswer } from "@/lib/steps";

/**
 * Everything the student has entered, in one object, mirrored to localStorage
 * on every write. That is the whole of "your progress is saved automatically"
 * for a prototype with no backend — and it is also what makes a hard refresh
 * mid-form non-destructive, which is the thing reviewers actually poke at.
 */

/**
 * Bumped whenever a stored value can no longer be interpreted by this build.
 *
 * v6, for About you in three (ADR 0011): `Where you live now` is not a Step any
 * more, so `whereYouLive.submitted` is gone and `whoYouAre.submitted` governs
 * both halves of the screen that absorbed it. A v5 blob carries that flag and a
 * spine with ten Steps in it — the shallow merge below would keep the flag,
 * `completedSteps` would ignore it, and the student would land on a half-saved
 * `Who you are` whose address they had already given. A clean slate is the
 * honest version of that.
 *
 * v5, for the rebuild: `identityContact` is gone, split into `whoYouAre`,
 * `whereYouLive` and `whoWeCall` following the three Steps that replaced it.
 * `citizenship` became `studentStatus` with a smaller set of values —
 * "eligible-noncitizen" no longer exists, and a stored blob carrying it would
 * put a student in a branch the spine has no address Step for. Housing lost
 * `arrangingOwn` with the off-campus exit, `campusLife.clubs` became
 * `campusLife.interests` against a completely different catalogue, and the
 * deposit grew a method and a reference. The shallow merge below is forgiving
 * about *missing* keys, so a v4 blob would not error — it would quietly restore
 * an empty About you over answers the student had given, which is worse than a
 * clean slate because it looks like data loss rather than a reset.
 *
 * v4, for Housing: `housing.intent` gone, `arrangingOwn` in its place, and the
 * residence ids renumbered when the catalogue went from three to eight.
 *
 * v3, for the Phases round: the `aboutYou` slice became `identityContact`.
 *
 * v2, for round 3: two housing intents removed, the review slice replaced
 * `readDocuments` with `documentRead`, and the deposit lost its paid flags.
 */
const STORAGE_KEY = "audentra.onboarding.v6";

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
  /** Has this device ever got someone in? Decides which tab opens. */
  hasAuthenticated: boolean;
};

export type OfferState = {
  response: "accepted" | "declined" | null;
  respondedAt: string | null;
  /** Whether the celebration's share prompt has been used. Awards Points once. */
  shared: boolean;
};

/**
 * One attached document. The file itself is never kept — this state is mirrored
 * to localStorage and a `File` does not survive that trip, nor should it. What
 * is kept is what the list needs to render and what the size limit needs to add
 * up.
 */
export type UploadedFile = {
  name: string;
  size: number;
};

/**
 * Who the student is, and the one answer that shapes the rest of the flow.
 *
 * Student status is answered *before* any document is requested, so the request
 * is never generic. It also decides whether the permanent address is asked for
 * — see `addressSchemaFor()`.
 */
export type WhoYouAreState = {
  preferredName: string;
  pronouns: string;
  dialCode: string;
  phone: string;
  studentStatus: StudentStatusAnswer;
  /** The Identity document the answered status calls for. */
  idDocuments: UploadedFile[];
  /** Governs the whole screen, address Sections included. */
  submitted: boolean;
};

/** Optional throughout: it never blocks Review & sign or Deposit. */
export type HealthState = {
  accommodations: "yes" | "no" | "";
  accommodationNote: string;
  medicalDocuments: UploadedFile[];
  /** Asked of everyone, regardless of the accommodation answer. */
  immunizationDocuments: UploadedFile[];
  submitted: boolean;
};

/**
 * The permanent address, which is two Sections inside `Who you are` rather than
 * a Step of its own (ADR 0011). Absent entirely for an international student:
 * the Sections are not rendered and `addressSchemaFor()` returns `null`.
 *
 * It keeps its own slice rather than being folded into `whoYouAre`, because the
 * two are different shapes with different validation and merging them would
 * make one schema out of two that branch differently. What it does **not** keep
 * is a `submitted` flag — one screen has one saved state, and two flags for one
 * Continue is how a screen comes to be half-saved.
 */
export type WhereYouLiveState = {
  street: string;
  unit: string;
  /** A slug, scoped to `state`. Never what the summary prints. */
  city: string;
  /** A USPS abbreviation. Never what the summary prints. */
  state: string;
  postalCode: string;
  country: string;
  residencyVerification: string;
};

export type EmergencyContact = {
  id: string;
  fullName: string;
  relationship: string;
  dialCode: string;
  phone: string;
};

/**
 * One person granted sight of part of the record, under FERPA.
 *
 * Four fields, and the fourth is the one that had never been built: the scope.
 * Laura listed all four on the call — "precisa do nome completo, precisa do
 * e-mail, precisa do parentesco, e o que vai ter acesso." More than one person
 * can be granted access and each is an independent record, which is why this is
 * a list rather than four fields on the slice.
 */
export type FamilyAccessGrant = {
  id: string;
  fullName: string;
  email: string;
  relationship: string;
  scope: string[];
};

export type WhoWeCallState = {
  emergencyContacts: EmergencyContact[];
  familyAccess: FamilyAccessGrant[];
  submitted: boolean;
};

export type HousingState = {
  /** Residence ids, best first. At most `housingAvailability.shortlistSize`. */
  residenceRanking: string[];
  submitted: boolean;
};

export type CampusLifeState = {
  /**
   * Organizations marked as interesting. Not a membership and not a roster:
   * joining happens in person at the Involvement Fair, and what this list
   * produces is a route through it. See `CONTEXT.md`.
   */
  interests: string[];
  submitted: boolean;
};

/**
 * One sampled point of a drawn signature, with the moment it was made. The
 * timestamp is what makes the replay the student's own hand rather than a
 * generic line-drawing animation.
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

/** How the deposit is being settled. All three are ways of finishing. */
export type DepositChoice = "pay-now" | "pay-by-deadline" | "waiver" | "";

/** Which of the checkout's three screens is showing. One rail entry, three screens. */
export type DepositScreen = "secure" | "double-check" | "receipt";

export type DepositState = {
  screen: DepositScreen;
  choice: DepositChoice;
  /** Only meaningful under `pay-now`. A bank transfer settles as processing. */
  method: "card" | "bank-transfer" | "";
  cardName: string;
  cardNumber: string;
  waiverReason: string;
  /** Issued when the checkout completes, so the receipt can be re-read. */
  reference: string;
  settledAt: string | null;
  submitted: boolean;
};

export type OnboardingState = {
  entry: EntryState;
  offer: OfferState;
  whoYouAre: WhoYouAreState;
  health: HealthState;
  whereYouLive: WhereYouLiveState;
  whoWeCall: WhoWeCallState;
  housing: HousingState;
  campusLife: CampusLifeState;
  review: ReviewState;
  deposit: DepositState;
};

/** Unique per row, independent of position — rows can be removed. */
export function newRowId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

export const emptyEmergencyContact = (id: string): EmergencyContact => ({
  id,
  fullName: "",
  relationship: "",
  dialCode: "+1",
  phone: "",
});

export const emptyFamilyAccess = (id: string): FamilyAccessGrant => ({
  id,
  fullName: "",
  email: "",
  relationship: "",
  scope: [],
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
  whoYouAre: {
    preferredName: "",
    pronouns: "",
    dialCode: "+1",
    phone: "",
    studentStatus: "",
    idDocuments: [],
    submitted: false,
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
  whoWeCall: {
    emergencyContacts: [emptyEmergencyContact("contact-1")],
    familyAccess: [],
    submitted: false,
  },
  housing: {
    residenceRanking: [],
    submitted: false,
  },
  campusLife: {
    interests: [],
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
      whoYouAre: { ...initialState.whoYouAre, ...parsed.whoYouAre },
      health: { ...initialState.health, ...parsed.health },
      whereYouLive: { ...initialState.whereYouLive, ...parsed.whereYouLive },
      whoWeCall: { ...initialState.whoWeCall, ...parsed.whoWeCall },
      housing: { ...initialState.housing, ...parsed.housing },
      campusLife: { ...initialState.campusLife, ...parsed.campusLife },
      review: { ...initialState.review, ...parsed.review },
      deposit: { ...initialState.deposit, ...parsed.deposit },
    };

    /* A ranked id that no longer resolves against the catalogue would sit
       invisibly in the Shortlist: it takes a slot, it moves when the arrows
       move it, and it prints as nothing in the summary and the agreement. The
       version bump above is the first line of defence; this is the one that
       survives a fixture edit without one. */
    merged.housing.residenceRanking = merged.housing.residenceRanking
      .filter((id) => residences.some((residence) => residence.id === id))
      .slice(0, housingAvailability.shortlistSize);

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
  "whoYouAre",
  "health",
  "whereYouLive",
  "whoWeCall",
  "housing",
  "campusLife",
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
   * signing", and the rule belongs here rather than in the review screen
   * because this is the one place every answer is written. `documentRead`
   * resets with the rest of it: the answers are written into the agreement's
   * clauses, so editing one rewrites the document, and leaving the read gate
   * satisfied would let the student re-sign text they have never seen.
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

/**
 * The Student status, which decides which Identity document is asked for and
 * whether the permanent address is asked for at all. One accessor, so no screen
 * reaches into the slice for it. The spine no longer reads it — see ADR 0011.
 */
export function studentStatus(current: OnboardingState): StudentStatusAnswer {
  return current.whoYouAre.studentStatus;
}

/** Which Steps count as done, for the rail's progress read-out. */
export function completedSteps(current: OnboardingState): StepId[] {
  const done: StepId[] = [];
  if (current.offer.response !== null) done.push("offer");
  if (current.whoYouAre.submitted) done.push("who-you-are");
  if (current.health.submitted) done.push("health");
  if (current.whoWeCall.submitted) done.push("who-we-call");
  if (current.housing.submitted) done.push("housing");
  if (current.campusLife.submitted) done.push("campus-life");
  if (current.review.submitted) done.push("review");
  if (current.deposit.submitted) done.push("deposit");
  return done;
}
