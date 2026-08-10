/**
 * Static fixtures. There is no API in this prototype — every value the
 * institution "already knows" is hardcoded here, sourced from the field
 * inventory in `raw/data/2026-08-08-audentra-student-portal-fields.md` and the
 * live capture in `raw/research/2026-08-10-current-onboarding-flow-capture.md`
 * of the VEKEND context repo.
 *
 * Single tenant, hardcoded: Aster University. Multi-tenant is a platform
 * concern, not a UX question this prototype is asking.
 */

export const institution = {
  name: "Aster University",
  short: "Aster",
  admissionsEmail: "admissions@aster.edu",
  housingOffice: "Housing Services",
} as const;

export const offer = {
  programme: "Computer Science",
  programmeDescription:
    "Four years, project-led. You build software with other people from your first term, not your third.",
  degree: "Bachelor of Science",
  startingTerm: "Fall 2027",
  campus: "Main Campus",
  responseDeadline: "2027-05-01",
  depositAmount: 500,
  depositCurrency: "USD",
} as const;

/**
 * What Aster already holds from the application. Anything with `onRecord: true`
 * renders read-only — the Registrar owns it, not the student (RN-PR-01/02).
 */
export const studentRecord = {
  applicationId: "AST-2027-014882",
  legalFirstName: "Alex",
  legalLastName: "Rivera",
  dateOfBirth: "2009-03-14",
  personalEmail: "alex.rivera@example.com",
  onRecord: {
    legalName: true,
    dateOfBirth: true,
    personalEmail: true,
  },
} as const;

export type Residence = {
  id: string;
  name: string;
  blurb: string;
  detail: string;
};

export const residences: Residence[] = [
  {
    id: "aster-residence-hall",
    name: "Aster Residence Hall",
    blurb: "Traditional halls, right on the quad",
    detail: "Shared floors · Dining hall attached · 4 min to the Computer Science building",
  },
  {
    id: "aster-apartments",
    name: "Aster Apartments",
    blurb: "Apartment-style with your own kitchen",
    detail: "4-person units · Full kitchen · 12 min walk or 4 min on the campus loop",
  },
  {
    id: "student-village",
    name: "Student Village",
    blurb: "Newest buildings, quietest end of campus",
    detail: "Mostly singles · Study rooms on every floor · 15 min walk",
  },
];

export const housingIntents = [
  {
    value: "on-campus",
    label: "On campus",
    hint: "In an Aster residence",
  },
  {
    value: "off-campus",
    label: "Off campus",
    hint: "Your own place nearby",
  },
  {
    value: "not-sure",
    label: "Not sure yet",
    hint: "You can decide later",
  },
  {
    value: "commuting",
    label: "Commuting",
    hint: "Living at home and travelling in",
  },
  {
    value: "family-housing",
    label: "Family or dependent housing",
    hint: "You'll be living with family or dependents",
  },
] as const;

export type HousingIntent = (typeof housingIntents)[number]["value"];

export const protectionOptions = [
  { value: "not-now", label: "Not now" },
  { value: "compare", label: "Help me compare" },
  { value: "tuition", label: "Tuition protection" },
  { value: "housing", label: "Housing protection" },
  { value: "both", label: "Both" },
] as const;

export const residencyVerificationOptions = [
  {
    value: "permanent-address",
    label: "Review my permanent address",
    hint: "Fastest, if the address above is where you actually live",
  },
  {
    value: "documents",
    label: "I'll provide supporting documents",
    hint: "Enrollment Services will tell you which ones",
  },
  {
    value: "advisor",
    label: "I need an advisor to look at this",
    hint: "Pick this if your situation doesn't fit the other two",
  },
] as const;

export const citizenshipOptions = [
  { value: "us-citizen", label: "U.S. citizen" },
  { value: "permanent-resident", label: "U.S. permanent resident" },
  { value: "eligible-noncitizen", label: "Eligible noncitizen" },
  { value: "international", label: "International student" },
] as const;

export const relationshipOptions = [
  { value: "parent", label: "Parent" },
  { value: "guardian", label: "Guardian" },
  { value: "partner", label: "Partner" },
  { value: "sibling", label: "Sibling" },
  { value: "relative", label: "Other relative" },
  { value: "friend", label: "Friend" },
  { value: "other", label: "Other" },
] as const;

export const disclosureScopeOptions = [
  { value: "enrollment", label: "Enrollment status" },
  { value: "financials", label: "Financial account and payments" },
  { value: "academic", label: "Academic record" },
  { value: "housing", label: "Housing" },
] as const;

export const declineReasons = [
  { value: "another-offer", label: "I accepted another offer" },
  { value: "cost", label: "Cost" },
  { value: "location", label: "Location" },
  { value: "programme", label: "The programme isn't right for me" },
  { value: "personal", label: "Personal circumstances" },
  { value: "other", label: "Something else" },
] as const;

export const countries = [
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "MX", label: "Mexico" },
  { value: "BR", label: "Brazil" },
  { value: "GB", label: "United Kingdom" },
  { value: "IN", label: "India" },
  { value: "NG", label: "Nigeria" },
  { value: "other", label: "Somewhere else" },
] as const;

/** Country calling codes, so nobody has to guess whether "+1 555…" parses. */
export const dialCodes = [
  { value: "+1", label: "+1 · US / CA" },
  { value: "+44", label: "+44 · UK" },
  { value: "+52", label: "+52 · MX" },
  { value: "+55", label: "+55 · BR" },
  { value: "+91", label: "+91 · IN" },
  { value: "+234", label: "+234 · NG" },
] as const;

export function formatDeadline(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
