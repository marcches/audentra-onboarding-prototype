import { institution } from "@/lib/fixtures";
import { cn } from "@/lib/utils";

/**
 * Aster University's arms.
 *
 * The client asked for *"o símbolo de uma faculdade de verdade, pra simular
 * como se fosse real"*, and what made the previous mark fail that was never
 * that Aster is invented. It was that the mark was a violet→azure gradient
 * shield carrying a geometric eight-petal flower — the visual language of an
 * app icon, drawn in the platform's own colours, on the one slot in the shell
 * that is supposed to say whose portal the student is standing in.
 *
 * So this is heraldry rather than a logo, and it is built from the parts real
 * U.S. collegiate arms are built from:
 *
 * - a **shield** with square shoulders drawn to a point, in flat fill;
 * - a **chief** across the top carrying the founding year, which is where a
 *   date goes on academic arms and nowhere else;
 * - the **aster** as a charge rather than as a logo mark — drawn petals, not a
 *   construction of eight identical ellipses;
 * - an **open book** below it, the commonest charge on U.S. collegiate arms;
 * - a **motto ribbon** under the point.
 *
 * The year and the motto are set at the size heraldry sets them at, which at
 * 36px is a texture rather than a legible line. That is not a compromise — it
 * is what an inscribed chief looks like on a crest in a sidebar, and drawing it
 * larger to be readable is exactly the move that turns arms back into an icon.
 *
 * **Navy and gold, flat, and declared here rather than in the theme.** Audentra
 * owns violet, azure and mint at the system layer, and two owners in the same
 * colours is how the institution and the platform got confused with each other
 * in the first place. The gold is not a token, does not enter `app.css`, and is
 * deliberately unlike `amber-500` — which means a warning, and must go on
 * meaning only that.
 */
const NAVY = "#12244d";
const GOLD = "#c9a227";

/** Eight petals, drawn as leaves. A charge is drawn; a logo is constructed. */
const PETALS = [0, 45, 90, 135, 180, 225, 270, 315];

export function InstitutionCrest({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 44 52"
      role="img"
      aria-label={`${institution.name} arms, founded ${institution.founded}, ${institution.motto}`}
      className={cn("size-11", className)}
    >
      {/* The shield: square shoulders, straight flanks, drawn to a point. */}
      <path d="M4 2h36v22.6c0 9.2-7.4 14.7-18 18.9C11.4 39.3 4 33.8 4 24.6V2Z" fill={NAVY} />

      {/* The chief, and the year inscribed on it. */}
      <path d="M4 2h36v10.4H4V2Z" fill={GOLD} />
      <text
        x="22"
        y="10"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontSize="7.4"
        fontWeight="700"
        letterSpacing="0.3"
        fill={NAVY}
      >
        {institution.founded}
      </text>

      {/* The aster, as a charge. */}
      <g transform="translate(22 21.5)" fill={GOLD}>
        {PETALS.map((angle) => (
          <path
            key={angle}
            d="M0-7.4c1.7 2.2 1.7 4.4 0 6.1-1.7-1.7-1.7-3.9 0-6.1Z"
            transform={`rotate(${angle})`}
          />
        ))}
      </g>
      <circle cx="22" cy="21.5" r="1.9" fill={GOLD} />
      <circle cx="22" cy="21.5" r="0.9" fill={NAVY} />

      {/* The open book, below the charge. */}
      <path d="M22 30.6c-2.5-1.6-5.4-2.1-8.7-1.7v5.6c3.3-.4 6.2.1 8.7 1.7Z" fill={GOLD} />
      <path d="M22 30.6c2.5-1.6 5.4-2.1 8.7-1.7v5.6c-3.3-.4-6.2.1-8.7 1.7Z" fill={GOLD} />
      <path d="M22 30.6v5.6" stroke={NAVY} strokeWidth="1" strokeLinecap="round" />

      {/* The motto ribbon, under the point. `textLength` rather than a font
          size chosen by eye: the motto is a fixture and a longer one must not
          run off the end of its own ribbon. */}
      <path
        d="M2.6 43.6 6.6 46.4 2.6 49.2C9 51.4 35 51.4 41.4 49.2L37.4 46.4 41.4 43.6C35 45.8 9 45.8 2.6 43.6Z"
        fill={GOLD}
      />
      <text
        x="22"
        y="49.3"
        textAnchor="middle"
        textLength="30"
        lengthAdjust="spacingAndGlyphs"
        fontFamily="var(--font-display)"
        fontSize="3.4"
        fontWeight="700"
        fill={NAVY}
        className="uppercase"
      >
        {institution.motto}
      </text>
    </svg>
  );
}
