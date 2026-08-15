import { XIcon } from "@phosphor-icons/react";
import { Dialog as DialogPrimitive } from "radix-ui";
import type * as React from "react";

import { DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/**
 * One overlay that is a bottom sheet on a phone and a dialog on a desktop.
 *
 * A centred dialog on a 390px screen is the desktop layout narrowed: it lands
 * in the middle of the viewport, its close button sits at the top right where
 * a thumb cannot reach, and it looks like a website's modal rather than
 * anything native. A sheet rises from the edge the thumb is already at.
 *
 * It is one component rather than two because "which one am I" is a decision
 * about the viewport, not about the content — the caller passes a title and
 * children and never thinks about it again.
 *
 * **Not** for a celebration. Nothing in the flow celebrates in an overlay any
 * more: winning, accepting and finishing all happen on the screen the student
 * is already standing on, through the celebration layer.
 *
 * Positioning is done with a flex wrapper rather than `top-1/2 -translate-y-1/2`
 * so that nothing static competes with the enter/exit keyframes — which is what
 * lets the same element slide up on a phone and zoom in on a desktop.
 */
export function Overlay({
  open,
  onOpenChange,
  title,
  description,
  className,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <div className="pointer-events-none fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4 compact:items-end compact:p-0">
          <DialogPrimitive.Content
            data-slot="overlay-content"
            className={cn(
              "pointer-events-auto flex max-h-[85dvh] w-full max-w-[34rem] flex-col overflow-y-auto bg-surface text-ink-900 outline-none",
              "rounded-[var(--radius-slab)] border border-ink-100 px-5 pt-4 pb-5 shadow-modal",
              "compact:max-h-[88dvh] compact:max-w-none compact:rounded-b-none compact:border-0 compact:px-4 compact:pt-2 compact:pb-5",
              "duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              "compact:data-[state=closed]:slide-out-to-bottom-6 compact:data-[state=open]:slide-in-from-bottom-6",
              className,
            )}
          >
            {/* The grab handle is the sheet's tell — it says "this came from the
                bottom and goes back there". Meaningless on a dialog, so it is
                not drawn on one. */}
            <span
              aria-hidden
              className="mx-auto mb-2 hidden h-1 w-9 shrink-0 rounded-full bg-ink-200 compact:block"
            />

            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1 space-y-0.5">
                <DialogPrimitive.Title className="text-h2 text-ink-900">
                  {title}
                </DialogPrimitive.Title>
                {description ? (
                  <DialogPrimitive.Description className="text-small text-ink-600">
                    {description}
                  </DialogPrimitive.Description>
                ) : (
                  /* Radix warns without one, and a sheet whose title already
                     says everything should not invent a second line to satisfy
                     the warning. */
                  <DialogPrimitive.Description className="sr-only">
                    {title}
                  </DialogPrimitive.Description>
                )}
              </div>

              <DialogPrimitive.Close className="-mr-1.5 flex size-8 shrink-0 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-ink-50 hover:text-ink-700">
                <XIcon weight="bold" aria-hidden className="size-4" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            </div>

            {children}
          </DialogPrimitive.Content>
        </div>
      </DialogPortal>
    </DialogPrimitive.Root>
  );
}
