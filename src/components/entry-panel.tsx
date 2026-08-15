import { useReducedMotion } from "motion/react";
import * as React from "react";

import { AudentraMark, Wordmark } from "@/components/wordmark";
import { cn } from "@/lib/utils";

/* WebGL and a shader compile, for a background. Splitting it out of the entry
   chunk keeps the email field interactive while it arrives. */
const Grainient = React.lazy(() => import("@/components/reactbits/Grainient"));

/** Violet → azure, from the brand guidelines. */
const GRADIENT = {
  color1: "#6A38FF",
  color2: "#1E5BFF",
  color3: "#2A1A6B",
} as const;

/**
 * Is there a WebGL2 context to be had at all?
 *
 * `Grainient` compiles `#version 300 es`, which WebGL1 refuses. ogl's renderer
 * falls back to WebGL1 rather than failing loudly, so without this probe a
 * machine without WebGL2 gets a canvas that draws nothing — a black rectangle
 * where the panel should be. Probed once, at module scope, on a throwaway
 * canvas.
 */
function detectWebgl2() {
  if (typeof document === "undefined") return false;
  try {
    return Boolean(document.createElement("canvas").getContext("webgl2"));
  } catch {
    return false;
  }
}

/**
 * The entry screen's left-hand panel.
 *
 * Four treatments have died here and each one narrowed what this panel may be.
 * A 3D lanyard read as a technology demo. A printed invitation stated a
 * programme, campus and application number on a screen where the system does not
 * know who is looking. An institutional lockup went for the same
 * reason one step out: if the link carries no identity it carries no *tenant*
 * either, so Aster is something this screen learns at authentication, exactly
 * like the student's name. And a headline of my own — "One place for your
 * enrollment / documents / payments", with the last word rotating — went because
 * the brand had already supplied the line it was competing with.
 *
 * What is here is the signature the identity actually ships:
 *
 *     AUDENTRA
 *     Institutional intelligence for what's next.
 *
 * presented at a size that makes it the subject of the panel, with the mark used
 * once more as material. No invented marketing copy, no mocked-up product
 * surface, no tenant, no person. Everything on this screen is either the
 * platform's own identity or a form field.
 */
export function EntryPanel({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const [canRender] = React.useState(detectWebgl2);
  const showCanvas = !reduceMotion && canRender;

  return (
    /* Inset with a radius rather than bled to the edge, so the gradient reads as
       a deliberate object on the page instead of as the page's background. */
    <div className={cn("py-4 pr-0 pl-4 compact:p-3", className)}>
      {/* `items-start`, because a flex column stretches its children across the
          cross axis by default — which took the lockup, an image told to keep its
          own width, and stretched it to the full width of the panel at the height
          it had been given. */}
      {/* Centred on the vertical axis, flush to the left on the horizontal one.
          The wordmark is pinned to the top of the same left axis, so the panel
          reads as one column: mark at the head, statement at the optical centre,
          both starting at the same x. */}
      <div className="brand-panel on-dark relative isolate flex h-full items-center justify-start overflow-hidden rounded-[var(--radius-slab)] px-12 py-16 text-white compact:px-6">
        {showCanvas ? (
          <div aria-hidden className="absolute inset-0 z-[var(--z-behind)]">
            <React.Suspense fallback={null}>
              {/* Enough grain to kill the banding a panel this size shows in any
                  smooth two-stop gradient, and no more. */}
              <Grainient
                color1={GRADIENT.color1}
                color2={GRADIENT.color2}
                color3={GRADIENT.color3}
                timeSpeed={0.1}
                grainAmount={0.035}
                grainScale={3.2}
                warpAmplitude={80}
                contrast={1.15}
                saturation={1}
                zoom={1.1}
              />
            </React.Suspense>
          </div>
        ) : null}

        {/* The mark again, oversized and cropped against the corner. Masked to a
            flat white at a few per cent rather than drawn in its own gradient,
            which at this size would fight the ground it lies on. */}
        <AudentraMark
          tone="mono"
          className="pointer-events-none absolute -right-[16%] -bottom-[20%] z-[var(--z-behind)] w-[64%] text-white/[0.06]"
        />

        {/* The signature, at the head of the same left axis the statement sits on.
            Out of the flow, so the statement is centred on the panel rather than
            on the space the signature leaves over.

            Knockout white: the coloured mark's left stroke is brand violet and so
            is this panel, so at chrome size it read as a smudge on its own
            ground. */}
        <Wordmark
          tone="knockout"
          className="absolute top-10 left-12 h-8 compact:left-6 compact:h-7"
        />

        {/* The brand's own line, and the panel's subject.
            Not invented copy — this is the tagline the identity ships with, and it
            is where the tone of voice is set: institutional, exact,
            forward-looking.

            One type size, with weight carrying the hierarchy. The previous
            arrangement set the first line small and the second three times
            larger, which made a wedge rather than a block and read as two
            unrelated things. Holding the size and letting weight do the work is
            also the device the rest of the product already uses — the deposit
            figure beside its explanation, the bold runs inside the agreement's
            clauses — so the panel speaks in the system's voice instead of
            introducing a scale of its own.

            Two lines, and exactly two on every screen. Letting a measure do the
            breaking gave three at some widths and two at others — the shape of
            the panel's one statement is not something to leave to the viewport.
            So the break is explicit, line one is held on a single line, and its
            size is capped low enough to fit the narrowest panel it has to live
            in.

            The second line is derived from the first with `calc`, not given its
            own clamp: two independent clamps cross over between breakpoints and
            the ratio between the lines drifts as the window changes. One
            variable, one multiplier, and the proportion holds everywhere. */}
        <p
          className="leading-[1.06] tracking-[-0.035em]"
          style={{ ["--statement" as string]: "clamp(1.15rem, 2.4vw, 2.75rem)" }}
        >
          <span
            className="block font-normal whitespace-nowrap text-white/55"
            style={{ fontSize: "var(--statement)" }}
          >
            Institutional intelligence for
          </span>
          <span
            className="block font-black text-white"
            style={{ fontSize: "calc(var(--statement) * 1.42)" }}
          >
            what&rsquo;s next
            {/* The brand punctuates its own tagline in colour. Mint rather than
                the printed violet, which would vanish into a violet ground. */}
            <span className="text-mint-500">.</span>
          </span>
        </p>
      </div>
    </div>
  );
}
