# About you is three Steps, and status variation drops a level

The previous round split *Identity & contact* into four Steps because it was one
Step carrying four subjects, and the client described the defect exactly: *"a
gente começou falando de nome, falou de contato, aí voltou a falar de nome,
falou de contato de novo."* That diagnosis was right and it is not being
reversed. What is being reversed is where the boundary was drawn.

It was drawn around **fields**. That is how *Where you live now* came to be a
Quest of its own: two minutes of two fields, existing not because an address is
a subject but because an earlier round needed somewhere to put an address that
varies by Student status. A student walking About you crossed four screens to
answer what is one question — who are you.

The boundary is around **subjects**. Name, number, Student status, Identity
document and permanent address are one subject: *you*. Emergency contact and
Family access are another: *other people*. Health is a third. Three Steps, three
subjects. Gusto's "Personal information" is the precedent — preferred name,
legal name, pronouns, phone and current home address in one step, with the
agreement at its foot.

**The status rule drops one level rather than disappearing.** The permanent
address and the residency check are Sections inside *Who you are*, present for a
U.S. citizen and a permanent resident and **absent** for an international
student — not shown and explained, not disabled. `addressSchemaFor()` is
unchanged and is called from the Section now rather than from a route: `null`
still means the fields do not participate in validation at all, which is the
distinction that stops a hidden required field from blocking Continue with an
error nobody can see.

## The trade-off, argued rather than asserted

*Who you are* becomes a five-minute Step, and `steps.ts` says every Step is
"levelled at one to three". That is a real cost and it is worth being exact
about what the rule was protecting.

It was written against a **distribution**, not against a length: one Step of six
minutes beside five of one. And the six-minute Step was not bad because it was
long — it was bad because it made the student circle back through four subjects,
answering their name, then their contact details, then their name again. A
five-minute Step whose parts are adjacent and all about the same person does not
reproduce that. So the rule keeps its reason and the test names the exception
rather than the number being fudged down to fit.

Against that cost: the student stops ping-ponging between screens on one
subject, the flow loses a screen that was two minutes of two fields, and every
student walks the same nine Quests — which is what the entrance announced to all
of them anyway.

## Consequences

- **A subsystem is deleted, not kept for a future caller.** With no Step varying
  by Student status, `Step.appliesTo`, `stepApplies()` and the `status`
  parameter on the eight spine functions that took one have no user, and they
  go. Keeping them for an imagined caller is how a two-column option came to sit
  in this codebase with no route using it. `useSpine` and `InstitutionBadge` go
  with them for the same reason.
- **Nine Quests, for everybody.** Every "N of M" in the UI, the entrance's time
  and Points announcement, and the rail all derive from one list again. The
  totals are unchanged at 215 Points: the 20 the address Step carried moved into
  the Step that absorbed it.
- **The storage shape follows it.** `whereYouLive.submitted` is gone and
  `whoYouAre.submitted` governs both halves of the screen — two flags for one
  Continue is how a screen comes to be half-saved. The address keeps its own
  slice, because the two are different shapes with different validation. The
  key bumps to v6, since a v5 blob carries the retired flag and a spine that no
  longer exists.
- **`/onboarding/where-you-live` redirects rather than 404ing**, because the
  Review summary's edit links were written against it and a student may have
  bookmarked it. Landing on a 404 in the middle of an enrolment is the worst
  available answer to "where did my address go".
- **The summary reads the address back under *Who you are***, conditionally, and
  emits no section for the retired Step. A summary that reads an answer back
  under a screen the student never saw is a summary teaching people not to read
  it.
- This is hard to reverse. Reversing it means a v7 storage shape, the summary
  splitting again, and the status parameter coming back through eight
  functions. Both halves of the argument are written down here on purpose: the
  commit that argued for four Steps is the other half, and a reader who finds
  only this one has been told half the story.
