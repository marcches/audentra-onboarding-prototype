import { InfoIcon, SealCheckIcon, WarningIcon } from "@phosphor-icons/react";
import type * as React from "react";

import { cn } from "@/lib/utils";

const tones = {
  info: {
    wrapper: "border-azure-100 bg-azure-50 text-ink-800",
    icon: "text-azure-500",
    Icon: InfoIcon,
  },
  success: {
    wrapper: "border-mint-100 bg-mint-50 text-mint-700",
    icon: "text-mint-600",
    Icon: SealCheckIcon,
  },
  caution: {
    wrapper: "border-amber-500/25 bg-amber-50 text-ink-800",
    icon: "text-amber-500",
    Icon: WarningIcon,
  },
} as const;

/**
 * The standing-condition surface from the message library: it says what is
 * true and, where there is one, offers the action that resolves it. Never a
 * bare status word.
 */
export function Notice({
  tone = "info",
  title,
  children,
  action,
  className,
  alert = false,
  ref,
}: {
  tone?: keyof typeof tones;
  title?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  /**
   * For a notice that appears in response to something the user just did.
   * Without it the message is drawn on screen and announced to nobody, and a
   * screen-reader user reads a failed submit as the button doing nothing.
   */
  alert?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}) {
  const { wrapper, icon, Icon } = tones[tone];

  return (
    <div
      ref={ref}
      role={alert ? "alert" : undefined}
      tabIndex={alert ? -1 : undefined}
      className={cn(
        "flex items-start gap-2 rounded-[var(--radius-field)] border px-3 py-2",
        wrapper,
        className,
      )}
    >
      <Icon weight="fill" aria-hidden className={cn("mt-1 size-4 shrink-0", icon)} />
      <div className="min-w-0 flex-1 space-y-1">
        {title ? <p className="text-small font-bold">{title}</p> : null}
        <div className="text-meta leading-4">{children}</div>
        {action ? <div className="pt-1">{action}</div> : null}
      </div>
    </div>
  );
}
