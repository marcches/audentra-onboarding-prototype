# 06 — Review & Sign: time estimate + required/optional per step

**What to build:** Extend the single step-order source (`steps.ts` or equivalent) with a time estimate and a required/optional flag per step, including the new Health Information step. Review & Sign's per-step summary blocks display both, next to the existing "Edit" affordance — read from that one source so the rail, any per-step index, and this summary can never disagree.

**Blocked by:** #05 (needs the final step list, including Health Information, before adding per-step metadata).

**Status:** ready-for-human

- [x] Step-order source gains a time-estimate field and a required/optional field per step, covering every step including Health Information.
- [x] Review & Sign displays both values per step in its summary blocks.
- [x] Time estimates are reasonable approximations (more for multi-section steps like About You, less for single-question steps) — not measured data.
- [x] Changing a value in the step-order source updates Review & Sign without a matching duplicate change anywhere else.
- [x] `docs/review-script.md` gets a checklist entry confirming every step shows a time estimate and required/optional tag in Review & Sign.

## Comments

Implemented. `Step` in `steps.ts` gained `timeEstimateMinutes`, `required`, and `points` (added together with #07's field, since both extend the same array and sequencing them as two separate passes over the same seven entries would've been pure churn). `SummaryGroup` in `summary.ts` carries the same fields through from `group()`, and `SummaryPanel` in `review.tsx` renders them next to each block's "Edit" link. Verified in-browser: all five summary groups (Offer, About you, Housing, Campus life, Health information) show their time/required/points correctly.
