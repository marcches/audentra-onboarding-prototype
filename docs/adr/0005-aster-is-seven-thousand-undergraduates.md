# Aster is a mid-size private institution of ~7,000 undergraduates

Every catalogue size and every price in this prototype derives from one number
that had never been written down. Fixing it here means that changing it later
invalidates the fixtures deliberately rather than silently.

Aster is a **mid-size private institution with roughly 7,000 undergraduates**.

## What derives from it

- **~420 student organizations.** U.S. directories run at roughly one
  organization per 15 to 25 undergraduates. Sixty ship in the fixture, adapted
  from verified directories at Michigan, Cornell, Iowa, Kenyon and Wittenberg;
  the ~420 figure is stated on screen so the catalogue reads as a sample of a
  real directory rather than as the whole of one.
- **Eight residences, ~2,970 beds.** Around 42% of undergraduates housed on
  campus, which is the ordinary figure for a private institution of this size
  that houses first and second years.
- **Room rates.** A base double at $6,800 per person per academic year, with the
  sector's real ratios applied by `roomRate()` rather than typed per residence:
  triple ~0.87x, single ~1.15x, private or connecting bathroom +10%, renovated
  within fifteen years +15%, air conditioning +12%, and a learning community as
  a flat surcharge. The internal spread ends at roughly 2x, which matches
  published rate sheets.
- **Meal plan priced separately**, from $4,250. Roughly half of U.S.
  universities bundle and half separate; without declaring a convention the same
  "double" ranges from $3,556 to $15,568 across the sector and no number on the
  screen is comparable to any other.

## Consequences

- Changing the 7,000 invalidates all of the above at once. That is the point of
  recording it: the numbers are not independent guesses, they are one guess with
  arithmetic on top.
- The Involvement Fair's scale is sized to this figure too. The larger
  institutions run two or three fair days; Aster runs one.
- None of these figures is authoritative. They are structurally correct so that
  real institutional values drop in without a shape change, which is the
  standard every fixture in this repo is held to.
