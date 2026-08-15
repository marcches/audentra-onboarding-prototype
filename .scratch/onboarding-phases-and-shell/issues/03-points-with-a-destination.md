# 03 — Points with a destination

**What to build:** Replace the grey `+50` beside finished rail items with a
reward model that means something. Quests show progress in the rail; Points
animate at the moment they are earned into a single Balance at the top of the
rail (a chip in the header on mobile); the Balance is always denominated in
bookstore credit, so a number has a destination. Sharing from the celebration
still earns Points, as the client asked.

**Blocked by:** 01 — the Balance has one home and the shell defines it.

**Status:** ready-for-human

**Referências:**
- [Langdock](https://mobbin.com/screens/065752db-06ad-4118-ad1c-8f95daa3f8a8) — points shown as `+10` *before* the task, a big fraction ring, and "complete tasks to earn points". The direct answer to what is wrong today.
- [Everyday Rewards](https://mobbin.com/screens/c0d07517-325a-4d5c-8663-575ade1f2f00), [Qantas](https://mobbin.com/screens/3685ad75-41b1-4520-9114-5d48576fa905), [Ulta](https://mobbin.com/screens/5e1db78b-5bb0-4336-841e-7ed0d962030f) — points are never a bare score; they are always distance to a named thing ("2000 more points to collect your reward").
- [Navan](https://mobbin.com/screens/d13f4a74-9b7b-478a-b563-41a0ef35afbe) — a single rewards balance living in the top chrome.
- [Portrait](https://mobbin.com/screens/21e83614-0f58-429c-a84b-8e811abb64e8) — locked future tasks as anticipation rather than as a price list.

- [ ] No Points figure renders beside a rail item, earned or unearned.
- [ ] Exactly one Balance exists in the shell; it shows the Points total and its bookstore-credit equivalent.
- [ ] Completing a Quest animates the award from the point of action into the Balance, then rests.
- [ ] The Balance states the distance to the next threshold, not just the total.
- [ ] Sharing from the celebration awards Points and shows the same animation.
- [ ] `points.ts` keeps the conversion rate in one place, marked as a fixture, so a real rate replaces it without a shape change.
- [ ] `prefers-reduced-motion` gets a non-animated award.

## Comments
