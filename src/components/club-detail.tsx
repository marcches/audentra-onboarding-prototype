import { CalendarBlankIcon } from "@phosphor-icons/react";

import { Overlay } from "@/components/ui/overlay";
import { type Club, clubCategories } from "@/lib/fixtures";

/**
 * A club's detail view, opened from the grid before picking.
 *
 * The first consumer of the responsive overlay: a sheet on a phone, a dialog on
 * a desktop. This is supporting detail the student opens, reads and dismisses
 * to get back to choosing — exactly the thing a sheet is for, and exactly the
 * thing a centred modal on a 390px screen handles worst.
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
    <Overlay open={open} onOpenChange={onOpenChange} title={club.name} description={club.blurb}>
      <figure className="mt-4 space-y-3">
        <div className="overflow-hidden rounded-[var(--radius-card)] bg-ink-50">
          <img
            src={club.image.src}
            alt={club.image.alt}
            className="aspect-[16/9] w-full object-cover md:aspect-[3/2]"
            decoding="async"
          />
        </div>

        <figcaption className="space-y-2.5">
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
    </Overlay>
  );
}
