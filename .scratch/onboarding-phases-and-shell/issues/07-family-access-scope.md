# 07 — Family access: what they can actually see

**What to build:** The missing fourth field. Laura listed four things Family
access needs — full name, email, relationship, **and what the person gets access
to** — and the last one was never built. `store.ts` carries three
(`familyMemberName`, `familyMemberEmail`, `familyMemberRelationship`), and the
screen's own lead promises the fourth: "Choose who can see your record **and what
they can see**." The UI is currently writing a cheque the form doesn't cash.

**Blocked by:** 01 — lands inside the renamed Identity & contact step.

**Status:** ready-for-human

**Referências:**
- [Square — new contract](https://mobbin.com/screens/aa8c688f-a889-44ef-848a-8c766d8272da) — a set of scoped permissions as individually checkable panels, each with a plain-language line about what it means.
- [Deel — bulk edit](https://mobbin.com/screens/ff59116e-b033-499e-badb-b4c9e02cd84a) — grouped checkbox categories with an `n/m selected` summary on the collapsed row, which is how a scope list stays compact.

- [ ] A scope selector exists: the student picks which parts of the record the person can see, not an all-or-nothing switch.
- [ ] Scopes are modelled on what FERPA releases actually cover — grades and academic record, billing and financial aid, housing, health and disability services, disciplinary record — as fixtures, plainly worded.
- [ ] Health and disciplinary scopes are **off by default** and never pre-checked. These are the two a student is most likely to regret granting to a parent by reflex.
- [ ] Nothing can be saved with access granted and zero scopes selected — that state promises access and delivers none.
- [ ] The lead copy and the form now agree.
- [ ] The scope appears in the Review summary and in the enrollment agreement, in the student's words, not as field names.
- [ ] Compact by default: collapsed, the row summarises what was granted rather than listing every scope.

## Comments
