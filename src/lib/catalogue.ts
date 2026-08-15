/**
 * The Organization directory, and the filter over it.
 *
 * The premise of the old screen was wrong. **No U.S. university has students
 * join organizations during enrolment.** They join in person at the Involvement
 * Fair after classes begin: Ohio State runs it on the Oval in late August, Penn
 * State runs two days on the HUB lawn with ~40,000 students circulating,
 * Syracuse runs three days segmented by category. What exists during onboarding
 * is an interest survey. So the verb changed, and nothing on this screen is a
 * commitment. See `CONTEXT.md` and ADR-0004.
 *
 * The scale was wrong too. Nine invented clubs is off by an order of magnitude.
 * Aster is fixed at ~7,000 undergraduates (ADR-0005), which puts it at ~420
 * organizations by the real ratio of one per 15 to 25 undergraduates. Sixty
 * ship in this fixture, adapted from verified directories at Michigan, Cornell,
 * Iowa, Kenyon and Wittenberg, and the ~420 total is stated on screen.
 *
 * Three of the four axes are genuinely structured fields in real directories —
 * Michigan publishes all three — which is why they make a filter worth having
 * rather than an ornament. Category is the fourth, from a taxonomy of twelve,
 * which is the real size of a directory taxonomy. Meeting cadence and location
 * are shown but are **not** structured fields in the real systems; they are
 * flagged below as an improvement on the standard rather than a copy of it.
 */

/* -------------------------------------------------------------------------
   The four axes
   ---------------------------------------------------------------------- */

export type CategoryCode =
  | "academic"
  | "arts"
  | "cultural"
  | "faith"
  | "service"
  | "sport"
  | "media"
  | "political"
  | "governance"
  | "professional"
  | "special-interest"
  | "greek";

export const categories: { value: CategoryCode; label: string }[] = [
  { value: "academic", label: "Academic and honor" },
  { value: "arts", label: "Arts and performance" },
  { value: "cultural", label: "Cultural and identity" },
  { value: "faith", label: "Faith" },
  { value: "service", label: "Service" },
  { value: "sport", label: "Sport and recreation" },
  { value: "media", label: "Media and publications" },
  { value: "political", label: "Political and advocacy" },
  { value: "governance", label: "Governance" },
  { value: "professional", label: "Professional and pre-professional" },
  { value: "special-interest", label: "Special interest" },
  { value: "greek", label: "Greek life" },
];

/** Cost per semester, in the bands real directories publish. */
export type CostBand = "free" | "low" | "mid" | "high";

export const costBands: { value: CostBand; label: string; short: string }[] = [
  { value: "free", label: "Free", short: "$0" },
  { value: "low", label: "$1 to $20", short: "$1 to 20" },
  { value: "mid", label: "$21 to $100", short: "$21 to 100" },
  { value: "high", label: "$101 to $250", short: "$101 to 250" },
];

export type TimeBand = "light" | "medium" | "heavy";

export const timeBands: { value: TimeBand; label: string; short: string }[] = [
  { value: "light", label: "1 to 2 hours a week", short: "1 to 2 h/week" },
  { value: "medium", label: "3 to 5 hours a week", short: "3 to 5 h/week" },
  { value: "heavy", label: "5 or more hours a week", short: "5+ h/week" },
];

/**
 * How you get in. On the **card**, not only in the detail: it is what separates
 * "I can turn up tomorrow" from "there is an audition in September".
 */
export type JoiningCode =
  | "automatic"
  | "meeting"
  | "application"
  | "audition"
  | "rush"
  | "academic";

export const joiningRoutes: { value: JoiningCode; label: string; short: string }[] = [
  { value: "automatic", label: "Automatic acceptance", short: "Just show up" },
  { value: "meeting", label: "Attend a meeting", short: "Come to a meeting" },
  { value: "application", label: "Application", short: "Application" },
  { value: "audition", label: "Interview or audition", short: "Audition" },
  { value: "rush", label: "Rush", short: "Rush" },
  { value: "academic", label: "Academic standing", short: "By standing" },
];

/* -------------------------------------------------------------------------
   The record
   ---------------------------------------------------------------------- */

export type Organization = {
  id: string;
  name: string;
  category: CategoryCode;
  /** One truncated line on the card. */
  blurb: string;
  /** The longer read, once the detail is open. */
  detail: string;
  cost: CostBand;
  time: TimeBand;
  joining: JoiningCode;
  /** Roughly how many people. Real directories publish this. */
  members: number;
  /**
   * IMPROVEMENT ON THE STANDARD, not a copy of one. Meeting cadence and
   * location are free text in every directory examined and are not structured
   * fields anywhere. Flagged here so a future round does not mistake them for
   * something a real API will return in this shape.
   */
  meets: string;
  where: string;
  /** Which zone of the Involvement Fair this organization tables in. */
  zone: FairZoneCode;
  table: number;
  /**
   * The real next step, in words, where getting in is anything but automatic.
   * "Audition in September, sign up at the fair" is the sentence a student
   * actually uses; "Interview or audition" is the field it derives from.
   */
  nextStep?: string;
};

/* -------------------------------------------------------------------------
   The Involvement Fair
   ---------------------------------------------------------------------- */

export type FairZoneCode =
  | "academic-row"
  | "arts-pavilion"
  | "community-green"
  | "sport-lawn"
  | "media-tent"
  | "greek-walk";

export const fairZones: { value: FairZoneCode; label: string }[] = [
  { value: "academic-row", label: "Academic Row" },
  { value: "arts-pavilion", label: "Arts Pavilion" },
  { value: "community-green", label: "Community Green" },
  { value: "sport-lawn", label: "Sport Lawn" },
  { value: "media-tent", label: "Media Tent" },
  { value: "greek-walk", label: "Greek Walk" },
];

export const involvementFair = {
  /** Stated once at the top of the route: it is the fact that makes it make sense. */
  date: "2027-08-27",
  place: "the Main Quad",
  /** How many organizations Aster actually has, at ~7,000 undergraduates. */
  organizationsTotal: 420,
  /** Minutes to walk between two zones, for the route's summary. */
  minutesBetweenZones: 6,
  /** Minutes a student spends at one table, on the same rough basis. */
  minutesPerStop: 4,
} as const;

/* -------------------------------------------------------------------------
   The fixture
   ---------------------------------------------------------------------- */

type Row = [
  id: string,
  name: string,
  category: CategoryCode,
  cost: CostBand,
  time: TimeBand,
  joining: JoiningCode,
  members: number,
  blurb: string,
  meets: string,
  where: string,
  nextStep?: string,
];

const ZONE_BY_CATEGORY: Record<CategoryCode, FairZoneCode> = {
  academic: "academic-row",
  professional: "academic-row",
  arts: "arts-pavilion",
  cultural: "community-green",
  faith: "community-green",
  service: "community-green",
  "special-interest": "community-green",
  sport: "sport-lawn",
  media: "media-tent",
  political: "media-tent",
  governance: "academic-row",
  greek: "greek-walk",
};

const ROWS: Row[] = [
  [
    "mathematics-society",
    "Mathematics Society",
    "academic",
    "free",
    "light",
    "automatic",
    84,
    "Problem sessions, a putnam group, and pizza afterwards.",
    "Wednesdays, 6pm",
    "Fenn Hall 210",
  ],
  [
    "biology-club",
    "Biology Club",
    "academic",
    "low",
    "light",
    "automatic",
    120,
    "Lab tours, grad school panels, and a spring field trip.",
    "Alternate Tuesdays, 7pm",
    "Life Sciences 101",
  ],
  [
    "phi-beta-kappa",
    "Phi Beta Kappa",
    "academic",
    "mid",
    "light",
    "academic",
    60,
    "The oldest honor society in the country. Invitation follows your transcript.",
    "Twice a semester",
    "Old Library",
    "Invitation goes out after your fourth semester. Nothing to do now.",
  ],
  [
    "chemistry-society",
    "Chemistry Society",
    "academic",
    "low",
    "medium",
    "automatic",
    66,
    "Demonstrations at local schools and a very competitive periodic table quiz.",
    "Thursdays, 5pm",
    "Chem Building 3",
  ],
  [
    "history-forum",
    "History Forum",
    "academic",
    "free",
    "light",
    "automatic",
    45,
    "One reading, one argument, every fortnight.",
    "Alternate Mondays, 7pm",
    "Kemp House",
  ],
  [
    "psychology-association",
    "Psychology Association",
    "academic",
    "low",
    "light",
    "automatic",
    98,
    "Research talks and the only reliable source of study participants on campus.",
    "Tuesdays, 6pm",
    "Sanders 140",
  ],
  [
    "computer-science-club",
    "Computer Science Club",
    "academic",
    "free",
    "medium",
    "automatic",
    210,
    "Weekly hack nights, an interview prep track, and a spring hackathon.",
    "Wednesdays, 7pm",
    "Fenn Hall Atrium",
  ],
  [
    "astronomy-club",
    "Astronomy Club",
    "academic",
    "free",
    "light",
    "automatic",
    52,
    "The roof telescope, and someone who knows how to point it.",
    "Clear Fridays",
    "Fenn Hall roof",
  ],
  [
    "debate-union",
    "Debate Union",
    "academic",
    "mid",
    "heavy",
    "audition",
    40,
    "British parliamentary format. Intervarsity travel most weekends.",
    "Mondays and Thursdays, 7pm",
    "Old Library Debate Room",
    "Trial debate in the first two weeks of term. Sign up at the fair.",
  ],
  [
    "mock-trial",
    "Mock Trial",
    "academic",
    "mid",
    "heavy",
    "audition",
    32,
    "Two competitive teams and a very long case file.",
    "Sundays, 1pm",
    "Law Annexe",
    "Tryouts in the second week of September.",
  ],

  [
    "concert-choir",
    "Concert Choir",
    "arts",
    "low",
    "medium",
    "audition",
    78,
    "Four concerts a year and a tour every other spring.",
    "Tuesdays and Thursdays, 5pm",
    "Chapel",
    "Voice audition in the first week. Slots go up at the fair.",
  ],
  [
    "jazz-ensemble",
    "Jazz Ensemble",
    "arts",
    "low",
    "medium",
    "audition",
    22,
    "A standing big band with an open soloist chair.",
    "Mondays, 7pm",
    "Music Building 2",
    "Play something you know. Auditions in the first fortnight.",
  ],
  [
    "theatre-company",
    "Aster Theatre Company",
    "arts",
    "mid",
    "heavy",
    "audition",
    65,
    "Two full productions a year, plus a student-written festival.",
    "Rehearsals most evenings",
    "Playhouse",
    "Open auditions for the autumn show in week two.",
  ],
  [
    "improv-troupe",
    "Improv Troupe",
    "arts",
    "free",
    "medium",
    "audition",
    18,
    "Short form, long form, and a monthly show that is free to get into.",
    "Wednesdays, 8pm",
    "Playhouse Studio",
    "Workshop audition in September. No experience assumed.",
  ],
  [
    "studio-art-collective",
    "Studio Art Collective",
    "arts",
    "low",
    "light",
    "automatic",
    44,
    "Open studio hours, and the department restocks the materials.",
    "Weekday afternoons",
    "Art Building",
  ],
  [
    "photography-society",
    "Photography Society",
    "arts",
    "low",
    "light",
    "automatic",
    96,
    "Photo walks, darkroom nights, one print show a term.",
    "Alternate Saturdays",
    "Art Building darkroom",
  ],
  [
    "dance-company",
    "Dance Company",
    "arts",
    "mid",
    "heavy",
    "audition",
    54,
    "Contemporary and hip hop tracks, one showcase each semester.",
    "Four evenings a week",
    "Recreation Centre studio",
    "Auditions on the first Saturday of term.",
  ],
  [
    "a-cappella-nightingales",
    "The Nightingales",
    "arts",
    "low",
    "heavy",
    "audition",
    14,
    "Sixteen people, no instruments, an alarming amount of commitment.",
    "Five evenings a week",
    "Chapel basement",
    "Auditions in the first week. Prepare one verse and a chorus.",
  ],
  [
    "film-society",
    "Film Society",
    "arts",
    "low",
    "light",
    "automatic",
    130,
    "A screening every Thursday and an argument every Friday.",
    "Thursdays, 8pm",
    "Lecture Theatre A",
  ],
  [
    "ceramics-guild",
    "Ceramics Guild",
    "arts",
    "mid",
    "medium",
    "meeting",
    28,
    "Wheel time, kiln access, and a sale before the winter break.",
    "Tuesdays and Sundays",
    "Art Building annexe",
    "Come to any Tuesday session and put your name down.",
  ],

  [
    "black-student-union",
    "Black Student Union",
    "cultural",
    "free",
    "light",
    "automatic",
    180,
    "Community, advocacy, and the biggest event on the spring calendar.",
    "Alternate Wednesdays, 7pm",
    "Student Centre 2",
  ],
  [
    "latinx-student-alliance",
    "Latinx Student Alliance",
    "cultural",
    "free",
    "light",
    "automatic",
    150,
    "Cultural programming, a mentoring scheme and very good food.",
    "Thursdays, 6pm",
    "Student Centre 3",
  ],
  [
    "asian-pacific-coalition",
    "Asian Pacific Coalition",
    "cultural",
    "free",
    "light",
    "automatic",
    165,
    "Eleven affiliated groups under one umbrella.",
    "Monthly, first Tuesday",
    "Student Centre 2",
  ],
  [
    "international-students",
    "International Students Association",
    "cultural",
    "free",
    "light",
    "automatic",
    220,
    "Airport pickups, a buddy scheme, and someone who has already done the visa thing.",
    "Fridays, 5pm",
    "Global Lounge",
  ],
  [
    "native-student-council",
    "Native Student Council",
    "cultural",
    "free",
    "light",
    "automatic",
    40,
    "A small council with a loud voice on campus policy.",
    "Alternate Mondays",
    "Student Centre 4",
  ],
  [
    "pride-alliance",
    "Pride Alliance",
    "cultural",
    "free",
    "light",
    "automatic",
    190,
    "Weekly social, a support track, and the campus policy work.",
    "Wednesdays, 7pm",
    "Student Centre 1",
  ],
  [
    "first-generation-network",
    "First Generation Network",
    "cultural",
    "free",
    "light",
    "automatic",
    175,
    "For students whose parents did not do this. Mentoring, and a lot of practical advice.",
    "Alternate Thursdays",
    "Student Centre 4",
  ],

  [
    "hillel",
    "Hillel",
    "faith",
    "free",
    "light",
    "automatic",
    120,
    "Shabbat dinner every Friday, open to anyone.",
    "Fridays, 6pm",
    "Hillel House",
  ],
  [
    "catholic-student-centre",
    "Catholic Student Centre",
    "faith",
    "free",
    "light",
    "automatic",
    145,
    "Mass, a service programme, and a Wednesday night that runs late.",
    "Sundays and Wednesdays",
    "Newman Centre",
  ],
  [
    "muslim-students-association",
    "Muslim Students Association",
    "faith",
    "free",
    "light",
    "automatic",
    110,
    "Daily prayer space, iftar in Ramadan, and an interfaith calendar.",
    "Daily",
    "Prayer Room, Student Centre",
  ],
  [
    "interfaith-council",
    "Interfaith Council",
    "faith",
    "free",
    "light",
    "meeting",
    35,
    "Delegates from nine communities, one conversation.",
    "Monthly",
    "Chapel",
    "Come to a monthly meeting and ask to join.",
  ],

  [
    "habitat-for-humanity",
    "Habitat for Humanity",
    "service",
    "low",
    "medium",
    "automatic",
    90,
    "Build days most Saturdays and a spring break trip.",
    "Saturdays",
    "Meet at the Quad",
  ],
  [
    "food-recovery-network",
    "Food Recovery Network",
    "service",
    "free",
    "light",
    "automatic",
    75,
    "Dining hall surplus to the town food bank, four nights a week.",
    "Nightly shifts",
    "Quad Dining loading bay",
  ],
  [
    "big-siblings",
    "Big Siblings",
    "service",
    "free",
    "medium",
    "application",
    68,
    "Mentoring at two local middle schools.",
    "Weekly, by arrangement",
    "Off campus",
    "Application and a background check. Forms at the fair.",
  ],
  [
    "relay-for-life",
    "Relay for Life",
    "service",
    "low",
    "light",
    "automatic",
    240,
    "One overnight event, and a year of building up to it.",
    "Monthly planning",
    "Student Centre 1",
  ],
  [
    "campus-tutors",
    "Campus Tutors",
    "service",
    "free",
    "medium",
    "application",
    85,
    "Free tutoring in maths, writing and chemistry.",
    "By arrangement",
    "Learning Commons",
    "Apply with one reference from a professor.",
  ],
  [
    "environmental-action",
    "Environmental Action",
    "service",
    "free",
    "medium",
    "automatic",
    105,
    "Campus sustainability campaigns and the annual waste audit.",
    "Tuesdays, 6pm",
    "Green House",
  ],

  [
    "ultimate-frisbee",
    "Ultimate Frisbee",
    "sport",
    "mid",
    "medium",
    "automatic",
    55,
    "Two teams, one competitive and one emphatically not.",
    "Tuesdays and Sundays",
    "West Fields",
  ],
  [
    "club-soccer",
    "Club Soccer",
    "sport",
    "mid",
    "heavy",
    "audition",
    48,
    "League play against six other colleges.",
    "Four evenings a week",
    "West Fields",
    "Tryouts in the first week of term.",
  ],
  [
    "rock-climbing",
    "Rock Climbing Club",
    "sport",
    "mid",
    "medium",
    "automatic",
    92,
    "The wall three nights a week, and outdoor trips once a month.",
    "Mondays, Wednesdays, Fridays",
    "Recreation Centre wall",
  ],
  [
    "outdoors-club",
    "Outdoors Club",
    "sport",
    "mid",
    "medium",
    "automatic",
    160,
    "Day hikes most weekends and two camping trips a term. Kit is lent.",
    "Saturdays",
    "Meet at the Quad",
  ],
  [
    "running-club",
    "Running Club",
    "sport",
    "free",
    "light",
    "automatic",
    130,
    "Three paces, one route, nobody left behind.",
    "Tuesdays and Saturdays, 7am",
    "Quad steps",
  ],
  [
    "quidditch",
    "Quidditch",
    "sport",
    "low",
    "medium",
    "automatic",
    26,
    "Yes, really. It is more physical than it looks.",
    "Sundays, 2pm",
    "North Lawn",
  ],
  [
    "cycling-team",
    "Cycling Team",
    "sport",
    "high",
    "heavy",
    "automatic",
    30,
    "Road racing in the spring, and a lot of very early mornings.",
    "Five mornings a week",
    "Bike shed, West Campus",
  ],
  [
    "martial-arts",
    "Martial Arts Club",
    "sport",
    "mid",
    "medium",
    "automatic",
    70,
    "Karate and judo tracks, beginners in both.",
    "Mondays and Thursdays",
    "Recreation Centre dojo",
  ],

  [
    "the-aster-review",
    "The Aster Review",
    "media",
    "free",
    "heavy",
    "application",
    45,
    "The student newspaper. Weekly in print, daily online.",
    "Sundays, 4pm",
    "Media Centre",
    "Pitch one story. Editors take pitches at the fair.",
  ],
  [
    "campus-radio",
    "WAST Campus Radio",
    "media",
    "low",
    "medium",
    "meeting",
    60,
    "A real FM licence and a lot of unfilled 2am slots.",
    "Mondays, 8pm",
    "Media Centre basement",
    "Come to one Monday meeting to claim a slot.",
  ],
  [
    "literary-magazine",
    "Chapel Street Review",
    "media",
    "free",
    "light",
    "application",
    22,
    "One issue a semester, poetry and short fiction.",
    "Alternate Wednesdays",
    "Old Library 4",
    "Send three pieces to the editors.",
  ],
  [
    "yearbook",
    "The Aster Yearbook",
    "media",
    "free",
    "medium",
    "automatic",
    30,
    "Photography, layout, and a deadline in April.",
    "Thursdays, 6pm",
    "Media Centre",
  ],
  [
    "podcast-network",
    "Aster Podcast Network",
    "media",
    "free",
    "medium",
    "meeting",
    38,
    "Studio time, editing help, and eleven shows.",
    "Fridays, 4pm",
    "Media Centre studio",
    "Turn up on a Friday with an idea.",
  ],

  [
    "college-democrats",
    "College Democrats",
    "political",
    "free",
    "light",
    "automatic",
    140,
    "Campaign work, voter registration, and a lot of doors.",
    "Wednesdays, 7pm",
    "Student Centre 3",
  ],
  [
    "college-republicans",
    "College Republicans",
    "political",
    "free",
    "light",
    "automatic",
    95,
    "Speaker series and campaign volunteering.",
    "Wednesdays, 7pm",
    "Student Centre 4",
  ],
  [
    "amnesty-international",
    "Amnesty International",
    "political",
    "free",
    "light",
    "automatic",
    55,
    "Letter writing, campaigns and one very cold vigil in December.",
    "Alternate Tuesdays",
    "Student Centre 1",
  ],
  [
    "students-for-reproductive-justice",
    "Students for Reproductive Justice",
    "political",
    "free",
    "light",
    "automatic",
    80,
    "Advocacy, education and a standing health resource table.",
    "Thursdays, 7pm",
    "Student Centre 2",
  ],

  [
    "student-government",
    "Student Government Association",
    "governance",
    "free",
    "heavy",
    "application",
    45,
    "The budget for every group on this page runs through here.",
    "Sundays, 6pm",
    "Student Centre Chamber",
    "Stand in the September election, or apply for a committee seat.",
  ],
  [
    "residence-hall-council",
    "Residence Hall Council",
    "governance",
    "free",
    "medium",
    "meeting",
    65,
    "Programming and policy for the halls, one delegate per building.",
    "Alternate Sundays",
    "Varies by hall",
    "Your hall elects delegates in the second week.",
  ],
  [
    "class-council",
    "Class Council",
    "governance",
    "free",
    "medium",
    "application",
    28,
    "Your year, its events, and eventually its reunion.",
    "Mondays, 7pm",
    "Student Centre 3",
    "Nominations open in September.",
  ],

  [
    "pre-med-society",
    "Pre-Med Society",
    "professional",
    "mid",
    "medium",
    "automatic",
    190,
    "MCAT groups, shadowing placements, and admissions panels.",
    "Alternate Thursdays",
    "Life Sciences 200",
  ],
  [
    "pre-law-society",
    "Pre-Law Society",
    "professional",
    "mid",
    "light",
    "automatic",
    110,
    "LSAT prep, mock interviews, and law school visits.",
    "Alternate Wednesdays",
    "Kemp House",
  ],
  [
    "women-in-stem",
    "Women in STEM",
    "professional",
    "free",
    "light",
    "automatic",
    145,
    "Mentoring, a speaker series and a very good internship list.",
    "Tuesdays, 6pm",
    "Fenn Hall 110",
  ],
  [
    "entrepreneurship-club",
    "Entrepreneurship Club",
    "professional",
    "low",
    "medium",
    "automatic",
    88,
    "Pitch nights, a small seed fund, and people who will tell you it is a bad idea.",
    "Wednesdays, 7pm",
    "Business Building 1",
  ],
  [
    "engineering-society",
    "Engineering Society",
    "professional",
    "low",
    "medium",
    "automatic",
    125,
    "Project teams, industry visits and the concrete canoe.",
    "Mondays, 6pm",
    "Engineering Atrium",
  ],

  [
    "robotics-team",
    "Robotics Team",
    "special-interest",
    "mid",
    "heavy",
    "automatic",
    42,
    "One long build a year and a workshop anyone can raid.",
    "Tuesdays, Thursdays and Saturdays",
    "Maker Space",
  ],
  [
    "tabletop-guild",
    "Tabletop Guild",
    "special-interest",
    "free",
    "light",
    "automatic",
    115,
    "Board games on Thursdays and campaigns that run all year.",
    "Thursdays, 7pm",
    "Student Centre 5",
  ],
  [
    "chess-club",
    "Chess Club",
    "special-interest",
    "free",
    "light",
    "automatic",
    48,
    "Casual boards, a ladder, and one rated tournament a term.",
    "Sundays, 2pm",
    "Old Library lounge",
  ],
  [
    "gardening-collective",
    "Gardening Collective",
    "special-interest",
    "low",
    "light",
    "automatic",
    36,
    "The campus plot, and whatever comes out of it.",
    "Saturdays, 10am",
    "West Campus plot",
  ],
  [
    "baking-society",
    "Baking Society",
    "special-interest",
    "low",
    "light",
    "automatic",
    140,
    "One bake a week, eaten immediately.",
    "Sundays, 4pm",
    "Student Centre kitchen",
  ],

  [
    "alpha-phi-omega",
    "Alpha Phi Omega",
    "greek",
    "high",
    "medium",
    "rush",
    95,
    "A coed service fraternity. Service hours rather than a house.",
    "Sundays, 7pm",
    "Student Centre 1",
    "Rush week runs in mid September. Sign up at the fair.",
  ],
  [
    "panhellenic-council",
    "Panhellenic Council",
    "greek",
    "high",
    "medium",
    "rush",
    320,
    "Eight sororities under one council. Recruitment is formal.",
    "Recruitment in September",
    "Greek Row",
    "Formal recruitment registration closes in early September.",
  ],
  [
    "interfraternity-council",
    "Interfraternity Council",
    "greek",
    "high",
    "medium",
    "rush",
    280,
    "Ten fraternities, one recruitment calendar.",
    "Recruitment in September",
    "Greek Row",
    "Rush events run through the third week of September.",
  ],
];

export const organizations: Organization[] = ROWS.map(
  ([id, name, category, cost, time, joining, members, blurb, meets, where, nextStep], index) => ({
    id,
    name,
    category,
    blurb,
    /* The detail's long read is derived rather than written sixty times: the
       questions a student has before walking up to a table are the four
       structured fields, and repeating them in prose would be the bulk the
       client has objected to twice. */
    detail: blurb,
    cost,
    time,
    joining,
    members,
    meets,
    where,
    zone: ZONE_BY_CATEGORY[category],
    table: 100 + index,
    nextStep,
  }),
);

/* -------------------------------------------------------------------------
   The filter — the one new tested seam
   ---------------------------------------------------------------------- */

export type CatalogueFilter = {
  search: string;
  categories: CategoryCode[];
  costs: CostBand[];
  times: TimeBand[];
  joining: JoiningCode[];
};

export const emptyFilter: CatalogueFilter = {
  search: "",
  categories: [],
  costs: [],
  times: [],
  joining: [],
};

/**
 * Axes combine with AND; values within one axis combine with OR.
 *
 * That is what every filter a student has used behaves like, and it is the only
 * combination that makes "Free" plus "1 to 2 hours" narrow rather than widen.
 * An empty axis is not a filter — it is the absence of one — so it matches
 * everything rather than nothing.
 */
export function filterOrganizations(all: Organization[], filter: CatalogueFilter): Organization[] {
  const query = filter.search.trim().toLowerCase();

  return all.filter((org) => {
    if (query && !`${org.name} ${org.blurb}`.toLowerCase().includes(query)) return false;
    if (filter.categories.length && !filter.categories.includes(org.category)) return false;
    if (filter.costs.length && !filter.costs.includes(org.cost)) return false;
    if (filter.times.length && !filter.times.includes(org.time)) return false;
    if (filter.joining.length && !filter.joining.includes(org.joining)) return false;
    return true;
  });
}

/** How many values are chosen across every axis. The pill bar reads this. */
export function activeFilterCount(filter: CatalogueFilter): number {
  return (
    filter.categories.length + filter.costs.length + filter.times.length + filter.joining.length
  );
}

export function isFilterEmpty(filter: CatalogueFilter): boolean {
  return activeFilterCount(filter) === 0 && filter.search.trim() === "";
}

/** Toggle one value on one axis. The popovers apply on click; there is no Apply. */
export function toggleFilterValue<K extends "categories" | "costs" | "times" | "joining">(
  filter: CatalogueFilter,
  axis: K,
  value: CatalogueFilter[K][number],
): CatalogueFilter {
  const current = filter[axis] as string[];
  const next = current.includes(value as string)
    ? current.filter((entry) => entry !== value)
    : [...current, value as string];
  return { ...filter, [axis]: next } as CatalogueFilter;
}

/* -------------------------------------------------------------------------
   The fair route — what the Interest list is for
   ---------------------------------------------------------------------- */

export type FairStop = {
  organization: Organization;
  /** 1-based within the whole route, so a stop has a number a student can follow. */
  number: number;
};

export type FairLeg = {
  zone: FairZoneCode;
  zoneLabel: string;
  stops: FairStop[];
};

/**
 * The Interest list, regrouped by fair zone.
 *
 * **That regrouping is the entire difference between a list of saves and a
 * route.** Ordered by the order things were marked, it is "things I liked";
 * ordered by where the tables are, it is "where I walk". Wanderlog and Google
 * Maps Timeline both do exactly this, and both are unreadable without it.
 */
export function buildFairRoute(interestIds: string[]): FairLeg[] {
  const marked = interestIds
    .map((id) => organizations.find((org) => org.id === id))
    .filter((org): org is Organization => Boolean(org));

  let number = 0;
  return fairZones
    .map((zone) => {
      const stops = marked
        .filter((org) => org.zone === zone.value)
        .sort((a, b) => a.table - b.table)
        .map((organization) => {
          number += 1;
          return { organization, number };
        });
      return { zone: zone.value, zoneLabel: zone.label, stops };
    })
    .filter((leg) => leg.stops.length > 0);
}

/** `7 organizations · 3 fair zones · about 45 min`. */
export function fairRouteSummary(legs: FairLeg[]) {
  const stops = legs.reduce((total, leg) => total + leg.stops.length, 0);
  const walking = Math.max(0, legs.length - 1) * involvementFair.minutesBetweenZones;
  return {
    stops,
    zones: legs.length,
    minutes: stops * involvementFair.minutesPerStop + walking,
  };
}

/* -------------------------------------------------------------------------
   Labels
   ---------------------------------------------------------------------- */

export function categoryLabel(code: CategoryCode) {
  return categories.find((entry) => entry.value === code)?.label ?? code;
}

export function costLabel(code: CostBand, short = false) {
  const band = costBands.find((entry) => entry.value === code);
  return (short ? band?.short : band?.label) ?? code;
}

export function timeLabel(code: TimeBand, short = false) {
  const band = timeBands.find((entry) => entry.value === code);
  return (short ? band?.short : band?.label) ?? code;
}

export function joiningLabel(code: JoiningCode, short = false) {
  const route = joiningRoutes.find((entry) => entry.value === code);
  return (short ? route?.short : route?.label) ?? code;
}

export function organizationById(id: string) {
  return organizations.find((org) => org.id === id);
}
