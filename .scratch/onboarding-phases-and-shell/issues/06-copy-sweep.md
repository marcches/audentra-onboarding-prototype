# 06 — Copy sweep, limited to what these decisions changed

**What to build:** Bring the words in line with the structure. Scope is
deliberately narrow: only text that these decisions renamed, invented or
orphaned. Not a full `copy-inventory.md` pass — that scope eats the deadline and
does not show up in the review.

**Blocked by:** 01–05. Sweeping before the structure lands means sweeping twice.

**Status:** done

**Referências:**
- [Upwork](https://mobbin.com/screens/826b635b-4b9e-40e6-895d-7f674d820901) — reassurance before an irreversible action, expiry stated plainly underneath.
- [Langdock](https://mobbin.com/screens/065752db-06ad-4118-ad1c-8f95daa3f8a8) — invitational register for progress copy ("let's get started", "complete tasks to earn points") rather than administrative.

- [x] Every occurrence of "About you" as a step name is gone; the step is Identity & contact and the Phase is About you.
- [x] Progress copy names Phases and Quests, per `CONTEXT.md`. No stray "step 4 of 7".
- [x] Points copy always states the destination — never a bare number.
- [x] Accept/Decline and the celebration are written to be shared, not merely acknowledged: the client wants the student to commit publicly, with enthusiasm, and with Points for sharing.
- [x] **`celebration-dialog.tsx:156` says "Entirely optional".** That is verbatim the register Laura reported the client rejecting — "não apenas se você quiser". The analogy he used: going public with a relationship. Rewrite to invite, not to excuse.
- [x] Housing copy uses Residence and Shortlist and states that the housing office assigns.
- [x] Em dashes stripped where they are doing a comma's job — called out on the review call.
- [x] `docs/copy-inventory.md` updated for the strings that changed, not rewritten wholesale.

## Comments

**The one that mattered.** `celebration-dialog.tsx` no longer says "Entirely
optional". It now reads "Go public with it. You're joining Aster." / "Post it to
Facebook or LinkedIn and let people hear it from you. Worth 20 points toward
your bookstore credit." It is still optional in fact — nothing gates on it, and
closing the dialog leaves the acceptance recorded. What changed is that the
invitation stopped apologising for being made.

**Already true, verified not rebuilt:** no "About you" survives as a step name
in any string (only in a comment and in `steps.test.ts`, where it correctly
names the Phase); nothing says "step N of 7"; every Points figure names
bookstore credit; Housing says Residence, Shortlist, and that Housing Services
assigns.

**Em dashes:** four, all doing a comma's or a colon's job, all on screens this
round changed — the Offer's reassurance line, Housing's lead, and Completion's
two. Not a repo-wide sweep; the dash is used deliberately elsewhere.

**`copy-inventory.md` is round 4** and says at the top what was touched. The
Housing section was replaced outright because the screen it described no longer
exists; Offer, About you and Completion gained rows for what changed.
