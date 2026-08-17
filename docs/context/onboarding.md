# Student Onboarding

The gate. The flow a newly admitted student walks from receiving an offer to
securing a place. Nine Quests, three Phases and a Closing, walked once, without
the portal's shell around it — no sidebar, no Edward, no checklist.

Assumes [the shared glossary](../../CONTEXT.md). What is here is what means
something *only* inside the gate; the terms the portal also uses live there.

## The spine

**Phase**:
A named group of Steps that share one purpose, and the unit the student sees
progress against. There are exactly three: _Deciding_, _About you_, _Your life
on campus_.
_Avoid_: stage, section, chapter

> **About you** names the Phase, never a Step. It used to name a Step as well,
> and then that Step became _Identity & contact_ carrying four subjects at
> once. It is now three Steps — _Who you are_, _Health information_, _Who we
> call, who can see_ — because a Phase can be described loosely and a form
> cannot.
>
> It was briefly four. _Where you live now_ was one of them and is not any
> more: the permanent address and the residency check are Sections inside _Who
> you are_, present for a U.S. citizen or a permanent resident and absent for an
> international student. The reasoning for splitting _Identity & contact_
> survives that change and is what drove it — the split was right that a Step
> carries **one subject**, and wrong about where the boundary falls, because it
> drew it around fields. Name, number, Student status, Identity document and
> permanent address are one subject; emergency contact and Family access are
> another; health is a third. See ADR 0011.

**Step**:
One screen inside a Phase, completable on its own and saved on its own. What the
gate stores under a Quest.
_Avoid_: page, tab, requirement

> **Not a Requirement.** The portal's unit of work carries a deadline, a
> dependency and a decaying value; a Step carries none of those and never will.
> They present to the student as the same thing — a Quest — and they are not the
> same thing underneath.

**Closing**:
Review & sign and Deposit — where the student confirms what they already gave,
rather than giving something new. Deliberately outside the Phase count.
_Avoid_: final phase, phase 4

**Skipped**:
An optional Step the student passed over rather than completed. Not a failure
state and not an error: the gate lets it through by design, and what it produces
is a carried-over Requirement in the portal. Nothing is lost, and the portal has
to say so.
_Avoid_: incomplete, abandoned, missed

## Housing

**Residence**:
A place on campus the student can be housed in, carrying its photos, room
types, bathroom arrangement, meal plan, walk time and laundry.
_Avoid_: hall, dorm, property, listing

**Shortlist**:
The three Residences a student ranks, in order, out of the full catalogue. A
statement of preference, never an assignment — the housing office assigns.
_Avoid_: choice, booking, selection

## Campus life

**Organization**:
A student-run group at Aster — a club, a sport club, a chapter, a publication, a
governing body. What the catalogue is made of. It carries a category, a joining
process, a weekly time commitment and a cost per semester, because those are the
questions a student actually has before walking up to a table.
_Avoid_: club, society, activity

**Interest list**:
The Organizations a student marks during onboarding. A statement of curiosity,
never membership: joining happens in person, after classes begin. What the list
produces is a route through the Involvement Fair, not a roster.
_Avoid_: selection, picks, my clubs, joined

**Involvement Fair**:
The in-person event in the first weeks of term where a student actually joins an
Organization. It is why nothing in this Phase is a commitment, and it is the
destination the Interest list is a route to.
_Avoid_: club fair, activities day

## Health

**Accommodation**:
Something the university adjusts for a student with a disability or health
condition. Disclosing the need is optional here and required later in the
portal — a difference the step has to say out loud rather than imply.
_Avoid_: special needs, disability question

**Immunization record**:
The proof of vaccination the university holds on file. Collected beside the
medical documentation an Accommodation needs, because both are uploads about
health and asking for them in two different places is what made this feel
scattered.
_Avoid_: vaccine card, shots

## Family and identity

**Emergency contact**:
Who Aster telephones if something happens to the student. Carries a name, a
relationship and a number, and nothing else — it grants no sight of anything.
One is required and a second is optional; there is no third.
_Avoid_: next of kin, ICE contact, guardian

> **Not the same thing as Family access**, which the copy has conflated more
> than once. The emergency contact is who Aster *calls*; Family access is who
> may *ask*. One is a phone number for a crisis, the other is a standing
> permission under federal law, and a student may reasonably want one person for
> the first and nobody at all for the second.

**Family access**:
A named person granted sight of specified parts of the student's record, under
FERPA. Carries a name, an email, a relationship, and the scope granted.
_Avoid_: guardian, parent permission, FERPA form

**Eligible student**:
What FERPA calls a student once the right to their education record has passed
from their parents to them — on turning 18, or on entering a postsecondary
institution at any age. Every student in this flow is one, which is the whole
reason they are the one granting Family access rather than being granted it.
_Avoid_: adult student, of age
