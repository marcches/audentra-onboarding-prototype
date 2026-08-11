import { useReducedMotion } from "motion/react";
import * as React from "react";

import { InstitutionCrest } from "@/components/institution-badge";
import { AudentraMark } from "@/components/wordmark";
import { institution } from "@/lib/fixtures";
import { cn } from "@/lib/utils";

/* WebGL and a shader compile, for a background. Splitting it out of the entry
   chunk keeps the email field interactive while it arrives. */
const Grainient = React.lazy(() => import("@/components/reactbits/Grainient"));

/** Violet → azure, from the brand guidelines. Mint has moved to the form. */
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
 * Institutional identity and nothing else. Two elaborate treatments died here —
 * a 3D lanyard that read as a technology demo, then a printed invitation that
 * stated the student's programme, campus and application number on a screen
 * where the system does not yet know who is looking at it. See
 * `docs/adr/0006-…`: this panel carries the mark and at most one line, and any
 * proposal that puts student data back before the login is revoking that
 * decision rather than interpreting it.
 *
 * It absorbs every spare pixel (`flex-1`) while the form column stays fixed, so
 * a wider monitor grows the panel instead of the gutter around the form.
 *
 * Two fallbacks, not one. Reduced motion drops the canvas for the CSS gradient
 * underneath, and so does the absence of a WebGL2 context. Both matter as demo
 * insurance before they matter as accessibility: a reviewer opening the link
 * has to see a finished panel, never an empty rectangle where an effect was.
 */
export function EntryPanel({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const [canRender] = React.useState(detectWebgl2);

  return (
    /* Inset with a radius rather than bled to the edge. It makes the gradient
       read as a deliberate object sitting on the page instead of as the page's
       background, and it removes the hard seam where the colour used to butt
       straight against the form column. */
    <div className={cn("p-3 lg:py-4 lg:pr-0 lg:pl-4", className)}>
      <div className="brand-panel on-dark relative isolate flex h-full flex-col justify-between gap-10 overflow-hidden rounded-[var(--radius-slab)] px-6 py-8 text-white sm:px-10 sm:py-10 lg:px-12">
        {reduceMotion || !canRender ? null : (
          <div aria-hidden className="absolute inset-0 -z-10">
            <React.Suspense fallback={null}>
              {/* The grain is the point, not a texture over the top of one: a
                  panel this size shows banding in any smooth two-stop gradient,
                  and the noise both kills it and makes the surface read as
                  something printed rather than as SaaS chrome. */}
              <Grainient
                color1={GRADIENT.color1}
                color2={GRADIENT.color2}
                color3={GRADIENT.color3}
                timeSpeed={0.1}
                /* Enough grain to kill the banding a panel this size shows in
                   any smooth two-stop gradient, and no more. The default 0.1
                   reads as noise over the colour rather than as the colour
                   having a surface. */
                grainAmount={0.035}
                grainScale={3.2}
                warpAmplitude={80}
                contrast={1.15}
                saturation={1}
                zoom={1.1}
              />
            </React.Suspense>
          </div>
        )}

        {/* The gradient is bright where the mark sits, and a white wordmark on
            violet at full chroma is legible but not clean. A scrim weighted to
            the two corners that carry type — top-left and bottom-left — buys
            the contrast back without flattening the middle of the panel. */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(70%_55%_at_0%_0%,rgb(6_18_42/0.62),transparent_72%),radial-gradient(85%_60%_at_0%_100%,rgb(6_18_42/0.72),transparent_75%)]"
        />

        {/* The institution leads, and Audentra sits at the foot at the size a
            platform belongs at — the same order the step rail uses. The panel
            carrying only the vendor's wordmark was the version of "institutional
            identity" that names the wrong institution. */}
        <span className="flex items-center gap-3">
          <InstitutionCrest className="size-10 shrink-0" />
          <span className="font-display text-h3 font-black tracking-[-0.015em] text-white">
            {institution.name}
          </span>
        </span>

        {/* Two lines, and the break is structural rather than whatever the
            column width happens to produce: the claim in black weight, the
            enumeration under it in a light one. Setting it as one wrapping
            sentence put the bold half across both lines and the weight change
            landed mid-line, which is the opposite of the shape intended.
            `block` on each half is what holds the break; the claim is short
            enough to stay on one line down to the narrowest the panel gets.

            Still one statement — ADR-0006 allows the mark and at most one line
            of institutional copy, and the centre of the panel stays empty
            because filling it is how the last two versions ended up asserting
            things about a student the screen has not met yet. */}
        <div className="space-y-5">
          <p className="text-[clamp(1.6rem,2.4vw,2.5rem)] leading-[1.14] tracking-[-0.03em] text-white">
            <span className="block font-black">All of {institution.short}, in one place.</span>
            <span className="block font-medium text-white/60">
              Enrollment, documents and payments.
            </span>
          </p>
          {/* The platform credit, at the size a platform belongs at. */}
          <span className="flex items-center gap-1.5 text-white/45">
            <span className="text-micro tracking-[0.06em] uppercase">Runs on</span>
            <AudentraMark className="size-3.5" />
            <span className="text-micro font-bold tracking-[0.12em] uppercase">Audentra</span>
          </span>
        </div>
      </div>
    </div>
  );
}
