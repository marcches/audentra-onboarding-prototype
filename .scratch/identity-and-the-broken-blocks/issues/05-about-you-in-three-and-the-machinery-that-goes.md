# 05 · About you in three, and the machinery that goes with it

Status: todo

`Where you live now` stops being a Step. The permanent address and the residency
check become Sections inside `Who you are` — present for a citizen or a
permanent resident, absent for an international student, which is the same rule
one level down.

Gusto's "Personal information" is the precedent: preferred name, legal name,
pronouns, phone and current home address in one step.

## What this reverses

The previous round split `Identity & contact` into four Steps because it carried
four subjects and made the student ping-pong between them. That reasoning still
holds, and this does not undo it: name/number/status/document/address is one
subject — *you* — while emergency contact and family access are another —
*other people* — and health is a third. Three Steps, three subjects.

## The five-minute Step

`Who you are` becomes 5 minutes and 50 Points. `steps.ts` says every Step is
"levelled at one to three"; that rule was written to kill a six-minute Step that
made the student circle back through four subjects, not to cap a five-minute
Step whose parts are adjacent. The comment gets rewritten to say that, rather
than the number getting fudged to fit it.

Totals are unchanged: 215 Points either way.

## What gets deleted

`appliesTo` on `Step` existed for one row of one table. With the address a
Section, **no Step varies by Student status**, and the following have no user:

- `Step.appliesTo`
- `stepApplies()`
- the `status` parameter on `stepsFor`, `stepCountFor`, `groupsFor`,
  `totalMinutesFor`, `totalPointsAvailableFor`, `stepIndexFor`, `nextStep`,
  `previousStep`
- the branch in `steps.test.ts` that counts nine versus ten

They go. Keeping a subsystem for an imagined future caller is how
`Sections columns={2}` came to sit in the codebase with no route using it.

`addressSchemaFor()` **stays** — it is still the right seam, just called from
the Section now rather than from the route. `null` still means absent, and
absent still means the fields do not participate in validation at all.

## Loose ends

- `/onboarding/where-you-live` redirects to `/onboarding/who-you-are` rather
  than 404ing: the Review summary's edit links and any bookmark point at it.
- `whereYouLive.submitted` goes; `whoYouAre.submitted` governs both.
- Storage key bumps to v6 — a v5 blob carries `whereYouLive.submitted` and a
  spine that no longer exists.
- `summary.ts` folds the address rows into `who-you-are`, conditionally.
