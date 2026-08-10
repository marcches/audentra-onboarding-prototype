import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type Residence, residenceViews } from "@/lib/fixtures";
import { cn } from "@/lib/utils";

/**
 * Three photos per residence — the room, the building, the shared space.
 *
 * The room shot leads, because "what would my room be like" is the question
 * this step is actually being asked, and the card's hero image (the building)
 * doesn't answer it. Nobody picks where they'll live off three lines of text.
 */
export function ResidenceGallery({
  residence,
  open,
  onOpenChange,
}: {
  residence: Residence | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [index, setIndex] = React.useState(0);

  /* Keyed on the residence, not on mount. The parent renders this component
     permanently (it just passes `residence={null}` when closed), so the index
     survives every close — and an empty dependency array meant a second
     residence opened on whatever slide the first one was left on, which made
     the "See the room" button show the shared lounge. */
  React.useEffect(() => {
    setIndex(0);
  }, [residence]);

  if (!residence) return null;

  const view = residenceViews[index] ?? residenceViews[0];
  if (!view) return null;
  const photo = residence.images[view.key];

  const step = (direction: -1 | 1) => {
    setIndex((current) => (current + direction + residenceViews.length) % residenceViews.length);
  };

  return (
    /* Fully controlled by the parent and carrying no DialogTrigger, so Radix
       only ever reports a close — there is no open branch to hook a reset on. */
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[46rem]">
        <DialogHeader>
          <DialogTitle>{residence.name}</DialogTitle>
          <DialogDescription>{residence.detail}</DialogDescription>
        </DialogHeader>

        <figure className="mt-5 space-y-3">
          <div className="overflow-hidden rounded-[var(--radius-card)] bg-ink-50">
            <img
              src={photo.src}
              alt={photo.alt}
              className="aspect-[3/2] w-full object-cover"
              /* The gallery is opened deliberately, so its images are wanted
                 immediately — no lazy flash on the slide the student asked for. */
              decoding="async"
            />
          </div>
          <figcaption className="flex items-center justify-between gap-4">
            <div className="flex gap-1.5" role="tablist" aria-label={`Views of ${residence.name}`}>
              {residenceViews.map((candidate, candidateIndex) => (
                <button
                  key={candidate.key}
                  type="button"
                  role="tab"
                  aria-selected={candidateIndex === index}
                  onClick={() => setIndex(candidateIndex)}
                  className={cn(
                    "rounded-[var(--radius-pill)] px-3.5 py-1.5 text-small font-bold transition-colors",
                    candidateIndex === index
                      ? "bg-ink-900 text-white"
                      : "bg-ink-50 text-ink-600 hover:bg-ink-100",
                  )}
                >
                  {candidate.label}
                </button>
              ))}
            </div>
            <div className="flex shrink-0 gap-1">
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={() => step(-1)}
                aria-label="Previous photo"
              >
                <ArrowLeftIcon weight="bold" aria-hidden className="size-4" />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={() => step(1)}
                aria-label="Next photo"
              >
                <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
              </Button>
            </div>
          </figcaption>
        </figure>
      </DialogContent>
    </Dialog>
  );
}
