# 07 — Family access: what they can actually see

**What to build:** The missing fourth field. Laura listed four things Family
access needs — full name, email, relationship, **and what the person gets access
to** — and the last one was never built. `store.ts` carries three
(`familyMemberName`, `familyMemberEmail`, `familyMemberRelationship`), and the
screen's own lead promises the fourth: "Choose who can see your record **and what
they can see**." The UI is currently writing a cheque the form doesn't cash.

**Blocked by:** 01 — lands inside the renamed Identity & contact step.

**Status:** done

**Referências:**
- [Square — new contract](https://mobbin.com/screens/aa8c688f-a889-44ef-848a-8c766d8272da) — a set of scoped permissions as individually checkable panels, each with a plain-language line about what it means.
- [Deel — bulk edit](https://mobbin.com/screens/ff59116e-b033-499e-badb-b4c9e02cd84a) — grouped checkbox categories with an `n/m selected` summary on the collapsed row, which is how a scope list stays compact.

- [x] A scope selector exists: the student picks which parts of the record the person can see, not an all-or-nothing switch.
- [x] Scopes are modelled on what FERPA releases actually cover — grades and academic record, billing and financial aid, housing, health and disability services, disciplinary record — as fixtures, plainly worded.
- [x] Health and disciplinary scopes are **off by default** and never pre-checked. These are the two a student is most likely to regret granting to a parent by reflex.
- [x] Nothing can be saved with access granted and zero scopes selected — that state promises access and delivers none.
- [x] The lead copy and the form now agree.
- [x] The scope appears in the Review summary and in the enrollment agreement, in the student's words, not as field names.
- [x] Compact by default: collapsed, the row summarises what was granted rather than listing every scope.

## Comments

**Found half-built.** A `disclosureScope` array, a checkbox grid and the
zero-scope validation were already there from an earlier round — the ticket's
premise that the field was never built was wrong. What was actually missing is
what this ticket delivered:

- **Two scopes that matter most.** The list was enrollment, financials,
  academic, housing. Health and disability services and Disciplinary record are
  now on it — the two a FERPA release most often covers and a student most
  specifically regrets granting.
- **`sensitive: true` on the fixture**, not styling in the route. It is what
  puts those two below the line, keeps them unticked, and makes the "no batch
  tick" rule a property of the data rather than a habit of whoever writes the
  next control. `toggleScope` is deliberately one-at-a-time and there is no
  select-all.
- **A plain-language line per scope.** "Academic record" and "your grades each
  term, your transcript and your academic standing" are the same box, and only
  one of them is an informed decision.
- **The agreement names the scopes** the student ticked instead of counting
  them. A clause you cannot check against your own answer cannot be audited,
  which is what the emphasised runs exist for.
- **Collapsed row reads `n of m areas`** rather than `n area(s)`.
