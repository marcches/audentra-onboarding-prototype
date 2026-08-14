# 03 — About You: phone field compaction

**What to build:** The mobile-number field in About You shrinks to a single compact row (dial-code select + number input side by side, one line of helper text), losing its separate heading block. Presentational change to the existing phone input pairing — no new field, no validation change.

**Blocked by:** None — can start immediately. Touches the same file as #02; consider sequencing or pairing with it to avoid rebasing.

**Status:** ready-for-human

- [x] Mobile-number field renders as one compact row instead of a full block with its own heading.
- [x] No regression to validation or autosave behavior for this field.
- [x] Field doesn't clip or wrap awkwardly at 390px.
- [x] `docs/review-script.md` gets a checklist entry for the compacted phone row at 390px.

## Comments

Implemented alongside #02 (same file, same accordion section, done in one pass to avoid rebasing). Dropped the standalone `Field` label/hint wrapper for this one field and hand-rolled a compact block: the `PhoneInput` row, then one line combining the field name, "optional", and the purpose — with an `aria-label` on the input for accessibility since there's no visible `<label>` element. Verified at 390px in-browser — no clipping.
