import { addDays, daysBetween, TODAY } from "@/lib/portal";

/**
 * Appointments: three services, a short run of days, and slots inside a day.
 *
 * **The Area whose absence started this entire body of work.** The client,
 * hunting the portal that shipped: *"Cadê a pointment na side bar? Então quer
 * dizer que eu não posso simplesmente marcar um, sei lá, um suporte em algum dia
 * específico?"* The sidebar row arrived last cycle; this is the module that lets
 * it answer.
 *
 * **Built to the depth the demonstration needs and no deeper.** Three services, a
 * fortnight of weekdays, six slots a day, one booking at a time. There is no
 * rescheduling policy, no staff profile, no availability rule and no calendar
 * integration — a screen that books a time and shows it back is the whole claim,
 * and anything past it is the next cycle inventing itself.
 *
 * Like `portal.ts`, it **reads no clock**: `TODAY` is the fixture, the run of
 * days is derived from it, and which slots are already taken is derived from the
 * slot's own identity rather than drawn at random. A prototype whose free slots
 * move between two screenshots is a prototype nobody can review.
 */

/* -------------------------------------------------------------------------
   The three services
   ---------------------------------------------------------------------- */

export type ServiceId = "financial-aid" | "academic-advising" | "student-support";

export type Service = {
  id: ServiceId;
  /** Named as the thing a student would book, not as the department that owns it. */
  label: string;
  /** One line of what this appointment is actually for. */
  blurb: string;
  /** Who they will be sitting with. The same field a Requirement carries. */
  office: string;
  minutes: number;
};

/**
 * Three, and they are the three the client named in the same breath as the
 * complaint — money, the adviser, and somebody to talk to. Each is bookable
 * directly rather than through a topic first, which was the second half of what
 * she was objecting to: *"Eu tenho que entrar em financials para falar aqui?"*
 */
export const services: readonly Service[] = [
  {
    id: "financial-aid",
    label: "Talk about paying for this",
    blurb: "Your award, your bill, a payment plan, or what to do if none of it adds up.",
    office: "Financial Aid",
    minutes: 30,
  },
  {
    id: "academic-advising",
    label: "Talk to an academic adviser",
    blurb: "Which courses to take first term, and what your programme expects of you.",
    office: "Academic Advising",
    minutes: 30,
  },
  {
    id: "student-support",
    label: "Talk to student support",
    blurb: "Anything else — settling in, accommodations, or something that is going wrong.",
    office: "Student Support",
    minutes: 45,
  },
];

export function serviceById(id: ServiceId): Service {
  const service = services.find((candidate) => candidate.id === id);
  // Unreachable while `ServiceId` and the list agree, which is the point of the
  // union — but a lookup returning `undefined` would render a blank screen.
  if (!service) throw new Error(`Unknown service: ${id}`);
  return service;
}

/* -------------------------------------------------------------------------
   Days and slots
   ---------------------------------------------------------------------- */

/**
 * The hours an office keeps, as a list rather than as a rule.
 *
 * Six a day with the lunch hour missing, which is what makes it read as an
 * office's day rather than as a grid generated from a start and a step.
 */
export const SLOT_TIMES = ["09:00", "10:00", "11:00", "13:30", "14:30", "15:30"] as const;

/** How far ahead the office is taking bookings. A fortnight, in weekdays. */
const WEEKDAYS_AHEAD = 10;

export type Slot = {
  /** `financial-aid-2027-08-09-09:00` — stable, so a booking is one string. */
  id: string;
  date: string;
  time: string;
  /** Already gone. Derived from the slot's identity, never from a clock or a die. */
  taken: boolean;
};

export type Day = {
  date: string;
  slots: Slot[];
};

/** Saturday and Sunday, in UTC, because every date in this repo is a UTC fixture. */
function isWeekend(iso: string): boolean {
  const day = new Date(`${iso}T00:00:00Z`).getUTCDay();
  return day === 0 || day === 6;
}

/**
 * A stable integer for a string. Not cryptography and not trying to be — it is
 * how a fixture gets a plausible pattern of taken slots that is the same on
 * every machine, on every run, and in every screenshot.
 */
function fingerprint(text: string): number {
  let value = 0;
  for (let index = 0; index < text.length; index += 1) {
    value = (value * 31 + text.charCodeAt(index)) | 0;
  }
  return Math.abs(value);
}

/**
 * The days this service is taking, starting the day after today.
 *
 * Not today: an office that offers a slot at 09:00 on the day you are reading
 * the screen is offering something it cannot honour, and "the soonest is
 * tomorrow" is a truthful thing for a university to say.
 */
export function daysFor(service: ServiceId, today: string = TODAY): Day[] {
  const days: Day[] = [];
  let cursor = today;

  while (days.length < WEEKDAYS_AHEAD) {
    cursor = addDays(cursor, 1);
    if (isWeekend(cursor)) continue;
    days.push({
      date: cursor,
      slots: SLOT_TIMES.map((time) => ({
        id: `${service}-${cursor}-${time}`,
        date: cursor,
        time,
        /* Roughly a third gone, and always the same third. */
        taken: fingerprint(`${service}-${cursor}-${time}`) % 3 === 0,
      })),
    });
  }

  return days;
}

/** How many slots on a day are still free — the count the day's row shows. */
export function freeSlots(day: Day): number {
  return day.slots.filter((slot) => !slot.taken).length;
}

/**
 * The first free slot across the whole run, which is what a student who does not
 * care when is actually asking for.
 */
export function soonestSlot(service: ServiceId, today: string = TODAY): Slot | undefined {
  for (const day of daysFor(service, today)) {
    const free = day.slots.find((slot) => !slot.taken);
    if (free) return free;
  }
  return undefined;
}

/* -------------------------------------------------------------------------
   The booking
   ---------------------------------------------------------------------- */

/**
 * One booking at a time, held in the portal's own slice.
 *
 * A list of bookings would need a cancellation policy, a past/upcoming split and
 * a rule about double-booking the same hour — three decisions this cycle
 * deliberately does not take. Booking a second time replaces the first, and the
 * screen says so rather than leaving the student to discover it.
 */
export type Booking = {
  service: ServiceId;
  date: string;
  time: string;
};

/** `Mon 9 Aug` — the day as a student reads it in a list of days. */
export function formatDay(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** `9:00 am`, from the 24-hour fixture the slots are written in. */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours < 12 ? "am" : "pm";
  const hour = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

/** `Tomorrow`, `In 3 days` — the distance, beside the date rather than instead of it. */
export function daysAway(iso: string, today: string = TODAY): string {
  const days = daysBetween(today, iso);
  if (days === 1) return "Tomorrow";
  return `In ${days} days`;
}
