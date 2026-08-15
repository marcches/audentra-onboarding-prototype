import { MapPinIcon, PrinterIcon, XIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { buildFairRoute, fairRouteSummary, involvementFair, joiningLabel } from "@/lib/catalogue";
import { formatDeadline } from "@/lib/fixtures";

/**
 * Your fair route: what the Interest list is *for*.
 *
 * Marking interest has to produce something, or the Step is a survey that goes
 * nowhere and "Interested" is a button that does nothing. What it produces is a
 * route through the Involvement Fair, the in-person event where joining
 * actually happens.
 *
 * The stops are **grouped by fair zone, not by the order things were marked**,
 * and that regrouping is the entire difference between a list of saves and a
 * route: it turns "things I liked" into "where I walk" (Wanderlog, Google Maps
 * Timeline). Removing a stop is inline and immediate, because the route is a
 * draft. Nothing here submits, confirms or enrols.
 */
export function FairRoute({
  interests,
  onRemove,
  onBack,
}: {
  interests: string[];
  onRemove: (id: string) => void;
  onBack: () => void;
}) {
  const legs = buildFairRoute(interests);
  const summary = fairRouteSummary(legs);

  if (legs.length === 0) {
    return (
      <div className="mt-4 space-y-3">
        <p className="text-body text-ink-600">
          Nothing marked yet. Go back to the catalogue and mark whatever looks interesting.
        </p>
        <Button type="button" variant="secondary" onClick={onBack}>
          Back to the catalogue
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-5">
      {/* The fact that makes the whole screen make sense, stated once: the
          student is being handed a plan for an event after classes begin. */}
      <p className="text-small text-ink-600">
        The Involvement Fair is on {formatDeadline(involvementFair.date)}, on{" "}
        {involvementFair.place}.
      </p>

      <p className="text-body font-strong text-ink-900 numeric">
        {summary.stops} {summary.stops === 1 ? "organization" : "organizations"} · {summary.zones}{" "}
        {summary.zones === 1 ? "fair zone" : "fair zones"} · about {summary.minutes} minutes
      </p>

      <ol className="space-y-5">
        {legs.map((leg, legIndex) => (
          <li key={leg.zone}>
            {/* A walking leg between zones, as a thin line. */}
            {legIndex > 0 ? (
              <p className="mb-4 flex items-center gap-2 pl-3 text-small text-ink-400">
                <span aria-hidden className="h-6 w-px bg-ink-200" />
                <span className="numeric">{involvementFair.minutesBetweenZones} min walk</span>
              </p>
            ) : null}

            <p className="flex items-center gap-2 field-label">
              <MapPinIcon weight="fill" aria-hidden className="size-4 text-violet-500" />
              {leg.zoneLabel}
            </p>

            <ol className="mt-2 space-y-2 border-l border-ink-200 pl-4">
              {leg.stops.map((stop) => (
                <li
                  key={stop.organization.id}
                  className="flex items-start gap-3 rounded-[var(--radius-field)] bg-well px-3 py-2"
                >
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-ink-900 text-[0.6875rem] font-bold text-white numeric">
                    {stop.number}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-body font-strong text-ink-900">
                      {stop.organization.name}
                    </span>
                    {/* At the fair, Getting in is the only thing the student
                        will actually use. */}
                    <span className="block text-small text-ink-500">
                      <span className="numeric">Table {stop.organization.table}</span> ·{" "}
                      {stop.organization.nextStep ?? joiningLabel(stop.organization.joining)}
                    </span>
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove ${stop.organization.name} from your route`}
                    onClick={() => onRemove(stop.organization.id)}
                  >
                    <XIcon weight="bold" aria-hidden className="size-4" />
                  </Button>
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ol>

      {/* Export or print. Nothing else: the route is the product, it does not
          submit anywhere, and there is no "confirm my clubs". */}
      <div className="flex justify-end border-t border-ink-100 pt-4">
        <Button type="button" variant="secondary" size="sm" onClick={() => window.print()}>
          <PrinterIcon weight="fill" aria-hidden className="size-4" />
          Save this route
        </Button>
      </div>
    </div>
  );
}
