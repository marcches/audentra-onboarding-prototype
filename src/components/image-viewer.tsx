import { CaretLeftIcon, CaretRightIcon, XIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import * as React from "react";

import type { Photo } from "@/lib/fixtures";
import { cn } from "@/lib/utils";

/**
 * A full screen image viewer, usable anywhere in the flow.
 *
 * The client's request, verbatim: *"housing precisa ser possível zoom nas
 * imagens, já que não abre — precisamos ou do zoom pelo mouse, ou clicar e
 * abrir só um visualizador full screen, que pode passar entre imagens e
 * fechar."*
 *
 * It is its own component ahead of Housing deliberately. Inside the Housing
 * screen it would have been the last thing built and the first thing cut when
 * time ran short, and it is the one thing on that screen the client asked for
 * by name.
 *
 * The rules, each from a reference:
 *
 * - Solid black ground, the image whole and letterboxed, **never cropped**
 *   (Faire). A photograph of a room with its edges cut off does not help
 *   anybody decide anything.
 * - Top: `X` at the left, and nothing competing with it (Careem).
 * - Bottom: the room label at the left, `5 / 12` at the right. The counter is
 *   always **textual**, never dots — dots stop scaling past about six.
 * - The label stays visible while zoomed, so a photo never loses which room it
 *   is of (Shopee).
 * - Desktop gets side arrows, the keyboard, and a filmstrip, because twelve
 *   photos by sequential swipe alone is eleven clicks (Weverse).
 * - The page behind is scroll-locked with its position preserved and does not
 *   shift. `scrollbar-gutter: stable` in `app.css` already reserves the
 *   gutter permanently, so hiding the overflow cannot take the layout with it —
 *   which is the classic version of this bug and would violate the drift
 *   invariants.
 */

/**
 * A photo in the viewer. `category` is what turns twelve frames into a
 * navigable set: KAYAK and Expedia both open a gallery on its categories with a
 * count each, and a blind carousel of 24 images is the thing this replaces.
 */
export type ViewerPhoto = Photo & { label?: string; category?: string };

type ViewerRequest = {
  photos: ViewerPhoto[];
  index: number;
  /** Where it grows from. The thumbnail that was clicked. */
  origin: DOMRect | null;
  trigger: HTMLElement | null;
};

type ImageViewerValue = {
  /** Open the viewer on `index` of `photos`, growing from the clicked element. */
  open: (photos: ViewerPhoto[], index: number, event?: React.MouseEvent<HTMLElement>) => void;
};

const ImageViewerContext = React.createContext<ImageViewerValue | null>(null);

export function useImageViewer(): ImageViewerValue {
  const value = React.useContext(ImageViewerContext);
  if (!value) {
    throw new Error("useImageViewer must be used inside an ImageViewerProvider");
  }
  return value;
}

export function ImageViewerProvider({ children }: { children: React.ReactNode }) {
  const [request, setRequest] = React.useState<ViewerRequest | null>(null);

  const open = React.useCallback<ImageViewerValue["open"]>((photos, index, event) => {
    const trigger = (event?.currentTarget ?? null) as HTMLElement | null;
    setRequest({
      photos,
      index,
      origin: trigger?.getBoundingClientRect() ?? null,
      trigger,
    });
  }, []);

  const close = React.useCallback(() => {
    setRequest((current) => {
      /* Focus returns to the thumbnail that opened it. Without this the student
         is dropped at the top of the document, which on a catalogue of eight
         residences means finding their place again. */
      current?.trigger?.focus?.();
      return null;
    });
  }, []);

  const value = React.useMemo<ImageViewerValue>(() => ({ open }), [open]);

  return (
    <ImageViewerContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {request ? <Viewer key="viewer" request={request} onClose={close} /> : null}
      </AnimatePresence>
    </ImageViewerContext.Provider>
  );
}

function Viewer({ request, onClose }: { request: ViewerRequest; onClose: () => void }) {
  const [index, setIndex] = React.useState(request.index);
  const reduceMotion = useReducedMotion();
  const surface = React.useRef<HTMLDivElement | null>(null);
  const touchStart = React.useRef<{ x: number; y: number } | null>(null);

  const photos = request.photos;
  const photo = photos[index];
  const many = photos.length > 1;

  /* The categories, in the order they first appear, each with the index it
     starts at and how many frames it holds. A gallery that opens on its
     categories is navigable at twenty-four photographs; a blind carousel is
     twenty-three taps to the bathroom (KAYAK, Expedia). */
  const categories = React.useMemo(() => {
    const found: { name: string; start: number; count: number }[] = [];
    photos.forEach((frame, position) => {
      if (!frame.category) return;
      const existing = found.find((entry) => entry.name === frame.category);
      if (existing) existing.count += 1;
      else found.push({ name: frame.category, start: position, count: 1 });
    });
    return found.length > 1 ? found : [];
  }, [photos]);

  const step = React.useCallback(
    (delta: number) => {
      setIndex((current) => (current + delta + photos.length) % photos.length);
    },
    [photos.length],
  );

  /* Scroll lock. The gutter is permanently reserved in `app.css`, so this
     cannot move the page behind. */
  React.useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  /* Focus moves into the viewer on open, and `Esc` always closes. */
  React.useEffect(() => {
    surface.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, step]);

  /* Mobile: swipe across to page, swipe down to close. Pinch to zoom is native
     — `touch-action: pinch-zoom` on the frame below hands it to the browser,
     which does it better than any hand-rolled transform and keeps the label
     and counter in place while it happens. */
  const onTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    touchStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    const start = touchStart.current;
    const touch = event.changedTouches[0];
    touchStart.current = null;
    if (!start || !touch) return;
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dy) > 90 && dy > Math.abs(dx)) {
      onClose();
      return;
    }
    if (Math.abs(dx) > 60) step(dx < 0 ? 1 : -1);
  };

  /* Grows from the thumbnail that was clicked, rather than fading in from
     nowhere: the photograph the student pointed at is the photograph that
     opens. Under reduced motion it simply appears. */
  const origin = request.origin;
  const growth =
    origin && !reduceMotion
      ? {
          initial: {
            opacity: 0,
            scale: Math.max(0.2, origin.width / window.innerWidth),
            x: origin.left + origin.width / 2 - window.innerWidth / 2,
            y: origin.top + origin.height / 2 - window.innerHeight / 2,
          },
          animate: { opacity: 1, scale: 1, x: 0, y: 0 },
          exit: {
            opacity: 0,
            scale: Math.max(0.2, origin.width / window.innerWidth),
            x: origin.left + origin.width / 2 - window.innerWidth / 2,
            y: origin.top + origin.height / 2 - window.innerHeight / 2,
          },
        }
      : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };

  return (
    <motion.div
      tabIndex={-1}
      ref={surface}
      role="dialog"
      aria-modal="true"
      aria-label={photo?.label ? `${photo.label} photo viewer` : "Photo viewer"}
      className="on-dark fixed inset-0 z-[var(--z-viewer)] flex flex-col bg-black outline-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.2 }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Top: close at the left, and the categories beside it. Careem's rule
          was "nothing competing with the close"; a row of room names is
          navigation rather than competition, and without it the twelfth
          photograph is eleven taps away. */}
      <div className="flex shrink-0 items-center gap-2 p-2">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex size-11 shrink-0 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/10"
        >
          <XIcon weight="bold" aria-hidden className="size-6" />
        </button>

        {categories.length ? (
          <div className="rail-scroll flex min-w-0 gap-1.5 overflow-x-auto">
            {categories.map((category) => {
              const active = photo?.category === category.name;
              return (
                <button
                  key={category.name}
                  type="button"
                  onClick={() => setIndex(category.start)}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "flex h-8 shrink-0 items-center gap-1.5 rounded-[var(--radius-pill)] px-3 text-small font-strong transition-colors",
                    active
                      ? "bg-white text-ink-900"
                      : "bg-white/10 text-white/80 hover:bg-white/20",
                  )}
                >
                  {category.name}
                  <span className="numeric opacity-70">{category.count}</span>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      {/* The frame. `object-contain` is the whole promise: the image is never
          cropped, at any aspect ratio or viewport. */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-14 compact:px-2">
        {many ? (
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous photo"
            className="absolute left-1 flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 compact:hidden"
          >
            <CaretLeftIcon weight="bold" aria-hidden className="size-6" />
          </button>
        ) : null}

        <motion.img
          key={photo?.src}
          src={photo?.src}
          alt={photo?.alt ?? ""}
          {...growth}
          transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="max-h-full max-w-full object-contain [touch-action:pinch-zoom]"
        />

        {many ? (
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next photo"
            className="absolute right-1 flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 compact:hidden"
          >
            <CaretRightIcon weight="bold" aria-hidden className="size-6" />
          </button>
        ) : null}
      </div>

      {/* Bottom: the label at the left, the counter at the right. Textual, so
          it still reads at forty photographs. */}
      <div className="shrink-0 px-4 pb-3">
        <div className="flex items-center justify-between gap-4 text-small text-white/80">
          <span className="min-w-0 truncate">{photo?.label ?? photo?.alt}</span>
          <span className="shrink-0 numeric">
            {index + 1} / {photos.length}
          </span>
        </div>

        {many ? (
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1 compact:hidden">
            {photos.map((frame, position) => (
              <button
                key={frame.src}
                type="button"
                onClick={() => setIndex(position)}
                aria-label={`Photo ${position + 1}`}
                aria-current={position === index ? "true" : undefined}
                className={cn(
                  "h-14 w-20 shrink-0 overflow-hidden rounded-[6px] transition-opacity",
                  position === index
                    ? "opacity-100 ring-2 ring-white"
                    : "opacity-50 hover:opacity-80",
                )}
              >
                <img src={frame.src} alt="" className="size-full object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
