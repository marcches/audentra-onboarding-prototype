# Points are a price and a receipt in one object

This **reverses** a decision recorded in an earlier round, and the reason is
mechanical rather than aesthetic, so it is worth writing down properly.

The earlier decision was that a Point value is never shown beside an unfinished
Quest: showing it turns the flow into a price list and the student into someone
shopping for the cheapest screen. That reasoning was not wrong. It was too
broad.

## The decision

A Point value is shown as a **price** on the Quest being worked and on the one
after it, and **the same tag becomes the receipt** once earned. It is never a
price list of the whole flow. The total available is announced once, at the
entrance.

## Why the reversal

Because of what it does to the award, not because of what it does to
motivation.

A figure that appears from nothing at the moment of completion makes the flight
to the Balance **decoration**: something was invented and then moved. The same
figure travelling, the tag the student had been looking at while they worked,
makes it a **transaction**: a price was quoted, the work was done, the price was
paid. Langdock prices each unfinished task and crowns the checklist with
"0 / 595"; Portrait keeps the same "+100" visible after completion. Both work
for the same reason.

The narrow form of the old rule survives, and `CONTEXT.md` states it: *never a
price list of the whole flow*.

## Consequences

- `PricePill` is one component doing both jobs, and it registers its own DOM
  element with the award provider. The flight starts from wherever that element
  actually is. **A version of this that flew from the pointer would be the
  decoration this decision replaced**, however well it animated.
- The flying token is 56px tall with a coin and a `+120`. What flew before was
  a `text-sm`, which is unreadable in motion.
- The Balance becomes a destination rather than a counter: two numbers, its own
  pressable surface, a verb ("50 points to spend"), and what is missing named as
  an object ("180 more for a course textbook"). See `nextTarget()` in
  `lib/points.ts`.
- The rail shows a price on exactly two rows. Ten priced rows would be the price
  list the old rule was protecting against, which is why the narrow form of it
  survives rather than the whole.
