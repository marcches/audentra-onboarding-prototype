# 04 — Housing: eight Residences, a Shortlist of three

**What to build:** The screen the last round skipped entirely. Eight Residences,
each a horizontal card with an inline photo carousel, amenity chips and the facts
a student actually decides on. Filter pills across the top. The student ranks a
**Shortlist** of three. Off campus stops being half the step, but a discreet
"I'll arrange my own" exit remains.

**Blocked by:** 01.

**Status:** done

**Referências:**
- [Expedia](https://mobbin.com/screens/8550912d-155f-4342-85bf-b50c4524bd8a) — the Booking card, literally: carousel with ‹ › on the left, title plus room type plus amenity chips in the middle. The card carries the resemblance the client asked for.
- [Zillow](https://mobbin.com/screens/ac55ce90-c633-46bd-bc99-aedfa1b446a3), [Care.com](https://mobbin.com/screens/6e81234b-6a1d-4b8b-acb5-0a4dc9fc0c4f) — filters as dropdown pills across the top rather than a filter column, which is right at eight items and wrong at five hundred.
- [Airbnb](https://mobbin.com/screens/b277fe9f-067a-42bd-88f8-7331193ac735) — carousel inside a compact card without a modal behind it.

- [x] Eight Residences in fixtures, modelled on what U.S. universities actually publish.
- [x] The fixture is shaped like an **API response**, not like whatever is convenient to render. The client was explicit that availability comes from a university API and that this round mocks it — a shape that has to be rewritten at integration is a failed mock.
- [x] Each carries room type, bathroom arrangement, meal plan, walk time, laundry and first-year policy. **No cost** — see ADR-0003.
- [x] Photo carousel is inline on the card. `ResidenceGallery` (the modal) is deleted.
- [x] Filter pills for room type and bathroom.
- [x] Shortlist is three ranked picks out of eight, added by tap and reorderable without dragging.
- [x] The screen states plainly that a Shortlist is a preference and the housing office assigns.
- [x] Off campus is no longer a top-level branch; a discreet "I'll arrange my own housing" exit remains and skips the Shortlist.
- [x] ~24 images curated from Unsplash under free licence, downloaded locally, credited per file in `public/images/CREDITS.md` — same procedure as the first nine.
- [x] Verified at 390px: the horizontal card reflows to vertical, carousel still swipeable.

## Comments

**Built.** `housingAvailability` in `fixtures.ts` is the mock response — codes,
a flat `photos` array with a `kind` per frame, and `shortlistSize` supplied by
the institution rather than hardcoded in the component. Every word on screen is
derived from it through the label maps in the same file, which is the seam that
has to survive the real endpoint.

**One thing moved rather than went.** The old "off campus" branch's only content
was the tuition/housing protection question, and that field is in the client's
inventory. It now lives behind the "I'll arrange my own housing" exit, which is
the same person it was always for. `housing.intent` is gone; `housing.arrangingOwn`
replaced it and storage is `v4`.

**Empty Shortlist shows a sentence, not three dashed slots.** 200px of
placeholder above the first photograph is the bulk the client complained about;
the numbered slots appear as soon as one of them means something.

Verified at 1440px and 390px: the card reflows to vertical, the carousel snaps
and the arrows track it.
