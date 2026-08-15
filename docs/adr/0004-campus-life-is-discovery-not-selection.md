# Campus life is discovery, not selection

A future reader will open Campus life, see a screen where nothing can be
committed to, and reasonably conclude it is unfinished. It is not. The premise
of the previous version was wrong, and this records why, so that nobody
"completes" it back into a selection screen.

**No U.S. university has students join organizations during enrolment.** Joining
happens in person at the Involvement Fair after classes begin: Ohio State runs
it on the Oval in late August, Penn State runs two days on the HUB lawn with
roughly 40,000 students circulating, Syracuse runs three days segmented by
category. What exists during onboarding, everywhere it exists at all, is an
interest survey.

So the verb changed. The student declares interest, and the outcome of the Step
is a route through the fair rather than a membership. The old detail modal was
useless for exactly this reason: it was built to confirm a choice that does not
happen at this point in the year.

## Consequences

- **No control on the screen says Join, Sign up, Apply or Enroll.** Where an
  organization requires an application, that is information in the Getting in
  field, not an action.
- The interest toggle is neutral-toned and the same width in both states. Brand
  colour stays reserved for the screen's primary navigation action, because a
  solid brand-coloured full-width button reads as enrolment whatever its label
  says.
- The Step is optional and skippable, and marking nothing is a complete answer.
- `Interest list` and `Involvement Fair` are terms in `CONTEXT.md`, so the
  distinction between curiosity and membership is enforced in the vocabulary
  rather than only in the UI.
- The fair route (`buildFairRoute` in `lib/catalogue.ts`) regroups the marked
  organizations **by fair zone rather than by the order they were marked**. That
  regrouping is what makes the Step produce something usable rather than a list
  of saves.

## What this does not decide

Whether Aster should eventually let students pre-register for organizations that
genuinely take applications ahead of term. Three of the sixty in the fixture do.
That is a product question for a round where somebody has asked for it.
