import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The stillness ruler, reduced to four lines and enforced.
 *
 * The ruler used to have six. Two rounds of screens showed that the extra two
 * were not preventing drift at all, they were preventing *choreography* — and
 * the client's actual complaint was never that things moved, it was that the
 * same screen landed in different places depending on how you arrived at it
 * ("vc erra bastante tbm com layout, onde fica dando flick, de posição").
 *
 * So this file is **rewritten rather than extended**: it asserts exactly the
 * four survivors, and the assertions that enforced the revoked lines are
 * deleted in the same change as the lines themselves. A test and a ruler that
 * disagree is worse than either alone.
 *
 * The four survivors, all of them about drift:
 *
 * 1. Every Step anchors its `h1` at the same pixel.
 * 2. Nothing is born above the title.
 * 3. The action bar is a constant height, declared once.
 * 4. A primary button's width does not react to its own label.
 *
 * Revoked, with the reason recorded in `docs/design-research.md`:
 *
 * - *A conditional block reserves its space or is an overlay* — it forbade
 *   choreography outright. Replaced by *reveals directly below the control that
 *   triggered it, with an authored transition; nothing above the trigger moves*,
 *   which is a judgement call and is reviewed by a human.
 * - *`Panel` never wraps a gallery* — it is what pushed catalogues onto the
 *   bare Ground and produced the "jogado no fundo" complaint.
 * - *No control exists for a catalogue that already fits* — the review call
 *   asked for a filter and this line forbade it.
 * - *One title-and-lead pair per screen* — demoted to an archetype default.
 *
 * This asserts source-level invariants rather than measuring a rendered page:
 * the repo has no DOM test environment, and an escape hatch that does not exist
 * cannot be used wrongly by a future step, which is a stronger guarantee than
 * catching it afterwards.
 */

const SRC = join(import.meta.dirname, "..");

/**
 * Comments stripped before matching. A doc comment is allowed — required, even
 * — to name what was removed and why; it is the code that must not say it.
 */
function code(text: string) {
  return text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
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
const shell = files.find((file) => file.name === "components/step-shell.tsx");
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
    // offender — moves the whole screen down.
    const column = shell?.text.split("MEASURE[archetype]")[1] ?? "";
    const beforeHeader = column.split("<header")[0];
    expect(beforeHeader).not.toMatch(/<[A-Za-z]/);
  });
});

/* ---------------------------------------------------------------------------
   3 · The action bar is a constant height, declared once
   ------------------------------------------------------------------------ */

describe("the action bar is a constant", () => {
  it("declares its height and every archetype measure exactly once, in the theme", () => {
    expect(css.match(/--action-bar-height:/g)).toHaveLength(1);
    expect(css.match(/--step-measure:/g)).toHaveLength(1);
    expect(css.match(/--catalogue-measure:/g)).toHaveLength(1);
    expect(css.match(/--decision-measure:/g)).toHaveLength(1);
  });

  it("lets no component reassign any of them", () => {
    for (const file of files) {
      expect(file.text, file.name).not.toMatch(
        /"--action-bar-height"|"--step-measure"|"--catalogue-measure"|"--decision-measure"/,
      );
      expect(file.text, file.name).not.toMatch(/\bactionBarHeight\b/);
    }
  });

  it("pairs the column's bottom padding with a bar that is actually there", () => {
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
    // `steadyAction` is the floor. Any button whose label is chosen by a
    // ternary inside the bar has to carry it, or the one fixed piece of
    // furniture in the layout moves while the student uses the step.
    expect(shell?.text).toMatch(/export const steadyAction/);
    expect(shell?.text).toMatch(/min-w-\[/);
  });
});

/* ---------------------------------------------------------------------------
   The award cannot move the page
   ------------------------------------------------------------------------ */

describe("the award choreography cannot shift the layout", () => {
  it("keeps the flight layer fixed and non-interactive", () => {
    // Not a fifth rule: it is how the four above survive a 2.6 second
    // animation running across the whole screen.
    const award = files.find((file) => file.name === "components/points-award.tsx");
    expect(award?.text).toMatch(/pointer-events-none fixed inset-0/);
  });
});
