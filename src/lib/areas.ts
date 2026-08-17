import {
  CalendarCheckIcon,
  ChatCircleDotsIcon,
  CreditCardIcon,
  FileTextIcon,
  GraduationCapIcon,
  type Icon,
  ListChecksIcon,
  SquaresFourIcon,
  UserCircleIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";

/**
 * The nine Areas, in three groups. The portal's whole map, in one list.
 *
 * The defect this closes is the client's, hunting for something she knew
 * existed: *"Cadê a pointment na side bar? Então quer dizer que eu não posso
 * simplesmente marcar um suporte em algum dia específico. Eu tenho que entrar em
 * financials para falar aqui, entendeu?"* In the portal that shipped
 * `/appointments` is a real page with no nav entry, reachable only from inside
 * Financials. A sidebar that does not contain everything the portal can do
 * teaches the student that not finding something means it does not exist.
 *
 * **Grouped, because nine flat rows is the point at which a list stops being
 * scannable** — which is precisely why the client searched instead of seeing.
 * The grouping is also what buys the rows their reduced height: the headings do
 * the work the vertical space was doing (Render, Remote, Dovetail).
 *
 * `Edward AI` is not here. An assistant with a sidebar row is a place you go; a
 * floating button is a thing you have while doing something else, and only the
 * second one gets used. Its FAB is the next cycle's, and nothing stands in for
 * it meanwhile — a floating control that does nothing is worse than none.
 */

export type AreaId =
  | "dashboard"
  | "enrollment"
  | "classrooms"
  | "campus-life"
  | "financials"
  | "documents"
  | "appointments"
  | "messages"
  | "profile";

export type Area = {
  id: AreaId;
  path: string;
  label: string;
  icon: Icon;
  /**
   * What will live here, in one sentence that is **true**.
   *
   * "Your bill, payment plans and financial aid will live here" is true;
   * "coming soon" is filler. It is what the shared placeholder prints, and the
   * reason there is one placeholder rather than seven bespoke empty screens —
   * seven shallow screens cost days, answer no design question, and are the
   * *"entregando pouco"* the client and the designer named on the call.
   */
  future: string;
  /**
   * Three or four things that will live here, named the way the student would
   * name them.
   *
   * **Honest was right; empty is not the same as honest.** Seven screens that
   * stopped three lines in, with 580px of Ground under them, is what made the
   * whole portal read as unfinished in a walkthrough — and the fix is not an
   * illustration or a progress bar, it is *saying what the thing is*. These are
   * the things themselves, not a roadmap: no dates, no counts, nothing that
   * could turn out to be a promise somebody has to keep.
   */
  willLive: readonly string[];
  /**
   * One sentence about acting on this subject **today** — where, or why there
   * is nowhere.
   *
   * Both halves are information. `My Classrooms` and `Messages` have no
   * destination, and the sweep found that saying nothing at all left them ending
   * in 379px of Ground — so they say *why* instead, which is a fact the student
   * can use ("your courses appear once you have registered") rather than a
   * block added to fill a screen.
   */
  meanwhile: string;
  /**
   * The destination, when there is a real one.
   *
   * Every pointer here goes to a screen that exists and really does the work —
   * mostly back into the gate, which is where the only finished versions of
   * these things are. It is never a link to another placeholder: a dead end
   * dressed as a door is worse than an honest wall.
   */
  pointer?: {
    label: string;
    path: string;
  };
  /** Built in this cycle. Everything else declares honestly that it is not. */
  built?: boolean;
};

export type AreaGroup = {
  /** Uppercase in the sidebar, at the metadata step. Absent for the two clusters. */
  label?: string;
  areas: readonly Area[];
};

/**
 * Four clusters, three of which the sidebar labels.
 *
 * The unlabelled cluster at the top is where a student goes by default rather
 * than by category (Dovetail), and the unlabelled pair at the foot is the
 * personal end of the list — where every product this design looked at puts
 * messages and the account.
 */
export const areaGroups: readonly AreaGroup[] = [
  {
    areas: [
      {
        id: "dashboard",
        path: "/portal/dashboard",
        label: "Dashboard",
        icon: SquaresFourIcon,
        future: "",
        willLive: [],
        meanwhile: "",
        built: true,
      },
      {
        id: "enrollment",
        path: "/portal/enrollment",
        label: "My Enrollment",
        icon: ListChecksIcon,
        future:
          "All twelve requirements in one list, in the order that serves you, with what you have already finished underneath.",
        willLive: [
          "All twelve requirements in one list",
          "Ordering by what is smartest, what is due soonest, or what is quickest",
          "What the university is holding, and which office is holding it",
          "What you have already finished, summarised underneath",
        ],
        meanwhile:
          "The three you can act on now are on the Dashboard, with the rest of the list under them.",
        pointer: {
          label: "Go to the Dashboard",
          path: "/portal/dashboard",
        },
      },
    ],
  },
  {
    label: "Academics",
    areas: [
      {
        id: "classrooms",
        path: "/portal/classrooms",
        label: "My Classrooms",
        icon: GraduationCapIcon,
        future: "Your courses, your timetable and the work each one has set.",
        willLive: [
          "Your courses this term, and where each one meets",
          "Your timetable for the week",
          "The work each course has set, and when it is due",
          "Your grades, once there are any",
        ],
        /* No pointer, and that is the finding rather than an omission: nothing
           in this product registers a course yet, so every candidate
           destination is another screen that is not built. The sentence says so
           — a student who is told why there is nowhere to go has been told
           something; one who is told nothing has been shown a wall. */
        meanwhile:
          "There is nowhere to go for this yet. Your courses appear here once you have registered for them, and registering for courses is one of the twelve on your list.",
      },
      {
        id: "campus-life",
        path: "/portal/campus-life",
        label: "My Campus Life",
        icon: UsersThreeIcon,
        future: "The organisations you joined, what is on this week, and where.",
        willLive: [
          "The organisations you joined, and when they meet",
          "What is on this week, and where",
          "Your route round the Involvement Fair",
          "Sign-ups and tickets you are holding",
        ],
        meanwhile:
          "The organisations you marked while accepting your offer are still there, with your route round the fair.",
        pointer: {
          label: "Open Campus life",
          path: "/onboarding/campus-life",
        },
      },
    ],
  },
  {
    label: "Admin",
    areas: [
      {
        id: "financials",
        path: "/portal/financials",
        label: "My Financials",
        icon: CreditCardIcon,
        future: "Your bill, your payment plan and your financial aid.",
        willLive: [
          "Your bill for the term, and what is on it",
          "What you have paid, and what is left",
          "Your financial aid award, and the documents behind it",
          "A payment plan, if you need to spread it",
        ],
        meanwhile:
          "The enrollment deposit is the one payment you can make today, and it comes off your first-term bill.",
        pointer: {
          label: "Secure your place",
          path: "/onboarding/deposit",
        },
      },
      {
        id: "documents",
        path: "/portal/documents",
        label: "My Documents",
        icon: FileTextIcon,
        future: "Everything you have sent us, and everything we hold about you.",
        willLive: [
          "Everything you have sent us, with the day it arrived",
          "Everything we hold about you, and who may see it",
          "What is still missing, and which office is waiting for it",
          "The agreement you signed, to read again",
        ],
        meanwhile:
          "The enrollment agreement you signed, and the packet it came in, are on Review and sign.",
        pointer: {
          label: "Open Review and sign",
          path: "/onboarding/review",
        },
      },
      {
        id: "appointments",
        path: "/portal/appointments",
        label: "Appointments",
        icon: CalendarCheckIcon,
        future:
          "Book a time with financial aid, your adviser or student support, without going through a topic first.",
        willLive: [],
        meanwhile: "",
        built: true,
      },
    ],
  },
  {
    areas: [
      {
        id: "messages",
        path: "/portal/messages",
        label: "Messages",
        icon: ChatCircleDotsIcon,
        future: "What the university has sent you, and your replies to it.",
        willLive: [
          "What the university has sent you, newest first",
          "Which office each message came from",
          "Your replies, in the same thread",
          "What still needs an answer from you",
        ],
        /* No pointer either. Nothing in this product sends or receives a
           message, and "email Admissions" is a mailto dressed up as a feature. */
        meanwhile:
          "There is nowhere to go for this yet. Until it is built, the university writes to the email address you gave when you created your account.",
      },
      {
        id: "profile",
        path: "/portal/profile",
        label: "Profile",
        icon: UserCircleIcon,
        future: "Your name, your contact details and who may see your record.",
        willLive: [
          "Your legal name, and the name you go by",
          "Your contact details, and which of them we use",
          "Who may be told about your record, and what about it",
          "Your student number and your ID photograph",
        ],
        meanwhile:
          "Your name, your pronouns and your contact details are on Who you are, where you entered them.",
        pointer: {
          label: "Open Who you are",
          path: "/onboarding/who-you-are",
        },
      },
    ],
  },
];

/** The nine, flattened. Derived — never edited beside the grouping. */
export const areas: readonly Area[] = areaGroups.flatMap((group) => group.areas);

export function areaById(id: AreaId): Area {
  const area = areas.find((candidate) => candidate.id === id);
  // Unreachable while `AreaId` and the groups agree, which is the point of the
  // union — but a lookup returning `undefined` would render a blank shell.
  if (!area) throw new Error(`Unknown area: ${id}`);
  return area;
}
