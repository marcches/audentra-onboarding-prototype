import {
  citizenshipOptions,
  clubs,
  disclosureScopeOptions,
  housingIntents,
  protectionOptions,
  relationshipOptions,
  residences,
  residencyVerificationOptions,
  studentRecord,
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
  rows: SummaryRow[];
};

const NOT_ANSWERED = "Not answered";

function labelFor(
  options: readonly { value: string; label: string }[],
  value: string,
): string | null {
  return options.find((option) => option.value === value)?.label ?? null;
}

function step(id: StepId): Step | undefined {
  return steps.find((candidate) => candidate.id === id);
}

function group(id: StepId, rows: SummaryRow[]): SummaryGroup | null {
  const found = step(id);
  if (!found) return null;
  return { id, label: found.label, path: found.path, rows };
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
  const address = [about.street, about.unit, about.city, about.state, about.postalCode]
    .filter(Boolean)
    .join(", ");

  const contacts = about.emergencyContacts.filter((contact) => contact.fullName.trim());
  const scopes = about.disclosureScope
    .map((value) => labelFor(disclosureScopeOptions, value))
    .filter(Boolean)
    .join(", ");

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
      value: address || "Not given (optional)",
      missing: !address,
    },
    {
      label: "Residency check",
      value: labelFor(residencyVerificationOptions, about.residencyVerification) ?? NOT_ANSWERED,
      missing: !about.residencyVerification,
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
        ? `${about.familyMemberName || "Someone"} — ${scopes || "no categories picked"}`
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

  const rows: SummaryRow[] = [
    {
      label: "Clubs and interests",
      value: picked.length ? picked.join(", ") : "Nothing picked",
      missing: picked.length === 0,
    },
    {
      label: "Accommodations",
      value:
        life.accommodations === "yes"
          ? "Yes — Accessibility Services will be in touch"
          : life.accommodations === "no"
            ? "Not needed right now"
            : NOT_ANSWERED,
      missing: life.accommodations === "",
    },
  ];

  if (life.accommodations === "yes" && life.accommodationNote.trim()) {
    rows.push({ label: "What would help", value: life.accommodationNote.trim() });
  }

  return rows;
}

export function buildSummary(state: OnboardingState): SummaryGroup[] {
  return [
    group("offer", offerRows(state)),
    group("about-you", aboutYouRows(state)),
    group("housing", housingRows(state)),
    group("campus-life", campusLifeRows(state)),
  ].filter((entry): entry is SummaryGroup => entry !== null);
}
