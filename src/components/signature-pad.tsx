import { EraserIcon } from "@phosphor-icons/react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import type { SignaturePoint } from "@/lib/store";

const INK = "#0a1f44";

export type DrawnSignature = {
  /** The still form: a PNG data URL. */
  dataUrl: string;
  /** The same signature as strokes, timestamped, for replaying it. */
  strokes: SignaturePoint[][];
  /** The pad's CSS size when it was drawn, so a replay can scale to its target. */
  size: { width: number; height: number };
};

const EMPTY: DrawnSignature = { dataUrl: "", strokes: [], size: { width: 0, height: 0 } };

/**
 * Drawing a signature.
 *
 * The one moment on this screen that is worth building rather than describing:
 * typing your name into a box is a text field, but drawing it is the gesture
 * people recognise as signing. Pointer events cover mouse, trackpad, pen and
 * touch in one path.
 *
 * The points are kept, not just the bitmap. That is what lets the agreement
 * replay the signature onto its line at the speed it was actually made — the
 * pauses, the fast strokes and the slow ones — instead of animating a generic
 * line drawing. It is the student's own hand, which is the entire difference
 * between a signature being applied and a field being filled.
 *
 * Legal validity and audit trails are explicitly out of scope — see the ticket.
 * What is being prototyped is the interaction.
 */
export function SignaturePad({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (signature: DrawnSignature) => void;
  label: string;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const drawing = React.useRef(false);
  const lastPoint = React.useRef<{ x: number; y: number } | null>(null);
  /** Strokes so far this session, and the one being drawn right now. */
  const strokes = React.useRef<SignaturePoint[][]>([]);
  const current = React.useRef<SignaturePoint[]>([]);
  const startedAt = React.useRef(0);
  const [hasInk, setHasInk] = React.useState(Boolean(value));

  /**
   * Size the bitmap to the element's real pixels, and repaint whatever was
   * drawn — because resizing a canvas clears it.
   *
   * Deliberately **not** keyed on `value`. Every pen-up publishes a new data
   * URL into that prop, so keying on it made each finished stroke wipe the
   * bitmap and repaint it from an async `Image` decode: the signature blanked
   * and flickered back after every stroke, and a stroke started inside that
   * window was saved over an empty canvas, silently losing the earlier ones.
   * The stored signature is read through a ref instead, so it is restored on
   * mount and on resize and never in response to the student's own drawing.
   */
  const restoreRef = React.useRef(value);
  restoreRef.current = value;

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const paint = () => {
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
      const stored = restoreRef.current;
      if (stored) {
        const image = new Image();
        image.onload = () => context.drawImage(image, 0, 0, rect.width, rect.height);
        image.src = stored;
      }
    };

    paint();
    const observer = new ResizeObserver(paint);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  const pointFrom = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const publish = (canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    onChange({
      dataUrl: canvas.toDataURL("image/png"),
      strokes: strokes.current.map((stroke) => [...stroke]),
      size: { width: rect.width, height: rect.height },
    });
  };

  const start = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    drawing.current = true;
    const point = pointFrom(event);
    lastPoint.current = point;
    // The clock starts on the first stroke, so the replay begins immediately
    // rather than after however long the student spent deciding.
    if (strokes.current.length === 0) startedAt.current = performance.now();
    current.current = [{ ...point, t: performance.now() - startedAt.current }];
  };

  const move = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const context = canvasRef.current?.getContext("2d");
    const from = lastPoint.current;
    if (!context || !from) return;
    const to = pointFrom(event);
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
    lastPoint.current = to;
    current.current.push({ ...to, t: performance.now() - startedAt.current });
    setHasInk(true);
  };

  const end = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    drawing.current = false;
    lastPoint.current = null;
    // A tap with no movement is not a stroke, and replaying it draws nothing.
    if (current.current.length > 1) strokes.current.push(current.current);
    current.current = [];
    const canvas = canvasRef.current;
    if (canvas) publish(canvas);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    strokes.current = [];
    current.current = [];
    setHasInk(false);
    onChange(EMPTY);
  };

  return (
    <div className="space-y-2">
      <div className="relative overflow-hidden rounded-[var(--radius-card)] border-2 border-dashed border-ink-200 bg-ink-50/50">
        <canvas
          ref={canvasRef}
          aria-label={label}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
          className="h-36 w-full touch-none"
        />
        {hasInk ? null : (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-small text-ink-400">
            Draw your signature here
          </span>
        )}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-6 bottom-7 border-b border-ink-200"
        />
      </div>
      <div className="flex justify-end">
        <Button type="button" variant="ghost" size="sm" onClick={clear} disabled={!hasInk}>
          <EraserIcon aria-hidden className="size-4" />
          Clear
        </Button>
      </div>
    </div>
  );
}
