import { EraserIcon } from "@phosphor-icons/react";
import * as React from "react";

import { Button } from "@/components/ui/button";

const INK = "#0a1f44";

/**
 * Drawing a signature.
 *
 * The one moment on this screen that is worth building rather than describing:
 * typing your name into a box is a text field, but drawing it is the gesture
 * people recognise as signing. Pointer events cover mouse, trackpad, pen and
 * touch in one path.
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
  onChange: (dataUrl: string) => void;
  label: string;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const drawing = React.useRef(false);
  const lastPoint = React.useRef<{ x: number; y: number } | null>(null);
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

  const start = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    drawing.current = true;
    lastPoint.current = pointFrom(event);
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
    setHasInk(true);
  };

  const end = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    drawing.current = false;
    lastPoint.current = null;
    const canvas = canvasRef.current;
    if (canvas) onChange(canvas.toDataURL("image/png"));
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    setHasInk(false);
    onChange("");
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
          className="h-40 w-full touch-none"
        />
        {hasInk ? null : (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-small text-ink-400">
            Draw your signature here
          </span>
        )}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-6 bottom-8 border-b border-ink-200"
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
