import { CaretDownIcon } from "@phosphor-icons/react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import type * as React from "react";

import { cn } from "@/lib/utils";

/**
 * The shadcn primitive, brought onto this round's two rules.
 *
 * No shadow — elevation stopped being available as a way to say "this is one
 * thing" (ADR 0010), so an item is told from its neighbour by a rule. And the
 * open/close transition is `grid-template-rows: 0fr → 1fr` rather than
 * `height: 0 → var(--radix-accordion-content-height)`: animating height
 * reflows the whole subtree on every frame, and that is the first suspect for
 * the stutter the client reported.
 *
 * `Section` in `surfaces.tsx` is what a Step actually uses. This stays because
 * it is the primitive the style guide draws and because a stray shadcn
 * accordion appearing later should already be right.
 */
function Accordion({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn(
        "overflow-hidden rounded-[var(--radius-card)] border border-ink-100 bg-surface",
        "[&>*+*]:border-t [&>*+*]:border-ink-100",
        className,
      )}
      {...props}
    />
  );
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item data-slot="accordion-item" className={className} {...props} />;
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group flex flex-1 items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-ink-50/60 compact:min-h-[var(--tap-target)]",
          className,
        )}
        {...props}
      >
        {children}
        <CaretDownIcon
          weight="bold"
          aria-hidden
          className="size-3 shrink-0 text-ink-400 transition-transform duration-[var(--duration-quick)] group-data-[state=open]:rotate-180"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="grid data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      {/* The clip that lets the track animate without the content spilling
          while it is between sizes. */}
      <div className="min-h-0 overflow-hidden">
        <div className={cn("border-t border-ink-100 px-3 py-2.5", className)}>{children}</div>
      </div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
