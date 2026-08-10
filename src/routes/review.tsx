import { ArrowRightIcon, PencilSimpleIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { Link, useNavigate } from "@tanstack/react-router";
import * as React from "react";

import { DocumentReader } from "@/components/document-reader";
import { Field, ReadOnlyField } from "@/components/field";
import { Notice } from "@/components/notice";
import { SignaturePad } from "@/components/signature-pad";
import { SectionTitle, StepActions, StepShell } from "@/components/step-shell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { enrollmentDocuments, studentRecord } from "@/lib/fixtures";
import { patch, useOnboarding } from "@/lib/store";
import { buildSummary } from "@/lib/summary";
import { cn } from "@/lib/utils";

const LEGAL_NAME = `${studentRecord.legalFirstName} ${studentRecord.legalLastName}`;

/**
 * Review & sign.
 *
 * Three changes from the live step. The documents are read here rather than in
 * a PDF in another tab, and consent unlocks only once both have been scrolled
 * through. The signature can be drawn as well as typed. And every line of the
 * summary links back to the step that produced it — which is what makes a
 * six-step summary usable rather than decorative, and costs nothing because
 * each step is already its own route.
 *
 * Note for the demo: the primary source doesn't cover this step. It is a
 * proposal.
 */
export function ReviewRoute() {
  const state = useOnboarding();
  const navigate = useNavigate();
  const review = state.review;
  const summary = buildSummary(state);

  const allRead = enrollmentDocuments.every((doc) => review.readDocuments.includes(doc.id));
  const signature =
    review.signatureMode === "type" ? review.typedSignature.trim() : review.drawnSignature;
  const typedMatches =
    review.signatureMode === "draw" ||
    review.typedSignature.trim().toLowerCase() === LEGAL_NAME.toLowerCase();
  const canSign = allRead && review.consented && Boolean(signature) && typedMatches;

  /* The reader calls this from a scroll handler that fires many times a
     second, and it runs inside the reader's own effect. Reading the current
     list through a ref keeps the callback identity stable, so the reader does
     not re-run its effect on every scroll frame. */
  const readDocumentsRef = React.useRef(review.readDocuments);
  readDocumentsRef.current = review.readDocuments;

  const markRead = React.useCallback((id: string) => {
    if (readDocumentsRef.current.includes(id)) return;
    patch("review", { readDocuments: [...readDocumentsRef.current, id] });
  }, []);

  return (
    <StepShell
      current="review"
      title="Read it, then sign it"
      lead="Everything you've told us is below, and every line links back to the step it came from. The two documents are here in full — no separate download."
    >
      <section className="space-y-4">
        <SectionTitle description="If a line is wrong, the edit link takes you straight to it and brings you back here.">
          What you've told us
        </SectionTitle>

        <div className="space-y-3">
          {summary.map((group) => (
            <div
              key={group.id}
              className="overflow-hidden rounded-[var(--radius-card)] border border-ink-200 bg-surface"
            >
              <header className="flex items-center gap-3 border-b border-ink-100 px-5 py-3">
                <h3 className="flex-1 text-body font-bold text-ink-900">{group.label}</h3>
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
              <dl className="divide-y divide-ink-50">
                {group.rows.map((row) => (
                  <div key={row.label} className="flex gap-4 px-5 py-2.5">
                    <dt className="w-[10rem] shrink-0 text-small text-ink-500">{row.label}</dt>
                    <dd
                      className={cn(
                        "flex-1 text-body",
                        row.missing ? "text-ink-400 italic" : "text-ink-900",
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

      <section className="space-y-4">
        <SectionTitle description="Scroll each one to the end. The acceptance below unlocks when you have.">
          Your document packet
        </SectionTitle>

        <div className="space-y-3">
          {enrollmentDocuments.map((doc) => (
            <DocumentReader
              key={doc.id}
              document={doc}
              read={review.readDocuments.includes(doc.id)}
              onRead={() => markRead(doc.id)}
            />
          ))}
        </div>

        {allRead ? null : (
          <p className="flex items-center gap-2 text-small text-ink-500">
            <WarningCircleIcon weight="fill" aria-hidden className="size-4 text-amber-500" />
            Both documents need reading before you can sign.
          </p>
        )}
      </section>

      <section className="space-y-4">
        <SectionTitle description="Type it or draw it — both count the same here.">
          Sign
        </SectionTitle>

        <ReadOnlyField label="Legal name" value={LEGAL_NAME} />

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
              hint={`Type it exactly as it appears above: ${LEGAL_NAME}.`}
              error={
                review.typedSignature.trim() && !typedMatches
                  ? "That doesn't match the legal name on your record. The Registrar changes the name, not this box."
                  : undefined
              }
            >
              <Input
                id="typed-signature"
                value={review.typedSignature}
                onChange={(event) => patch("review", { typedSignature: event.target.value })}
                placeholder={LEGAL_NAME}
                autoComplete="off"
                className="font-display text-lead"
              />
            </Field>
          </TabsContent>

          <TabsContent value="draw">
            <SignaturePad
              label={`Draw the signature for ${LEGAL_NAME}`}
              value={review.drawnSignature}
              onChange={(dataUrl) => patch("review", { drawnSignature: dataUrl })}
            />
          </TabsContent>
        </Tabs>

        <div className="flex items-start gap-3 rounded-[var(--radius-card)] border border-ink-200 bg-surface p-4">
          <Checkbox
            id="review-consent"
            checked={review.consented}
            disabled={!allRead}
            onCheckedChange={(checked) => patch("review", { consented: checked === true })}
            className="mt-0.5"
          />
          {/* Sentence case, not the small-caps `Label` used for field names —
              this is a statement being agreed to, not the name of a control. */}
          <label
            htmlFor="review-consent"
            className={cn(
              "text-body leading-6 select-none",
              allRead ? "text-ink-700" : "text-ink-400",
            )}
          >
            I've read both documents and I agree to them. I understand the FERPA release reflects
            exactly what I chose in About you.
          </label>
        </div>

        {review.submitted ? (
          <Notice tone="success" title="Signed">
            Signed on{" "}
            {new Date(review.signedAt ?? Date.now()).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
            . Changing an answer above re-opens this for signing.
          </Notice>
        ) : null}
      </section>

      <StepActions>
        <Button
          type="button"
          size="lg"
          disabled={!canSign}
          onClick={() => {
            patch("review", { submitted: true, signedAt: new Date().toISOString() });
            navigate({ to: "/onboarding/deposit" });
          }}
        >
          Sign and continue
          <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
        </Button>
      </StepActions>
    </StepShell>
  );
}
