import { CheckCircleIcon } from "@phosphor-icons/react";
import * as React from "react";

import type { EnrollmentDocument } from "@/lib/fixtures";
import { cn } from "@/lib/utils";

/**
 * A document read in the page, not in another tab.
 *
 * The live step links a PDF, which is how a packet gets agreed to unread: the
 * tab opens, the tab closes, the box gets ticked. Here the text is in a
 * scrollable panel and the acceptance only unlocks once the panel has reached
 * its end — a low bar, but a real one, and the honest thing to show a
 * stakeholder who asked what "read and accepted" means.
 *
 * A panel that never overflows counts as read on mount: a short document that
 * cannot be scrolled must not become an unclearable gate.
 */
export function DocumentReader({
  document: doc,
  read,
  onRead,
}: {
  document: EnrollmentDocument;
  read: boolean;
  onRead: () => void;
}) {
  const scroller = React.useRef<HTMLDivElement>(null);
  const [progress, setProgress] = React.useState(read ? 1 : 0);

  const check = React.useCallback(() => {
    const element = scroller.current;
    if (!element) return;
    const scrollable = element.scrollHeight - element.clientHeight;
    if (scrollable <= 4) {
      setProgress(1);
      onRead();
      return;
    }
    // A document already marked read stays at 100%. It used to be seeded that
    // way and then immediately overwritten by this measurement — a student
    // returning to the step saw the "Read" pill above an empty bar, which reads
    // as "scroll it again".
    if (read) {
      setProgress(1);
      return;
    }
    const ratio = Math.min(1, element.scrollTop / scrollable);
    setProgress(ratio);
    // 8px of slack: sub-pixel line heights mean scrollTop often stops a
    // fraction short of the true bottom, and "scroll harder" is not a state
    // anyone should be stuck in.
    if (element.scrollTop >= scrollable - 8) onRead();
  }, [onRead, read]);

  React.useEffect(() => {
    check();
  }, [check]);

  return (
    <section className="overflow-hidden rounded-[var(--radius-card)] border border-ink-200 bg-surface">
      <header className="flex items-center gap-3 border-b border-ink-100 px-5 py-4">
        <div className="flex-1">
          <h3 className="text-body font-bold text-ink-900">{doc.title}</h3>
          <p className="text-small text-ink-500">{doc.summary}</p>
        </div>
        {read ? (
          <span className="flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-mint-50 px-3 py-1 text-small font-bold text-mint-700">
            <CheckCircleIcon weight="fill" aria-hidden className="size-4" />
            Read
          </span>
        ) : (
          <span className="text-small text-ink-400">{Math.round(progress * 100)}%</span>
        )}
      </header>

      <div
        ref={scroller}
        onScroll={check}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region that keyboard focus cannot reach cannot be scrolled by keyboard, and scrolling to the end is what unlocks the acceptance below. WCAG G202 puts tabindex on exactly this pattern.
        tabIndex={0}
        role="region"
        aria-label={doc.title}
        className="max-h-[19rem] space-y-5 overflow-y-auto px-5 py-5"
      >
        {doc.body.map((section) => (
          <div key={section.heading} className="space-y-2">
            <h4 className="text-small font-bold tracking-[0.04em] text-ink-900 uppercase">
              {section.heading}
            </h4>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-body text-ink-600">
                {paragraph}
              </p>
            ))}
          </div>
        ))}
        <p className="border-t border-ink-100 pt-4 text-small text-ink-400">End of {doc.title}.</p>
      </div>

      <div aria-hidden className="h-1 bg-ink-100">
        <div
          className={cn(
            "h-full transition-[width] duration-150",
            read ? "bg-mint-500" : "brand-gradient",
          )}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </section>
  );
}
