# Student Portal

Where the student lands once the gate is behind them. A shell of areas, a
checklist that answers "what do I do next", and an assistant that follows them
around.

Assumes [the shared glossary](../../CONTEXT.md). What is here is what means
something *only* inside the portal.

The portal exists because the one that shipped does not answer its own first
question. The client's words, watching a student open it: *"eu não tenho
direcionamento"* — I open it and nothing tells me where to go. Every term below
is downstream of that sentence.

## The unit of work

**Requirement**:
One thing the institution needs from the student after the offer is accepted.
What the portal stores under a Quest. Unlike a Step it carries a deadline, an
availability date, prerequisites, a state, and a value that changes with time.
_Avoid_: task, step, to-do, item

> The word is the one the production portal already uses
> (`/enrollment/requirements/[slug]`), chosen so the prototype translates without
> a glossary when engineering picks it up.

**Carried-over Requirement**:
A Requirement that exists because the student skipped the equivalent Step in the
gate. It is the portal's only inheritance from the gate, and the reason the
portal can say *nothing was lost* and mean it.
_Avoid_: leftover, pending, unfinished

**Prerequisite**:
Another Requirement that must be complete before this one becomes available.
Named on screen rather than represented as a lock, because a named prerequisite
is an instruction and a padlock is an obstacle.
_Avoid_: dependency, blocker, gate

**Unlocks**:
How many Requirements a Requirement releases by being completed. The number
behind *Best next step* — the first card is first *because* it opens the most,
not by accident of ordering.
_Avoid_: opens, enables

## State

Four, and the first three are the groups the checklist draws. A Requirement is in
exactly one at a time.

**Available**:
Its prerequisites are met and the student can act on it now. The only state that
appears above the fold, and the only group that is never collapsed.
_Avoid_: open, todo, ready

**Under review**:
Submitted, and waiting on the institution rather than on the student. Carries who
is looking at it and how long that usually takes, because a state the student
cannot act on still owes them a reason for existing.
_Avoid_: pending, processing, in progress

**Upcoming**:
Not yet available, because a prerequisite is unmet or a date has not arrived.
Drawn as a discreet line naming what is missing.
_Avoid_: locked, blocked, future

**Complete**:
Done. Leaves the checklist entirely and becomes a line in the summary. A finished
Requirement at the top of a list of things to do is information nobody can act
on, occupying the position of highest value — which is the defect the portal was
built to fix.
_Avoid_: closed, archived

## Time and value

**Availability date**:
The day a Requirement becomes Available. It starts the Decay clock — not the day
the student first opens the portal, so that a student who logs in late is not
punished for days they were never offered.
_Avoid_: start date, unlock date

**Deadline**:
The day by which the institution needs the Requirement. Shown as a date and a
distance together — `Due Aug 14 · 6 days` — because a date alone makes a student
do arithmetic to feel urgency. Always **before teaching begins**: a deadline
that falls after the first lecture is not a deadline, and `portal.test.ts` holds
that against the Academic calendar so it cannot come back.
_Avoid_: due date, expiry, cutoff

**Academic calendar**:
The five dates of the term the student was admitted to — move-in, orientation,
teaching begins, add/drop closes, and the first term's bill. One fixture
(`academicCalendar`), and the ruler every Deadline is measured against. `Key
dates` is what the student sees it called on the Dashboard.
_Avoid_: term dates, important dates, milestones

**Decay**:
The rule by which a Requirement is worth one Point less for each day it goes
unfinished. Mandatory, and the one part of the design the client specified
outright: *hoje é 100, amanhã 99*. It is shown literally — today's value beside
tomorrow's — and never as a running tally of what has been lost.
_Avoid_: penalty, expiry, countdown

> **No reference in the catalogue does this.** Thirty-six screens were searched
> for a reward that decreases and every one of them uses a deadline or a
> countdown timer instead — Codecademy, Shop, OpenSea, Uxcel. The pattern was
> invented by the reference prototype, not borrowed. That does not make it wrong;
> it makes it the one component of the portal that cannot be validated by
> reference and has to be validated with students.

**Floor**:
Half the Requirement's original value, and the least Decay can take it to. A
Requirement never reaches zero and never goes negative. Without a floor a student
who is a hundred days late opens the portal to a row of noughts, and the reward
system becomes a bill.
_Avoid_: minimum, cap

**Original value**:
What a Requirement was worth on its Availability date. Held so the Floor can be
computed — deliberately never shown, because displaying what the student has
already lost turns a reward into a reprimand.
_Avoid_: base points, full value

## Ordering

**Smart order**:
The default arrangement of the checklist: Unlocks descending, then Points at risk
descending, then time ascending. Upcoming Requirements never place at the top.
_Avoid_: recommended, suggested, priority

**Points at risk**:
What a student loses per day by not acting on a Requirement — the client's
mandate expressed as a sort key rather than only as a number on a card.
_Avoid_: urgency score

**Quick win**:
A Requirement with a low time estimate. One of the three arrangements, and the
one that answers "I have four minutes".
_Avoid_: easy task, low-hanging

## The shell

**Area**:
One destination in the sidebar. Nine of them. Two are built and seven declare
honestly that they are not, because a sidebar of dead items repeats the exact
complaint that started this work — a student looking for something and not
finding it.
_Avoid_: page, section, tab, module

**Edward**:
The assistant, present in every Area as a floating button and never as a sidebar
item. A sidebar entry makes an assistant a place you go; a floating button makes
it a thing you have while doing something else, which is the only version that
gets used.
_Avoid_: chatbot, AI tab, copilot
