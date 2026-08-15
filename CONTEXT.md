# Student Onboarding

The flow a newly admitted student walks from receiving an offer to securing a
place. It is the student-facing half of Audentra; the staff portal is a separate
context and is not modelled here.

Written in English because the identifiers are: `steps.ts`, `store.ts` and the
UI copy all use these words, and a glossary that disagrees with the code is
worse than no glossary.

## The spine

**Phase**:
A named group of steps that share one purpose, and the unit the student sees
progress against. There are exactly three: _Deciding_, _About you_, _Your life
on campus_.
_Avoid_: stage, section, chapter

> **About you** names the Phase, never a Step. The Step it used to name is
> _Identity & contact_ — a Phase can be described loosely, a form cannot.

**Step**:
One screen inside a Phase, completable on its own and saved on its own.
_Avoid_: page, tab

**Quest**:
The student-facing name for a Step, used wherever progress is shown. A Step is
what the system stores; a Quest is what the student is invited to finish.
_Avoid_: task, to-do

**Closing**:
Review & sign and Deposit — where the student confirms what they already gave,
rather than giving something new. Deliberately outside the Phase count.
_Avoid_: final phase, phase 4

## Progress and reward

**Points**:
What completing a Quest is worth. Shown at the moment they are earned and
otherwise held in a single Balance — never printed next to every item as a
standing price list.
_Avoid_: score, XP, credits

**Balance**:
The one place the student's running Points total lives, always shown against
what it converts to. There is exactly one Balance in the shell.
_Avoid_: total, wallet

**Bookstore credit**:
What Points convert into, and the reason a Point is worth earning. The
destination that makes a number mean something.
_Avoid_: reward, prize, tier

## The student

**Student status**:
The answer that decides which documents and which address fields the flow asks
for. Exactly one of: _U.S. citizen_, _Permanent resident_, _International
student_.
_Avoid_: citizenship, residency

**Identity document**:
The proof of Student status the flow requires, which differs by status: a U.S.
passport for a citizen, a driver's licence for a permanent resident, a home
country passport for an international student.
_Avoid_: ID, upload

## Housing

**Residence**:
A place on campus the student can be housed in, carrying its photos, room
types, bathroom arrangement, meal plan, walk time and laundry.
_Avoid_: hall, dorm, property, listing

**Shortlist**:
The three Residences a student ranks, in order, out of the full catalogue. A
statement of preference, never an assignment — the housing office assigns.
_Avoid_: choice, booking, selection

## Family and identity

**Family access**:
A named person granted sight of specified parts of the student's record, under
FERPA. Carries a name, an email, a relationship, and the scope granted.
_Avoid_: guardian, parent permission, FERPA form
