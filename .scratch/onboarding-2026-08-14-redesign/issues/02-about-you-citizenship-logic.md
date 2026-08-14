# 02 — About You: citizenship-conditional logic + family relationship field

**What to build:** Citizenship/student status gates two things already in the About You accordion, rather than adding a new section: the identity-document requirement text (passport for U.S. citizens and international students against their own country, driver's license for permanent residents), and the entire address block, which is skipped outright for international students instead of shown and required. When shown, state and city become cascading selects instead of free-text. Separately, the family-access section gains a relationship field (reusing the existing emergency-contact relationship options) alongside the name/email it already collects.

**Blocked by:** None — can start immediately.

**Status:** ready-for-human

- [x] Citizenship/status answer changes the identity-document requirement copy per branch (U.S. citizen → passport; permanent resident → driver's license; international student → passport of their country).
- [x] International-student branch hides the address block entirely (street/unit/city/state/postal/country/residency-verification) and shows a short explanatory line instead; validation schema excludes those fields on that branch.
- [x] U.S. citizen / permanent resident branches still require the address block, matching today's behavior.
- [x] State field is a select; city field is a select scoped to the selected state (new fixture data for U.S. states and per-state cities).
- [x] Family-access section collects a relationship value (from the existing relationship options) in addition to name and email; validation requires it when family access is granted.
- [x] `docs/review-script.md` gets checklist entries for: switching citizenship answers correctly shows/hides the address block and updates the document requirement text in both directions; state/city cascade correctly.

## Comments

Implemented, and reordered the identity section so citizenship is asked first (feeds the document hint and the residence gate right below it). Added `usStates`/`citiesByState` fixtures (51 states, 3 representative cities each). Validation moved into `superRefine` so the address fields are conditionally required based on citizenship rather than unconditionally. Eligible noncitizen is treated as domestic (address required, driver's-license-style document) since the spec only calls out international students for the hidden-address branch.

Found and fixed a related bug while verifying in-browser: the address summary in Review & Sign and the signed agreement text were printing the raw select values ("los-angeles", "CA") instead of labels, since `city`/`state` moved from free-text to selects. Added `formatAddress()` in `lib/summary.ts`, reused from `lib/agreement.ts`, so both read the same formatted string.
