import { CalendarCheckIcon, CheckIcon, ClockIcon } from "@phosphor-icons/react";
import * as React from "react";

import { PortalShell } from "@/components/portal-shell";
import { FlatCard, Prose, Section, Sections, SelectionMark, Well } from "@/components/surfaces";
import {
  type Booking,
  type Day,
  daysAway,
  daysFor,
  formatDay,
  formatTime,
  freeSlots,
  type ServiceId,
  type Slot,
  serviceById,
  services,
} from "@/lib/appointments";
import { patchPortal, usePortal } from "@/lib/portal-store";
import { cn } from "@/lib/utils";

/**
 * The Area whose absence started this entire body of work.
 *
 * The client, hunting the portal that shipped: *"Cadê a pointment na side bar?
 * Então quer dizer que eu não posso simplesmente marcar um, sei lá, um suporte
 * em algum dia específico? Eu tenho que entrar em financials para falar aqui?"*
 * Two complaints in one sentence — it was not in the map, and it was reachable
 * only *through a topic*. The sidebar row answered the first last cycle. This
 * screen answers the second: the three services sit side by side at the top and
 * any of them books directly.
 *
 * **A list, not a calendar widget** (Superlist). A month grid would be the
 * largest thing on the screen, and eleven twelfths of it would be days the
 * office is not offering. So: days down the page, the slots for each on its own
 * row, and **the time as the primary field** with everything else metadata
 * beside it (Motion).
 *
 * **What it deliberately is not.** No rescheduling policy, no staff profiles, no
 * availability rules, no calendar integration. One booking at a time, and
 * booking a second time replaces the first — which the screen says in words
 * rather than leaving the student to find out.
 */
export function AppointmentsRoute() {
  const { portal } = usePortal();
  const booking = portal.booking;

  /**
   * Which service the day list is showing. It opens on the one already booked,
   * because a student returning to this screen is far likelier to be looking at
   * the thing they booked than starting again from the top of the list.
   */
  const [service, setService] = React.useState<ServiceId>(booking?.service ?? services[0].id);
  const chosen = serviceById(service);
  const days = daysFor(service);

  return (
    <PortalShell
      current="appointments"
      title="Appointments"
      lead={
        <span className="text-small text-ink-500">
          Book a time directly. You do not have to go through a topic first.
        </span>
      }
    >
      {/* First on the screen when it exists, because "the booked time is
          reachable without hunting" is the whole of what a student comes back
          to this Area for. */}
      {booking ? <TheBooking booking={booking} /> : null}

      <Sections>
        <Section title="What do you need?">
          <Well flush strong className="flex flex-col gap-1.5 p-2">
            {services.map((entry) => (
              <FlatCard
                key={entry.id}
                as="button"
                interactive
                selected={entry.id === service}
                onClick={() => setService(entry.id)}
                aria-pressed={entry.id === service}
                className="flex w-full items-center gap-2.5 p-2.5"
              >
                <SelectionMark selected={entry.id === service} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-small font-strong text-ink-900">
                    {entry.label}
                  </span>
                  <span className="block truncate text-meta text-ink-500">{entry.blurb}</span>
                </span>
                <span className="shrink-0 text-right text-meta text-ink-500">
                  <span className="block">{entry.office}</span>
                  <span className="block numeric">{entry.minutes} min</span>
                </span>
              </FlatCard>
            ))}
          </Well>
        </Section>

        <Section title={`Pick a time with ${chosen.office}`}>
          <Prose size="note" className="mb-2">
            The soonest is tomorrow. Times already taken are shown so you can see how full a day is,
            and {chosen.minutes} minutes is what the office sets aside.
          </Prose>
          <ul className="flex flex-col">
            {days.map((day) => (
              <DayRow
                key={day.date}
                day={day}
                /* The booking, only when it belongs to the service on screen.
                   Switching services must not leave a violet slot lit under a
                   different office. */
                held={booking?.service === service ? booking : null}
                onPick={(slot) =>
                  patchPortal({ booking: { service, date: slot.date, time: slot.time } })
                }
              />
            ))}
          </ul>
        </Section>
      </Sections>
    </PortalShell>
  );
}

/**
 * One day, and its six slots on the same line.
 *
 * The date and the distance to it are both given, for the reason every deadline
 * in the portal gives both: a date alone makes a student do arithmetic, and a
 * distance alone gives them nothing to write in a diary.
 */
function DayRow({
  day,
  held,
  onPick,
}: {
  day: Day;
  /** The student's booking, if it is with the service currently on screen. */
  held: Booking | null;
  onPick: (slot: Slot) => void;
}) {
  const free = freeSlots(day);

  return (
    <li className="flex items-center gap-3 border-t border-ink-100 py-1.5 first:border-t-0 compact:flex-col compact:items-start compact:gap-1">
      <span className="flex w-40 shrink-0 items-baseline gap-2">
        <span className="text-small font-strong text-ink-800 numeric">{formatDay(day.date)}</span>
        <span className="text-meta text-ink-400">{daysAway(day.date)}</span>
      </span>

      {free === 0 ? (
        <span className="text-meta text-ink-400">Nothing free this day</span>
      ) : (
        <span className="flex min-w-0 flex-1 flex-wrap gap-1">
          {day.slots.map((slot) => (
            <SlotButton
              key={slot.id}
              slot={slot}
              booked={held?.date === slot.date && held?.time === slot.time}
              onPick={onPick}
            />
          ))}
        </span>
      )}
    </li>
  );
}

/**
 * The time, as the thing you press.
 *
 * A taken slot stays on the screen rather than being filtered out: six times
 * with two greyed says how full the office is, and four times says nothing at
 * all. It is `disabled` rather than merely styled, so the keyboard skips it too.
 */
function SlotButton({
  slot,
  booked,
  onPick,
}: {
  slot: Slot;
  booked: boolean;
  onPick: (slot: Slot) => void;
}) {
  return (
    <button
      type="button"
      disabled={slot.taken}
      onClick={() => onPick(slot)}
      aria-label={`${formatTime(slot.time)} on ${formatDay(slot.date)}`}
      className={cn(
        "rounded-[var(--radius-pill)] border px-2 py-0.5 text-meta transition-colors numeric",
        "compact:min-h-[var(--tap-target)] compact:px-3",
        slot.taken && "cursor-not-allowed border-transparent bg-ink-50 text-ink-300 line-through",
        !slot.taken && !booked && "border-ink-200 bg-surface text-ink-700 hover:border-violet-400",
        booked && "border-violet-500 bg-violet-500 font-bold text-white",
      )}
    >
      {formatTime(slot.time)}
    </button>
  );
}

/**
 * What the student holds, at the head of the Area.
 *
 * It carries the same four facts the slot was booked with and one sentence about
 * what happens if they pick another — which is the whole of this cycle's
 * "policy", written where the consequence is rather than in a help page.
 */
function TheBooking({ booking }: { booking: Booking }) {
  const service = serviceById(booking.service);

  return (
    <Sections>
      <Section title="Your appointment">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-field)] bg-mint-50 text-mint-deep">
            <CheckIcon weight="bold" aria-hidden className="size-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-h3 text-ink-900 numeric">
              {formatDay(booking.date)} · {formatTime(booking.time)}
            </span>
            <span className="block text-small text-ink-600">
              {service.label} — with {service.office}
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-3 text-meta text-ink-500">
            <span className="flex items-center gap-1 numeric">
              <ClockIcon weight="duotone" aria-hidden className="size-3.5" />
              {service.minutes} min
            </span>
            <span className="flex items-center gap-1">
              <CalendarCheckIcon weight="duotone" aria-hidden className="size-3.5" />
              {daysAway(booking.date)}
            </span>
          </span>
        </div>
        <Prose size="note" className="mt-2">
          You hold one appointment at a time. Picking another time below replaces this one.
        </Prose>
      </Section>
    </Sections>
  );
}
