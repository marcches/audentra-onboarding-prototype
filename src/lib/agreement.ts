import {
  disclosureScopeOptions,
  formatDeadline,
  formatMoney,
  institution,
  offer,
  relationshipOptions,
  studentRecord,
  studentStatusOptions,
} from "@/lib/fixtures";
import { residenceById } from "@/lib/housing";
import type { OnboardingState } from "@/lib/store";
import { formatAddress } from "@/lib/summary";

/**
 * The Enrollment Agreement.
 *
 * What Review & sign was missing entirely: a document with the student's own
 * answers inside its sentences, rather than a summary of fields sitting next to
 * a packet of generic text. Reading your own name, your own programme and your
 * own housing ranking inside the clauses is what makes it read as an agreement
 * about you and not a form you filled in.
 *
 * A run is a span of one clause. `emphasis` marks the parts that came from the
 * student — those are set in bold, which is also the audit: anything bold is
 * something they can check against what they entered.
 */
export type Run = { text: string; emphasis?: boolean };

export type Clause = {
  /** Numbered in the document, so a question about it has something to quote. */
  number: string;
  heading: string;
  runs: Run[];
};

const NOT_GIVEN = "not given";

function label(options: readonly { value: string; label: string }[], value: string) {
  return options.find((option) => option.value === value)?.label ?? null;
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function legalName() {
  return `${studentRecord.legalFirstName} ${studentRecord.legalLastName}`;
}

/** Plain text, plain value, emphasised value — the three things a clause is made of. */
const t = (text: string): Run => ({ text });
const v = (text: string): Run => ({ text, emphasis: true });

export function buildAgreement(state: OnboardingState): Clause[] {
  const who = state.whoYouAre;
  const housing = state.housing;

  /* An international student has no `Where you live now` Step, so the clause
     says that rather than printing an empty address it never asked for. */
  const address =
    who.studentStatus === "international"
      ? "the address Admissions holds"
      : formatAddress(state.whereYouLive) || NOT_GIVEN;

  const deposit = formatMoney(offer.depositAmount, offer.depositCurrency);
  const deadline = formatDeadline(offer.responseDeadline);

  const clauses: Clause[] = [
    {
      number: "1",
      heading: "The parties",
      runs: [
        t("This agreement is between "),
        v(institution.name),
        t(" and "),
        v(legalName()),
        t(", born "),
        v(formatDate(studentRecord.dateOfBirth)),
        t(", application number "),
        v(studentRecord.applicationId),
        t(". Correspondence goes to "),
        v(address),
        t(" and to "),
        v(studentRecord.personalEmail),
        t("."),
      ],
    },
    {
      number: "2",
      heading: "The place you are accepting",
      runs: [
        t("You are accepting a place in "),
        v(offer.programme),
        t(" ("),
        v(offer.degree),
        t("), starting "),
        v(offer.startingTerm),
        t(" at "),
        v(offer.campus),
        t(
          ". The place is held for that term. Deferring to a later term is a separate request and is not automatic. Your offer assumes the qualifications in your application are accurate; if they are not, Admissions may revise or withdraw it, and will tell you in writing before doing so.",
        ),
      ],
    },
    {
      number: "3",
      heading: "Your status",
      runs: [
        t("You have told us your status is "),
        v(label(studentStatusOptions, who.studentStatus) ?? NOT_GIVEN),
        t(
          ". This decides which financial aid and visa requirements appear on your checklist. Your residency classification is reviewed by Enrollment Services against the address above, and it affects what you are charged.",
        ),
      ],
    },
    {
      number: "4",
      heading: "Money",
      runs: [
        t("The enrollment deposit of "),
        v(deposit),
        t(
          " secures your place and is credited against your first term's tuition. It is refundable up to ",
        ),
        v(deadline),
        t(
          " and not afterwards. Tuition and fees are set each year and published before registration opens; enrolling does not lock a rate for the length of your programme.",
        ),
      ],
    },
  ];

  clauses.push(housingClause(housing));

  clauses.push(familyAccessClause(state.whoWeCall));

  clauses.push({
    number: "7",
    heading: "What the university expects",
    runs: [
      t(
        `You agree to keep your contact details current, to read what the university sends to your ${institution.short} address, and to follow the student conduct code and the academic integrity policy. Both are published in full and neither is short.`,
      ),
    ],
  });

  clauses.push({
    number: "8",
    heading: "Withdrawing",
    runs: [
      t("You may withdraw at any time before term starts by writing to Admissions at "),
      v(institution.admissionsEmail),
      t(". Withdrawing after "),
      v(deadline),
      t(
        " forfeits the deposit but carries no other charge. Nothing in this agreement limits any right you have under state or federal law.",
      ),
    ],
  });

  return clauses;
}

function housingClause(housing: OnboardingState["housing"]): Clause {
  const ranked = housing.residenceRanking
    .map((id) => residenceById(id)?.name)
    .filter((name): name is string => Boolean(name));

  return {
    number: "5",
    heading: "Housing",
    runs: [
      t("Your shortlist is "),
      v(ranked.length ? ranked.map((name, index) => `${index + 1}. ${name}`).join("; ") : "empty"),
      t(
        `. ${institution.housingOffice} assigns rooms after the response deadline. A shortlist is considered, not guaranteed, and no room is reserved by this agreement.`,
      ),
    ],
  };
}

/**
 * Who else may see the record, one run per person granted access.
 *
 * Family access is a list now, because more than one person can be granted it
 * and each is an independent record with its own scope. A clause that collapsed
 * three grants into "three people" would be a clause the student cannot audit
 * against what they actually entered, which is the whole reason the emphasised
 * runs exist.
 */
function familyAccessClause(call: OnboardingState["whoWeCall"]): Clause {
  if (call.familyAccess.length === 0) {
    return {
      number: "6",
      heading: "Who else may see your record",
      runs: [
        t("You have granted access to "),
        v("nobody"),
        t(
          ". Staff will decline to discuss your record with anyone who asks, including a parent who is paying your fees. You may grant access at any time from your profile.",
        ),
      ],
    };
  }

  const runs: Run[] = [t("You have granted access to the following people. ")];

  for (const grant of call.familyAccess) {
    const relationship = label(relationshipOptions, grant.relationship);
    runs.push(v(grant.fullName || "One person"));
    runs.push(t(" ("));
    runs.push(v(grant.email || NOT_GIVEN));
    runs.push(t(relationship ? `, ${relationship.toLowerCase()}` : ""));
    runs.push(t("), for "));
    runs.push(
      v(
        grant.scope
          .map((value) => label(disclosureScopeOptions, value))
          .filter((name): name is string => Boolean(name))
          .join(", ") || NOT_GIVEN,
      ),
    );
    runs.push(t(". "));
  }

  runs.push(
    t(
      "They receive no account of their own and cannot act for you. You may widen, narrow or withdraw this at any time; withdrawing it does not undo disclosures already made.",
    ),
  );

  return { number: "6", heading: "Who else may see your record", runs };
}

/**
 * The reference the student can quote, issued once at signing.
 *
 * A Result statement carries "the date and any reference the student may need
 * to quote" — that is the Message Library rule this exists to satisfy. Uppercase
 * and digits only, because the split-flap board it lands on has no lower case.
 */
export function issueReference() {
  const random = Math.floor(Math.random() * 36 ** 4)
    .toString(36)
    .toUpperCase()
    .padStart(4, "0");
  return `ENR-${new Date().getFullYear()}-${random}`;
}
