import {
  ArrowRightIcon,
  CaretDownIcon,
  CheckCircleIcon,
  PencilSimpleIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import * as React from "react";

import { AwardStage, PricePill, usePointsAward } from "@/components/points-award";
import { SignatureLine } from "@/components/signature-line";
import { type DrawnSignature, SignaturePad } from "@/components/signature-pad";
import { BackButton, StepShell, useStepNav } from "@/components/step-shell";
import { Panel, SectionLabel, Well } from "@/components/surfaces";
import { Button } from "@/components/ui/button";
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
 * Review & sign: the answers come first.
 *
 * The screen the client bats an eye at and cannot identify. The diagnosis is
 * structural, not decorative: **the order was inverted.** It opened on an
 * unlabelled legal document, and "Your answers" — the review of everything, the
 * reason the screen exists — sat below the fold under a Points figure.
 *
 * Corrected order: a status header saying what this is and how complete it is,
 * then the student's own answers, then the agreement, then signing. The student
 * checks their own data *before* reading the document built from it (Zillow's
 * lease review, GoFundMe's fixed purpose rail, Gusto's "Step 4 of 4 · Review").
 *
 * This screen is the documented exception to the one-viewport rule: the object
 * of the decision is a legally binding document, so it scrolls **inside its own
 * Panel** and the signing bar is fixed outside it. A previous round made the
 * whole page the only scroll container specifically to support the read gate;
 * the gate follows the scroll into the panel here.
 */
export function ReviewRoute() {
  const state = useOnboarding();
  const { next, goNext } = useStepNav("review");
  const award = usePointsAward();
  const review = state.review;
  const step = stepById("review");

  const sections = buildSummary(state);
  const counts = summaryCounts(sections);
  const clauses = buildAgreement(state);

  const signatureRef = React.useRef<HTMLDivElement>(null);
  const [applyToken, setApplyToken] = React.useState(0);

  const signature =
    review.signatureMode === "type" ? review.typedSignature.trim() : review.drawnSignature;
  const typedMatches =
    review.signatureMode === "draw" ||
    review.typedSignature.trim().toLowerCase() === LEGAL_NAME.toLowerCase();
  const canSign = review.documentRead && review.consented && Boolean(signature) && typedMatches;

  const sign = () => {
    patch("review", {
      submitted: true,
      signedAt: new Date().toISOString(),
      // Issued once. Regenerating it on every render would make the one thing
      // the student is told to quote change under them.
      reference: review.reference || issueReference(),
    });
    setApplyToken((token) => token + 1);
    window.setTimeout(() => {
      signatureRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 60);
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
        review.submitted ? (
          <>
            <BackButton current="review" />
            <Button type="button" size="lg" onClick={goNext}>
              <span className="hidden sm:inline">Next: {next?.label.toLowerCase()}</span>
              <span className="sm:hidden">Next</span>
              <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
            </Button>
          </>
        ) : (
          <>
            <BackButton current="review" />
            <Button type="button" size="lg" disabled={!canSign} onClick={sign}>
              Sign and continue
              <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
            </Button>
          </>
        )
      }
    >
      {/* 1 · The status header. What this screen is, one sentence of purpose,
          the position in a known sequence, and a completeness line. The Points
          figure lives here rather than beside the answers, where it competed
          with the sections' own meaning. */}
      <Well strong className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <div>
          <p className="text-[0.6875rem] font-bold tracking-[0.06em] text-ink-400 uppercase">
            Last quest before the deposit
          </p>
          <p className="mt-0.5 text-body text-ink-700 numeric">
            {counts.answers} answers across {counts.sections} sections ·{" "}
            {counts.attention === 0 ? (
              <span className="text-mint-deep">nothing outstanding</span>
            ) : (
              <span className="font-strong text-danger-600">
                {counts.attention} needs attention
              </span>
            )}
          </p>
        </div>
        {review.submitted ? (
          <p className="flex items-center gap-2 text-small font-strong text-mint-deep">
            <CheckCircleIcon weight="fill" aria-hidden className="size-4" />
            Signed. Reference {review.reference}
          </p>
        ) : null}
      </Well>

      {/* 2 · Your answers, above the agreement. */}
      <SectionLabel description="Fix anything wrong before you sign. Editing an answer re-opens this for signing.">
        Your answers
      </SectionLabel>
      {/* `items-start` so a short section does not stretch to the height of the
          tall one beside it. A grid row that stretches leaves a block of empty
          white inside a card, which reads as a section with something missing
          from it. */}
      <div className="grid items-start gap-3 lg:grid-cols-2">
        {sections.map((section) => (
          <AnswerSection key={section.id} section={section} />
        ))}
      </div>

      {/* 3 · The agreement, scrolling inside its own Panel. */}
      <SectionLabel description="Two documents, written out in full. Scroll to the end before you sign.">
        Your enrollment agreement
      </SectionLabel>
      <Agreement
        clauses={clauses}
        read={review.documentRead}
        onRead={() => patch("review", { documentRead: true })}
      />

      {/* 4 · Signing. */}
      <Panel title="Sign it">
        {/* The line that makes a U.S. reader recognise this as a signature
            rather than as another field (Oyster, DocuSign). */}
        <p className="text-small leading-5 text-ink-500">
          By signing electronically you agree that your electronic signature is the legal equivalent
          of your handwritten one, and that Aster may keep and send these records electronically.
        </p>

        <Tabs
          className="mt-4"
          value={review.signatureMode}
          onValueChange={(value) => patch("review", { signatureMode: value as "type" | "draw" })}
        >
          <TabsList>
            <TabsTrigger value="type">Type it</TabsTrigger>
            <TabsTrigger value="draw">Draw it</TabsTrigger>
          </TabsList>

          <TabsContent value="type" className="mt-3">
            <label htmlFor="typed-signature" className="field-label">
              Type your full legal name
            </label>
            <Input
              id="typed-signature"
              className="mt-2 font-script text-h2"
              placeholder={LEGAL_NAME}
              value={review.typedSignature}
              disabled={review.submitted}
              onChange={(event) => patch("review", { typedSignature: event.target.value })}
            />
            {review.typedSignature.trim() && !typedMatches ? (
              <p className="mt-2 flex items-center gap-1.5 text-small text-danger-600">
                <WarningCircleIcon weight="fill" aria-hidden className="size-4" />
                Type it exactly as {LEGAL_NAME}.
              </p>
            ) : null}
          </TabsContent>

          <TabsContent value="draw" className="mt-3">
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

        <label htmlFor="consent" className="mt-4 flex cursor-pointer items-start gap-3">
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

        {!review.documentRead ? (
          <p className="mt-2 text-small text-ink-400">Keep reading to the end to sign.</p>
        ) : null}

        <div ref={signatureRef} className="mt-5">
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
      </Panel>

      <AwardStage stepId="review" headline="Signed and filed.">
        <Button type="button" size="lg" onClick={goNext}>
          Continue
          <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
        </Button>
      </AwardStage>
    </StepShell>
  );
}

/**
 * One section: a card, not a `divide-y` band. The header carries the section
 * name, a status pill, a chevron and **exactly one Edit** — Edit used to be per
 * group, which multiplied buttons and flattened the hierarchy.
 *
 * Expanded by default where there is a problem or where there are few rows;
 * collapsed otherwise, and a collapsed section still shows its one-line digest,
 * because closing a section should not blind you to it.
 */
function AnswerSection({ section }: { section: SummarySection }) {
  const [open, setOpen] = React.useState(() => opensByDefault(section));

  return (
    <Panel
      className={cn(section.status === "attention" && "border-danger-100")}
      bodyClassName="p-0"
    >
      <div className="flex items-start gap-2 px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          className="row-nudge flex min-w-0 flex-1 items-start gap-2 text-left"
        >
          <CaretDownIcon
            weight="bold"
            aria-hidden
            className={cn(
              "mt-1 size-4 shrink-0 text-ink-400 transition-transform duration-[var(--duration-base)]",
              !open && "-rotate-90",
            )}
          />
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-2">
              <span className="text-body font-strong text-ink-900">{section.label}</span>
              <StatusPill status={section.status} />
              {/* Per-Step time and required/optional return here, read from
                  `steps.ts`. A previous round implemented these and then
                  removed them; they come back by explicit decision. */}
              <span className="text-[0.6875rem] text-ink-400 numeric">
                {section.minutes} min · {section.required ? "Required" : "Optional"}
              </span>
            </span>
            {/* The digest. A closed section still says something. */}
            {!open ? (
              <span className="mt-0.5 block truncate text-small text-ink-500">
                {section.digest}
              </span>
            ) : null}
          </span>
        </button>

        <Button asChild variant="ghost" size="sm">
          <Link to={section.path} search={{ from: "review" }}>
            <PencilSimpleIcon aria-hidden className="size-4" />
            Edit
            <span className="sr-only"> {section.label}</span>
          </Link>
        </Button>
      </div>

      {open ? (
        <dl className="space-y-1 border-t border-ink-100 px-4 py-3">
          {section.rows.map((row) =>
            /* A long free-text answer gets a full-width block. Prose squeezed
               into a two-column list is what makes a summary unreadable. */
            row.long ? (
              <div key={row.label} className="py-1.5">
                <dt className="text-small text-ink-500">{row.label}</dt>
                <dd
                  className={cn(
                    "mt-1 rounded-[var(--radius-field)] bg-well px-3 py-2 text-small leading-5",
                    row.missing ? "text-danger-600" : "text-ink-800",
                  )}
                >
                  {row.value}
                </dd>
              </div>
            ) : (
              <div
                key={row.label}
                className="flex items-baseline justify-between gap-4 border-b border-ink-100/70 py-1.5 last:border-0"
              >
                <dt className="text-small text-ink-500">{row.label}</dt>
                <dd
                  className={cn(
                    "text-right text-small font-strong",
                    row.missing ? "text-danger-600" : "text-ink-800",
                  )}
                >
                  {row.value}
                </dd>
              </div>
            ),
          )}
        </dl>
      ) : null}
    </Panel>
  );
}

function StatusPill({ status }: { status: SummarySection["status"] }) {
  const copy =
    status === "complete" ? "Complete" : status === "attention" ? "Needs attention" : "Skipped";
  return (
    <span
      className={cn(
        "rounded-[var(--radius-pill)] px-2 py-0.5 text-[0.625rem] font-bold tracking-[0.06em] uppercase",
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
 * The agreement, scrolling **inside its own Panel** with the read gate attached
 * to that scroller rather than to the page.
 *
 * This is the documented exception to the one-viewport rule, and it is the only
 * one: the object of the decision is a legally binding document, and a document
 * that cannot be scrolled cannot be read to the end.
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

  const onScroll = React.useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      if (readRef.current) return;
      const element = event.currentTarget;
      if (element.scrollTop + element.clientHeight >= element.scrollHeight - 24) onRead();
    },
    [onRead],
  );

  return (
    <Panel
      flush
      footerMeta={
        read ? (
          <span className="flex items-center gap-1.5 text-mint-deep">
            <CheckCircleIcon weight="fill" aria-hidden className="size-4" />
            Read in full
          </span>
        ) : (
          "Keep reading to the end to sign"
        )
      }
    >
      <div
        onScroll={onScroll}
        className="max-h-[26rem] overflow-y-auto px-4 py-4 sm:px-6"
        // biome-ignore lint/a11y/noNoninteractiveTabindex: the read gate depends on this region being scrolled, so a keyboard user has to be able to reach and scroll it.
        tabIndex={0}
        aria-label="Enrollment agreement"
        role="region"
      >
        <ol className="space-y-5">
          {clauses.map((clause) => (
            <li key={clause.number}>
              <p className="text-small font-bold text-ink-900">
                <span className="numeric">{clause.number}. </span>
                {clause.heading}
              </p>
              <p className="mt-1 max-w-prose text-small leading-6 text-ink-700">
                {clause.runs.map((run, index) => (
                  <React.Fragment key={`${clause.number}-${index}`}>
                    {run.emphasis ? (
                      <strong className="font-strong text-ink-900">{run.text}</strong>
                    ) : (
                      run.text
                    )}
                  </React.Fragment>
                ))}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </Panel>
  );
}
