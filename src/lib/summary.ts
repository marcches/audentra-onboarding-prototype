import {
  citiesByState,
  citizenshipOptions,
  clubs,
  disclosureScopeOptions,
  protectionOptions,
  relationshipOptions,
  residences,
  residencyVerificationOptions,
  studentRecord,
  type UsStateCode,
  usStates,
} from "@/lib/fixtures";
import { type PhaseId, phases, type StepId } from "@/lib/steps";
import type { OnboardingState } from "@/lib/store";

/**
 * The review summary, built from what the prototype actually stored.
 *
 * Every row is derived from `localStorage`, never invented: a summary that
 * lists fields the flow never captured is worse than no summary, because it
 * teaches people not to read it. Anything genuinely unanswered says so and
 * links to the step where it lives.
 */
export type SummaryRow = {
  label: string;
  value: string;
  /** True when the student skipped it, so the row can read as a gap not a fact. */
  missing?: boolean;
};

/** One Quest's worth of answers, with the route that edits them. */
export type SummaryGroup = {
  id: StepId;
  label: string;
  path: string;
  rows: SummaryRow[];
};

/**
 * A Phase's worth of Quests.
 *
 * The summary is grouped the way the flow is grouped, because the student
 * checking it is remembering the flow, not a list of routes. What is *not* here
 * any more is the per-Quest time estimate and required/optional tag: both moved
 * to the Phase rows in the rail, where they answer "what am I in for" before the
 * work rather than reporting it back afterwards, when neither can be acted on.
 */
export type SummarySection = {
  id: PhaseId;
  label: string;
  groups: SummaryGroup[];
};

const NOT_ANSWERED = "Not answered";

function labelFor(
  options: readonly { value: string; label: string }[],
  value: string,
): string | null {
  return options.find((option) => option.value === value)?.label ?? null;
}

/**
 * The permanent address, in the words a person reads rather than the values a
 * `<select>` stores. State and city are cascading selects now (see About
 * you's residence section), so what's in `identityContact.state`/`.city` is a postal
 * abbreviation and a slug — "CA", "los-angeles" — never what the agreement or
 * the summary should print.
 */
export function formatAddress(about: OnboardingState["identityContact"]): string {
  const stateLabel = labelFor(usStates, about.state) ?? about.state;
  const cityLabel =
    citiesByState[about.state as UsStateCode]?.find((option) => option.value === about.city)
      ?.label ?? about.city;
  return [about.street, about.unit, cityLabel, stateLabel, about.postalCode]
    .filter(Boolean)
    .join(", ");
}

function offerRows(state: OnboardingState): SummaryRow[] {
  const { response } = state.offer;
  return [
    {
      label: "Your answer",
      value:
        response === "accepted" ? "Accepted" : response === "declined" ? "Declined" : NOT_ANSWERED,
      missing: response === null,
    },
  ];
}

function identityContactRows(state: OnboardingState): SummaryRow[] {
  const about = state.identityContact;
  const international = about.citizenship === "international";
  const address = formatAddress(about);

  const contacts = about.emergencyContacts.filter((contact) => contact.fullName.trim());
  const scopes = about.disclosureScope
    .map((value) => labelFor(disclosureScopeOptions, value))
    .filter(Boolean)
    .join(", ");
  const familyRelationship = labelFor(relationshipOptions, about.familyMemberRelationship);

  return [
    {
      label: "Legal name",
      value: `${studentRecord.legalFirstName} ${studentRecord.legalLastName}`,
    },
    {
      label: "Preferred name",
      value: about.preferredName || "Same as legal name",
    },
    {
      label: "Mobile",
      value: about.phone ? `${about.dialCode} ${about.phone}` : NOT_ANSWERED,
      missing: !about.phone,
    },
    {
      label: "Citizenship",
      value: labelFor(citizenshipOptions, about.citizenship) ?? NOT_ANSWERED,
      missing: !about.citizenship,
    },
    {
      label: "Permanent address",
      value: international ? "Not applicable — international student" : address || NOT_ANSWERED,
      missing: !international && !address,
    },
    {
      label: "Residency check",
      value: international
        ? "Not applicable — international student"
        : (labelFor(residencyVerificationOptions, about.residencyVerification) ?? NOT_ANSWERED),
      missing: !international && !about.residencyVerification,
    },
    {
      label: "Emergency contact",
      value: contacts.length
        ? contacts
            .map((contact) => {
              const relationship = labelFor(relationshipOptions, contact.relationship);
              return relationship ? `${contact.fullName} (${relationship})` : contact.fullName;
            })
            .join(", ")
        : NOT_ANSWERED,
      missing: contacts.length === 0,
    },
    {
      label: "Family access",
      value: about.grantsFamilyAccess
        ? `${about.familyMemberName || "Someone"}${familyRelationship ? ` (${familyRelationship})` : ""} — ${scopes || "no categories picked"}`
        : "Nobody has access",
    },
  ];
}

function housingRows(state: OnboardingState): SummaryRow[] {
  const housing = state.housing;

  if (housing.arrangingOwn) {
    return [
      { label: "Where you'll live", value: "Arranging your own housing" },
      {
        label: "Tuition / housing protection",
        value: labelFor(protectionOptions, housing.protectionInterest) ?? NOT_ANSWERED,
        missing: !housing.protectionInterest,
      },
    ];
  }

  const ranked = housing.residenceRanking
    .map((id) => residences.find((residence) => residence.id === id)?.name)
    .filter(Boolean);

  return [
    {
      label: "Shortlist",
      // A middle dot, not the double space this used to use: HTML collapses
      // runs of whitespace, so the separator was invisible and the shortlist
      // arrived as one run-on line at the moment it is meant to be checked.
      value: ranked.length
        ? ranked.map((name, index) => `${index + 1}. ${name}`).join(" · ")
        : "No preference given",
      missing: ranked.length === 0,
    },
  ];
}

function campusLifeRows(state: OnboardingState): SummaryRow[] {
  const life = state.campusLife;
  const picked = life.clubs.map((id) => clubs.find((club) => club.id === id)?.name).filter(Boolean);

  return [
    {
      label: "Clubs and interests",
      value: picked.length ? picked.join(", ") : "Nothing picked",
      missing: picked.length === 0,
    },
  ];
}

function healthRows(state: OnboardingState): SummaryRow[] {
  const health = state.health;

  const rows: SummaryRow[] = [
    {
      label: "Accommodations",
      value:
        health.accommodations === "yes"
          ? "Yes — Accessibility Services will be in touch"
          : health.accommodations === "no"
            ? "Not needed right now"
            : "Skipped in onboarding",
      missing: false,
    },
  ];

  if (health.accommodations === "yes") {
    if (health.accommodationNote.trim()) {
      rows.push({ label: "What would help", value: health.accommodationNote.trim() });
    }
    rows.push({
      label: "Medical documentation",
      value: health.medicalDocuments.length
        ? `${health.medicalDocuments.length} ${health.medicalDocuments.length === 1 ? "file" : "files"} attached`
        : "Nothing attached",
      missing: health.medicalDocuments.length === 0,
    });
    rows.push({
      label: "Immunization record",
      value: health.immunizationDocuments.length
        ? `${health.immunizationDocuments.length} ${health.immunizationDocuments.length === 1 ? "file" : "files"} attached`
        : "Nothing attached",
      missing: health.immunizationDocuments.length === 0,
    });
  }

  return rows;
}

/**
 * Which Quests read back, and how.
 *
 * The Closing is absent on purpose: Review & sign is the screen doing the
 * reading, and Deposit is settled after it. A summary that listed itself would
 * be a mirror facing a mirror.
 */
const ROWS: Partial<Record<StepId, (state: OnboardingState) => SummaryRow[]>> = {
  offer: offerRows,
  "identity-contact": identityContactRows,
  health: healthRows,
  housing: housingRows,
  "campus-life": campusLifeRows,
};

/**
 * Built by walking the spine, not by listing the Quests again here.
 *
 * The order is `steps.ts`'s order, which is also the order they were answered
 * in — a summary that reads back in a different order than it was filled in
 * makes checking it harder than it needs to be, and the previous hand-written
 * list could drift from the flow without anything failing to build.
 */
export function buildSummary(state: OnboardingState): SummarySection[] {
  return phases
    .map((phase) => ({
      id: phase.id,
      label: phase.label,
      groups: phase.steps.flatMap((entry) => {
        const rows = ROWS[entry.id];
        return rows
          ? [{ id: entry.id, label: entry.label, path: entry.path, rows: rows(state) }]
          : [];
      }),
    }))
    .filter((section) => section.groups.length > 0);
}
