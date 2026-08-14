# 05 — Health Information step

**What to build:** Split the disability/accommodation question out of Campus Life into its own explicitly optional step (or section — left to design judgment during build). Keep the existing yes/no question and its "don't write medical details here" warning, but on "yes" add two upload fields — medical documentation and immunization record — reusing the existing identity-document upload component pattern. Copy notes that onboarding doesn't require this, but the student portal may require it later.

**Blocked by:** #04 (Campus Life's filter/detail work should land first so this ticket isn't editing the same step mid-flight).

**Status:** ready-for-human

- [x] Accommodation yes/no question and its warning notice move out of Campus Life into the new step/section.
- [x] "Yes" reveals medical-documentation and immunization-record upload fields, each behaving like the existing identity-document upload (add/remove, no crash on empty state).
- [x] Step is optional — does not block Review & Sign or Deposit.
- [x] Copy explicitly states the onboarding step is optional but the student portal may require this information later.
- [x] If implemented as a new step: `steps.ts` (or equivalent step-order source) and the store's per-step state both gain a matching entry; `completedSteps()` gets the equivalent submitted check.
- [x] `docs/review-script.md` gets checklist entries for upload add/remove behavior and the step being skippable.

## Comments

Implemented as a new step (`/onboarding/health`, between Campus life and Review & sign). New `HealthState` slice in the store; `CampusLifeState` lost `accommodations`/`accommodationNote` since they moved wholesale. Built a general `DocumentUpload` component (drag-and-drop, file list, remove) shared by both uploads — deliberately without the identity upload's simulated-OCR "extracted" behavior, since a medical letter or immunization record is never read into a field. `summary.ts` gained a `healthRows()` group alongside the existing ones so Review & sign shows it. Verified in-browser: skip leaves it unsubmitted, "Yes" reveals both uploads, uploads behave correctly.
