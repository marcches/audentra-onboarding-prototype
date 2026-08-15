import { ArrowRightIcon, PencilSimpleIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import * as React from "react";

import { Field } from "@/components/field";
import { Notice } from "@/components/notice";
import { SignatureLine } from "@/components/signature-line";
import { type DrawnSignature, SignaturePad } from "@/components/signature-pad";
import { BackButton, Panel, StepShell, useStepNav } from "@/components/step-shell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buildAgreement, issueReference, legalName } from "@/lib/agreement";
import { institution, offer } from "@/lib/fixtures";
import { totalPoints } from "@/lib/points";
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
  const { next, goNext } = useStepNav("review");
  const review = state.review;
  const summary = buildSummary(state);
  const clauses = buildAgreement(state);
  const points = totalPoints(state);

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
      /* The one action that has to be reachable at every scroll position is
         signing — which is exactly what the fixed bar is for, and why the
         sticky panel this replaces is no longer needed. What stays in the
         column is the *choosing* half: type or draw, and the consent tick.
         Reading order is now the honest one — the agreement, then how you sign
         it, then the answers it was built from. */
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
              Sign the agreement
            </Button>
          </>
        )
      }
    >
      <AgreementSheet
        clauses={clauses}
        onRead={markRead}
        signatureRef={signatureRef}
        review={review}
        applyToken={applyToken}
      />
      <SignPanel typedMatches={typedMatches} />
      <SummaryPanel summary={summary} points={points} />
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
  const endRef = React.useRef<HTMLDivElement>(null);

  /**
   * "Read to the end", observed rather than measured.
   *
   * This used to be a scroll handler on a 34rem box inside the page. Three
   * scroll containers ended up stacked on this screen — the page, the context
   * column and the document — so a wheel gesture scrolled whichever one the
   * pointer happened to be over, ran to its end, and then handed the rest to
   * the page in a lurch. A legal document read through a 34rem window was the
   * lesser problem.
   *
   * Now the document is simply as tall as it is and the page is the only thing
   * that scrolls. An observer on a sentinel after the last clause is what marks
   * it read, which is both simpler and more honest than a scroll arithmetic
   * check: it fires when the end of the text has actually been on screen.
   */
  React.useEffect(() => {
    const end = endRef.current;
    if (!end) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          /* Reached, or already gone past.
             `isIntersecting` alone is not enough: a jump — End, a scrollbar
             drag, a fragment link, or arriving back on an already-scrolled
             page — can take the sentinel from below the fold to above it
             without it ever being sampled on screen, and the gate would then
             refuse to open for someone who had read the whole document.

             "Past" is tested against the *top* of the viewport, not the bottom:
             the sentinel has to be genuinely above the fold. Measuring against
             the bottom instead also matches the first observation on a page
             whose layout has not settled — everything reports near zero for a
             frame — which opened the gate on arrival, before a word was read. */
          const viewportTop = entry.rootBounds?.top ?? 0;
          if (entry.isIntersecting || entry.boundingClientRect.bottom < viewportTop) {
            onRead();
            return;
          }
        }
      },
      // A little short of the true bottom edge, so the last line has to be
      // properly on screen rather than clipped against it.
      { rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(end);
    return () => observer.disconnect();
  }, [onRead]);

  return (
    <section className="overflow-hidden rounded-[var(--radius-slab)] border border-ink-200 bg-surface shadow-card">
      <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-ink-100 px-6 py-4">
        <h2 className="text-h3 text-ink-900">Enrollment Agreement</h2>
        <p className="text-small text-ink-500">
          {institution.name} · {offer.startingTerm}
        </p>
      </header>

      <div className="px-6 py-6 sm:px-8">
        <div className="space-y-5">
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

          {/* The end of the text. Crossing it is what marks the agreement read
              — placed before the signature block, because the block is a
              control and the clauses are the thing to have read. */}
          <div ref={endRef} aria-hidden className="h-px" />

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
          Read to the end of the agreement. Signing unlocks when you have.
        </p>
      )}
    </section>
  );
}

/**
 * How you sign: type it or draw it, then tick the consent.
 *
 * The act of signing is the button in the fixed bar; this panel is the choice
 * that feeds it. Splitting the two is what let the panel stop being sticky.
 */
function SignPanel({ typedMatches }: { typedMatches: boolean }) {
  const state = useOnboarding();
  const review = state.review;

  if (review.submitted) {
    return (
      <Panel title="Signed">
        <Notice tone="success" title="Your agreement is signed">
          Signed on{" "}
          {new Date(review.signedAt ?? Date.now()).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
          . Reference {review.reference}. It is on the sheet above, and changing an answer re-opens
          it for signing.
        </Notice>
      </Panel>
    );
  }

  return (
    <Panel title="Sign" description="Type your name or draw it. Both count the same here.">
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
    </Panel>
  );
}

/**
 * What the agreement says, and how to fix it.
 *
 * Below the document rather than beside it: it is an appendix to the thing being
 * signed, it is long, and the two columns it sits between are the document and
 * the one control that has to stay put.
 */
function SummaryPanel({
  summary,
  points,
}: {
  summary: ReturnType<typeof buildSummary>;
  points: number;
}) {
  return (
    <section className="overflow-hidden rounded-[var(--radius-slab)] border border-ink-200 bg-surface shadow-card">
      <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-ink-100 px-6 py-4">
        <div className="space-y-1">
          <h2 className="text-h3 text-ink-900">Your answers</h2>
          <p className="text-small text-ink-500">
            These are what the agreement above says. If a line is wrong, edit takes you to it and
            brings you back.
          </p>
        </div>
        {/* The running total — the sum of whatever was actually completed, not
            a hardcoded max. Sharing at the accept-offer moment adds to this
            too, so it can read higher than the steps below add up to. */}
        <p className="text-small font-bold text-violet-700">{points} points earned</p>
      </header>

      <div className="divide-y divide-ink-50">
        {summary.map((group) => (
          <div key={group.id} className="px-6 py-4">
            <header className="flex items-center gap-2">
              <h3 className="flex-1 text-body font-bold text-ink-900">{group.label}</h3>
              {/* Read straight from the step-order source (see `steps.ts`), so
                  this can never say something different from the rail or
                  About you's own section index. */}
              <span className="text-micro font-bold tracking-[0.06em] text-ink-400 uppercase">
                ~{group.timeEstimateMinutes} min
              </span>
              <span className="text-micro font-bold tracking-[0.06em] text-mint-600 uppercase">
                {group.points} pts
              </span>
              <span
                className={cn(
                  "rounded-[var(--radius-pill)] px-2 py-0.5 text-micro font-bold tracking-[0.06em] uppercase",
                  group.required ? "bg-violet-50 text-violet-700" : "bg-ink-50 text-ink-500",
                )}
              >
                {group.required ? "Required" : "Optional"}
              </span>
              <Button asChild variant="ghost" size="sm">
                {/* `from=review` is what the destination step reads to offer
                    the way back — see ReturnToReview in step-shell.tsx. */}
                <Link to={group.path} search={{ from: "review" as const }}>
                  <PencilSimpleIcon aria-hidden className="size-4" />
                  Edit
                  <span className="sr-only"> {group.label}</span>
                </Link>
              </Button>
            </header>
            {/* Two columns of label→value once there is room for them. These
                are short facts being checked at a glance, not prose — in one
                column they were a 700px ribbon of mostly empty line. */}
            <dl className="mt-1.5 grid gap-x-8 gap-y-1 sm:grid-cols-2">
              {group.rows.map((row) => (
                <div key={row.label} className="flex gap-3 text-small">
                  <dt className="w-[9rem] shrink-0 text-ink-500">{row.label}</dt>
                  <dd
                    className={cn(
                      "min-w-0 flex-1",
                      row.missing ? "text-ink-400 italic" : "text-ink-800",
                    )}
                  >
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
}
