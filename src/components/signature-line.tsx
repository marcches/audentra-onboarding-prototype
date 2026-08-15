import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import * as React from "react";
import { Prose } from "@/components/surfaces";
import { Button } from "@/components/ui/button";
import type { SignaturePoint } from "@/lib/store";
import { cn } from "@/lib/utils";

const INK = "#0a1f44";

/**
 * The signature block at the foot of the agreement.
 *
 * The cell is visible and empty *before* signing, which is the whole point: the
 * signature needs somewhere to land. A block that appears only once it is
 * filled makes signing feel like completing another field.
 *
 * On confirm the signature is applied to the line rather than simply rendered
 * there — drawn mode replays the actual captured strokes at the speed they were
 * made, typed mode wipes in from the left. Both paths end at the same DOM, and
 * with reduced motion on, both jump straight to it.
 *
 * Nothing here glitches, distorts, spins or stamps. It is a document, and
 * credibility is the requirement.
 */
export function SignatureLine({
  name,
  mode,
  typed,
  drawnStrokes,
  drawnSize,
  drawnImage,
  signedAt,
  reference,
  /** Bumped by the parent when the student confirms, to trigger the one replay. */
  applyToken = 0,
}: {
  name: string;
  mode: "type" | "draw";
  typed: string;
  drawnStrokes: SignaturePoint[][];
  drawnSize: { width: number; height: number };
  /** The still form. The fallback when there are no strokes to replay. */
  drawnImage: string;
  signedAt: string | null;
  reference: string;
  applyToken?: number;
}) {
  const signed = Boolean(signedAt);

  return (
    <section className="space-y-4 border-t border-ink-200 pt-6">
      <p className="field-label">Signed by the student</p>

      <div className="flex flex-col gap-2">
        {/* The cell. Fixed height whether or not there is anything in it, so
            the page does not jump at the moment of signing. */}
        <div className="relative h-24">
          {signed ? (
            mode === "draw" ? (
              /* The replay needs strokes; the still image needs only the
                 bitmap. If the strokes are missing for any reason, the image is
                 what gets drawn — a signed document that renders an empty line
                 over a date and a reference number is the worst failure this
                 screen has, and it must not be reachable by any path. */
              drawnStrokes.length > 0 ? (
                <DrawnSignature
                  strokes={drawnStrokes}
                  size={drawnSize}
                  applyToken={applyToken}
                  label={`Signature of ${name}`}
                />
              ) : drawnImage ? (
                <img
                  src={drawnImage}
                  alt={`Signature of ${name}`}
                  className="absolute bottom-0 left-1 h-24 w-auto max-w-full"
                />
              ) : null
            ) : (
              <TypedSignature text={typed || name} applyToken={applyToken} />
            )
          ) : (
            <span className="absolute bottom-2 left-1 text-small text-ink-300">
              Your signature goes here
            </span>
          )}
          <span aria-hidden className="absolute inset-x-0 bottom-0 border-b border-ink-400" />
        </div>

        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <p className="text-small text-ink-700">{name}</p>
          {signed && signedAt ? (
            <p className="text-small text-ink-500">
              Signed{" "}
              {new Date(signedAt).toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          ) : (
            <p className="text-small text-ink-400">Not signed yet</p>
          )}
        </div>
      </div>

      {signed && reference ? <Provenance reference={reference} /> : null}
    </section>
  );
}

/**
 * The provenance strip: what was signed, when, and the reference to quote.
 *
 * This was a split-flap board — an airport-departures flip animation on the
 * reference number. It went, and the reason is worth keeping: the reference is
 * not a thing to be impressed by, it is a thing you have to *use*. Someone
 * quoting it in an email needs to select it, or better, copy it in one action.
 * A flip animation makes it briefly unreadable and never makes it usable, and
 * dressing a record up as a mechanical toy works against the one property this
 * block is here to carry, which is credibility.
 *
 * So: a record, set like a record. Tabular figures, a real copy control, and the
 * Result statement rule from the Message Library — the date and the reference,
 * persistent, on the page rather than in a toast.
 */
function Provenance({ reference }: { reference: string }) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="rounded-[var(--radius-card)] border border-ink-100 bg-ink-50/70 px-4 py-3.5">
      {/* The reference and nothing else. The date is already under the
          signature line, with the time on it, and saying it twice on one page
          is the habit this flow has been pulling out everywhere else. */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <div className="min-w-0">
          <p className="field-label">Reference</p>
          {/* Tabular, tracked, selectable. It is an identifier, so it is set
              like one — a character cannot be misread when it is retyped. */}
          <code className="font-mono text-body font-bold tracking-[0.04em] text-ink-900 tabular-nums select-all">
            {reference}
          </code>
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={copy} className="shrink-0">
          {copied ? (
            <CheckIcon weight="bold" aria-hidden className="size-4 text-mint-600" />
          ) : (
            <CopyIcon aria-hidden className="size-4" />
          )}
          {copied ? "Copied" : "Copy"}
          <span className="sr-only"> the reference {reference}</span>
        </Button>
      </div>

      <Prose className="mt-2.5 border-t border-ink-100 pt-2.5 text-ink-500">
        Quote this reference if you contact anyone about this agreement. A copy is in My Documents.
      </Prose>
    </div>
  );
}

/** ~700ms, left to right, over the script face. */
function TypedSignature({ text, applyToken }: { text: string; applyToken: number }) {
  const reduceMotion = useReducedMotion();
  const [revealed, setRevealed] = React.useState(reduceMotion ? 1 : 0);

  React.useEffect(() => {
    if (reduceMotion) return setRevealed(1);
    setRevealed(0);
    const started = performance.now();
    let raf = requestAnimationFrame(function step(now) {
      const progress = Math.min(1, (now - started) / 700);
      setRevealed(progress);
      if (progress < 1) raf = requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(raf);
  }, [applyToken, reduceMotion]);

  return (
    <span
      className="absolute bottom-1 left-1 text-[2.5rem] leading-none text-ink-900"
      style={{
        fontFamily: "var(--font-script)",
        // A wipe, not a fade: the ink arrives across the line the way a pen
        // lays it down.
        clipPath: `inset(0 ${(1 - revealed) * 100}% 0 0)`,
      }}
    >
      {text}
    </span>
  );
}

/**
 * The drawn signature, replayed onto the line.
 *
 * The timestamps captured by the pad are what make this the student's own hand
 * rather than a generic path animation: their pauses and their speed come back
 * as they were. The stroke geometry is scaled from the pad's size to this
 * canvas, so a signature drawn on a phone lands correctly on a desktop line.
 */
function DrawnSignature({
  strokes,
  size,
  applyToken,
  label,
}: {
  strokes: SignaturePoint[][];
  size: { width: number; height: number };
  applyToken: number;
  label: string;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0) return;

    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    const context = canvas.getContext("2d");
    if (!context) return;
    context.scale(ratio, ratio);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 2.4;
    context.strokeStyle = INK;

    // Contain rather than stretch: a squashed signature reads as a fake.
    const scale =
      size.width > 0 && size.height > 0
        ? Math.min(rect.width / size.width, rect.height / size.height)
        : 1;
    const at = (point: SignaturePoint) => ({ x: point.x * scale, y: point.y * scale });

    const drawSegment = (from: SignaturePoint, to: SignaturePoint) => {
      const a = at(from);
      const b = at(to);
      context.beginPath();
      context.moveTo(a.x, a.y);
      context.lineTo(b.x, b.y);
      context.stroke();
    };

    if (reduceMotion) {
      for (const stroke of strokes) {
        for (let i = 1; i < stroke.length; i += 1) {
          const from = stroke[i - 1];
          const to = stroke[i];
          if (from && to) drawSegment(from, to);
        }
      }
      return;
    }

    /* One flat list of segments ordered by the moment each was drawn, so the
       replay crosses stroke boundaries at the right times — including the gaps
       where the pen was lifted, which are as much a part of a signature's
       rhythm as the strokes themselves. */
    const segments: { from: SignaturePoint; to: SignaturePoint }[] = [];
    for (const stroke of strokes) {
      for (let i = 1; i < stroke.length; i += 1) {
        const from = stroke[i - 1];
        const to = stroke[i];
        if (from && to) segments.push({ from, to });
      }
    }
    if (segments.length === 0) return;

    const total = segments[segments.length - 1]?.to.t ?? 0;
    /* Long signatures are drawn slowly and would take as long to watch as they
       took to write. Anything over 2.5s is compressed to it; anything shorter
       plays at its true speed. */
    const rate = total > 2500 ? total / 2500 : 1;
    const started = performance.now();
    let next = 0;

    let raf = requestAnimationFrame(function step(now) {
      const elapsed = (now - started) * rate;
      while (next < segments.length) {
        const segment = segments[next];
        if (!segment || segment.to.t > elapsed) break;
        drawSegment(segment.from, segment.to);
        next += 1;
      }
      if (next < segments.length) raf = requestAnimationFrame(step);
    });

    return () => cancelAnimationFrame(raf);
  }, [strokes, size, applyToken, reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={label}
      className={cn("absolute inset-x-0 bottom-0 h-24 w-full")}
    />
  );
}
