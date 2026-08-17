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

/**
 * The platform, as distinct from the tenant.
 *
 * Needed because the entry screen cannot route anyone to an institution's
 * Admissions office: it does not know which institution they belong to until
 * they authenticate, exactly as it does not know who they are. Before the login
 * the only party on the screen is Audentra, so the only help route is Audentra's.
 */
export const platform = {
  name: "Audentra",
  supportEmail: "support@audentra.com",
} as const;

/**
 * Aster is invented, and stays invented.
 *
 * Every number in this file derives from ADR 0005's ~7,000 undergraduates, and
 * a real university's crest, name and arms are that university's registered
 * trademark — an awkward thing to have on screen when the demo is shown to a
 * different university.
 *
 * `founded` and `motto` are here because the crest draws them, and a crest
 * carrying a year and a motto that the rest of the product has never heard of
 * is a drawing rather than an institution. Latin, ablative, and chosen for the
 * flower the place is named after: *aster* is Greek for star.
 */
export const institution = {
  name: "Aster University",
  short: "Aster",
  admissionsEmail: "admissions@aster.edu",
  housingOffice: "Housing Services",
  founded: 1867,
  motto: "Sidere et studio",
  mottoEnglish: "By the star, and by the work",
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

/**
 * A photograph shipped from `public/images`. The alt text is part of the
 * fixture rather than the component: it describes what is in the frame, which
 * is a property of the photo, and it changes when the photo changes.
 * Provenance and licence for every file are in `public/images/CREDITS.md`.
 */
export type Photo = {
  src: string;
  alt: string;
};

/**
 * Keyed by **what is in the frame**, not by the screen that shows it. The Offer
 * and the portal's academic block both draw the lawn, and they draw the same
 * file deliberately: it is the same campus, and one photograph appearing on both
 * sides of the login is a small part of what makes the two surfaces one product.
 * A key named after a screen would have made the second use look like a
 * borrowing.
 *
 * The completion screen keeps none of these: every candidate put mid-tones
 * behind the largest type on the screen, so it runs on a dark field with
 * `LightRays` over it instead.
 */
export const campusPhotos = {
  lawn: {
    src: "/images/campus/offer-campus.webp",
    alt: "A broad green lawn shaded by a large spreading tree, with brick campus buildings behind it",
  },
} as const satisfies Record<string, Photo>;

/**
 * Every branching radio in the flow carries its consequence in its own label
 * rather than in a footnote below the group — Fiverr's "U.S. tax authorities
 * might request Form W-9" is the pattern, and a footnote under a group of three
 * is read by nobody choosing between them.
 */
export const residencyVerificationOptions = [
  {
    value: "permanent-address",
    label: "Use the address above",
    consequence: "Fastest, if that is genuinely where you live.",
  },
  {
    value: "documents",
    label: "I will send supporting documents",
    consequence: "Enrollment Services will write to you with the list.",
  },
  {
    value: "advisor",
    label: "I need an advisor to look at this",
    consequence: "Pick this if your situation does not fit the other two.",
  },
] as const;

/**
 * Student status: the answer that decides which Identity document is requested
 * and whether `Where you live now` exists at all. Three values, matching
 * `StudentStatus` in `steps.ts` — the fourth ("eligible noncitizen") went with
 * the rebuild, because the flow had no branch for it and offering an answer
 * nothing acts on is worse than not asking.
 */
export const studentStatusOptions = [
  {
    value: "us-citizen",
    label: "U.S. citizen",
    consequence: "We will ask for your U.S. passport.",
    document: "U.S. passport",
    documentLabel: "Your U.S. passport",
  },
  {
    value: "permanent-resident",
    label: "U.S. permanent resident",
    consequence: "We will ask for your state-issued driver's licence.",
    document: "driver's licence",
    documentLabel: "Your driver's licence",
  },
  {
    value: "international",
    label: "International student",
    consequence: "We will ask for your home country passport. No U.S. address needed.",
    document: "home country passport",
    documentLabel: "Your home country passport",
  },
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

/**
 * What a FERPA release can actually be scoped to.
 *
 * Modelled on the categories U.S. universities put on their own release forms,
 * worded as the thing rather than as the department that owns it — a student
 * ticking a box called "Student Financial Services" has not been told what they
 * are giving away. Each carries the line that says what it means, because
 * "Academic record" and "your grades, every term" are the same box and only one
 * of them is an informed decision (Square's scoped-permission panels).
 *
 * `sensitive` is not styling. Health and conduct are the two a student is most
 * likely to hand a parent by reflex and regret specifically, so they are drawn
 * apart, they are never pre-ticked, and nothing in the UI may ever tick them in
 * a batch with the others. The flag is what makes that a property of the
 * fixture rather than a habit of whoever writes the next control.
 */
export const disclosureScopeOptions = [
  {
    value: "enrollment",
    label: "Enrollment status",
    hint: "Whether you are registered, full-time or part-time, and which programme. Not your grades.",
    sensitive: false,
  },
  {
    value: "academic",
    label: "Grades and academic record",
    hint: "Your grades each term, your transcript and your academic standing.",
    sensitive: false,
  },
  {
    value: "financials",
    label: "Billing and financial aid",
    hint: "What you owe, what you have paid, and any aid you hold. Not your grades.",
    sensitive: false,
  },
  {
    value: "housing",
    label: "Housing",
    hint: "Which residence you are assigned and your move-in window.",
    sensitive: false,
  },
  {
    value: "health",
    label: "Health and disability services",
    hint: "Accommodations, and anything you have told Accessibility Services.",
    sensitive: true,
  },
  {
    value: "conduct",
    label: "Disciplinary record",
    hint: "Conduct cases involving you, and how they were resolved.",
    sensitive: true,
  },
] as const;

export type DisclosureScope = (typeof disclosureScopeOptions)[number]["value"];

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

/**
 * States and a representative slice of cities per state — not exhaustive, a
 * plausible pass so the cascading select has real options to show. Values are
 * the USPS abbreviation and a lowercase slug respectively, neither of which a
 * student ever sees.
 */
export const usStates = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "DC", label: "District of Columbia" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
] as const;

export type UsStateCode = (typeof usStates)[number]["value"];

export const citiesByState: Record<UsStateCode, { value: string; label: string }[]> = {
  AL: [
    { value: "birmingham", label: "Birmingham" },
    { value: "montgomery", label: "Montgomery" },
    { value: "huntsville", label: "Huntsville" },
  ],
  AK: [
    { value: "anchorage", label: "Anchorage" },
    { value: "fairbanks", label: "Fairbanks" },
    { value: "juneau", label: "Juneau" },
  ],
  AZ: [
    { value: "phoenix", label: "Phoenix" },
    { value: "tucson", label: "Tucson" },
    { value: "mesa", label: "Mesa" },
  ],
  AR: [
    { value: "little-rock", label: "Little Rock" },
    { value: "fayetteville", label: "Fayetteville" },
    { value: "fort-smith", label: "Fort Smith" },
  ],
  CA: [
    { value: "los-angeles", label: "Los Angeles" },
    { value: "san-francisco", label: "San Francisco" },
    { value: "san-diego", label: "San Diego" },
  ],
  CO: [
    { value: "denver", label: "Denver" },
    { value: "colorado-springs", label: "Colorado Springs" },
    { value: "boulder", label: "Boulder" },
  ],
  CT: [
    { value: "hartford", label: "Hartford" },
    { value: "new-haven", label: "New Haven" },
    { value: "stamford", label: "Stamford" },
  ],
  DE: [
    { value: "wilmington", label: "Wilmington" },
    { value: "dover", label: "Dover" },
    { value: "newark-de", label: "Newark" },
  ],
  DC: [{ value: "washington", label: "Washington" }],
  FL: [
    { value: "miami", label: "Miami" },
    { value: "orlando", label: "Orlando" },
    { value: "tampa", label: "Tampa" },
  ],
  GA: [
    { value: "atlanta", label: "Atlanta" },
    { value: "savannah", label: "Savannah" },
    { value: "augusta", label: "Augusta" },
  ],
  HI: [
    { value: "honolulu", label: "Honolulu" },
    { value: "hilo", label: "Hilo" },
    { value: "kailua", label: "Kailua" },
  ],
  ID: [
    { value: "boise", label: "Boise" },
    { value: "idaho-falls", label: "Idaho Falls" },
    { value: "nampa", label: "Nampa" },
  ],
  IL: [
    { value: "chicago", label: "Chicago" },
    { value: "springfield-il", label: "Springfield" },
    { value: "naperville", label: "Naperville" },
  ],
  IN: [
    { value: "indianapolis", label: "Indianapolis" },
    { value: "fort-wayne", label: "Fort Wayne" },
    { value: "bloomington-in", label: "Bloomington" },
  ],
  IA: [
    { value: "des-moines", label: "Des Moines" },
    { value: "cedar-rapids", label: "Cedar Rapids" },
    { value: "iowa-city", label: "Iowa City" },
  ],
  KS: [
    { value: "wichita", label: "Wichita" },
    { value: "topeka", label: "Topeka" },
    { value: "overland-park", label: "Overland Park" },
  ],
  KY: [
    { value: "louisville", label: "Louisville" },
    { value: "lexington", label: "Lexington" },
    { value: "bowling-green", label: "Bowling Green" },
  ],
  LA: [
    { value: "new-orleans", label: "New Orleans" },
    { value: "baton-rouge", label: "Baton Rouge" },
    { value: "shreveport", label: "Shreveport" },
  ],
  ME: [
    { value: "portland-me", label: "Portland" },
    { value: "augusta-me", label: "Augusta" },
    { value: "bangor", label: "Bangor" },
  ],
  MD: [
    { value: "baltimore", label: "Baltimore" },
    { value: "annapolis", label: "Annapolis" },
    { value: "rockville", label: "Rockville" },
  ],
  MA: [
    { value: "boston", label: "Boston" },
    { value: "cambridge-ma", label: "Cambridge" },
    { value: "worcester", label: "Worcester" },
  ],
  MI: [
    { value: "detroit", label: "Detroit" },
    { value: "ann-arbor", label: "Ann Arbor" },
    { value: "grand-rapids", label: "Grand Rapids" },
  ],
  MN: [
    { value: "minneapolis", label: "Minneapolis" },
    { value: "saint-paul", label: "Saint Paul" },
    { value: "duluth", label: "Duluth" },
  ],
  MS: [
    { value: "jackson-ms", label: "Jackson" },
    { value: "gulfport", label: "Gulfport" },
    { value: "hattiesburg", label: "Hattiesburg" },
  ],
  MO: [
    { value: "kansas-city", label: "Kansas City" },
    { value: "st-louis", label: "St. Louis" },
    { value: "springfield-mo", label: "Springfield" },
  ],
  MT: [
    { value: "billings", label: "Billings" },
    { value: "missoula", label: "Missoula" },
    { value: "helena", label: "Helena" },
  ],
  NE: [
    { value: "omaha", label: "Omaha" },
    { value: "lincoln-ne", label: "Lincoln" },
    { value: "bellevue-ne", label: "Bellevue" },
  ],
  NV: [
    { value: "las-vegas", label: "Las Vegas" },
    { value: "reno", label: "Reno" },
    { value: "henderson", label: "Henderson" },
  ],
  NH: [
    { value: "manchester-nh", label: "Manchester" },
    { value: "concord-nh", label: "Concord" },
    { value: "nashua", label: "Nashua" },
  ],
  NJ: [
    { value: "newark-nj", label: "Newark" },
    { value: "jersey-city", label: "Jersey City" },
    { value: "trenton", label: "Trenton" },
  ],
  NM: [
    { value: "albuquerque", label: "Albuquerque" },
    { value: "santa-fe", label: "Santa Fe" },
    { value: "las-cruces", label: "Las Cruces" },
  ],
  NY: [
    { value: "new-york-city", label: "New York City" },
    { value: "buffalo", label: "Buffalo" },
    { value: "albany", label: "Albany" },
  ],
  NC: [
    { value: "charlotte", label: "Charlotte" },
    { value: "raleigh", label: "Raleigh" },
    { value: "durham", label: "Durham" },
  ],
  ND: [
    { value: "fargo", label: "Fargo" },
    { value: "bismarck", label: "Bismarck" },
    { value: "grand-forks", label: "Grand Forks" },
  ],
  OH: [
    { value: "columbus", label: "Columbus" },
    { value: "cleveland", label: "Cleveland" },
    { value: "cincinnati", label: "Cincinnati" },
  ],
  OK: [
    { value: "oklahoma-city", label: "Oklahoma City" },
    { value: "tulsa", label: "Tulsa" },
    { value: "norman", label: "Norman" },
  ],
  OR: [
    { value: "portland-or", label: "Portland" },
    { value: "eugene", label: "Eugene" },
    { value: "salem-or", label: "Salem" },
  ],
  PA: [
    { value: "philadelphia", label: "Philadelphia" },
    { value: "pittsburgh", label: "Pittsburgh" },
    { value: "harrisburg", label: "Harrisburg" },
  ],
  RI: [
    { value: "providence", label: "Providence" },
    { value: "warwick", label: "Warwick" },
    { value: "newport-ri", label: "Newport" },
  ],
  SC: [
    { value: "charleston-sc", label: "Charleston" },
    { value: "columbia-sc", label: "Columbia" },
    { value: "greenville", label: "Greenville" },
  ],
  SD: [
    { value: "sioux-falls", label: "Sioux Falls" },
    { value: "rapid-city", label: "Rapid City" },
    { value: "pierre", label: "Pierre" },
  ],
  TN: [
    { value: "nashville", label: "Nashville" },
    { value: "memphis", label: "Memphis" },
    { value: "knoxville", label: "Knoxville" },
  ],
  TX: [
    { value: "houston", label: "Houston" },
    { value: "austin", label: "Austin" },
    { value: "dallas", label: "Dallas" },
  ],
  UT: [
    { value: "salt-lake-city", label: "Salt Lake City" },
    { value: "provo", label: "Provo" },
    { value: "ogden", label: "Ogden" },
  ],
  VT: [
    { value: "burlington", label: "Burlington" },
    { value: "montpelier", label: "Montpelier" },
    { value: "rutland", label: "Rutland" },
  ],
  VA: [
    { value: "richmond", label: "Richmond" },
    { value: "virginia-beach", label: "Virginia Beach" },
    { value: "arlington", label: "Arlington" },
  ],
  WA: [
    { value: "seattle", label: "Seattle" },
    { value: "spokane", label: "Spokane" },
    { value: "tacoma", label: "Tacoma" },
  ],
  WV: [
    { value: "charleston-wv", label: "Charleston" },
    { value: "huntington", label: "Huntington" },
    { value: "morgantown", label: "Morgantown" },
  ],
  WI: [
    { value: "milwaukee", label: "Milwaukee" },
    { value: "madison", label: "Madison" },
    { value: "green-bay", label: "Green Bay" },
  ],
  WY: [
    { value: "cheyenne", label: "Cheyenne" },
    { value: "casper", label: "Casper" },
    { value: "laramie", label: "Laramie" },
  ],
};

/** Country calling codes, so nobody has to guess whether "+1 555…" parses. */
export const dialCodes = [
  { value: "+1", label: "+1 · US / CA" },
  { value: "+44", label: "+44 · UK" },
  { value: "+52", label: "+52 · MX" },
  { value: "+55", label: "+55 · BR" },
  { value: "+91", label: "+91 · IN" },
  { value: "+234", label: "+234 · NG" },
] as const;

export type EnrollmentDocument = {
  id: string;
  title: string;
  /** One line for the summary row, before anyone opens the thing. */
  summary: string;
  body: { heading: string; paragraphs: string[] }[];
};

/**
 * The document packet, written out in full so it can be read in the page.
 *
 * The live portal links these as PDFs that open in another tab, which is how a
 * document gets agreed to without being read. The text is plausible plain
 * English rather than the real legal instrument — this prototype is testing the
 * reading and signing interaction, not the wording of a FERPA release.
 */
export const enrollmentDocuments: EnrollmentDocument[] = [
  {
    id: "ferpa",
    title: "FERPA Information Release",
    summary: "Who, other than you, can be told about your record",
    body: [
      {
        heading: "What FERPA protects",
        paragraphs: [
          "The Family Educational Rights and Privacy Act gives you control over your education record once you enrol here, whoever pays your tuition. From your first day at Aster, the record is yours.",
          "That covers your grades, your enrollment status, your financial account, your housing assignment and anything an advisor writes down about you. It does not cover directory information — your name, programme, dates of attendance and any degree awarded — which the university may publish unless you ask it not to.",
        ],
      },
      {
        heading: "What you're agreeing to",
        paragraphs: [
          "If you named someone in the family access section of Who we call, who can see, this release lets Aster staff discuss the categories you ticked with that person. It does not give them an account, a login, or the ability to act for you.",
          "If you named nobody, nothing is released. Staff will decline to discuss your record with anyone who calls, including a parent who is paying your fees.",
        ],
      },
      {
        heading: "Changing your mind",
        paragraphs: [
          "You can widen, narrow or withdraw this release at any point, in writing, and it takes effect the day it is processed. Withdrawing it does not undo disclosures already made.",
          `Requests go to the Registrar, ${institution.admissionsEmail}. There is no charge and no form to buy.`,
        ],
      },
      {
        heading: "Where complaints go",
        paragraphs: [
          "If you believe the university has released your record improperly, you may complain to the Registrar and, separately, to the Student Privacy Policy Office of the U.S. Department of Education. Complaining to one does not stop you complaining to the other.",
        ],
      },
    ],
  },
  {
    id: "enrollment-acknowledgment",
    title: "Enrollment Information Acknowledgment",
    summary: "What you're confirming by enrolling",
    body: [
      {
        heading: "The offer you're accepting",
        paragraphs: [
          `You are accepting a place in ${offer.programme} (${offer.degree}), starting ${offer.startingTerm} at ${offer.campus}. The place is held for that term. Deferring to a later term is a separate request and is not automatic.`,
          "Your offer assumes the qualifications in your application are accurate and that any pending results meet the stated conditions. If they don't, Admissions may revise or withdraw the offer, and will tell you in writing before doing so.",
        ],
      },
      {
        heading: "Money",
        paragraphs: [
          `The enrollment deposit of ${formatMoney(offer.depositAmount, offer.depositCurrency)} secures your place and is credited against your first-term tuition. It is refundable up to the response deadline and not afterwards.`,
          "Tuition and fees are set each year and are published before registration opens. Enrolling does not lock a rate for the duration of your programme.",
        ],
      },
      {
        heading: "What the university expects",
        paragraphs: [
          "You agree to keep your contact details current, to read what the university sends to your Aster address, and to follow the student conduct code and academic integrity policy. Both are published in full and neither is short.",
          "Housing preferences are preferences. Rooms are assigned after the response deadline, and the ranking you gave is considered rather than guaranteed.",
        ],
      },
      {
        heading: "Withdrawing",
        paragraphs: [
          "You may withdraw at any time before term starts by writing to Admissions. Withdrawing after the response deadline forfeits the deposit but carries no other charge.",
          "Nothing in this acknowledgment limits any right you have under state or federal law.",
        ],
      },
    ],
  },
];

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

/**
 * What the student walks away with: the enrolment record the final screen hands
 * over as an object rather than as a message. CRED, Qonto, Zing and Qantas all
 * end their flow by delivering a thing, and none of them delivers a sentence.
 */
export const enrollment = {
  id: "AST-2027-014882",
  entryYear: 2027,
  /** Four years on, which is what a student card actually prints. */
  classOf: 2031,
} as const;

/**
 * The deposit's terms, in one place, because three screens and a document all
 * quote them and three copies would drift.
 */
export const depositTerms = {
  amount: offer.depositAmount,
  currency: offer.depositCurrency,
  refundableUntil: offer.responseDeadline,
  /** Working days Student Accounts takes over a waiver request. */
  waiverReviewDays: 5,
  /** When the rest of the first term's bill falls due. */
  balanceDue: "2027-08-15",
} as const;

/**
 * The Fall 2027 calendar: the five dates a university portal owes a student, and
 * the ruler every Requirement deadline is measured against.
 *
 * It is new because nothing in this repo had one, and the absence was not
 * neutral. The twelve Requirement deadlines were written to make one card read
 * `100 days` and were never checked against a term, which put `Secure your
 * place` on **Nov 16** — twelve weeks after the student would have started
 * classes. A deadline that falls after teaching begins is not a deadline; it is
 * a number that happened to look right on a card.
 *
 * `teachingBegins` is therefore load-bearing rather than decorative:
 * `portal.test.ts` asserts that no Requirement is due after it, so the defect
 * cannot come back by somebody adjusting a date to make a screenshot read well.
 *
 * The shape of the term is an ordinary U.S. Fall one, and the two dates it has
 * to agree with were already in the repo: the first term's bill is
 * `depositTerms.balanceDue`, quoted rather than retyped, and the Involvement
 * Fair (`catalogue.ts`, Aug 27) falls after classes begin, which is where every
 * real fair falls and why that fixture does not move.
 */
export const academicCalendar = {
  moveIn: "2027-08-21",
  /** Two days before term, which is what `register-orientation` promises. */
  orientation: "2027-08-23",
  teachingBegins: "2027-08-25",
  /** After teaching begins, as it is everywhere. Not a Requirement deadline. */
  addDropCloses: "2027-09-08",
  firstBillDue: depositTerms.balanceDue,
} as const;

/**
 * The same five, in the order they happen, for the block that draws them.
 *
 * Derived from the record above rather than written beside it: two lists of
 * dates that have to agree is the bug every derived list in this repo exists to
 * make impossible.
 */
export const keyDates = [
  { id: "first-bill", label: "First term's bill", date: academicCalendar.firstBillDue },
  { id: "move-in", label: "Move-in", date: academicCalendar.moveIn },
  { id: "orientation", label: "Orientation", date: academicCalendar.orientation },
  { id: "teaching", label: "Teaching begins", date: academicCalendar.teachingBegins },
  { id: "add-drop", label: "Add/drop closes", date: academicCalendar.addDropCloses },
] as const;
