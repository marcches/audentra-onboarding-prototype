import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { presence, widthClasses } from "@/lib/layout";

/**
 * The layout ruler, enforced.
 *
 * **Rewritten rather than extended**, for the third time and for the same
 * reason ADR 0006 gives: a test and a ruler that disagree are worse than either
 * alone. Everything the previous version asserted about `Panel`, about the
 * `decision` archetype filling one viewport, and about a component called
 * `points-award` is gone in the same change as the things themselves.
 *
 * What it asserts now, and why each line exists:
 *
 * 1. The four **drift** invariants that survived ADR 0006. All four are about
 *    the same element landing on different pixels depending on how you arrived
 *    at it, which is the client's actual complaint word for word ("vc erra
 *    bastante tbm com layout, onde fica dando flick, de posição").
 * 2. **Presence has exactly eight rows.** Without this the closed table in
 *    `docs/design-research.md` is decoration, and "Presence" is `hidden
 *    lg:block` with a nicer name.
 * 3. **No breakpoint outside the three width classes**, in any `.tsx`. ADR 0008
 *    says a fourth class is a test failure rather than a review note.
 * 4. **No animation rule touches a layout property.** `height`, `top`, `width`
 *    and `left` reflow a subtree on every frame, and that is the first suspect
 *    for the stutter the client reported. `grid-template-rows` is the sanctioned
 *    replacement and is explicitly allowed.
 * 5. **One celebration layer**, `fixed` and non-interactive — the evolution of
 *    the assertion that used to aim at the Points flight, now that the same
 *    layer owns the confetti and the single `<canvas>`.
 * 6. **One z-index ladder.** Every overlapping thing reads a token and nothing
 *    writes a literal, so "the dialog went behind the bar" stops being a class
 *    of bug.
 * 7. **No sheet can stretch.** `fill` and `grow` are gone from the prop surface
 *    rather than from the call sites, and the dropzone that genuinely wanted the
 *    room carries its own height instead of borrowing the column's.
 * 8. **The signature lands twice and no more.** The brand gradient is confined
 *    to four files, each with a reason written beside it; a route signs each of
 *    its screens once; the guide never signs; and "which Section is in progress"
 *    is answered by the sheet rather than by nine routes.
 * 9. **The prose measure is declared once** and carried by one element, the
 *    pattern the archetype measures and the action bar height already follow.
 *
 * What it deliberately does **not** assert: content above the fold, and the
 * ceiling of three surfaces. The repo has no DOM environment, and measuring a
 * fold without one is pretending the test knows the height of a font. A test
 * that lies is worse than no test, so those two are human acceptance at
 * 1366×768 and 390×844 — the one point in this epic where "done" is not an
 * output of CI, and the client agreed to that explicitly.
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

/**
 * Strings blanked, so a rule about *props* is not tripped by a sentence.
 *
 * "Selection is fill and a check" is a caption in the style guide and `fill` is
 * a prop that no longer exists; without this the two are the same eight
 * characters. Applied only where the assertion is about JSX attributes.
 */
function attributes(text: string) {
  return text
    .replace(/"[^"]*"/g, '""')
    .replace(/'[^']*'/g, "''")
    .replace(/`[^`]*`/g, "``");
}

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
   5 · Presence is a closed table of eight
   ------------------------------------------------------------------------ */

describe("presence", () => {
  it("has exactly eight rows", () => {
    // Eight, argued for one by one in `docs/design-research.md`. A ninth needs
    // a written reason in the same change, and the argument has to be that no
    // container query can express it.
    expect(presence).toHaveLength(8);
  });

  it("gives every row a distinct piece and both of its states", () => {
    expect(new Set(presence.map((row) => row.id)).size).toBe(presence.length);
    for (const row of presence) {
      expect(row.compact.length, row.id).toBeGreaterThan(0);
      expect(row.desktop.length, row.id).toBeGreaterThan(0);
    }
  });
});

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
   10 · No sheet can stretch
   ------------------------------------------------------------------------ */

describe("every sheet is the height of its content", () => {
  it("has deleted `fill` and `grow` from the props, not only from the call sites", () => {
    // A prop that does not exist cannot be passed, which is a stronger
    // guarantee than a review note about not passing it. Both took the Step
    // column's leftover height and spent it inside a border, which is the
    // white space the client photographed on three sibling Steps.
    expect(surfaces?.text).not.toMatch(/\bfill\?:/);
    expect(surfaces?.text).not.toMatch(/\bgrow\?:/);
    expect(surfaces?.text).not.toMatch(/\bfill\s*=\s*false/);
    expect(surfaces?.text).not.toMatch(/\bgrow\s*=\s*false/);
  });

  it("lets no `.tsx` pass either of them", () => {
    for (const file of components) {
      expect(attributes(file.text), file.name).not.toMatch(/(?:^|\s)(fill|grow)(?=\s|>|$)/m);
    }
  });

  it("gives the dropzone an intrinsic height rather than the column's slack", () => {
    // The one part of a short Step that genuinely wanted to be large. It is
    // large because a dropzone is large, not because Health had room to spare.
    // `min-h-0` is the tell: it is what an element writes when it intends to be
    // stretched by a flex parent. The remaining `flex-1` in the file is the
    // horizontal one that lets the label take the row's width.
    const upload = files.find((file) => file.name === "components/document-upload.tsx");
    expect(upload?.text).toMatch(/h-\[9rem\]/);
    expect(upload?.text).not.toMatch(/min-h-0|max-h-\[/);
  });
});

/* ---------------------------------------------------------------------------
   11 · The signature lands twice, and no more
   ------------------------------------------------------------------------ */

/**
 * The four files the brand gradient may appear in, each for a stated reason.
 *
 * - `surfaces.tsx` — the Section marker's "in progress" fill, and the sheet
 *   hairline. The two places ADR 0012 admits.
 * - `step-rail.tsx` — the group marker on the spine, which is the same grammar
 *   one level up and predates this round.
 * - `completion.tsx` — the student card. It is an object handed over on a
 *   celebration screen outside the Step shell, not a mark on a working screen.
 * - `style-guide.tsx` — the swatch that documents the rule. A system that
 *   cannot show its own gradient cannot be reviewed.
 *
 * Anything else — a field, a chip, the primary action, an eyebrow above an
 * `h1` — is what turns a signature into a stripe on every component, which is
 * the decision this list exists to stop being remade every fortnight.
 */
const GRADIENT_ALLOWED = new Set([
  "components/surfaces.tsx",
  "components/step-rail.tsx",
  "routes/completion.tsx",
  "routes/style-guide.tsx",
]);

/** Every `<Sections …>` opening tag in a file. */
function sheetTags(text: string) {
  return text.match(/<Sections\b[^>]*?>/gs) ?? [];
}

describe("the Audentra signature", () => {
  it("appears in four files, each of which had to argue for it", () => {
    for (const file of components) {
      if (GRADIENT_ALLOWED.has(file.name)) continue;
      expect(file.text, file.name).not.toMatch(/brand-gradient/);
    }
  });

  it("lands exactly twice in the surfaces module: the marker, and the hairline", () => {
    expect(surfaces?.text.match(/brand-gradient/g)).toHaveLength(2);
  });

  it("signs each of a route's screens once and no more", () => {
    // A source-level count cannot tell one screen from another inside a route —
    // Deposit is three screens in one file — so the ceiling is the number of
    // shells the route renders. Two hairlines on one screen would need a fourth
    // `Sections`, and there is nowhere in this flow that has one.
    for (const route of routes) {
      const signed = sheetTags(route.text).filter((tag) => /\bsignature\b/.test(tag));
      const shells = route.text.match(/<StepShell\b/g)?.length ?? 0;
      expect(signed.length, route.name).toBeLessThanOrEqual(shells);
    }
  });

  it("never signs the guide", () => {
    // The guide is a second sheet on the same screen. Signing it would put the
    // signature twice on every form Step in the flow, which is the definition
    // of a stripe rather than a signature.
    for (const tag of sheetTags(shell?.text ?? "")) {
      expect(tag).not.toMatch(/\bsignature\b/);
    }
  });

  it("decides `in progress` in the sheet, and lets no route pass it", () => {
    // A Section cannot know it is first on the screen, and nine routes working
    // it out is the answer living in nine places.
    expect(surfaces?.text).toMatch(/useSheetProgress\(\)/);
    expect(surfaces?.text).toMatch(/SheetProgress\.Provider/);
    for (const route of routes) {
      expect(route.text, route.name).not.toMatch(/SheetProgress|inProgress/);
    }
  });
});
