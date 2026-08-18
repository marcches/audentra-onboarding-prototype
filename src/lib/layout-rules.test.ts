import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  presence,
  RAIL_CONNECTOR_OFFSET,
  RAIL_MARKER,
  RAIL_ROW_PAD,
  widthClasses,
} from "@/lib/layout";
import { portalPresence } from "@/lib/portal-layout";

/**
 * The layout ruler, enforced.
 *
 * ## What may enter this file
 *
 * **Assert a defect the client has reported more than once, never an
 * aesthetic.**
 *
 * That line is here in prose because this file has now been rewritten four
 * times, and every rewrite was caused by the same thing: it was holding taste
 * still rather than catching a fault, so the next round of design had to delete
 * it before it could work. ADR 0015 deleted five invariants at once for exactly
 * that reason, and one of them — the signature confined to four files — was
 * failing the designer's own request in CI at the moment she made it. Without
 * this criterion written down there will be a fifth rewrite.
 *
 * A line belongs here when all three are true:
 *
 * 1. Somebody outside this repo has complained about it, **twice**.
 * 2. It is verifiable from the source, without a DOM.
 * 3. Reversing it would be a decision, not a preference.
 *
 * ## The nine
 *
 * 1–4. The **four drift invariants**. All four are about the same element
 *      landing on different pixels depending on how you arrived at it, which is
 *      the client's complaint word for word ("vc erra bastante tbm com layout,
 *      onde fica dando flick, de posição"): every Step anchors its title at the
 *      same pixel, nothing is born above the title, the foot of the screen is a
 *      constant declared once, and a primary action does not resize as you
 *      work.
 * 5.   **No animation rule touches a layout property.** `height`, `top`,
 *      `width` and `left` reflow a subtree on every frame, and that is the
 *      first suspect for the stutter the client reported twice.
 *      `grid-template-rows` is the sanctioned replacement and is allowed by
 *      name.
 * 6.   **One celebration layer**, `fixed` and non-interactive, owning exactly
 *      one `<canvas>`. It is how the four drift rules survive a 3.4-second
 *      choreography running across the whole screen.
 * 7.   **One z-index ladder.** Every overlapping thing reads a token and
 *      nothing writes a literal, so "the dialog went behind the bar" stops
 *      being a class of bug.
 * 8.   **One icon weight for meaning and one for state** — new in ADR 0015.
 *      Three Phosphor weights ran at once and read as three different icon
 *      families, which is one of the four measured causes of "too flat".
 * 9.   **No half-step in the spacing scale** — new in ADR 0015. Five gap values
 *      lived inside eight pixels with half-steps, which is the same compression
 *      as the type scale one axis over: grouping cannot be composed out of
 *      intervals a reader cannot tell apart.
 *
 * ## The physical ruler, which is not taste and is not counted
 *
 * ADR 0008 (HD is the desktop), ADR 0009 (a decision scrolls) and ADR 0014 (the
 * portal's Presence table) are untouched by ADR 0015 and are asserted below
 * without being part of the nine: the three width classes and their boundaries,
 * every measure declared exactly once with no call site, the metadata type
 * step, the institution's colours staying inside its own SVG, and the rail's
 * connector being computed rather than eyeballed. Each of them is a *count of
 * declarations* rather than a judgement about how a screen should look, which
 * is precisely why none of them has ever had to be deleted to let a design
 * round proceed.
 *
 * ## What was deleted, and why
 *
 * ADR 0015 removed five, each of which policed a decision this cycle
 * deliberately reversed:
 *
 * - **Presence has exactly eight rows**, and its portal twin at four. Closed
 *   tables of a fixed size are an aesthetic about how much variation is
 *   tasteful, and nobody outside the repo ever asked for either number.
 * - **No sheet can stretch.** The prop surface it policed is still gone; the
 *   assertion was guarding an implementation detail of a fix rather than the
 *   defect.
 * - **The signature lands in four files.** Superseded outright: the brand is a
 *   property of the surface now — the room and the band — rather than an
 *   exception granted to four call sites.
 * - **No Quest card floats.** Elevation is back as containment; the lead card
 *   is raised because it is the subject of the screen.
 *
 * ## What it deliberately does not assert
 *
 * Content above the fold, and whether the screen reads as flat. The repo has no
 * DOM environment, and measuring a fold without one is pretending the test
 * knows the height of a font. A test that lies is worse than no test, so those
 * are human acceptance at 1366×768 and 390×844 — the one point in this cycle
 * where "done" is not an output of CI, and the client agreed to that explicitly.
 *
 * Everything here asserts a source-level invariant rather than measuring a
 * rendered page: an escape hatch that does not exist cannot be used wrongly by
 * a future Step, which is a stronger guarantee than catching it afterwards.
 */

const SRC = join(import.meta.dirname, "..");

/**
 * Comments stripped before matching. A doc comment is allowed — required, even
 * — to name what was removed and why; it is the code that must not say it.
 */
function code(text: string) {
  return text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

/* `attributes()` — which blanked string literals so a rule about props was not
   tripped by a sentence — went with the sheet-stretch invariant that was its
   only caller. It is named here rather than kept, because the next assertion
   that needs to tell a prop from a caption should have to decide that for
   itself rather than inherit a helper nobody remembers the reason for. */

function sourceFiles() {
  return readdirSync(SRC, { recursive: true, encoding: "utf8" })
    .filter((name) => /\.tsx?$/.test(name) && !name.endsWith(".test.ts"))
    .map((name) => ({
      name: name.replace(/\\/g, "/"),
      text: code(readFileSync(join(SRC, name), "utf8")),
    }));
}

const files = sourceFiles();
const components = files.filter((file) => file.name.endsWith(".tsx"));
const shell = files.find((file) => file.name === "components/step-shell.tsx");
const celebration = files.find((file) => file.name === "components/celebration.tsx");
const surfaces = files.find((file) => file.name === "components/surfaces.tsx");
const css = readFileSync(join(SRC, "styles/app.css"), "utf8");
const rail = files.find((file) => file.name === "components/step-rail.tsx");
const routes = files.filter((file) => file.name.startsWith("routes/"));

/* ---------------------------------------------------------------------------
   1 · Every Step anchors its `h1` at the same pixel
   ------------------------------------------------------------------------ */

describe("every step anchors its title at the same pixel", () => {
  it("has no way to centre one step's column and not another's", () => {
    for (const file of files) {
      expect(file.text, file.name).not.toMatch(/justify-center-safe|\bcentered\b/);
    }
  });

  it("takes the column's width from the archetype, never from the route", () => {
    // A screen that could choose its own measure could move its own title, and
    // "which archetype am I" is a fact about the Step rather than a prop.
    expect(shell?.text).toMatch(/const MEASURE/);
    for (const route of routes) {
      expect(route.text, route.name).not.toMatch(/archetype=/);
    }
  });
});

/* ---------------------------------------------------------------------------
   2 · Nothing is born above the title
   ------------------------------------------------------------------------ */

describe("nothing is born above the title", () => {
  it("renders the header as the first thing in the measured column", () => {
    // A block that appears by state — the return to Review was the one
    // offender — moves the whole screen down. It now lives with the actions.
    const column = shell?.text.split("MEASURE[archetype]")[1] ?? "";
    const beforeHeader = column.split("motion.header")[0];
    expect(beforeHeader).not.toMatch(/<[A-Za-z]/);
  });
});

/* ---------------------------------------------------------------------------
   3 · The foot of the screen is a constant, declared once
   ------------------------------------------------------------------------ */

describe("the foot of the screen is a constant", () => {
  it("declares its height and every measure exactly once, in the theme", () => {
    expect(css.match(/--action-bar-height:/g)).toHaveLength(1);
    expect(css.match(/--step-measure:/g)).toHaveLength(1);
    expect(css.match(/--catalogue-measure:/g)).toHaveLength(1);
    expect(css.match(/--decision-measure:/g)).toHaveLength(1);
    // The prose measure joins them, and deliberately does not track them.
    expect(css.match(/--measure-prose:/g)).toHaveLength(1);
  });

  it("lets no component reassign any of them", () => {
    for (const file of files) {
      expect(file.text, file.name).not.toMatch(
        /"--action-bar-height"|"--step-measure"|"--catalogue-measure"|"--decision-measure"|"--measure-prose"/,
      );
      expect(file.text, file.name).not.toMatch(/\bactionBarHeight\b/);
    }
  });

  it("gives prose one element to be measured by, and no screen its own", () => {
    // `max-w-prose` is Tailwind's 65ch, which in Satoshi is a 104-character
    // cap — the FERPA paragraph carried it and still set at 89, because the cap
    // was never reached. A limit that cannot bind reads in the source as a
    // decision already taken, which is why it goes rather than being tuned.
    expect(surfaces?.text).toMatch(/export function Prose/);
    expect(surfaces?.text).toMatch(/max-w-\[var\(--measure-prose\)\]/);
    for (const file of components) {
      expect(file.text, file.name).not.toMatch(/max-w-prose/);
      if (file.name === "components/surfaces.tsx") continue;
      expect(file.text, file.name).not.toMatch(/max-w-\[var\(--measure-prose\)\]/);
    }
  });

  it("pairs the column's bottom padding with actions that are actually there", () => {
    // `main` always reserves `--action-bar-height` at the foot, so a step
    // without `actions` would render that much dead space below nothing.
    for (const route of routes) {
      if (!route.text.includes("<StepShell")) continue;
      expect(route.text, route.name).toMatch(/actions=/);
    }
  });
});

/* ---------------------------------------------------------------------------
   4 · A primary button's width does not react to its own label
   ------------------------------------------------------------------------ */

describe("a primary action does not resize as you work", () => {
  it("gives a state-labelled button a width floor", () => {
    // `steadyAction` is the floor, and `ContinueAction` is the only thing that
    // swaps a primary label — "2 fields to go" and "Save and continue" are the
    // same button, so it has to be the same width.
    expect(shell?.text).toMatch(/export const steadyAction/);
    expect(shell?.text).toMatch(/min-w-\[/);
    expect(shell?.text).toMatch(/export function ContinueAction/);
    expect(shell?.text).toMatch(/className=\{steadyAction\}/);
  });
});

/* ---------------------------------------------------------------------------
   deleted — "Presence has exactly eight rows", and its portal twin at four
   ---------------------------------------------------------------------------
   Both tables survive as tables; what goes is the assertion that each has a
   fixed number of rows. A closed count is a claim about how much variation is
   tasteful, and no client ever asked for eight or for four — which is the first
   of the three tests a line has to pass to live in this file.

   What replaces them is the rule they were standing in front of, and it is
   still asserted below: `portal-layout.ts` does not redeclare the three width
   classes. ADR 0014 splits the exception lists and shares everything else, and
   a second copy of what a phone is remains a real defect rather than a taste.
   ------------------------------------------------------------------------ */

describe("the two Presence tables", () => {
  it("share one definition of what a phone is", () => {
    const portalLayout = files.find((file) => file.name === "lib/portal-layout.ts");
    expect(portalLayout?.text).not.toMatch(/widthClasses|compact"|768|1280/);
  });

  it("gives every row a distinct piece and both of its states", () => {
    for (const table of [presence, portalPresence]) {
      expect(new Set(table.map((row) => row.id)).size).toBe(table.length);
      for (const row of table) {
        expect(row.compact.length, row.id).toBeGreaterThan(0);
        expect(row.desktop.length, row.id).toBeGreaterThan(0);
      }
    }
  });
});

/* ---------------------------------------------------------------------------
   5c · The metadata type step, and what it is for
   ------------------------------------------------------------------------ */

describe("the metadata type step", () => {
  it("is declared once, in the theme, beside the measures", () => {
    expect(css.match(/--text-meta:/g)).toHaveLength(1);
  });

  it("lets no component reassign it", () => {
    for (const file of files) {
      expect(file.text, file.name).not.toMatch(/"--text-meta"/);
    }
  });
});

/* ---------------------------------------------------------------------------
   5d · deleted — "No Quest card floats"
   ---------------------------------------------------------------------------
   ADR 0015 supersedes ADR 0010 and brings elevation back with one condition:
   it is containment, never reaction. The lead card is raised because it is the
   subject of the screen, and every card under it is still flat on its Well —
   which is what this invariant was actually protecting and is now a property of
   `QuestCard` itself rather than of a test.

   It is deleted here rather than in the contract because it fails in CI on the
   commit that reverses it, which is the same reason ADR 0015 gives for deleting
   it at all: a ruler that holds taste still stops the work it was written to
   protect. The remaining four deletions and the two additions are the
   contract's.
   ------------------------------------------------------------------------ */

/* ---------------------------------------------------------------------------
   6 · Three width classes, and no fourth
   ------------------------------------------------------------------------ */

describe("the three width classes", () => {
  it("declares them once, at the two boundaries ADR 0008 names", () => {
    expect(widthClasses.map((entry) => entry.id)).toEqual(["compact", "medium", "desktop"]);
    expect(widthClasses.map((entry) => entry.from)).toEqual([0, 768, 1280]);

    const variants = css.match(/@custom-variant (compact|medium|desktop) /g) ?? [];
    expect(variants).toHaveLength(3);
    // 1280 rather than 1366, so a real HD machine sits inside the class rather
    // than on its edge.
    expect(css).toMatch(/@custom-variant desktop \(@media \(width >= 1280px\)\)/);
  });

  it("lets no `.tsx` reach for a Tailwind default breakpoint", () => {
    for (const file of components) {
      expect(file.text, file.name).not.toMatch(/\b(sm|md|lg|xl|2xl):[a-z[-]/);
      expect(file.text, file.name).not.toMatch(/\b(min|max)-width\b/);
    }
  });

  it("keeps the container query to one threshold, in one place", () => {
    expect(css.match(/@custom-variant narrow /g)).toHaveLength(1);
    expect(css.match(/container-type:/g)).toHaveLength(1);
  });
});

/* ---------------------------------------------------------------------------
   7 · No animation rule touches a layout property
   ------------------------------------------------------------------------ */

const LAYOUT_PROPERTIES = /\b(height|top|width|left)\b/;

describe("nothing animates a layout property", () => {
  it("keeps keyframes to transform, opacity and the sanctioned grid track", () => {
    // `grid-template-rows: 0fr → 1fr` is the replacement for `height: 0 → auto`
    // and is allowed by name — it collapses a track rather than reflowing a
    // subtree. The bare properties below are what is forbidden.
    const frames = css.match(/@keyframes[\s\S]*?\n {2}}/g) ?? [];
    expect(frames.length).toBeGreaterThan(0);
    for (const frame of frames) {
      const body = frame.replace(/grid-template-rows/g, "");
      for (const declaration of body.match(/^\s*[a-z-]+:/gm) ?? []) {
        expect(declaration.trim(), frame.split("\n")[0]).not.toMatch(LAYOUT_PROPERTIES);
      }
    }
  });

  it("keeps CSS transitions off them too", () => {
    for (const property of css.match(/transition-property:[^;]+;/g) ?? []) {
      expect(property).not.toMatch(LAYOUT_PROPERTIES);
    }
  });

  it("keeps Tailwind's arbitrary transition lists off them", () => {
    for (const file of components) {
      for (const list of file.text.match(/transition-\[[^\]]+\]/g) ?? []) {
        expect(list.replace(/grid-template-rows/g, ""), file.name).not.toMatch(LAYOUT_PROPERTIES);
      }
    }
  });

  it("keeps `motion`'s animated properties off them", () => {
    for (const file of components) {
      for (const target of file.text.match(/(?:initial|animate|exit)=\{\{[^}]*\}/g) ?? []) {
        expect(target, file.name).not.toMatch(/\b(height|top|left)\s*:/);
      }
    }
  });
});

/* ---------------------------------------------------------------------------
   8 · One celebration layer
   ------------------------------------------------------------------------ */

describe("the celebration layer", () => {
  it("is one, fixed, and cannot be clicked", () => {
    // Not a fifth drift rule: it is how the four above survive a 3.4 second
    // choreography running across the whole screen.
    expect(celebration?.text).toMatch(/pointer-events-none fixed inset-0/);
  });

  it("owns exactly one canvas, created once and reused", () => {
    // `canvas-confetti` mints a full-screen canvas per call if it is allowed
    // to. Twelve of those is the second suspect for the stutter, after
    // animating `height`.
    expect(celebration?.text.match(/<canvas/g)).toHaveLength(1);
    expect(celebration?.text.match(/confetti\.create\(/g)).toHaveLength(1);
    for (const file of components) {
      if (file.name === "components/celebration.tsx") continue;
      expect(file.text, file.name).not.toMatch(/from "canvas-confetti"/);
    }
  });
});

/* ---------------------------------------------------------------------------
   9 · One z-index ladder
   ------------------------------------------------------------------------ */

describe("the stacking order", () => {
  it("is declared once, in the theme", () => {
    const rungs = css.match(/^\s*--z-[a-z-]+:/gm) ?? [];
    expect(rungs.length).toBeGreaterThan(0);
    expect(new Set(rungs.map((rung) => rung.trim())).size).toBe(rungs.length);
  });

  it("lets no component write a literal", () => {
    for (const file of components) {
      expect(file.text, file.name).not.toMatch(/\bz-\[?-?\d/);
      expect(file.text, file.name).not.toMatch(/zIndex:\s*-?\d/);
    }
  });
});

/* ---------------------------------------------------------------------------
   deleted — "No sheet can stretch"
   ---------------------------------------------------------------------------
   `fill` and `grow` are still gone from `Sections`, and a prop that does not
   exist still cannot be passed — which was always the guarantee. What this
   asserted was the *shape of the fix* rather than the defect, and the defect
   (a void inside a border, on a screen where nothing wanted the room) is one
   nobody can measure without a DOM anyway. It goes with the other four.
   ------------------------------------------------------------------------ */

/* ---------------------------------------------------------------------------
   deleted — "The signature lands twice, and no more"
   ---------------------------------------------------------------------------
   Superseded outright by ADR 0015. The brand is a property of the surface now —
   the room every screen stands in and the band that opens it — rather than an
   exception granted to four call sites, and the sheet's gradient hairline is
   gone along with the rule that rationed it.

   This is the line that made the case for the criterion at the top of this
   file: as written it required the gradient to appear in four files, and the
   designer's request was for *more* of it. A ruler that fails a design request
   in CI is a ruler holding taste still.
   ------------------------------------------------------------------------ */

/* ---------------------------------------------------------------------------
   8 · One icon weight for meaning, and one for state
   ---------------------------------------------------------------------------
   New in ADR 0015, and it answers a measured defect: three Phosphor weights ran
   at once — `regular`, `bold` and `duotone` — and read as three different icon
   families on one screen. That is one of the four causes behind "too flat", and
   it is the same disease as a nine-step type scale: variation with no meaning
   attached to it.

   Two weights, and each has a job. **`bold` names a thing** — the subject of a
   Section, an action, a unit of metadata. **`fill` says a thing is in a state**
   — done, selected, where you are. A student never has to work out which of
   three weights they are looking at, because there are two and the difference
   between them is the difference between a noun and a status.
   ------------------------------------------------------------------------ */

const ICON_WEIGHTS = new Set(["bold", "fill"]);

describe("icon weight carries exactly two meanings", () => {
  it("uses `bold` for meaning and `fill` for state, and no third weight", () => {
    for (const file of components) {
      for (const attribute of file.text.match(/weight="[a-z]+"/g) ?? []) {
        const weight = attribute.slice(8, -1);
        expect(ICON_WEIGHTS.has(weight), `${file.name}: weight="${weight}"`).toBe(true);
      }
    }
  });

  it("keeps a weight chosen at runtime inside the same two", () => {
    // `weight={here ? "fill" : "bold"}` is the state pair, written out. A
    // ternary is where a third weight comes back in without being noticed.
    for (const file of components) {
      for (const expression of file.text.match(/weight=\{[^}]*\}/g) ?? []) {
        for (const quoted of expression.match(/"[a-z]+"/g) ?? []) {
          const weight = quoted.slice(1, -1);
          expect(ICON_WEIGHTS.has(weight), `${file.name}: ${expression}`).toBe(true);
        }
      }
    }
  });
});

/* ---------------------------------------------------------------------------
   9 · No half-step in the spacing scale
   ---------------------------------------------------------------------------
   New in ADR 0015, and the whitespace half of the same compression the type
   scale had: five gap values living between 4px and 12px, half of them
   half-steps, and exactly one spacing token declared in the entire system.

   Grouping cannot be composed out of intervals a reader cannot tell apart. The
   rhythm is five steps — 4 / 8 / 16 / 24 / 40 — declared once in the theme and
   far enough apart to be seen (Midday). A `2.5` in a class name is a sixth step
   nobody argued for, and 124 of them is a rhythm with nothing in it.

   This is the *deletion* half of the expand–contract made permanent: the
   utilities are gone from the source, and this is what stops the next screen
   reintroducing them one at a time.
   ------------------------------------------------------------------------ */

describe("the spacing scale has no half-step", () => {
  it("declares five steps, in the theme, and no more", () => {
    /* `--space-section` is not a sixth step: it is a *name* for one of the
       five, so that "the gap between two Sections" is a decision recorded once
       rather than a number typed into a component. It has to resolve to one of
       them, which is what the second assertion checks. */
    const steps = (css.match(/^\s*--space-[a-z]+:/gm) ?? []).map((step) => step.trim());
    expect(steps).toEqual([
      "--space-hair:",
      "--space-tight:",
      "--space-group:",
      "--space-block:",
      "--space-region:",
      "--space-section:",
    ]);
    expect(css).toMatch(/--space-section:\s*var\(--space-(hair|tight|group|block|region)\)/);
  });

  /**
   * The utilities that read the spacing scale, named rather than matched by
   * shape.
   *
   * A pattern of "any word, a dash, a number and a half" also catches an SVG
   * path command and a line of GLSL, which is how a ruler comes to be switched
   * off by whoever hits the false positive first. These are the prefixes that
   * actually resolve against the spacing scale, and a sixth kind of half-step
   * is a line added here.
   */
  const SPACED = [
    "gap",
    "gap-x",
    "gap-y",
    "p",
    "px",
    "py",
    "pt",
    "pb",
    "pl",
    "pr",
    "m",
    "mx",
    "my",
    "mt",
    "mb",
    "ml",
    "mr",
    "space-x",
    "space-y",
    "size",
    "w",
    "h",
    "min-w",
    "min-h",
    "max-w",
    "max-h",
    "basis",
    "inset",
    "inset-x",
    "inset-y",
    "top",
    "bottom",
    "left",
    "right",
    "start",
    "end",
    "translate-x",
    "translate-y",
  ];

  const HALF_STEP = new RegExp(
    "(?:^|[\\s\"'`])-?(?:" + SPACED.join("|") + ")-\\d+\\.5(?![\\w.])",
    "g",
  );

  it("lets no `.tsx` write a half-step utility", () => {
    for (const file of components) {
      const found = (file.text.match(HALF_STEP) ?? []).map((utility) => utility.trim());
      expect(found, file.name).toEqual([]);
    }
  });

  it("lets no half-step into the stylesheet either", () => {
    // The theme is where a sixth step would be cheapest to add and hardest to
    // see, so the same rule applies to the declaration as to the call site.
    for (const step of css.match(/^\s*--space-[a-z-]+:\s*([\d.]+)px/gm) ?? []) {
      expect(step.trim()).not.toMatch(/\.\d/);
    }
  });
});

/* ---------------------------------------------------------------------------
   12 · The institution's colours are the institution's
   ------------------------------------------------------------------------ */

describe("Aster's arms", () => {
  const crest = files.find((file) => file.name === "components/institution-badge.tsx");

  it("keeps its navy and its gold inside one SVG and out of the theme", () => {
    // Audentra owns violet, azure and mint at the system layer. Two owners in
    // the same colours is how the platform and the institution got confused
    // with each other, and a gold token would be one `amber-500` away from
    // meaning "warning" somewhere nobody intended.
    expect(crest?.text).toMatch(/#12244d/i);
    expect(crest?.text).toMatch(/#c9a227/i);
    expect(css).not.toMatch(/#12244d|#c9a227/i);
    for (const file of components) {
      if (file.name === "components/institution-badge.tsx") continue;
      expect(file.text, file.name).not.toMatch(/#12244d|#c9a227/i);
    }
  });

  it("is heraldry rather than an app icon", () => {
    // Flat fill and no gradient: the gradient shield with a geometric flower is
    // what read as an app icon, in the platform's own colours, in the one slot
    // that says whose portal this is.
    expect(crest?.text).not.toMatch(/linearGradient|brand-gradient/);
    // A year and a motto the rest of the product also knows.
    expect(crest?.text).toMatch(/institution\.founded/);
    expect(crest?.text).toMatch(/institution\.motto/);
  });
});

/* ---------------------------------------------------------------------------
   13 · The rail's connector runs through its markers
   ------------------------------------------------------------------------ */

describe("the rail is a spine", () => {
  it("puts the connector at the marker's centre, computed rather than compared", () => {
    // Not `toBe(14)`. A literal here would pass while the rail drew something
    // else, which is precisely the failure being fixed — the offset was an
    // eyeballed `ml-[0.5625rem]` and it missed the marker by 4.5px on all five
    // groups.
    expect(RAIL_CONNECTOR_OFFSET).toBe(RAIL_ROW_PAD + RAIL_MARKER / 2);
  });

  it("ties the constants to what the rail actually draws", () => {
    // Tailwind's spacing scale is 4px a step, so the marker's `size-5` and the
    // row's `px-1` are the two numbers above expressed as classes. If either
    // class changes without the constant, the connector drifts again and this
    // is the line that says so.
    expect(rail?.text).toMatch(new RegExp(String.raw`\bsize-${RAIL_MARKER / 4}\b`));
    expect(rail?.text).toMatch(new RegExp(String.raw`\bpx-${RAIL_ROW_PAD / 4}\b`));
  });

  it("lets the rail write no offset of its own", () => {
    expect(rail?.text).toMatch(/RAIL_CONNECTOR_OFFSET/);
    expect(rail?.text).not.toMatch(/ml-\[|left-\[|pl-\[/);
  });

  it("gives every Quest a mark on the line, and takes the check off the right", () => {
    expect(rail?.text).toMatch(/function QuestMark/);
    // The check moved sides rather than a mark being added: the rail draws
    // exactly two checks, the group marker's and the Quest mark's.
    expect(rail?.text.match(/<CheckIcon/g)).toHaveLength(2);
  });
});
