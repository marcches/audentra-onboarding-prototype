# 03 — Points with a destination

**What to build:** Replace the grey `+50` beside finished rail items with a
reward model that means something. Quests show progress in the rail; Points
animate at the moment they are earned into a single Balance at the top of the
rail (a chip in the header on mobile); the Balance is always denominated in
bookstore credit, so a number has a destination. Sharing from the celebration
still earns Points, as the client asked.

**Blocked by:** 01 — the Balance has one home and the shell defines it.

**Status:** done

**Referências:**
- [Langdock](https://mobbin.com/screens/065752db-06ad-4118-ad1c-8f95daa3f8a8) — points shown as `+10` *before* the task, a big fraction ring, and "complete tasks to earn points". The direct answer to what is wrong today.
- [Everyday Rewards](https://mobbin.com/screens/c0d07517-325a-4d5c-8663-575ade1f2f00), [Qantas](https://mobbin.com/screens/3685ad75-41b1-4520-9114-5d48576fa905), [Ulta](https://mobbin.com/screens/5e1db78b-5bb0-4336-841e-7ed0d962030f) — points are never a bare score; they are always distance to a named thing ("2000 more points to collect your reward").
- [Navan](https://mobbin.com/screens/d13f4a74-9b7b-478a-b563-41a0ef35afbe) — a single rewards balance living in the top chrome.
- [Portrait](https://mobbin.com/screens/21e83614-0f58-429c-a84b-8e811abb64e8) — locked future tasks as anticipation rather than as a price list.

- [x] No Points figure renders beside a rail item, earned or unearned. `Balance` is the only component that prints a Point; the per-group `{group.points} pts` chip in Review's summary went with it, for the same reason.
- [x] Exactly one Balance exists in the shell; it shows the Points total and its bookstore-credit equivalent. Rail: `125 pts` / `$20 bookstore credit ready`. Phone chip: `125 PTS · $20`, measured at 390px.
- [x] Completing a Quest animates the award from the point of action into the Balance, then rests. Measured in the browser: the token leaves (523, 415) — the button that was pressed — and lands on the Balance at (112, 123) in ~850ms.
- [x] The Balance states the distance to the next threshold, not just the total: `· 25 pts to $30`, and `50 pts to your first $10 bookstore credit` from zero.
- [x] Sharing from the celebration awards Points and shows the same animation — it goes through the same total, so it could not have been wired differently.
- [x] `points.ts` keeps the conversion rate in one place, marked as a fixture. `POINTS_PER_BLOCK` is derived from it, and `points.test.ts` asserts the two can't drift apart.
- [x] `prefers-reduced-motion` gets a non-animated award: the token appears just above the Balance, holds 1.1s, and goes. Verified under emulated `reduce` — the token's position does not change across the whole hold.

## Comments

### Delivered

**Where the award comes from.** Nothing calls an `award()` function. The provider
watches `totalPoints` and animates whenever it goes up, so every future
point-earning action is animated for free and none of them can forget to be. The
alternative — every submit handler firing an award beside its `patch` — is two
writes that have to agree, and the second is the one people forget.

**Where the provider lives.** Above `/onboarding`, not inside `StepShell`: the
click that earns a Point is usually the same click that navigates, and a
provider inside the step would be unmounted mid-flight. Confirmed in the
browser — the token completes its journey across a route change.

**The Balance lags the store by one flight.** `shownPoints` only catches up when
a token lands, so the number changes at the moment of arrival rather than before
the token has left. A loss (an edit un-signing the packet) is not an award and
doesn't fly — it just becomes true.

**Credit lands in whole $10 blocks** rather than accruing continuously, because
a continuous "$17.40 so far" has no next moment in it. That is what gives the
Balance a countdown to show, which is the thing Everyday Rewards / Qantas / Ulta
all do and the old `+50` did not.

### Left for other tickets

- Review's summary still prints per-step time and required/optional — ticket 05.
- The celebration's "Entirely optional" — ticket 06 owns that line. Only the
  Points half of that sentence was touched here, to name the destination.
