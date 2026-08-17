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
        built: true,
      },
      {
        id: "enrollment",
        path: "/portal/enrollment",
        label: "My Enrollment",
        icon: ListChecksIcon,
        future:
          "All twelve requirements in one list, in the order that serves you, with what you have already finished underneath.",
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
      },
      {
        id: "campus-life",
        path: "/portal/campus-life",
        label: "My Campus Life",
        icon: UsersThreeIcon,
        future: "The organisations you joined, what is on this week, and where.",
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
      },
      {
        id: "documents",
        path: "/portal/documents",
        label: "My Documents",
        icon: FileTextIcon,
        future: "Everything you have sent us, and everything we hold about you.",
      },
      {
        id: "appointments",
        path: "/portal/appointments",
        label: "Appointments",
        icon: CalendarCheckIcon,
        future:
          "Book a time with financial aid, your adviser or student support, without going through a topic first.",
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
      },
      {
        id: "profile",
        path: "/portal/profile",
        label: "Profile",
        icon: UserCircleIcon,
        future: "Your name, your contact details and who may see your record.",
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
