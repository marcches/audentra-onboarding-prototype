# 04 — Campus Life: filter + club detail view

**What to build:** Add a category to each club fixture (sport, arts, outdoors, social, service, etc.) and a filter control above the club grid that narrows visible clubs by selected category — without affecting which clubs are already picked. Selecting a club (separate from the "pick" action) opens a detail view with a larger image, the existing blurb, and enough added detail (meeting cadence, longer description) to inform the decision, reusing the dialog/sheet pattern already used for the Housing residence gallery.

**Blocked by:** None — can start immediately.

**Status:** ready-for-human

- [x] Club fixtures gain a category field; filter control above the grid narrows by one or more selected categories.
- [x] Filtering the grid doesn't unpick or hide already-picked clubs from the running "Your picks" panel.
- [x] Opening a club's detail view (distinct from picking it) shows a larger image and expanded copy.
- [x] Detail view is built on the existing dialog/sheet pattern (matches Housing's residence gallery), not a new interaction pattern.
- [x] `docs/review-script.md` gets checklist entries for filter narrowing/clearing correctly and the detail view opening independent of filter state.

## Comments

Implemented. Each club fixture gained `category`, `detail` (longer description), and `cadence`; six categories (sport, arts, outdoors, social, service, making). `ClubGrid` now has two separate controls per card — the photo/copy opens a new `ClubDetail` dialog (reusing the `Dialog` primitives, same pattern as `ResidenceGallery`), and a small badge in the corner is the pick toggle. Filter state lives in `CampusLifeRoute`, independent of the stored picks, so filtering never touches what's chosen.

Found and fixed a real bug while checking 390px in-browser: two-word club names with "&" ("Robotics & making", "Tabletop & games", "Debate & speaking") wrapped to two lines on the narrower 2-column mobile grid, and the second line clipped the first off the top of the card — the text overlay is absolutely positioned and was overflowing the image's `aspect-[4/3]` box, then getting cropped by `overflow-hidden`. Fixed by switching to `aspect-square` (more headroom) and `line-clamp-2` on both title and blurb, which also reads better on desktop.
