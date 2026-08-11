import { ArrowRightIcon, PencilSimpleIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { Link, useNavigate } from "@tanstack/react-router";
import * as React from "react";

import { Field } from "@/components/field";
import { Notice } from "@/components/notice";
import { SignatureLine } from "@/components/signature-line";
import { type DrawnSignature, SignaturePad } from "@/components/signature-pad";
import { ContextPanel, StepShell } from "@/components/step-shell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buildAgreement, issueReference, legalName } from "@/lib/agreement";
import { institution, offer } from "@/lib/fixtures";
import { patch, useOnboarding } from "@/lib/store";
import { buildSummary } from "@/lib/summary";
import { cn } from "@/lib/utils";

const LEGAL_NAME = legalName();

/**
 * Review & sign.
 *
 * The document is the left column and it is a document: a formatted sheet with
 * the student's own answers set into its sentences, not a summary of fields
 * beside a packet of generic text. Reading your own programme, your own
 * address and your own housing ranking inside the clauses is what makes this an
 * agreement about you.
 *
 * The right column carries the summary — every line linking back to the step
 * that produced it, which costs nothing because each step is already its own
 * route — and the signature controls.
 *
 * No confetti. That belongs to accepting the offer, and there is product
 * precedent for getting exactly this wrong.
 *
 * Note for the demo: the primary source doesn't cover this step. It is a
 * proposal.
 */
export function ReviewRoute() {
  const state = useOnboarding();
  const navigate = useNavigate();
  const review = state.review;
  const summary = buildSummary(state);
  const clauses = buildAgreement(state);

  const signatureRef = React.useRef<HTMLDivElement>(null);
  /* Bumped on confirm. It is what tells the signature block to play its one
     application — a boolean could not distinguish "signed" from "sign again". */
  const [applyToken, setApplyToken] = React.useState(0);

  const signature =
    review.signatureMode === "type" ? review.typedSignature.trim() : review.drawnSignature;
  const typedMatches =
    review.signatureMode === "draw" ||
    review.typedSignature.trim().toLowerCase() === LEGAL_NAME.toLowerCase();
  const canSign = review.documentRead && review.consented && Boolean(signature) && typedMatches;

  /* Fires from a scroll handler many times a second, so it reads the current
     value through a ref and keeps its own identity stable. */
  const readRef = React.useRef(review.documentRead);
  readRef.current = review.documentRead;

  const markRead = React.useCallback(() => {
    if (readRef.current) return;
    patch("review", { documentRead: true });
  }, []);

  function sign() {
    patch("review", {
      submitted: true,
      signedAt: new Date().toISOString(),
      // Issued once. Regenerating it on every render would make the one thing
      // the student is told to quote change under them.
      reference: review.reference || issueReference(),
    });
    setApplyToken((token) => token + 1);
    /* The signature is applied *on the document*, so the page goes there to
       watch it happen. Signing and then seeing nothing move is the version of
       this that reads as another field being filled. */
    window.setTimeout(() => {
      signatureRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 60);
  }

  return (
    <StepShell
      current="review"
      title="Read it, then sign it"
      lead="Your answers are written into the agreement below. Read to the end — signing unlocks when you have."
      context={
        <div className="space-y-6">
          <SignPanel
            canSign={canSign}
            typedMatches={typedMatches}
            onSign={sign}
            onContinue={() => navigate({ to: "/onboarding/deposit" })}
          />
          <SummaryPanel summary={summary} />
        </div>
      }
    >
      <AgreementSheet
        clauses={clauses}
        onRead={markRead}
        signatureRef={signatureRef}
        review={review}
        applyToken={applyToken}
      />
    </StepShell>
  );
}

/**
 * The agreement, on a sheet.
 *
 * Scrolls inside itself with the acceptance unlocking at the end, which Laura
 * approved explicitly — "perfeito, aí você obrigou a rodar aqui pra baixo, pra
 * dizer que leu".
 */
function AgreementSheet({
  clauses,
  onRead,
  signatureRef,
  review,
  applyToken,
}: {
  clauses: ReturnType<typeof buildAgreement>;
  onRead: () => void;
  signatureRef: React.Ref<HTMLDivElement>;
  review: ReturnType<typeof useOnboarding>["review"];
  applyToken: number;
}) {
  const scrollerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const check = () => {
      // 24px of slack: a sheet that demands the exact last pixel can be
      // impossible to satisfy on a trackpad with rubber-band scrolling.
      const atEnd = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 24;
      if (atEnd) onRead();
    };

    check();
    scroller.addEventListener("scroll", check, { passive: true });
    return () => scroller.removeEventListener("scroll", check);
  }, [onRead]);

  return (
    <section className="overflow-hidden rounded-[var(--radius-slab)] border border-ink-200 bg-surface shadow-card">
      <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-ink-100 px-6 py-4">
        <h2 className="text-h3 text-ink-900">Enrollment Agreement</h2>
        <p className="text-small text-ink-500">
          {institution.name} · {offer.startingTerm}
        </p>
      </header>

      <div
        ref={scrollerRef}
        className="max-h-[34rem] overflow-y-auto px-6 py-7 sm:px-9"
        /* A labelled region, and focusable, because it scrolls. Consent unlocks
           at the end of this box, so anyone who cannot put a pointer on it has
           to be able to reach it with the keyboard and page down. */
        role="region"
        // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region must be keyboard-focusable or its content is unreachable without a pointer (WCAG 2.1.1), and here that content gates the consent checkbox. Labelled and given a role so it announces as a region, not as a stray tab stop.
        tabIndex={0}
        aria-label="Enrollment Agreement"
      >
        <div className="space-y-6">
          {clauses.map((clause) => (
            <article key={clause.number} className="space-y-1.5">
              <h3 className="text-body font-bold text-ink-900">
                <span className="text-ink-400">{clause.number}. </span>
                {clause.heading}
              </h3>
              {/* The runs, not a paragraph of prose with the values summarised
                  underneath. Anything bold came from an answer the student
                  gave, which makes the bold its own audit trail. */}
              <p className="text-body leading-7 text-ink-700">
                {clause.runs.map((run, index) => (
                  <React.Fragment key={`${clause.number}-${index}`}>
                    {run.emphasis ? (
                      <strong className="font-bold text-ink-900">{run.text}</strong>
                    ) : (
                      run.text
                    )}
                  </React.Fragment>
                ))}
              </p>
            </article>
          ))}

          <div ref={signatureRef}>
            <SignatureLine
              name={LEGAL_NAME}
              mode={review.signatureMode}
              typed={review.typedSignature.trim()}
              drawnStrokes={review.drawnStrokes}
              drawnSize={review.drawnSize}
              drawnImage={review.drawnSignature}
              signedAt={review.submitted ? review.signedAt : null}
              reference={review.reference}
              applyToken={applyToken}
            />
          </div>
        </div>
      </div>

      {review.documentRead ? null : (
        <p className="flex items-center gap-2 border-t border-ink-100 bg-ink-50/60 px-6 py-3 text-small text-ink-600">
          <WarningCircleIcon weight="fill" aria-hidden className="size-4 shrink-0 text-amber-500" />
          Scroll to the end of the agreement. Signing unlocks when you have.
        </p>
      )}
    </section>
  );
}

/** The fixed column, upper half: sign the thing. */
function SignPanel({
  canSign,
  typedMatches,
  onSign,
  onContinue,
}: {
  canSign: boolean;
  typedMatches: boolean;
  onSign: () => void;
  onContinue: () => void;
}) {
  const state = useOnboarding();
  const review = state.review;

  if (review.submitted) {
    return (
      <ContextPanel title="Signed">
        <Notice tone="success" title="Your agreement is signed">
          Signed on{" "}
          {new Date(review.signedAt ?? Date.now()).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
          . Reference {review.reference}. It is on the sheet beside this, and changing an answer
          re-opens it for signing.
        </Notice>
        <Button type="button" size="lg" className="w-full" onClick={onContinue}>
          Next: your deposit
          <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
        </Button>
      </ContextPanel>
    );
  }

  return (
    <ContextPanel title="Sign" description="Type your name or draw it. Both count the same here.">
      <Tabs
        value={review.signatureMode}
        onValueChange={(value) => patch("review", { signatureMode: value as "type" | "draw" })}
      >
        <TabsList>
          <TabsTrigger value="type">Type it</TabsTrigger>
          <TabsTrigger value="draw">Draw it</TabsTrigger>
        </TabsList>

        <TabsContent value="type">
          <Field
            label="Your signature"
            htmlFor="typed-signature"
            hint={`Type your full name to sign: ${LEGAL_NAME}.`}
            error={
              review.typedSignature.trim() && !typedMatches
                ? `The name you typed does not match your name on record. Type it exactly as ${LEGAL_NAME}.`
                : undefined
            }
          >
            <Input
              id="typed-signature"
              value={review.typedSignature}
              onChange={(event) => patch("review", { typedSignature: event.target.value })}
              placeholder={LEGAL_NAME}
              autoComplete="off"
              // The live preview: it reads as a signature while it is typed,
              // before anything is committed.
              className="text-[1.5rem] leading-none"
              style={{ fontFamily: "var(--font-script)" }}
            />
          </Field>
        </TabsContent>

        <TabsContent value="draw">
          <SignaturePad
            label={`Draw the signature for ${LEGAL_NAME}`}
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

      <div className="flex items-start gap-3 border-t border-ink-100 pt-4">
        <Checkbox
          id="review-consent"
          checked={review.consented}
          disabled={!review.documentRead}
          onCheckedChange={(checked) => patch("review", { consented: checked === true })}
          className="mt-0.5"
        />
        {/* Sentence case, not the small-caps `Label` used for field names —
            this is a statement being agreed to, not the name of a control. */}
        <label
          htmlFor="review-consent"
          className={cn(
            "text-small leading-5 select-none",
            review.documentRead ? "text-ink-700" : "text-ink-400",
          )}
        >
          I have read the agreement and I agree to it.
        </label>
      </div>

      <Button type="button" size="lg" className="w-full" disabled={!canSign} onClick={onSign}>
        Sign the agreement
      </Button>
    </ContextPanel>
  );
}

/** The fixed column, lower half: what is in the document, and how to fix it. */
function SummaryPanel({ summary }: { summary: ReturnType<typeof buildSummary> }) {
  return (
    <ContextPanel
      title="Your answers"
      description="These are what the agreement says. If a line is wrong, edit takes you to it and brings you back."
    >
      <div className="space-y-4">
        {summary.map((group) => (
          <div key={group.id} className="space-y-1.5">
            <header className="flex items-center gap-2">
              <h3 className="flex-1 text-small font-bold text-ink-900">{group.label}</h3>
              <Button asChild variant="ghost" size="sm" className="h-7 px-2">
                {/* `from=review` is what the destination step reads to offer
                    the way back — see ReturnToReview in step-shell.tsx. */}
                <Link to={group.path} search={{ from: "review" as const }}>
                  <PencilSimpleIcon aria-hidden className="size-3.5" />
                  Edit
                  <span className="sr-only"> {group.label}</span>
                </Link>
              </Button>
            </header>
            <dl className="space-y-1">
              {group.rows.map((row) => (
                <div key={row.label} className="flex gap-3 text-small">
                  <dt className="w-[7.5rem] shrink-0 text-ink-500">{row.label}</dt>
                  <dd
                    className={cn("flex-1", row.missing ? "text-ink-400 italic" : "text-ink-800")}
                  >
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </ContextPanel>
  );
}
