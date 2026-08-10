import {
  ArrowRightIcon,
  BuildingsIcon,
  CalendarBlankIcon,
  CheckCircleIcon,
  GraduationCapIcon,
  ProhibitIcon,
  WalletIcon,
} from "@phosphor-icons/react";
import { Link, useNavigate } from "@tanstack/react-router";
import * as React from "react";

import { Field } from "@/components/field";
import { Notice } from "@/components/notice";
import { StepActions, StepShell } from "@/components/step-shell";
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
      title={`Your place at ${institution.short}`}
      lead={
        <>
          Here's what {institution.name} is offering. Read it, then tell us yes or no — you can only
          answer once.
        </>
      }
    >
      <section className="overflow-hidden rounded-[var(--radius-slab)] border border-ink-100 bg-surface shadow-card">
        {/* The photo, not another text block: this is the screen where someone
            agrees to move their life somewhere, and a card of type alone gives
            them nothing to picture. The scrim is what keeps the copy legible
            over it. */}
        <div className="relative isolate px-6 py-8 text-white sm:px-8 sm:py-10">
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
            Offer of admission
          </p>
          <h2 className="mt-2 text-h1 font-black tracking-[-0.03em] text-white">
            {offer.programme}
          </h2>
          <p className="mt-2 max-w-[34rem] text-body text-white/80">{offer.programmeDescription}</p>
        </div>

        <dl className="grid gap-x-8 gap-y-6 p-6 sm:grid-cols-2 sm:p-8">
          <Detail
            icon={<GraduationCapIcon weight="duotone" />}
            label="Degree"
            value={offer.degree}
          />
          <Detail
            icon={<CalendarBlankIcon weight="duotone" />}
            label="Starts"
            value={offer.startingTerm}
          />
          <Detail icon={<BuildingsIcon weight="duotone" />} label="Campus" value={offer.campus} />
          <Detail
            icon={<WalletIcon weight="duotone" />}
            label="Deposit to hold your place"
            value={formatMoney(offer.depositAmount, offer.depositCurrency)}
            note="Paid at the last step, not now."
          />
        </dl>

        <div className="border-t border-ink-100 bg-ink-50/60 px-6 py-4 sm:px-8">
          <p className="text-small text-ink-600">
            Respond by{" "}
            <strong className="text-ink-900">{formatDeadline(offer.responseDeadline)}</strong>.
            After that the offer closes and only Admissions can reopen it.
          </p>
        </div>
      </section>

      {response === null ? (
        /* Two buttons, not a checkbox. Both are one click, and the words say
           what happens — "Accept and continue" next to a tickbox made people
           ask what exactly they were confirming. */
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="button" size="lg" className="flex-1" onClick={accept}>
            <CheckCircleIcon weight="fill" aria-hidden className="size-5" />
            Yes, I'm joining {institution.short}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="flex-1"
            onClick={() => setDeclining(true)}
          >
            <ProhibitIcon aria-hidden className="size-5" />
            No, I won't be joining
          </Button>
        </div>
      ) : (
        <RecordedResponse />
      )}

      {response !== null ? (
        <StepActions>
          <Button asChild size="lg">
            <Link to="/onboarding/about-you">
              Next: about you
              <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
            </Link>
          </Button>
        </StepActions>
      ) : null}

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

  if (accepted) {
    return (
      <Notice
        tone="success"
        title={`You accepted on ${formatRespondedAt(state.offer.respondedAt)}`}
      >
        Your place in {offer.programme} for {offer.startingTerm} is reserved. To change your answer,
        contact Admissions at {institution.admissionsEmail}.
      </Notice>
    );
  }

  return (
    <Notice tone="caution" title={`You declined on ${formatRespondedAt(state.offer.respondedAt)}`}>
      Thanks for letting us know — your response is recorded.
      {reason ? ` You told us: ${reason.label.toLowerCase()}.` : ""} To change your answer, contact
      Admissions at {institution.admissionsEmail}.
    </Notice>
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
          <DialogTitle>You won't be joining {institution.short}</DialogTitle>
          <DialogDescription>
            That's a real answer and we'd rather know. Telling us why is optional — skip it and your
            decline still counts.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-5 space-y-5">
          <Field label="Why, roughly?" htmlFor="decline-reason" optional>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger id="decline-reason">
                <SelectValue placeholder="Pick one, or leave it blank" />
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
            error={tooLong ? "That's longer than 250 characters. Trim it a little." : undefined}
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
            Send my answer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
