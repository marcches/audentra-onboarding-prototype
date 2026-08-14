import { CalendarBlankIcon } from "@phosphor-icons/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type Club, clubCategories } from "@/lib/fixtures";

/**
 * A club's detail view, opened from the grid before picking — the same
 * dialog-on-a-photo pattern as Housing's residence gallery, reused rather than
 * invented again: a larger image, the room to actually read about the thing,
 * and the two facts a one-line blurb never had space for (how often it meets,
 * what a session is actually like).
 */
export function ClubDetail({
  club,
  open,
  onOpenChange,
}: {
  club: Club | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!club) return null;

  const category = clubCategories.find((option) => option.value === club.category);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[34rem]">
        <DialogHeader>
          <DialogTitle>{club.name}</DialogTitle>
          <DialogDescription>{club.blurb}</DialogDescription>
        </DialogHeader>

        <figure className="mt-5 space-y-4">
          <div className="overflow-hidden rounded-[var(--radius-card)] bg-ink-50">
            <img
              src={club.image.src}
              alt={club.image.alt}
              className="aspect-[3/2] w-full object-cover"
              decoding="async"
            />
          </div>

          <figcaption className="space-y-3">
            {category ? (
              <span className="inline-flex items-center rounded-[var(--radius-pill)] bg-violet-50 px-3 py-1 text-micro font-bold tracking-[0.06em] text-violet-700 uppercase">
                {category.label}
              </span>
            ) : null}

            <p className="text-body leading-6 text-ink-700">{club.detail}</p>

            <p className="flex items-start gap-2 text-small text-ink-500">
              <CalendarBlankIcon
                weight="duotone"
                aria-hidden
                className="mt-0.5 size-4 shrink-0 text-violet-500"
              />
              {club.cadence}
            </p>
          </figcaption>
        </figure>
      </DialogContent>
    </Dialog>
  );
}
