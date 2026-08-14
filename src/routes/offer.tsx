import {
  ArrowRightIcon,
  BuildingsIcon,
  CalendarBlankIcon,
  CheckCircleIcon,
  GraduationCapIcon,
  ProhibitIcon,
} from "@phosphor-icons/react";
import { Link, useNavigate } from "@tanstack/react-router";
import * as React from "react";

import { Field } from "@/components/field";
import { Notice } from "@/components/notice";
import { ContextPanel, StepShell } from "@/components/step-shell";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  campusPhotos,
  declineReasons,
  formatDeadline,
  formatMoney,
  institution,
  offer,
} from "@/lib/fixtures";
import { patch, useOnboarding } from "@/lib/store";

/* The celebration drags in GSAP and canvas-confetti — a third of the bundle for
   one moment nobody reaches on first paint. Loaded when it is actually needed. */
const CelebrationDialog = React.lazy(() =>
  import("@/components/celebration-dialog").then((module) => ({
    default: module.CelebrationDialog,
  })),
);

const DEPOSIT = formatMoney(offer.depositAmount, offer.depositCurrency);

export function OfferRoute() {
  const state = useOnboarding();
  const navigate = useNavigate();
  const [celebrating, setCelebrating] = React.useState(false);
  const [declining, setDeclining] = React.useState(false);

  const response = state.offer.response;

  function accept() {
    patch("offer", { response: "accepted", respondedAt: new Date().toISOString() });
    setCelebrating(true);
  }

  return (
    <StepShell
      current="offer"
      title="Your offer"
      lead="Read it, then accept or decline. You can answer once — changing it afterwards goes through Admissions."
      context={
        <Decision response={response} onAccept={accept} onDecline={() => setDeclining(true)} />
      }
    >
      <section className="overflow-hidden rounded-[var(--radius-slab)] border border-ink-100 bg-surface shadow-card">
        {/* The photo, not another text block: this is the screen where someone
            agrees to move their life somewhere, and a card of type alone gives
            them nothing to picture. The scrim is what keeps the copy legible
            over it. */}
        <div className="relative isolate px-6 py-6 text-white sm:px-8 sm:py-8">
          <img
            src={campusPhotos.offer.src}
            alt={campusPhotos.offer.alt}
            className="absolute inset-0 -z-20 size-full object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-tr from-ink-950/95 via-ink-950/80 to-violet-700/55"
          />
          <p className="text-micro font-bold tracking-[0.06em] text-white/70 uppercase">
            Offer of admission · {institution.name}
          </p>
          <h2 className="mt-2 text-h1 font-black tracking-[-0.03em] text-white">
            {offer.programme}
          </h2>
          <p className="mt-2 max-w-[34rem] text-body text-white/80">{offer.programmeDescription}</p>
        </div>

        {/* The helper text under each fact is the sheet's own, copied: it says
            what the value is without repeating the label back. */}
        <dl className="grid gap-x-6 gap-y-5 p-5 sm:grid-cols-2 sm:p-6">
          <Detail
            icon={<GraduationCapIcon weight="duotone" />}
            label="Degree"
            value={offer.degree}
            note="The degree awarded."
          />
          <Detail
            icon={<CalendarBlankIcon weight="duotone" />}
            label="Starting term"
            value={offer.startingTerm}
            note="When you would begin."
          />
          <Detail
            icon={<BuildingsIcon weight="duotone" />}
            label="Campus"
            value={offer.campus}
            note="Where you would study."
          />
          <Detail
            icon={<CalendarBlankIcon weight="duotone" />}
            label="Respond by"
            value={formatDeadline(offer.responseDeadline)}
            note="After this the offer closes and only Admissions can reopen it."
          />
        </dl>
      </section>

      {/* The deposit, out of the four-cell grid it used to be the last item of.
          The number is on the screen either way; what it was missing was any
          weight at all, which is what Laura noticed and could not place. */}
      <section className="flex flex-col gap-4 rounded-[var(--radius-slab)] border border-ink-100 bg-surface p-5 shadow-card sm:flex-row sm:items-center sm:p-6">
        <div className="sm:w-[13rem] sm:shrink-0">
          <p className="field-label">Enrollment deposit</p>
          <p className="text-display font-black tracking-[-0.03em] text-ink-900">{DEPOSIT}</p>
        </div>
        <div className="space-y-1.5 border-ink-100 sm:border-l sm:pl-6">
          <p className="text-body font-bold text-ink-900">
            Accepting does not commit you to payment yet.
          </p>
          <p className="text-small text-ink-600">
            It is asked for at the last step of enrollment, it secures your place, and it is
            credited against your first term's tuition. Refundable up to{" "}
            {formatDeadline(offer.responseDeadline)}.
          </p>
        </div>
      </section>

      <section className="space-y-3 rounded-[var(--radius-slab)] border border-ink-100 bg-surface p-5 shadow-card sm:p-6">
        <h2 className="text-h3 text-ink-900">What happens when you accept</h2>
        <ol className="space-y-3">
          <Consequence n={1} title="Your place is reserved">
            Admissions is told the same day, and the place is held for {offer.startingTerm}.
            Deferring to a later term is a separate request and is not automatic.
          </Consequence>
          <Consequence n={2} title="Six more steps open">
            About you, housing, campus life, health information, your document packet and the
            deposit. Your answers are kept as you go.
          </Consequence>
          <Consequence n={3} title="Your answer is final here">
            One response only. To change it afterwards, contact Admissions at{" "}
            {institution.admissionsEmail}.
          </Consequence>
        </ol>
      </section>

      <React.Suspense fallback={null}>
        {celebrating ? (
          <CelebrationDialog
            open
            onOpenChange={setCelebrating}
            onContinue={() => {
              setCelebrating(false);
              navigate({ to: "/onboarding/about-you" });
            }}
          />
        ) : null}
      </React.Suspense>

      <DeclineDialog open={declining} onOpenChange={setDeclining} />
    </StepShell>
  );
}

/**
 * The fixed column: the decision, in view the whole way down the facts.
 *
 * Two buttons, not a checkbox. Both are one click and the words say what
 * happens — "Accept and continue" next to a tickbox made people ask what
 * exactly they were confirming.
 */
function Decision({
  response,
  onAccept,
  onDecline,
}: {
  response: "accepted" | "declined" | null;
  onAccept: () => void;
  onDecline: () => void;
}) {
  if (response !== null) return <RecordedResponse />;

  return (
    <ContextPanel
      sticky
      title="Your answer"
      description={`Due by ${formatDeadline(offer.responseDeadline)}.`}
    >
      <div className="space-y-3">
        <Button type="button" size="lg" className="w-full" onClick={onAccept}>
          <CheckCircleIcon weight="fill" aria-hidden className="size-5" />
          Yes, I'm joining
        </Button>
        <p className="text-small text-ink-500">
          Your place is reserved and the rest of enrollment opens. Nothing is charged.
        </p>
      </div>

      <div className="space-y-3 border-t border-ink-100 pt-4">
        <Button type="button" variant="secondary" size="lg" className="w-full" onClick={onDecline}>
          <ProhibitIcon aria-hidden className="size-5" />
          No, I won't be joining
        </Button>
        <p className="text-small text-ink-500">
          Your record closes. Telling us why is optional and helps us improve.
        </p>
      </div>
    </ContextPanel>
  );
}

function Consequence({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3.5">
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-violet-50 text-small font-bold text-violet-600">
        {n}
      </span>
      <div className="space-y-0.5">
        <p className="text-body font-bold text-ink-900">{title}</p>
        <p className="text-small text-ink-600">{children}</p>
      </div>
    </li>
  );
}

function Detail({
  icon,
  label,
  value,
  note,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-violet-50 text-violet-600 [&_svg]:size-5">
        {icon}
      </span>
      <div>
        <dt className="field-label">{label}</dt>
        <dd className="text-lead font-bold text-ink-900">{value}</dd>
        {note ? <p className="text-small text-ink-500">{note}</p> : null}
      </div>
    </div>
  );
}

function RecordedResponse() {
  const state = useOnboarding();
  const accepted = state.offer.response === "accepted";
  const reason = declineReasons.find((item) => item.value === state.offer.declineReason);
  const when = formatRespondedAt(state.offer.respondedAt);

  return (
    <ContextPanel sticky title="Your answer" description={`Recorded on ${when}.`}>
      {accepted ? (
        <Notice tone="success" title="Your place is reserved">
          You accepted this offer on {when}. To change your response, contact Admissions at{" "}
          {institution.admissionsEmail}.
        </Notice>
      ) : (
        <Notice tone="caution" title="You declined this offer">
          Thank you for letting us know. Your response is recorded.
          {reason ? ` You told us: ${reason.label.toLowerCase()}.` : ""} To change it, contact
          Admissions at {institution.admissionsEmail}.
        </Notice>
      )}

      <Button asChild size="lg" className="w-full">
        <Link to="/onboarding/about-you">
          Next: about you
          <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
        </Link>
      </Button>
    </ContextPanel>
  );
}

function formatRespondedAt(iso: string | null) {
  if (!iso) return "today";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function DeclineDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const state = useOnboarding();
  const [reason, setReason] = React.useState(state.offer.declineReason);
  const [note, setNote] = React.useState(state.offer.declineNote);

  const tooLong = note.length > 250;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Decline your offer from {institution.short}?</DialogTitle>
          <DialogDescription>
            Your record closes and the place is released. Telling us why is optional and helps us
            improve.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-5 space-y-5">
          <Field label="Why, roughly?" htmlFor="decline-reason" optional>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger id="decline-reason">
                <SelectValue placeholder="Tell us why, if you would like to" />
              </SelectTrigger>
              <SelectContent>
                {declineReasons.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field
            label="Anything else"
            htmlFor="decline-note"
            optional
            hint={`${note.length} of 250 characters.`}
            error={tooLong ? "That is longer than 250 characters. Trim it a little." : undefined}
          >
            <Textarea
              id="decline-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Only if you want to."
              aria-invalid={tooLong}
            />
          </Field>
        </div>

        <DialogFooter className="mt-7">
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            Go back
          </Button>
          {/* Labelled with the action, not with "Yes" — the Confirmation
              dialogue rule from the Message Library. */}
          <Button
            type="button"
            disabled={tooLong}
            onClick={() => {
              patch("offer", {
                response: "declined",
                respondedAt: new Date().toISOString(),
                declineReason: reason,
                declineNote: note,
              });
              onOpenChange(false);
            }}
          >
            Decline my offer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
