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

export type Residence = {
  id: string;
  name: string;
  blurb: string;
  detail: string;
  /**
   * Three views, in the order the gallery shows them. The room shot is the one
   * that matters — "what would my room be like" is the question the student is
   * actually asking, and no amount of blurb answers it.
   */
  images: {
    exterior: Photo;
    room: Photo;
    common: Photo;
  };
};

export const residences: Residence[] = [
  {
    id: "aster-residence-hall",
    name: "Aster Residence Hall",
    blurb: "Traditional halls, right on the quad",
    detail: "Shared floors · Dining hall attached · 4 min to the Computer Science building",
    images: {
      exterior: {
        src: "/images/residences/aster-residence-hall-exterior.webp",
        alt: "A four-storey brick residence hall with a covered porch and an external staircase, on a lawn in full sun",
      },
      room: {
        src: "/images/residences/aster-residence-hall-room.webp",
        alt: "A single dorm room with a bed against the wall, a white desk and chair, and a tall window overlooking trees",
      },
      common: {
        src: "/images/residences/aster-residence-hall-common.webp",
        alt: "A double-height common room with sofas, low stools and a glass wall looking onto the grounds",
      },
    },
  },
  {
    id: "aster-apartments",
    name: "Aster Apartments",
    blurb: "Apartment-style with your own kitchen",
    detail: "4-person units · Full kitchen · 12 min walk or 4 min on the campus loop",
    images: {
      exterior: {
        src: "/images/residences/aster-apartments-exterior.webp",
        alt: "Two brick apartment blocks facing each other across a paved courtyard with clipped hedges and trees",
      },
      room: {
        src: "/images/residences/aster-apartments-room.webp",
        alt: "A bedroom with a metal-framed bed, a long desk with a task chair, and a bright window above the desk",
      },
      common: {
        src: "/images/residences/aster-apartments-common.webp",
        alt: "A shared flat kitchen with white units, an oven, a coffee machine and a round dining table by a glazed door",
      },
    },
  },
  {
    id: "student-village",
    name: "Student Village",
    blurb: "Newest buildings, quietest end of campus",
    detail: "Mostly singles · Study rooms on every floor · 15 min walk",
    images: {
      exterior: {
        src: "/images/residences/student-village-exterior.webp",
        alt: "A long, low modern building in brick and glass behind a wide clipped lawn under a blue sky",
      },
      room: {
        src: "/images/residences/student-village-room.webp",
        alt: "A white single room with a made bed, a pale wood desk under the window and a mirror on the wall",
      },
      common: {
        src: "/images/residences/student-village-common.webp",
        alt: "Students working on laptops on beanbags and low sofas in a plywood-lined study room with a picture window",
      },
    },
  },
];

/** Ordered as the gallery shows them; the room shot leads the labels for a reason. */
export const residenceViews = [
  { key: "room", label: "Your room" },
  { key: "exterior", label: "The building" },
  { key: "common", label: "Shared space" },
] as const satisfies readonly { key: keyof Residence["images"]; label: string }[];

/**
 * The Offer keeps its photograph. The completion screen does not: every
 * candidate put mid-tones behind the largest type on the screen, so it runs on
 * a dark field with `LightRays` over it instead.
 */
export const campusPhotos = {
  offer: {
    src: "/images/campus/offer-campus.webp",
    alt: "A broad green lawn shaded by a large spreading tree, with brick campus buildings behind it",
  },
} as const satisfies Record<string, Photo>;

/**
 * Broad enough to sort nine clubs into more than one useful pile, not a
 * taxonomy of student life. "Making" earns its own bucket because robotics and
 * tabletop are both hands-on-a-table activities that neither "arts" nor
 * "social" describes honestly.
 */
export const clubCategories = [
  { value: "sport", label: "Sport" },
  { value: "arts", label: "Arts" },
  { value: "outdoors", label: "Outdoors" },
  { value: "social", label: "Social" },
  { value: "service", label: "Service" },
  { value: "making", label: "Making" },
] as const;

export type ClubCategory = (typeof clubCategories)[number]["value"];

export type Club = {
  id: string;
  name: string;
  blurb: string;
  category: ClubCategory;
  /** The longer read, once a student opens the detail view rather than just glancing at the grid. */
  detail: string;
  cadence: string;
  image: Photo;
};

export const clubs: Club[] = [
  {
    id: "robotics",
    name: "Robotics & making",
    blurb: "Build something that moves. Nobody starts knowing how.",
    category: "making",
    detail:
      "A shared workshop with soldering stations, a laser cutter and a parts wall anyone can raid. Most terms run one long build — last year's was a line-following rover — alongside whatever smaller thing you show up wanting to make. No electronics background assumed; half the club started here.",
    cadence: "Open workshop Tuesday and Thursday evenings, plus a Saturday build day once a month.",
    image: {
      src: "/images/clubs/robotics.webp",
      alt: "Three students wiring a small robot together at a workbench",
    },
  },
  {
    id: "music",
    name: "Live music",
    blurb: "Bands, open mics, rehearsal rooms you can book by the hour.",
    category: "arts",
    detail:
      "Four soundproofed rehearsal rooms you can book online, a backline of amps and a kit so you don't have to haul your own gear across campus. The open mic is unauditioned — sign-up sheet goes up an hour before. A handful of bands form out of it most years; nobody's required to join one.",
    cadence: "Open mic every other Friday night; rehearsal rooms bookable any day.",
    image: {
      src: "/images/clubs/music.webp",
      alt: "Four people with guitars and a microphone stand mid-rehearsal in a bright room",
    },
  },
  {
    id: "football",
    name: "Football",
    blurb: "Kickabouts on Wednesdays, a league if you want one.",
    category: "sport",
    detail:
      "The Wednesday kickabout is genuinely casual — turn up, get put on a side, no boots required for the first few weeks. A more competitive five-a-side league runs each term for anyone who wants to keep score, with sign-up separate from the open sessions.",
    cadence: "Casual kickabout every Wednesday evening; league matches on weekends in-term.",
    image: {
      src: "/images/clubs/football.webp",
      alt: "Two players challenging for the ball in front of the goal on a green pitch",
    },
  },
  {
    id: "outdoors",
    name: "Outdoors",
    blurb: "Weekend hikes and two camping trips a term. Kit is lent, not bought.",
    category: "outdoors",
    detail:
      "Day hikes leave from the quad most weekends, graded easy to hard so nobody's stuck choosing between staying home and being in over their head. The two termly camping trips cover transport and shared kit — tents, stoves, the works — so the only thing you need to bring is yourself.",
    cadence: "Day hikes most Saturdays; overnight camping trips twice a term.",
    image: {
      src: "/images/clubs/outdoors.webp",
      alt: "A line of students in walking gear coming down a hillside track",
    },
  },
  {
    id: "art",
    name: "Studio art",
    blurb: "Open studio hours. Materials are on the department.",
    category: "arts",
    detail:
      "A shared studio with easels, a print press and a materials cupboard the department restocks — paint, paper and clay are covered, so showing up empty-handed is the normal way to start. No critique sessions unless you ask for one; most people are just there to work.",
    cadence: "Open studio hours every weekday afternoon; no sign-up needed.",
    image: {
      src: "/images/clubs/art.webp",
      alt: "Two students working at easels in a studio hung with paintings",
    },
  },
  {
    id: "photography",
    name: "Photography",
    blurb: "Photo walks, darkroom nights, one print show each term.",
    category: "arts",
    detail:
      "Photo walks are themed and casual — golden hour on the quad, the town market, whatever someone proposes. The darkroom is open to anyone who's had the one, ten-minute safety briefing, film and paper included. The end-of-term print show hangs a handful of pieces from anyone who wants to submit.",
    cadence: "Photo walks every other weekend; darkroom nights weekly.",
    image: {
      src: "/images/clubs/photography.webp",
      alt: "A student in a red hoodie raising a camera to their eye on a campus lawn",
    },
  },
  {
    id: "tabletop",
    name: "Tabletop & games",
    blurb: "Board games on Thursdays and campaigns that run all year.",
    category: "making",
    detail:
      "Thursday nights are drop-in board games from the club's own shelf — nothing to bring, nothing to learn in advance. A handful of longer campaigns (tabletop RPGs, mostly) run alongside it for anyone who wants a standing weekly seat instead of a one-off game.",
    cadence: "Drop-in games every Thursday night; campaign groups meet weekly by arrangement.",
    image: {
      src: "/images/clubs/tabletop.webp",
      alt: "A long table of students leaning over a board game covered in tiles and pieces",
    },
  },
  {
    id: "debate",
    name: "Debate & speaking",
    blurb: "Argue for the practice. Compete only if you feel like it.",
    category: "social",
    detail:
      "Weekly sessions are a mix of short-notice topics and practice for anyone building up to competing. Competing is genuinely optional — plenty of members come purely for the practice of thinking on their feet in front of a room. Intervarsity tournaments run a few times a year for the ones who want them.",
    cadence: "Weekly practice sessions; intervarsity tournaments a few times a year.",
    image: {
      src: "/images/clubs/debate.webp",
      alt: "Two students sharing a handheld microphone outdoors, one of them mid-sentence",
    },
  },
  {
    id: "volunteering",
    name: "Volunteering",
    blurb: "Local projects, a few hours whenever you actually have them.",
    category: "service",
    detail:
      "A rotating list of local projects — food bank shifts, park clean-ups, a reading programme at a nearby school — posted a few weeks out so you can pick what fits your week. Nothing is a standing commitment; showing up once counts as much as showing up every time.",
    cadence: "New project postings every few weeks; individual shifts are a few hours each.",
    image: {
      src: "/images/clubs/volunteering.webp",
      alt: "Volunteers in matching blue shirts collecting litter into bags among trees",
    },
  },
];

/**
 * Three options, not five.
 *
 * An earlier version of the spec claimed none of the five had been criticised
 * in the primary source. The opposite is true: Laura removed two of them on the
 * 2026-08-10 call — "Aí é on campus e off campus. Esses outros três enfia no
 * não", corrected to "on campus, off campus, I'm not sure yet", then "Isso. Os
 * outros dois" — and repeated it in the second Jam. Commuting and family or
 * dependent housing are gone. The three that remain are also exactly the three
 * the client's field inventory lists for this field.
 */
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
    label: "Not decided yet",
    hint: "You can settle it later",
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
          "If you named someone in the family access section of About you, this release lets Aster staff discuss the categories you ticked with that person. It does not give them an account, a login, or the ability to act for you.",
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
