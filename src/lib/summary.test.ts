import { describe, expect, it } from "vitest";

import type { OnboardingState } from "@/lib/store";
import { buildSummary, opensByDefault, summaryCounts } from "@/lib/summary";

/**
 * What Review & sign displays.
 *
 * The screen's whole job is telling the student whether they are done, so the
 * two counts and the per-section digest are the parts that must not drift. A
 * collapsed section showing nothing is a section the student has to open to
 * check, which defeats collapsing it.
 */

function state(overrides: Partial<OnboardingState> = {}): OnboardingState {
  return {
    entry: {
      email: "",
      registeredEmail: "",
      dialCode: "+1",
      phone: "",
      signInEmail: "",
      accountCreated: false,
      hasAuthenticated: false,
    },
    offer: { response: "accepted", respondedAt: "2027-03-01", shared: false },
    whoYouAre: {
      preferredName: "Alex",
      pronouns: "they/them",
      dialCode: "+1",
      phone: "555 123 4567",
      studentStatus: "us-citizen",
      idDocuments: [{ name: "passport.pdf", size: 100 }],
      submitted: true,
    },
    health: {
      accommodations: "no",
      accommodationNote: "",
      medicalDocuments: [],
      immunizationDocuments: [{ name: "shots.pdf", size: 100 }],
      submitted: true,
    },
    whereYouLive: {
      street: "12 Chapel Street",
      unit: "",
      city: "san-francisco",
      state: "CA",
      postalCode: "94103",
      country: "US",
      residencyVerification: "permanent-address",
      submitted: true,
    },
    whoWeCall: {
      emergencyContacts: [
        {
          id: "contact-1",
          fullName: "Marta Rivera",
          relationship: "parent",
          dialCode: "+1",
          phone: "555 999 0000",
        },
      ],
      familyAccess: [],
      submitted: true,
    },
    housing: { residenceRanking: ["linden-house", "kestrel-hall"], submitted: true },
    campusLife: { interests: ["chess-club"], submitted: true },
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
    ...overrides,
  };
}

describe("the sections", () => {
  it("walks this student's spine, not the whole one", () => {
    const international = state({
      whoYouAre: { ...state().whoYouAre, studentStatus: "international" },
    });
    /* An international student's summary has no address section, rather than an
       address section saying "not applicable". */
    expect(buildSummary(international).map((section) => section.id)).not.toContain(
      "where-you-live",
    );
    expect(buildSummary(state()).map((section) => section.id)).toContain("where-you-live");
  });

  it("leaves the Closing out, because it is the screen doing the reading", () => {
    const ids = buildSummary(state()).map((section) => section.id);
    expect(ids).not.toContain("review");
    expect(ids).not.toContain("deposit");
    expect(ids).not.toContain("enrolled");
  });

  it("carries each Step's minutes and required flag from the spine", () => {
    for (const section of buildSummary(state())) {
      expect(section.minutes).toBeGreaterThan(0);
      expect(typeof section.required).toBe("boolean");
    }
  });
});

describe("the one-line digest", () => {
  it("gives every section something to say when it is closed", () => {
    for (const section of buildSummary(state())) {
      expect(section.digest.length, section.id).toBeGreaterThan(0);
    }
  });

  it("names the first-ranked residence and the number ranked", () => {
    const housing = buildSummary(state()).find((section) => section.id === "housing");
    expect(housing?.digest).toContain("Linden House");
    expect(housing?.digest).toContain("2 ranked");
  });

  it("says what a skipped section was skipped as", () => {
    const skipped = state({
      health: { ...state().health, accommodations: "", submitted: false },
    });
    const health = buildSummary(skipped).find((section) => section.id === "health");
    expect(health?.digest).toBe("Skipped");
  });

  it("prints the address in the words a person reads, not the stored codes", () => {
    const live = buildSummary(state()).find((section) => section.id === "where-you-live");
    expect(live?.digest).toContain("San Francisco");
    expect(live?.digest).toContain("California");
    expect(live?.digest).not.toContain("san-francisco");
  });
});

describe("the two counts", () => {
  it("counts answers across sections", () => {
    const sections = buildSummary(state());
    const counts = summaryCounts(sections);
    expect(counts.sections).toBe(sections.length);
    expect(counts.answers).toBe(
      sections.reduce((total, section) => total + section.rows.length, 0),
    );
  });

  it("reports nothing outstanding for a complete student", () => {
    expect(summaryCounts(buildSummary(state())).attention).toBe(0);
  });

  it("counts a required Step with a gap as needing attention", () => {
    const missing = state({
      whoYouAre: { ...state().whoYouAre, idDocuments: [], submitted: false },
    });
    expect(summaryCounts(buildSummary(missing)).attention).toBe(1);
  });

  it("does not call a skipped optional Step a problem", () => {
    /* Telling a student that skipping an optional Quest "needs attention" is the
       flow contradicting its own word. */
    const skipped = state({
      campusLife: { interests: [], submitted: false },
    });
    const section = buildSummary(skipped).find((entry) => entry.id === "campus-life");
    expect(section?.status).toBe("skipped");
    expect(summaryCounts(buildSummary(skipped)).attention).toBe(0);
  });
});

describe("what opens by default", () => {
  it("opens anything with a problem", () => {
    const missing = state({
      whoYouAre: { ...state().whoYouAre, idDocuments: [], submitted: false },
    });
    const section = buildSummary(missing).find((entry) => entry.id === "who-you-are");
    expect(section && opensByDefault(section)).toBe(true);
  });

  it("closes a long, clean section and lets its digest speak", () => {
    const section = buildSummary(state()).find((entry) => entry.id === "who-you-are");
    expect(section?.rows.length).toBeGreaterThan(3);
    expect(section && opensByDefault(section)).toBe(false);
  });
});
