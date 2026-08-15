import { CheckCircleIcon, PencilSimpleIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import * as React from "react";

import { PricePill, useCelebration } from "@/components/celebration";
import { SignatureLine } from "@/components/signature-line";
import { type DrawnSignature, SignaturePad } from "@/components/signature-pad";
import { BackButton, ContinueAction, StepShell, useStepNav } from "@/components/step-shell";
import { Prose, Section, Sections, Well } from "@/components/surfaces";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buildAgreement, issueReference, legalName } from "@/lib/agreement";
import { stepById } from "@/lib/steps";
import { patch, useOnboarding } from "@/lib/store";
import { buildSummary, opensByDefault, type SummarySection, summaryCounts } from "@/lib/summary";
import { cn } from "@/lib/utils";

const LEGAL_NAME = legalName();

/**
 * Review & sign: the answers and the document, at the same time.
 *
 * The screen used to be one column: a status header, then the answers, then the
 * agreement, then the signature — which put the signature a full scroll below
 * the thing it signs, and made checking an answer against a clause a matter of
 * memory. Headspace has the same shape and had to glue a "Scroll to bottom"
 * nudge onto it; the nudge is the tell.
 *
 * Two columns instead (Headspace's better half, Figma): **answers at the left,
 * document and signature at the right**, both visible on a 1366×768 machine.
 * The document scrolls inside its own frame — it is a legally binding text and
 * a document that cannot be scrolled cannot be read to the end — and the read
 * gate follows that scroller rather than the page. On a phone it is one column
 * with the answers first, which is the seventh Presence row and the only thing
 * that differs.
 *
 * `Edit` is **per row** (Walmart), because it is by field that a student thinks
 * — "the phone number is wrong", never "the Who you are section is wrong". The
 * way back from the edited Step lives with the actions, never above the title,
 * so the round trip lands the `h1` on the same pixel it left from.
 */
export function ReviewRoute() {
  const state = useOnboarding();
  const { goNext } = useStepNav("review");
  const award = useCelebration();
  const review = state.review;
  const step = stepById("review");

  const sections = buildSummary(state);
  const counts = summaryCounts(sections);
  const clauses = buildAgreement(state);

  const [applyToken, setApplyToken] = React.useState(0);

  const signature =
    review.signatureMode === "type" ? review.typedSignature.trim() : review.drawnSignature;
  const typedMatches =
    review.signatureMode === "draw" ||
    review.typedSignature.trim().toLowerCase() === LEGAL_NAME.toLowerCase();
  /* What the primary action narrates while it is disabled. Three gates, and
     the button counts them rather than going quiet — the screen used to carry a
     "keep reading to the end" line instead, which is a nudge doing the work a
     label should. */
  const missing = [!review.documentRead, !signature || !typedMatches, !review.consented].filter(
    Boolean,
  ).length;

  const sign = () => {
    patch("review", {
      submitted: true,
      signedAt: new Date().toISOString(),
      // Issued once. Regenerating it on every render would make the one thing
      // the student is told to quote change under them.
      reference: review.reference || issueReference(),
    });
    setApplyToken((token) => token + 1);
    award?.celebrate("review", step.points);
  };

  return (
    <StepShell
      current="review"
      title="Review &amp; sign"
      lead="Check what you told us, then sign the enrollment agreement built from it."
      headerAside={<PricePill points={step.points} stepId="review" earned={review.submitted} />}
      saved={!review.submitted}
      actions={
        <>
          <BackButton current="review" />
          {review.submitted ? (
            <ContinueAction label="Continue" onClick={goNext} />
          ) : (
            <ContinueAction
              remaining={missing}
              pending={
                !review.documentRead
                  ? "Read the agreement"
                  : !signature || !typedMatches
                    ? "Sign your name"
                    : "Tick the box"
              }
              label="Sign and continue"
              onClick={sign}
            />
          )}
        </>
      }
    >
      <div className="grid grid-cols-2 items-start gap-3 narrow:grid-cols-1">
        {/* 1 · The answers. */}
        <div className="flex flex-col gap-2">
          <Well strong className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <p className="text-micro text-ink-600 numeric">
              {counts.answers} answers across {counts.sections} sections ·{" "}
              {counts.attention === 0 ? (
                <span className="text-mint-deep">nothing outstanding</span>
              ) : (
                <span className="font-strong text-danger-600">
                  {counts.attention} needs attention
                </span>
              )}
            </p>
            {review.submitted ? (
              <p className="flex items-center gap-1.5 text-micro font-strong text-mint-deep">
                <CheckCircleIcon weight="fill" aria-hidden className="size-3.5" />
                Signed · {review.reference}
              </p>
            ) : null}
          </Well>

          <Sections>
            {sections.map((section) => (
              <AnswerSection key={section.id} section={section} />
            ))}
          </Sections>
        </div>

        {/* 2 · What is being signed, and the signature — never a scroll apart. */}
        <Sections>
          <Section
            title="Your enrollment agreement"
            collapsible={false}
            action={
              review.documentRead ? (
                <span className="flex items-center gap-1 text-micro font-strong text-mint-deep">
                  <CheckCircleIcon weight="fill" aria-hidden className="size-3.5" />
                  Read in full
                </span>
              ) : (
                <span className="text-micro text-ink-400">Read to the end to sign</span>
              )
            }
            bodyClassName="p-0"
          >
            <Agreement
              clauses={clauses}
              read={review.documentRead}
              onRead={() => patch("review", { documentRead: true })}
            />
          </Section>

          <Section title="Sign it" collapsible={false}>
            {/* The line that makes a U.S. reader recognise this as a signature
                rather than as another field (Oyster, DocuSign). */}
            <p className="text-micro leading-4 text-ink-500">
              By signing electronically you agree that your electronic signature is the legal
              equivalent of your handwritten one, and that Aster may keep and send these records
              electronically.
            </p>

            <Tabs
              className="mt-2"
              value={review.signatureMode}
              onValueChange={(value) =>
                patch("review", { signatureMode: value as "type" | "draw" })
              }
            >
              <TabsList>
                <TabsTrigger value="type">Type it</TabsTrigger>
                <TabsTrigger value="draw">Draw it</TabsTrigger>
              </TabsList>

              <TabsContent value="type">
                <label htmlFor="typed-signature" className="field-label">
                  Type your full legal name
                </label>
                <Input
                  id="typed-signature"
                  className="mt-1 h-10 font-script text-h2"
                  placeholder={LEGAL_NAME}
                  value={review.typedSignature}
                  disabled={review.submitted}
                  onChange={(event) => patch("review", { typedSignature: event.target.value })}
                />
                {review.typedSignature.trim() && !typedMatches ? (
                  <p className="mt-1 flex items-center gap-1 text-micro text-danger-600">
                    <WarningCircleIcon weight="fill" aria-hidden className="size-3" />
                    Type it exactly as {LEGAL_NAME}.
                  </p>
                ) : null}
              </TabsContent>

              <TabsContent value="draw">
                <SignaturePad
                  label="Sign with your mouse or finger"
                  value={review.drawnSignature}
                  strokes={review.drawnStrokes}
                  onChange={(drawn: DrawnSignature) =>
                    patch("review", {
                      drawnSignature: drawn.dataUrl,
                      drawnStrokes: drawn.strokes,
                      drawnSize: drawn.size,
                    })
                  }
                />
              </TabsContent>
            </Tabs>

            <label htmlFor="consent" className="mt-2.5 flex cursor-pointer items-start gap-2.5">
              <Checkbox
                id="consent"
                checked={review.consented}
                disabled={!review.documentRead || review.submitted}
                onCheckedChange={(checked) => patch("review", { consented: checked === true })}
              />
              <span className="text-small leading-5 text-ink-700">
                I have read both documents and I agree to be legally bound by them.
              </span>
            </label>

            <div className="mt-3">
              <SignatureLine
                name={LEGAL_NAME}
                mode={review.signatureMode}
                typed={review.typedSignature}
                drawnStrokes={review.drawnStrokes}
                drawnSize={review.drawnSize}
                drawnImage={review.drawnSignature}
                signedAt={review.signedAt}
                reference={review.reference}
                applyToken={applyToken}
              />
            </div>
          </Section>
        </Sections>
      </div>
    </StepShell>
  );
}

/**
 * One section of answers. Closed, it says what it holds; open, every row
 * carries its own `Edit`.
 */
function AnswerSection({ section }: { section: SummarySection }) {
  return (
    <Section
      title={section.label}
      defaultOpen={opensByDefault(section)}
      value={section.digest}
      action={<StatusPill status={section.status} />}
      bodyClassName="px-3 py-1.5"
    >
      <dl>
        {section.rows.map((row) =>
          /* A long free-text answer gets a full-width block. Prose squeezed
             into a two-column list is what makes a summary unreadable. */
          row.long ? (
            <div key={row.label} className="border-b border-ink-100/70 py-1 last:border-0">
              <div className="flex items-baseline justify-between gap-2">
                <dt className="text-small text-ink-500">{row.label}</dt>
                <EditRow section={section} row={row.label} />
              </div>
              <dd
                className={cn(
                  "mt-0.5 rounded-[var(--radius-field)] bg-well px-2 py-1.5 text-small leading-5",
                  row.missing ? "text-danger-600" : "text-ink-800",
                )}
              >
                {row.value}
              </dd>
            </div>
          ) : (
            <div
              key={row.label}
              className="flex items-baseline gap-2 border-b border-ink-100/70 py-1 last:border-0"
            >
              <dt className="shrink-0 text-small text-ink-500">{row.label}</dt>
              <dd
                className={cn(
                  "min-w-0 flex-1 truncate text-right text-small font-strong",
                  row.missing ? "text-danger-600" : "text-ink-800",
                )}
              >
                {row.value}
              </dd>
              <EditRow section={section} row={row.label} />
            </div>
          ),
        )}
      </dl>
    </Section>
  );
}

/**
 * `Edit`, on the row rather than on the section (Walmart).
 *
 * It carries `from=review`, which is what puts the way back into the edited
 * Step's action pill instead of into a block above its title — the round trip
 * has to land the `h1` on the pixel it left from.
 */
function EditRow({ section, row }: { section: SummarySection; row: string }) {
  return (
    <Link
      to={section.path}
      search={{ from: "review" }}
      className="row-nudge shrink-0 rounded-[var(--radius-field)] p-1 text-ink-400 transition-colors hover:text-violet-600"
    >
      <PencilSimpleIcon aria-hidden className="size-3" />
      <span className="sr-only">
        Edit {row} in {section.label}
      </span>
    </Link>
  );
}

function StatusPill({ status }: { status: SummarySection["status"] }) {
  const copy =
    status === "complete" ? "Complete" : status === "attention" ? "Needs attention" : "Skipped";
  return (
    <span
      className={cn(
        "rounded-[var(--radius-pill)] px-1.5 py-0.5 text-[0.625rem] font-bold tracking-[0.06em] uppercase",
        status === "complete" && "bg-mint-50 text-mint-deep",
        status === "attention" && "bg-danger-50 text-danger-600",
        status === "skipped" && "bg-ink-50 text-ink-500",
      )}
    >
      {copy}
    </span>
  );
}

/**
 * The agreement, scrolling inside its own frame with the read gate attached to
 * that scroller rather than to the page.
 *
 * It says what it is above the text, which was the original complaint: the
 * screen used to open on an unlabelled legal document.
 */
function Agreement({
  clauses,
  read,
  onRead,
}: {
  clauses: ReturnType<typeof buildAgreement>;
  read: boolean;
  onRead: () => void;
}) {
  const readRef = React.useRef(read);
  readRef.current = read;

  /* A document short enough not to scroll has already been read to the end the
     moment it is on screen. Without this the gate is unreachable on a tall
     monitor, and the student is told to keep reading something with no more of
     it to read — which is what "não to conseguindo assinar" looked like. */
  const scroller = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const element = scroller.current;
    if (!element || readRef.current) return;
    if (element.scrollHeight <= element.clientHeight + 24) onRead();
  }, [onRead]);

  const onScroll = React.useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      if (readRef.current) return;
      const element = event.currentTarget;
      if (element.scrollTop + element.clientHeight >= element.scrollHeight - 24) onRead();
    },
    [onRead],
  );

  return (
    <div
      ref={scroller}
      onScroll={onScroll}
      className="max-h-[18rem] overflow-y-auto px-3 py-2.5"
      // biome-ignore lint/a11y/noNoninteractiveTabindex: the read gate depends on this region being scrolled, so a keyboard user has to be able to reach and scroll it.
      tabIndex={0}
      aria-label="Enrollment agreement"
      role="region"
    >
      <ol className="space-y-3">
        {clauses.map((clause) => (
          <li key={clause.number}>
            <p className="text-small font-bold text-ink-900">
              <span className="numeric">{clause.number}. </span>
              {clause.heading}
            </p>
            <Prose className="mt-0.5 text-ink-700">
              {clause.runs.map((run, index) => (
                <React.Fragment key={`${clause.number}-${index}`}>
                  {run.emphasis ? (
                    <strong className="font-strong text-ink-900">{run.text}</strong>
                  ) : (
                    run.text
                  )}
                </React.Fragment>
              ))}
            </Prose>
          </li>
        ))}
      </ol>
    </div>
  );
}
