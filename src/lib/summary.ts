import { organizationById } from "@/lib/catalogue";
import {
  citiesByState,
  disclosureScopeOptions,
  relationshipOptions,
  residencyVerificationOptions,
  studentRecord,
  studentStatusOptions,
  type UsStateCode,
  usStates,
} from "@/lib/fixtures";
import { residenceById } from "@/lib/housing";
import { type StepId, stepById, steps } from "@/lib/steps";
import type { OnboardingState } from "@/lib/store";
import { addressSchemaFor } from "@/lib/validation";

/**
 * The review summary, built from what the prototype actually stored.
 *
 * Every row is derived from `localStorage`, never invented: a summary that
 * lists fields the flow never captured is worse than no summary, because it
 * teaches people not to read it. Anything genuinely unanswered says so and
 * links to the Step where it lives.
 *
 * What changed in the rebuild: a section is now **one Step**, not one Phase.
 * Each carries a status, a one-line digest for when it is closed, and its own
 * single edit control. A collapsed section that says nothing is a section the
 * student has to open to check, which defeats collapsing it.
 */

export type SummaryRow = {
  label: string;
  value: string;
  /** True when the student skipped it, so the row can read as a gap not a fact. */
  missing?: boolean;
  /**
   * A long free-text answer. It gets a full-width block rather than a
   * definition-list cell — prose squeezed into a two-column list is what makes
   * a summary unreadable (Origin).
   */
  long?: boolean;
};

export type SectionStatus = "complete" | "attention" | "skipped";

/** One Quest's worth of answers, with the route that edits them. */
export type SummarySection = {
  id: StepId;
  label: string;
  path: string;
  minutes: number;
  required: boolean;
  rows: SummaryRow[];
  status: SectionStatus;
  /**
   * One line that stands in for the section when it is closed — "Sunrise Hall ·
   * Single · 3 preferences". Remote's group headers carry their own state for
   * the same reason: a closed group still has to say something.
   */
  digest: string;
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
 * `<select>` stores. State and city are cascading selects, so what is stored is
 * a postal abbreviation and a slug — "CA", "los-angeles" — never what the
 * agreement or the summary should print.
 */
export function formatAddress(live: OnboardingState["whereYouLive"]): string {
  const stateLabel = labelFor(usStates, live.state) ?? live.state;
  const cityLabel =
    citiesByState[live.state as UsStateCode]?.find((option) => option.value === live.city)?.label ??
    live.city;
  return [live.street, live.unit, cityLabel, stateLabel, live.postalCode]
    .filter(Boolean)
    .join(", ");
}

/* -------------------------------------------------------------------------
   Rows, per Step
   ---------------------------------------------------------------------- */

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

/**
 * Who you are, including the address for the students it applies to.
 *
 * The address had its own section here while it had its own Step. It reads back
 * under the Step the student answered it on, which is the whole point of a
 * summary — and for an international student the two rows are absent rather
 * than present and marked "not applicable", the same rule
 * `addressSchemaFor()` applies to validation.
 */
function whoYouAreRows(state: OnboardingState): SummaryRow[] {
  const who = state.whoYouAre;
  const live = state.whereYouLive;
  const status = labelFor(studentStatusOptions, who.studentStatus);

  const rows: SummaryRow[] = [
    {
      label: "Legal name",
      value: `${studentRecord.legalFirstName} ${studentRecord.legalLastName}`,
    },
    { label: "Preferred name", value: who.preferredName || "Same as legal name" },
    { label: "Pronouns", value: who.pronouns || "Not given" },
    {
      label: "Mobile",
      value: who.phone ? `${who.dialCode} ${who.phone}` : NOT_ANSWERED,
      missing: !who.phone,
    },
    {
      label: "Student status",
      value: status ?? NOT_ANSWERED,
      missing: !who.studentStatus,
    },
    {
      label: "Identity document",
      value: who.idDocuments.length
        ? `${who.idDocuments.length} ${who.idDocuments.length === 1 ? "file" : "files"} attached`
        : "Nothing attached",
      missing: who.idDocuments.length === 0,
    },
  ];

  if (addressSchemaFor(who.studentStatus)) {
    const address = formatAddress(live);
    rows.push(
      { label: "Permanent address", value: address || NOT_ANSWERED, missing: !address },
      {
        label: "Residency check",
        value: labelFor(residencyVerificationOptions, live.residencyVerification) ?? NOT_ANSWERED,
        missing: !live.residencyVerification,
      },
    );
  }

  return rows;
}

function healthRows(state: OnboardingState): SummaryRow[] {
  const health = state.health;

  const rows: SummaryRow[] = [
    {
      label: "Accommodations",
      value:
        health.accommodations === "yes"
          ? "Yes, Accessibility Services will be in touch"
          : health.accommodations === "no"
            ? "Not needed right now"
            : "Skipped in onboarding",
    },
  ];

  if (health.accommodations === "yes") {
    if (health.accommodationNote.trim()) {
      rows.push({ label: "What would help", value: health.accommodationNote.trim(), long: true });
    }
    rows.push({
      label: "Medical documentation",
      value: health.medicalDocuments.length
        ? `${health.medicalDocuments.length} attached`
        : "Nothing attached",
      missing: health.medicalDocuments.length === 0,
    });
  }

  rows.push({
    label: "Immunization record",
    value: health.immunizationDocuments.length
      ? `${health.immunizationDocuments.length} attached`
      : "Nothing attached, the portal will ask later",
  });

  return rows;
}

function whoWeCallRows(state: OnboardingState): SummaryRow[] {
  const call = state.whoWeCall;
  const contacts = call.emergencyContacts.filter((contact) => contact.fullName.trim());

  const rows: SummaryRow[] = [
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
  ];

  if (call.familyAccess.length === 0) {
    rows.push({ label: "Family access", value: "Nobody has access" });
  } else {
    for (const grant of call.familyAccess) {
      const relationship = labelFor(relationshipOptions, grant.relationship);
      const scopes = grant.scope
        .map((value) => labelFor(disclosureScopeOptions, value))
        .filter(Boolean)
        .join(", ");
      rows.push({
        label: `Access for ${grant.fullName || "someone"}`,
        value: `${relationship ? `${relationship}, ` : ""}${grant.email || "no email"} · ${scopes || "no categories picked"}`,
        missing: !grant.fullName || !grant.email || grant.scope.length === 0,
        long: true,
      });
    }
  }

  return rows;
}

function housingRows(state: OnboardingState): SummaryRow[] {
  const ranked = state.housing.residenceRanking
    .map((id) => residenceById(id)?.name)
    .filter(Boolean);

  return [
    {
      label: "Shortlist",
      value: ranked.length
        ? ranked.map((name, index) => `${index + 1}. ${name}`).join(" · ")
        : "No preference given",
      missing: ranked.length === 0,
    },
    {
      label: "What that means",
      value: "A request, not an assignment. Housing Services assigns after the deadline.",
    },
  ];
}

function campusLifeRows(state: OnboardingState): SummaryRow[] {
  const marked = state.campusLife.interests.map((id) => organizationById(id)?.name).filter(Boolean);

  return [
    {
      label: "Interested in",
      value: marked.length ? marked.join(", ") : "Nothing marked",
      long: marked.length > 3,
    },
    {
      label: "What that means",
      value: "A route through the Involvement Fair. Not a membership.",
    },
  ];
}

/* -------------------------------------------------------------------------
   Digests
   ---------------------------------------------------------------------- */

const DIGEST: Partial<Record<StepId, (state: OnboardingState) => string>> = {
  offer: (state) =>
    state.offer.response === "accepted"
      ? "Accepted"
      : state.offer.response === "declined"
        ? "Declined"
        : "No answer yet",
  "who-you-are": (state) => {
    const status = labelFor(studentStatusOptions, state.whoYouAre.studentStatus) ?? "No status";
    const name = state.whoYouAre.preferredName || studentRecord.legalFirstName;
    const documents = state.whoYouAre.idDocuments.length;
    const parts = [name, status, `${documents} document${documents === 1 ? "" : "s"}`];
    if (addressSchemaFor(state.whoYouAre.studentStatus)) {
      parts.push(formatAddress(state.whereYouLive) || "no address");
    }
    return parts.join(" · ");
  },
  health: (state) =>
    state.health.accommodations === "yes"
      ? "Accommodation requested"
      : state.health.accommodations === "no"
        ? "No accommodation needed"
        : "Skipped",
  "who-we-call": (state) => {
    const contacts = state.whoWeCall.emergencyContacts.filter((c) => c.fullName.trim()).length;
    const grants = state.whoWeCall.familyAccess.length;
    return `${contacts} emergency contact${contacts === 1 ? "" : "s"} · ${grants === 0 ? "nobody has access" : `${grants} with access`}`;
  },
  housing: (state) => {
    const ranked = state.housing.residenceRanking
      .map((id) => residenceById(id)?.name)
      .filter(Boolean);
    return ranked.length ? `${ranked[0]} first · ${ranked.length} ranked` : "No preference given";
  },
  "campus-life": (state) => {
    const count = state.campusLife.interests.length;
    return count === 0 ? "Nothing marked" : `${count} organization${count === 1 ? "" : "s"} marked`;
  },
};

/* -------------------------------------------------------------------------
   Assembly
   ---------------------------------------------------------------------- */

/**
 * Which Quests read back, and how.
 *
 * The Closing is absent on purpose: Review & sign is the screen doing the
 * reading and Deposit is settled after it. A summary that listed itself would
 * be a mirror facing a mirror. Enrolled is absent for the same reason.
 */
const ROWS: Partial<Record<StepId, (state: OnboardingState) => SummaryRow[]>> = {
  offer: offerRows,
  "who-you-are": whoYouAreRows,
  health: healthRows,
  "who-we-call": whoWeCallRows,
  housing: housingRows,
  "campus-life": campusLifeRows,
};

function statusOf(id: StepId, rows: SummaryRow[], state: OnboardingState): SectionStatus {
  if (rows.some((row) => row.missing)) {
    /* An optional Step nobody filled in is skipped, not broken. Telling a
       student that skipping an optional Quest "needs attention" is the flow
       contradicting its own word. */
    return stepById(id).required ? "attention" : "skipped";
  }
  return submitted(id, state) ? "complete" : "skipped";
}

function submitted(id: StepId, state: OnboardingState): boolean {
  switch (id) {
    case "offer":
      return state.offer.response !== null;
    case "who-you-are":
      return state.whoYouAre.submitted;
    case "health":
      return state.health.submitted;
    case "who-we-call":
      return state.whoWeCall.submitted;
    case "housing":
      return state.housing.submitted;
    case "campus-life":
      return state.campusLife.submitted;
    default:
      return false;
  }
}

/**
 * Built by walking the spine, not by listing the Quests again here.
 *
 * The spine is one list for every student now. What varies is inside `Who you
 * are`: for an international student the two address rows are absent rather
 * than present and marked "not applicable" — the same rule, one level down from
 * where it used to be.
 */
export function buildSummary(state: OnboardingState): SummarySection[] {
  return steps.flatMap((step) => {
    const rows = ROWS[step.id];
    if (!rows) return [];
    const built = rows(state);
    return [
      {
        id: step.id,
        label: step.label,
        path: step.path,
        minutes: step.minutes,
        required: step.required,
        rows: built,
        status: statusOf(step.id, built, state),
        digest: DIGEST[step.id]?.(state) ?? "",
      },
    ];
  });
}

/**
 * The completeness line: "14 answers across 5 sections · 1 needs attention".
 *
 * Both numbers are derived from the sections rather than counted by hand,
 * because the screen's whole job is to tell the student whether they are done
 * and a count that can drift is worse than no count.
 */
export function summaryCounts(sections: SummarySection[]) {
  return {
    answers: sections.reduce((total, section) => total + section.rows.length, 0),
    sections: sections.length,
    attention: sections.filter((section) => section.status === "attention").length,
  };
}

/**
 * Which sections open by default: those with a problem, and those short enough
 * that opening them costs nothing. Long, clean sections start closed and speak
 * through their digest (Employment Hero, Dialpad).
 */
export function opensByDefault(section: SummarySection): boolean {
  return section.status === "attention" || section.rows.length <= 3;
}
