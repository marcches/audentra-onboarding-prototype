import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The stillness ruler, enforced.
 *
 * The client's second complaint was not about any one screen: "vc erra bastante
 * tbm com layout, onde fica dando flick, de posição." It had four causes, three
 * of them in the shell — a per-step `centered`, a per-step `--action-bar-height`
 * that also drove the column's bottom padding, and a block that was born above
 * the title when you arrived from the Review summary.
 *
 * Those three are fixed by *deletion*, and this file is what keeps them
 * deleted. It asserts source-level invariants rather than measuring a rendered
 * page: the repo has no DOM test environment, and — more to the point — an
 * escape hatch that does not exist cannot be used wrongly by a future step,
 * which is a stronger guarantee than catching it after the fact. What it cannot
 * check is judgement; the stacking half of the ruler lives in
 * `docs/design-research.md` and is reviewed by a human.
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

describe("every step anchors its title at the same pixel", () => {
  it("has no way to centre one step's column and not another's", () => {
    for (const file of files) {
      expect(file.text, file.name).not.toMatch(/justify-center-safe|\bcentered\b/);
    }
  });

  it("renders the header as the first thing in the measured column", () => {
    // Nothing may be born above the title: a block that appears by state — the
    // return to Review was the one offender — moves the whole screen down.
    const column = shell?.text.split("max-w-[var(--step-measure)]")[1] ?? "";
    const beforeHeader = column.split("<header")[0];
    expect(beforeHeader).not.toMatch(/<[A-Za-z]/);
  });
});

describe("the action bar is a constant", () => {
  it("declares its height and the column measure exactly once, in the theme", () => {
    expect(css.match(/--action-bar-height:/g)).toHaveLength(1);
    expect(css.match(/--step-measure:/g)).toHaveLength(1);
  });

  it("lets no component reassign either of them", () => {
    for (const file of files) {
      expect(file.text, file.name).not.toMatch(/"--action-bar-height"|"--step-measure"/);
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

describe("a primary action does not resize as you work", () => {
  it("gives a state-labelled button a width floor", () => {
    // `steadyAction` is the floor. Any button whose label is chosen by a
    // ternary inside the bar has to carry it, or the one fixed piece of
    // furniture in the layout moves while the student uses the step.
    expect(shell?.text).toMatch(/export const steadyAction/);
    expect(shell?.text).toMatch(/min-w-\[/);
  });
});
