import { motion, useReducedMotion } from "motion/react";
import { Tabs as TabsPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Retheme note: a pill segmented control on a sunken track, with the active
 * thumb sliding between options via a shared layout animation rather than
 * cross-fading. The slide is what tells a first-time arrival that the other
 * tab exists at all — the entry screen's whole bug was people landing on the
 * wrong tab and not noticing the other one.
 *
 * Radix does not expose its own value context, so we mirror it here purely to
 * know which trigger should own the sliding thumb.
 */
type TabsContextValue = { value: string | undefined; thumbId: string };

const TabsContext = React.createContext<TabsContextValue | null>(null);

function Tabs({
  className,
  value,
  defaultValue,
  onValueChange,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  const thumbId = React.useId();
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const current = value ?? uncontrolled;

  const handleValueChange = React.useCallback(
    (next: string) => {
      setUncontrolled(next);
      onValueChange?.(next);
    },
    [onValueChange],
  );

  const context = React.useMemo(() => ({ value: current, thumbId }), [current, thumbId]);

  return (
    <TabsContext.Provider value={context}>
      <TabsPrimitive.Root
        data-slot="tabs"
        className={cn("flex flex-col gap-6", className)}
        value={value}
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
        {...props}
      />
    </TabsContext.Provider>
  );
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex w-full items-center gap-1 rounded-[var(--radius-pill)] bg-sunken p-1",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  children,
  value,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const context = React.useContext(TabsContext);
  const reduceMotion = useReducedMotion();
  const isActive = context?.value === value;

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      value={value}
      className={cn(
        "relative flex h-10 flex-1 items-center justify-center rounded-[var(--radius-pill)] px-4 text-body font-bold text-ink-500 transition-colors hover:text-ink-800 data-[state=active]:text-violet-600",
        className,
      )}
      {...props}
    >
      {isActive && context ? (
        <motion.span
          aria-hidden
          layoutId={context.thumbId}
          /* The thumb moves under JS-driven inline transforms, which the global
             prefers-reduced-motion CSS reset cannot reach — it only clamps CSS
             animations and transitions. So the gate has to live here. */
          transition={
            reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36 }
          }
          className="absolute inset-0 rounded-[var(--radius-pill)] bg-surface shadow-soft"
        />
      ) : null}
      <span className="relative">{children}</span>
    </TabsPrimitive.Trigger>
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content data-slot="tabs-content" className={cn(className)} {...props} />;
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
