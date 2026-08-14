import {
  citiesByState,
  citizenshipOptions,
  clubs,
  disclosureScopeOptions,
  housingIntents,
  protectionOptions,
  relationshipOptions,
  residences,
  residencyVerificationOptions,
  studentRecord,
  type UsStateCode,
  usStates,
} from "@/lib/fixtures";
import { type Step, type StepId, steps } from "@/lib/steps";
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

export type SummaryGroup = {
  id: StepId;
  label: string;
  path: string;
  /** Read from `steps.ts` — the one place these can be changed. */
  timeEstimateMinutes: number;
  required: boolean;
  points: number;
  rows: SummaryRow[];
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
 * you's residence section), so what's in `aboutYou.state`/`.city` is a postal
 * abbreviation and a slug — "CA", "los-angeles" — never what the agreement or
 * the summary should print.
 */
export function formatAddress(about: OnboardingState["aboutYou"]): string {
  const stateLabel = labelFor(usStates, about.state) ?? about.state;
  const cityLabel =
    citiesByState[about.state as UsStateCode]?.find((option) => option.value === about.city)
      ?.label ?? about.city;
  return [about.street, about.unit, cityLabel, stateLabel, about.postalCode]
    .filter(Boolean)
    .join(", ");
}

function step(id: StepId): Step | undefined {
  return steps.find((candidate) => candidate.id === id);
}

function group(id: StepId, rows: SummaryRow[]): SummaryGroup | null {
  const found = step(id);
  if (!found) return null;
  return {
    id,
    label: found.label,
    path: found.path,
    timeEstimateMinutes: found.timeEstimateMinutes,
    required: found.required,
    points: found.points,
    rows,
  };
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

function aboutYouRows(state: OnboardingState): SummaryRow[] {
  const about = state.aboutYou;
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
  const intentLabel = housing.intent ? labelFor(housingIntents, housing.intent) : null;

  const rows: SummaryRow[] = [
    {
      label: "Where you'll live",
      value: intentLabel ?? NOT_ANSWERED,
      missing: !intentLabel,
    },
  ];

  if (housing.intent === "on-campus") {
    const ranked = housing.residenceRanking
      .map((id) => residences.find((residence) => residence.id === id)?.name)
      .filter(Boolean);
    rows.push({
      label: "Residence ranking",
      // A middle dot, not the double space this used to use: HTML collapses
      // runs of whitespace, so the separator was invisible and the ranking
      // arrived as one run-on line at the moment it is meant to be checked.
      value: ranked.length
        ? ranked.map((name, index) => `${index + 1}. ${name}`).join(" · ")
        : "No preference given",
      missing: ranked.length === 0,
    });
  }

  if (housing.intent === "off-campus") {
    rows.push({
      label: "Tuition / housing protection",
      value: labelFor(protectionOptions, housing.protectionInterest) ?? NOT_ANSWERED,
      missing: !housing.protectionInterest,
    });
  }

  return rows;
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

export function buildSummary(state: OnboardingState): SummaryGroup[] {
  return [
    group("offer", offerRows(state)),
    group("about-you", aboutYouRows(state)),
    group("housing", housingRows(state)),
    group("campus-life", campusLifeRows(state)),
    group("health", healthRows(state)),
  ].filter((entry): entry is SummaryGroup => entry !== null);
}
