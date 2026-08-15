/**
 * Housing, in the shape a U.S. university actually publishes it.
 *
 * The previous fixture was a plausible guess: four room types, three bathroom
 * arrangements, a walk time and a photo. The previous spec then declared this
 * screen already correct and touched nothing. The record was the part that was
 * wrong, and it is the part every comparison on the screen is made of.
 *
 * What real housing directories publish, and this now carries: room types with
 * explicit occupancy, bathroom as an enum of five, air conditioning, laundry,
 * capacity in beds, year built and renovated, learning communities, gender
 * configuration, class-year eligibility, walk time, dining, a canonical
 * amenities list, and a price per room type.
 *
 * **Meal plan is priced separately from the room, and the screen says so.**
 * Roughly half of U.S. universities bundle and half separate; without declaring
 * a convention the same "double" ranges from $3,556 to $15,568 across the
 * sector and no number on the screen is comparable to any other.
 *
 * API-shaped rather than screen-shaped: codes rather than sentences, a flat
 * `photos` array with a `kind` on each frame, and the shortlist size supplied
 * by the institution rather than hardcoded in a component. This data will come
 * from the university, and a fixture you have to rewrite on the day the
 * endpoint is real is a fixture that proved nothing.
 */

import type { Photo } from "@/lib/fixtures";

/* -------------------------------------------------------------------------
   Codes
   ---------------------------------------------------------------------- */

/** Room types, with occupancy explicit. "Double" without "two people" is a guess. */
export type RoomTypeCode = "single" | "double" | "triple" | "suite" | "apartment";

export const roomTypes: Record<RoomTypeCode, { label: string; occupancy: number }> = {
  single: { label: "Single", occupancy: 1 },
  double: { label: "Double", occupancy: 2 },
  triple: { label: "Triple", occupancy: 3 },
  suite: { label: "Suite bedroom", occupancy: 2 },
  apartment: { label: "Apartment bedroom", occupancy: 1 },
};

/**
 * The five arrangements every U.S. housing directory distinguishes between.
 * The three-value version this replaces collapsed suite-style and connecting
 * into "semi-private", which is the difference between sharing a bathroom with
 * five people and sharing it with one.
 */
export type BathroomCode = "community" | "semi-private" | "suite-style" | "connecting" | "private";

export const bathroomLabels: Record<BathroomCode, string> = {
  community: "Community bathroom on each floor",
  "semi-private": "Semi-private, shared with one other room",
  "suite-style": "Suite bathroom, shared with your suite",
  connecting: "Connecting bathroom between two rooms",
  private: "Private bathroom",
};

export const bathroomShort: Record<BathroomCode, string> = {
  community: "Community",
  "semi-private": "Semi-private",
  "suite-style": "Suite-style",
  connecting: "Connecting",
  private: "Private",
};

export type LaundryCode = "in-unit" | "in-building" | "nearby";

export const laundryLabels: Record<LaundryCode, string> = {
  "in-unit": "In your apartment",
  "in-building": "In the building",
  nearby: "In the building next door",
};

export type EligibilityCode =
  | "first-year-only"
  | "first-year-priority"
  | "upper-years"
  | "all-years";

export const eligibilityLabels: Record<EligibilityCode, string> = {
  "first-year-only": "First years only",
  "first-year-priority": "First years get priority",
  "upper-years": "Second year and above",
  "all-years": "Open to all years",
};

export type GenderConfigCode =
  | "coed-by-floor"
  | "coed-by-room"
  | "single-gender-wings"
  | "all-gender";

export const genderConfigLabels: Record<GenderConfigCode, string> = {
  "coed-by-floor": "Coed, single gender by floor",
  "coed-by-room": "Coed, single gender by room",
  "single-gender-wings": "Single gender wings",
  "all-gender": "All gender, any room",
};

export type ResidencePhotoKind = "room" | "common" | "exterior";

export const photoKindLabels: Record<ResidencePhotoKind, string> = {
  room: "Bedroom",
  common: "Common area",
  exterior: "Exterior",
};

export type ResidencePhoto = Photo & { kind: ResidencePhotoKind };

/** The canonical amenities list. A free-text list would not filter or compare. */
export type AmenityCode =
  | "study-lounge"
  | "kitchen-per-floor"
  | "practice-rooms"
  | "bike-storage"
  | "elevator"
  | "print-station"
  | "courtyard"
  | "game-room"
  | "gym";

export const amenityLabels: Record<AmenityCode, string> = {
  "study-lounge": "Study lounge",
  "kitchen-per-floor": "Kitchen on each floor",
  "practice-rooms": "Music practice rooms",
  "bike-storage": "Bike storage",
  elevator: "Elevator",
  "print-station": "Print station",
  courtyard: "Courtyard",
  "game-room": "Game room",
  gym: "Gym",
};

/* -------------------------------------------------------------------------
   The record
   ---------------------------------------------------------------------- */

export type Residence = {
  id: string;
  name: string;
  /** One line: the thing that is true about this place and no other. */
  summary: string;
  campusArea: string;
  /** Minutes on foot to the middle of campus, as Housing Services publishes it. */
  walkMinutes: number;
  floors: number;
  /** Beds, not rooms. Capacity is published in beds everywhere. */
  capacityBeds: number;
  yearBuilt: number;
  /** Absent where the building has never been renovated. Drives a +15% rate. */
  yearRenovated?: number;
  roomTypes: RoomTypeCode[];
  bathroom: BathroomCode;
  /** The strongest single price driver in the real data, and it behaves that way here. */
  airConditioning: boolean;
  laundry: LaundryCode;
  /** The dining hall attached to or nearest this residence. */
  diningHall: string;
  /** Named living-learning communities. A flat surcharge, not a multiplier. */
  learningCommunities: string[];
  genderConfig: GenderConfigCode;
  eligibility: EligibilityCode;
  amenities: AmenityCode[];
  /**
   * Ordered as the carousel shows them, room first. "What would my room
   * actually be like" is the question being asked, and no photograph of a
   * facade answers it.
   *
   * FIXTURE NOTE: a real directory returns ten to fifteen frames per building.
   * Three ship here because three are the photographs this repo owns, and
   * inventing filenames for images that do not exist would break the gallery
   * rather than enrich it.
   */
  photos: ResidencePhoto[];
};

/* -------------------------------------------------------------------------
   Pricing
   ---------------------------------------------------------------------- */

/**
 * Rates are **derived, not typed out**, so the ratios the real sector data
 * shows are enforced by arithmetic rather than by whoever edits the fixture
 * next getting them right from memory.
 *
 * The ratios, from published U.S. rate sheets:
 *
 * - triple ≈ 0.87× double
 * - single ≈ 1.15× double
 * - private or connecting bathroom ≈ +10%
 * - renovated within the last fifteen years ≈ +15%
 * - air conditioning ≈ +12%, the strongest single driver
 * - a learning community is a **flat** surcharge, never a multiplier
 *
 * Per person, per academic year. Meal plan is not in it.
 */
export const BASE_DOUBLE_USD = 6800;
export const LEARNING_COMMUNITY_SURCHARGE_USD = 400;

const ROOM_RATIO: Record<RoomTypeCode, number> = {
  triple: 0.87,
  double: 1,
  suite: 1.08,
  single: 1.15,
  apartment: 1.28,
};

/** What one person pays for one room type in one residence, for the year. */
export function roomRate(residence: Residence, room: RoomTypeCode, year = 2027): number {
  let rate = BASE_DOUBLE_USD * ROOM_RATIO[room];
  if (residence.bathroom === "private" || residence.bathroom === "connecting") rate *= 1.1;
  if (residence.yearRenovated && year - residence.yearRenovated <= 15) rate *= 1.15;
  if (residence.airConditioning) rate *= 1.12;
  if (residence.learningCommunities.length > 0) rate += LEARNING_COMMUNITY_SURCHARGE_USD;
  // Rounded to the nearest ten, the way a rate sheet is published.
  return Math.round(rate / 10) * 10;
}

/** The cheapest room in a residence, which is what a card should carry. */
export function lowestRate(residence: Residence): number {
  return Math.min(...residence.roomTypes.map((room) => roomRate(residence, room)));
}

export function highestRate(residence: Residence): number {
  return Math.max(...residence.roomTypes.map((room) => roomRate(residence, room)));
}

/* -------------------------------------------------------------------------
   The catalogue
   ---------------------------------------------------------------------- */

export type HousingAvailability = {
  academicYear: string;
  /** How many ranked preferences this institution accepts. Three, here. */
  shortlistSize: number;
  /**
   * Stated on screen, because a room rate that silently excludes food is how a
   * student budgets $6,800 for a year that costs $12,000.
   */
  mealPlanSeparate: true;
  mealPlanFromUsd: number;
  residences: Residence[];
};

export const housingAvailability: HousingAvailability = {
  academicYear: "2027-28",
  shortlistSize: 3,
  mealPlanSeparate: true,
  mealPlanFromUsd: 4250,
  residences: [
    {
      id: "aster-residence-hall",
      name: "Aster Residence Hall",
      summary: "The traditional halls on the quad, with the dining hall attached.",
      campusArea: "The Quad",
      walkMinutes: 4,
      floors: 4,
      capacityBeds: 520,
      yearBuilt: 1962,
      roomTypes: ["double", "triple"],
      bathroom: "community",
      airConditioning: false,
      laundry: "in-building",
      diningHall: "Quad Dining",
      learningCommunities: [],
      genderConfig: "coed-by-floor",
      eligibility: "first-year-only",
      amenities: ["study-lounge", "print-station", "bike-storage", "game-room"],
      photos: [
        {
          kind: "room",
          src: "/images/residences/aster-residence-hall-room.webp",
          alt: "A single dorm room with a bed against the wall, a white desk and chair, and a tall window overlooking trees",
        },
        {
          kind: "exterior",
          src: "/images/residences/aster-residence-hall-exterior.webp",
          alt: "A four-storey brick residence hall with a covered porch and an external staircase, on a lawn in full sun",
        },
        {
          kind: "common",
          src: "/images/residences/aster-residence-hall-common.webp",
          alt: "A double-height common room with sofas, low stools and a glass wall looking onto the grounds",
        },
      ],
    },
    {
      id: "linden-house",
      name: "Linden House",
      summary: "The smallest house in the catalogue, and the closest to everything.",
      campusArea: "The Quad",
      walkMinutes: 3,
      floors: 3,
      capacityBeds: 180,
      yearBuilt: 1948,
      yearRenovated: 2019,
      roomTypes: ["double"],
      bathroom: "community",
      airConditioning: false,
      laundry: "in-building",
      diningHall: "Quad Dining",
      learningCommunities: ["Writers House"],
      genderConfig: "all-gender",
      eligibility: "first-year-only",
      amenities: ["study-lounge", "kitchen-per-floor", "courtyard"],
      photos: [
        {
          kind: "room",
          src: "/images/residences/linden-house-room.webp",
          alt: "A shared room with two wooden beds under white covers, a chest of drawers and a curtained window between them",
        },
        {
          kind: "exterior",
          src: "/images/residences/linden-house-exterior.webp",
          alt: "A low red-brick building with wide windows and a young tree on the grass in front of it",
        },
        {
          kind: "common",
          src: "/images/residences/linden-house-common.webp",
          alt: "A plain dining corner with a wooden table, four chairs, a bowl of fruit and a potted plant by the window",
        },
      ],
    },
    {
      id: "kestrel-hall",
      name: "Kestrel Hall",
      summary: "Halls again, but quieter, and the study lounge is the good one.",
      campusArea: "North Campus",
      walkMinutes: 6,
      floors: 5,
      capacityBeds: 430,
      yearBuilt: 1971,
      yearRenovated: 2015,
      roomTypes: ["single", "double"],
      bathroom: "community",
      airConditioning: true,
      laundry: "in-building",
      diningHall: "North Commons",
      learningCommunities: [],
      genderConfig: "coed-by-floor",
      eligibility: "first-year-priority",
      amenities: ["study-lounge", "practice-rooms", "elevator", "print-station"],
      photos: [
        {
          kind: "room",
          src: "/images/residences/kestrel-hall-room.webp",
          alt: "A dorm room with a green-covered bed, a slim white desk and chair, and a wide blinded window above the desk",
        },
        {
          kind: "exterior",
          src: "/images/residences/kestrel-hall-exterior.webp",
          alt: "A long red-brick hall with a white colonnaded entrance, seen across a lawn split by a brick path",
        },
        {
          kind: "common",
          src: "/images/residences/kestrel-hall-common.webp",
          alt: "Two armchairs and a small round table in front of a wall of open timber bookshelves",
        },
      ],
    },
    {
      id: "maple-court",
      name: "Maple Court",
      summary: "Suites of four or five, sharing a bathroom and a kitchen table.",
      campusArea: "North Campus",
      walkMinutes: 9,
      floors: 4,
      capacityBeds: 360,
      yearBuilt: 2004,
      roomTypes: ["single", "suite"],
      bathroom: "suite-style",
      airConditioning: true,
      laundry: "in-building",
      diningHall: "North Commons",
      learningCommunities: ["Global House"],
      genderConfig: "coed-by-room",
      eligibility: "first-year-priority",
      amenities: ["study-lounge", "kitchen-per-floor", "elevator", "bike-storage"],
      photos: [
        {
          kind: "room",
          src: "/images/residences/maple-court-room.webp",
          alt: "A bedroom with a black metal bed frame on a wooden floor, a wardrobe alongside and daylight from two windows",
        },
        {
          kind: "exterior",
          src: "/images/residences/maple-court-exterior.webp",
          alt: "Students walking a path across a lawn towards a brick and glass building with a projecting upper floor",
        },
        {
          kind: "common",
          src: "/images/residences/maple-court-common.webp",
          alt: "A laid dining table with four chairs against an exposed brick wall, beside a tall fridge and a bright window",
        },
      ],
    },
    {
      id: "student-village",
      name: "Student Village",
      summary: "Newest buildings, quietest end of campus, study rooms on every floor.",
      campusArea: "West Campus",
      walkMinutes: 15,
      floors: 3,
      capacityBeds: 610,
      yearBuilt: 2016,
      roomTypes: ["single", "double"],
      bathroom: "semi-private",
      airConditioning: true,
      laundry: "in-building",
      diningHall: "West Table",
      learningCommunities: ["Sustainability Living", "Health Sciences"],
      genderConfig: "all-gender",
      eligibility: "all-years",
      amenities: ["study-lounge", "kitchen-per-floor", "elevator", "gym", "print-station"],
      photos: [
        {
          kind: "room",
          src: "/images/residences/student-village-room.webp",
          alt: "A white single room with a made bed, a pale wood desk under the window and a mirror on the wall",
        },
        {
          kind: "exterior",
          src: "/images/residences/student-village-exterior.webp",
          alt: "A long, low modern building in brick and glass behind a wide clipped lawn under a blue sky",
        },
        {
          kind: "common",
          src: "/images/residences/student-village-common.webp",
          alt: "Students working on laptops on beanbags and low sofas in a plywood-lined study room with a picture window",
        },
      ],
    },
    {
      id: "harborview-commons",
      name: "Harborview Commons",
      summary: "Your own bathroom, and the longest walk of anywhere on campus.",
      campusArea: "Harborview",
      walkMinutes: 18,
      floors: 6,
      capacityBeds: 290,
      yearBuilt: 2009,
      yearRenovated: 2022,
      roomTypes: ["single", "suite"],
      bathroom: "private",
      airConditioning: true,
      laundry: "in-building",
      diningHall: "Harbor Kitchen",
      learningCommunities: [],
      genderConfig: "all-gender",
      eligibility: "upper-years",
      amenities: ["study-lounge", "elevator", "gym", "courtyard", "bike-storage"],
      photos: [
        {
          kind: "room",
          src: "/images/residences/harborview-commons-room.webp",
          alt: "A white room with a low bed, framed prints above it and a desk and wooden chair beside a floor-to-ceiling window",
        },
        {
          kind: "exterior",
          src: "/images/residences/harborview-commons-exterior.webp",
          alt: "A modern timber-and-glass building at the edge of a sunlit lawn, with mature trees along the path to it",
        },
        {
          kind: "common",
          src: "/images/residences/harborview-commons-common.webp",
          alt: "Three dark sofas around a low table on a concrete floor, seen from above, one student sitting with a phone",
        },
      ],
    },
    {
      id: "aster-apartments",
      name: "Aster Apartments",
      summary: "Four-person flats with a full kitchen and nobody's meal plan to work around.",
      campusArea: "West Campus",
      walkMinutes: 12,
      floors: 4,
      capacityBeds: 340,
      yearBuilt: 2011,
      roomTypes: ["apartment"],
      bathroom: "connecting",
      airConditioning: true,
      laundry: "in-unit",
      diningHall: "West Table",
      learningCommunities: [],
      genderConfig: "coed-by-room",
      eligibility: "upper-years",
      amenities: ["kitchen-per-floor", "bike-storage", "elevator", "courtyard"],
      photos: [
        {
          kind: "room",
          src: "/images/residences/aster-apartments-room.webp",
          alt: "A bedroom with a metal-framed bed, a long desk with a task chair, and a bright window above the desk",
        },
        {
          kind: "exterior",
          src: "/images/residences/aster-apartments-exterior.webp",
          alt: "Two brick apartment blocks facing each other across a paved courtyard with clipped hedges and trees",
        },
        {
          kind: "common",
          src: "/images/residences/aster-apartments-common.webp",
          alt: "A shared flat kitchen with white units, an oven, a coffee machine and a round dining table by a glazed door",
        },
      ],
    },
    {
      id: "quarry-ridge",
      name: "Quarry Ridge",
      summary: "Studios at the far edge of campus, on the shuttle line rather than the path.",
      campusArea: "Quarry Ridge",
      walkMinutes: 20,
      floors: 7,
      capacityBeds: 240,
      yearBuilt: 2001,
      yearRenovated: 2024,
      roomTypes: ["apartment"],
      bathroom: "private",
      airConditioning: true,
      laundry: "in-unit",
      diningHall: "Harbor Kitchen",
      learningCommunities: [],
      genderConfig: "all-gender",
      eligibility: "upper-years",
      amenities: ["elevator", "gym", "bike-storage", "study-lounge"],
      photos: [
        {
          kind: "room",
          src: "/images/residences/quarry-ridge-room.webp",
          alt: "A studio with a long desk and wooden chair in the foreground and a made bed by a floor-to-ceiling window",
        },
        {
          kind: "exterior",
          src: "/images/residences/quarry-ridge-exterior.webp",
          alt: "Pale apartment towers behind a wide lawn with benches and clipped planting along a paved walk",
        },
        {
          kind: "common",
          src: "/images/residences/quarry-ridge-common.webp",
          alt: "An open-plan flat with a kitchen counter, a dining table by tall windows and a red armchair in the corner",
        },
      ],
    },
  ],
};

export const residences = housingAvailability.residences;

export function residenceById(id: string): Residence | undefined {
  return residences.find((residence) => residence.id === id);
}

/** Photo counts per room category, for the shortcut row under the hero. */
export function photoSections(residence: Residence) {
  const kinds: ResidencePhotoKind[] = ["room", "common", "exterior"];
  return kinds
    .map((kind) => ({
      kind,
      label: photoKindLabels[kind],
      photos: residence.photos.filter((photo) => photo.kind === kind),
    }))
    .filter((section) => section.photos.length > 0);
}
