# 06 — About you in three, and the machinery that goes with it

Status: ready-for-agent

**What to build:** A student answers everything about themselves — name, number,
Student status, Identity document, permanent address — on one screen, and About
you becomes three Steps instead of four. *Where you live now* stops being a Step:
the permanent address and the residency check become Sections inside *Who you
are*, present for a U.S. citizen or a permanent resident and absent for an
international student. The same rule, one level down.

**What this reverses, and what survives.** The previous round split *Identity &
contact* into four Steps because it carried four subjects and made the student
ping-pong between them. That reasoning holds and this does not undo it:
name/number/status/document/address is one subject — *you* — while emergency
contact and family access are another — *other people* — and health is a third.
Three Steps, three subjects.

**The five-minute Step.** *Who you are* becomes 5 minutes and 50 Points. The
spine says every Step is "levelled at one to three"; that rule was written to
kill a six-minute Step that made the student circle back through four subjects,
not to cap a five-minute Step whose parts are adjacent. The comment and the test
get rewritten to say that, rather than the number being fudged to fit them.
Totals are unchanged: 215 Points either way.

**What gets deleted.** `appliesTo` existed for one row of one table. With the
address a Section, **no Step varies by Student status**, so `Step.appliesTo`,
`stepApplies()`, the `status` parameter on the eight spine functions that take
one, and the branch in the spine test that counts nine against ten all have no
user. They go. Keeping a subsystem for an imagined future caller is how a
two-column option came to sit in the codebase with no route using it.

`addressSchemaFor()` **stays** — it is still the right seam, just called from the
Section now rather than from the route. `null` still means absent, and absent
still means the fields do not participate in validation at all.

**Blocked by:** 01 — *Who you are* has to be content-height before it absorbs two
more Sections.

**Referências:**
- [Gusto — Personal information](https://mobbin.com/flows/4c148fb2-f611-4b54-bc2d-4eebdb50dc58) — preferred name, legal name, pronouns, phone and home address in one step, with the agreement at its foot. The precedent for the address living inside the personal-details step rather than beside it.
- [Later — Tell us about you](https://mobbin.com/screens/d9985ab0-703c-437f-9b57-3cee60d686c4) — name, email, phone, birthday, industry and mailing address in a single step of a four-step application, with the mailing address as its own block at the foot of the same screen.

- [ ] The spine has nine Steps, and About you holds *Who you are*, *Health information* and *Who we call, who can see*
- [ ] The permanent address and the residency check are Sections inside *Who you are*, present for a citizen and a permanent resident, absent for an international student
- [ ] *Who you are* is 5 minutes and 50 Points; the total available is unchanged at 215
- [ ] The one-to-three-minute rule is rewritten to say what it was for, rather than the number being fudged to fit it
- [ ] `Step.appliesTo`, `stepApplies()` and the `status` parameter on the spine's eight status-taking functions are deleted, with the nine-versus-ten branch in the spine test
- [ ] `addressSchemaFor()` is unchanged and is called from the Section; `null` still means the fields do not validate at all
- [ ] `/onboarding/where-you-live` redirects to `/onboarding/who-you-are` rather than 404ing, so the Review summary's edit links and any bookmark still land
- [ ] `whereYouLive.submitted` is gone and `whoYouAre.submitted` governs both; the storage key bumps to v6
- [ ] The summary folds the address rows into `who-you-are` conditionally and emits no section for the retired Step
- [ ] Every "N of M" in the UI reads nine, for every student
- [ ] `pnpm typecheck`, `pnpm test` and `pnpm lint` pass
