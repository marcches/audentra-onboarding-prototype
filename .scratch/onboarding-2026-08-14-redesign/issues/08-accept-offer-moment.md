# 08 — Accept-offer moment: bigger dialog + share + share-points

**What to build:** Grow the existing celebration dialog: larger footprint, existing confetti/headline treatment kept, with an added share prompt (Facebook/LinkedIn) using copy that leans into "publicly join this university" framing from the review call rather than a neutral "share if you'd like to" tone. Sharing awards points through the same points mechanism from #07 — a one-off award, not a step submission, so it needs its own small addition to the points total. The dialog must remain dismissible without sharing.

**Blocked by:** #07 (the share action needs the points mechanism to already exist so it can award into it).

**Status:** ready-for-human

- [x] Celebration dialog grows in size/prominence while keeping its existing confetti and headline animation.
- [x] Share prompt (Facebook/LinkedIn) uses inviting, "join publicly" framing rather than neutral share copy.
- [x] Sharing (simulated) awards points via the points mechanism from #07.
- [x] Dialog remains fully dismissible without sharing — no forced interaction.
- [x] `docs/review-script.md` gets a checklist entry: dialog dismissible without sharing, and sharing visibly adds points.

## Comments

Implemented. Dialog widened (`sm:max-w-[38rem]`, more padding, larger icon/headline), same confetti and letter-by-letter `SplitText` headline kept as-is. Added Facebook alongside the existing LinkedIn/X/WhatsApp/Copy, reordered so Facebook and LinkedIn lead (the call's specific ask), with copy that reads "Make it official — tell people you're joining Aster" instead of the old neutral "Tell people, if you want to." Every share action (including Copy) calls `patch("offer", { shared: true })`, which is idempotent against `totalPoints()`. A confirmation line ("+20 points added") appears once shared. Verified in-browser: dialog dismisses cleanly without sharing, Copy triggers the points confirmation and the rail total updates.
