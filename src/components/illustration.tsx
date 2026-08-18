import { cn } from "@/lib/utils";

/**
 * The drawn half of the imagery rule (ADR 0015).
 *
 * **Photography carries what is real** — the residences a student is ranking,
 * the campus they are moving to, their own card. **Illustration carries what is
 * abstract** — an empty state, an Area that is not built yet, the moment Points
 * are awarded.
 *
 * The division is not decorative and it is not a matter of taste. A student
 * choosing where to live needs to *judge a room*, and a drawing of a room
 * cannot be judged: it shows what somebody wanted the room to look like. The
 * apps that illustrate heavily do so because they have nothing real to show;
 * this product has residences, a campus and a person, so its photography is
 * information rather than atmosphere. What is left for drawing is exactly the
 * set of things that have no photograph because they have no referent yet.
 *
 * **They are geometric rather than figurative, and that is a decision.** The
 * catalogue's reference for this slot is Deputy's character work, and a
 * character drawn badly is worse than no character at all — it is the one kind
 * of asset a viewer can tell was improvised. What these do instead is build the
 * scene out of the system's own vocabulary: the card radius, the band's
 * gradient, the mint that already means done. An empty screen made of the
 * product's own shapes reads as part of the product rather than as a sticker
 * bought for it.
 *
 * **Every one of them lives inside a container** — a card, a Well, a Section —
 * and never as a full-bleed banner above the work. A drawing that spans the top
 * of a screen spends the fold budget on decoration, which is the trade this
 * cycle refused when it made the band contain its first unit rather than
 * precede it.
 *
 * They are inline SVG rather than files: they read the theme's colours through
 * `currentColor` and `var(--color-…)`, so a change to the palette moves them
 * with everything else instead of leaving four exported PNGs behind.
 */

export type Scene = "unbuilt" | "settled" | "reward";

const SIZE = {
  sm: "h-16",
  md: "h-24",
  lg: "h-32",
} as const;

/**
 * One drawn scene, sized by role.
 *
 * `aria-hidden` throughout: every place one of these appears already says in
 * words what the screen's state is, and an illustration that repeats the
 * sentence beside it into a screen reader is noise. If a drawing is ever the
 * only thing carrying a fact, that is the bug rather than the alt text.
 */
export function Illustration({
  scene,
  size = "md",
  className,
}: {
  scene: Scene;
  size?: keyof typeof SIZE;
  className?: string;
}) {
  const Scene = SCENES[scene];

  return (
    <svg
      aria-hidden
      viewBox="0 0 160 120"
      fill="none"
      className={cn("w-auto shrink-0", SIZE[size], className)}
    >
      <title>{scene}</title>
      <defs>
        <linearGradient id={`ill-brand-${scene}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-violet-500)" />
          <stop offset="100%" stopColor="var(--color-azure-500)" />
        </linearGradient>
      </defs>
      <Scene />
    </svg>
  );
}

/**
 * **An Area that is not built yet**: a room with its furniture in and one slot
 * still open.
 *
 * The dashed slot is the whole of what this has to say. A blank panel reads as
 * a screen that failed to load; a room with three things in it and a fourth
 * space clearly waiting reads as a room somebody is still furnishing, which is
 * the true state and the one the client has to be able to walk past in front of
 * a school (Cloaked's coloured cards standing in for what the user has not
 * reached yet).
 */
function Unbuilt() {
  return (
    <>
      <rect x="14" y="26" width="132" height="76" rx="14" fill="var(--color-violet-50)" />
      <rect x="26" y="40" width="44" height="14" rx="7" fill="url(#ill-brand-unbuilt)" />
      <rect x="26" y="60" width="60" height="8" rx="4" fill="var(--color-violet-200)" />
      <rect x="26" y="74" width="38" height="8" rx="4" fill="var(--color-violet-200)" />
      <rect
        x="92"
        y="40"
        width="42"
        height="42"
        rx="12"
        stroke="var(--color-violet-300)"
        strokeWidth="2"
        strokeDasharray="6 5"
      />
      <path
        d="M113 54v14M106 61h14"
        stroke="var(--color-violet-400)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </>
  );
}

/**
 * **Nothing is waiting on you**: the list, finished and put down.
 *
 * The mint check is the system's own "done" rather than a second vocabulary for
 * it, and the rows behind it are settled rather than absent — an empty state
 * that draws *nothing* says the screen is broken, and this screen is the
 * opposite of broken (Substack's finished items, visibly settled).
 */
function Settled() {
  return (
    <>
      <rect x="20" y="22" width="120" height="84" rx="16" fill="var(--color-mint-50)" />
      <rect x="34" y="40" width="66" height="8" rx="4" fill="var(--color-mint-200)" />
      <rect x="34" y="56" width="50" height="8" rx="4" fill="var(--color-mint-200)" />
      <rect x="34" y="72" width="58" height="8" rx="4" fill="var(--color-mint-200)" />
      <circle cx="116" cy="72" r="20" fill="var(--color-mint-500)" />
      <path
        d="M107 72.5l6.5 6.5L126 66"
        stroke="#ffffff"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  );
}

/**
 * **The moment Points are awarded**: the thing they turn into, arriving.
 *
 * It draws the *destination* rather than the number, which is ADR 0002 in a
 * picture — a Point with no named thing at the end of it is a scoreboard. What
 * arrives is a parcel from the bookstore, and the burst around it is the only
 * place in the system a drawing is allowed to celebrate.
 */
function Reward() {
  return (
    <>
      <path
        d="M80 14v12M52 24l6 10M108 24l-6 10M28 46l11 5M132 46l-11 5"
        stroke="var(--color-violet-300)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <rect x="38" y="52" width="84" height="54" rx="14" fill="url(#ill-brand-reward)" />
      <rect x="72" y="52" width="16" height="54" fill="var(--color-violet-100)" opacity="0.85" />
      <rect x="38" y="70" width="84" height="12" fill="var(--color-violet-100)" opacity="0.85" />
      <circle cx="80" cy="76" r="13" fill="var(--color-mint-500)" />
      <path
        d="M74 76.5l4.5 4.5L87 72"
        stroke="#ffffff"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  );
}

const SCENES: Record<Scene, () => React.JSX.Element> = {
  unbuilt: Unbuilt,
  settled: Settled,
  reward: Reward,
};
