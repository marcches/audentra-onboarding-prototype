# 08 — The grammar of a prefilled field

**What to build:** A field the institution already knows the answer to **looks**
already answered. The student's job on it is to confirm rather than to type, and
they can tell at a glance how much of the form is already done.

This is the direct visual answer to **Melt**, and it is the client's own
argument: schools cannot get admitted students to fill things in, so the product
must show that most of it is already filled. A prefilled field drawn as an empty
field that happens to contain text throws that away.

**The plumbing is explicitly not in this ticket.** No CRM, no import, no sync —
the values come from fixtures, and the value delivered here is the *grammar*: what
a **Prefill** looks like, how it is confirmed, how it is corrected when it is
wrong, and how a Step whose fields are mostly prefilled reads shorter than one
that is not. Designing that grammar after the integration would mean designing it
twice.

A prefilled field must remain correctable. A student whose phone number changed
must be able to change it without hunting for how.

**Blocked by:** 07 — The nine Steps recomposed.

**Status:** resolved

**Referências:**
- [Portrait](https://mobbin.com/screens/21e83614-0f58-429c-a84b-8e811abb64e8) — facts set as label→value pairs at metadata size, which is the anatomy a confirmed field borrows instead of inventing a fourth one.
- [Coinbase](https://mobbin.com/screens/834b6b4e-dcfe-4577-8a6c-293c1c77fa5c) — rows in a soft filled state reading unmistakably as already complete, without a status word doing the work.
- [Substack](https://mobbin.com/screens/73b297c2-e58e-4b05-b64b-48001a69e072) — a checklist where finished items are visibly settled and the live ones stand forward, so the remaining work looks small.

- [ ] A prefilled field is visually distinct from an empty one at a glance
- [ ] A prefilled field reads as done rather than as pre-typed
- [ ] The student can correct a prefilled value without hunting for how
- [ ] A Step that is mostly prefilled reads shorter than one that is not
- [ ] Prefilled state comes from fixtures; no CRM, import or sync is introduced
- [ ] Icon state follows the system rule: fill means done
- [ ] `Prefill` is used as the term, matching the glossary
- [ ] `pnpm typecheck`, `pnpm test` and `pnpm lint` pass

## Answer

A Prefill is a comparison, not a flag: a field is one exactly while its value is still the institution's copy, so no stored marker can disagree with the value beside it. The whole address is one Prefill rather than five. `Who you are` goes 1464 -> 1323 at 1366x768 without shrinking any type. Values are fixtures; no CRM.
