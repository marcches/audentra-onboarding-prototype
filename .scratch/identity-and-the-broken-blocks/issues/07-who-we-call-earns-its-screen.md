# 07 — Who we call earns its screen

Status: done

**What to build:** The shortest Step in the flow gets its text fixed, its empty
state drawn, and a rule behind the button that is already on it. It does **not**
get content invented to fill the sheet — that is the void with a border around
it, one more time.

**The FERPA block.** Today it is the worst-set paragraph in the flow: 89
characters per line, a bold clause opening and closing mid-sentence, and a link
welded to the tail of the last line with an orphan under it. Rewritten to the
four rules from ticket 02 — one block, at measure, emphasis on a whole sentence,
the link on its own line.

**The empty state.** "Nobody has access to your record." is a grey sentence
floating under a paragraph. It becomes a drawn empty state inside a Well: the
thing that is true, and the one action that changes it.

**Emergency contacts.** `Add another` is already on screen with no rule behind
it. One required, a second optional, capped at two. That is what U.S.
institutions collect, and a cap keeps a two-minute Step from becoming a list
manager.

If the screen still ends at y≈400 once its text is fixed, it ends there.

**Blocked by:** 02 (the prose measure and the four rules the FERPA block is
rewritten to), 01 (the void under this sheet is that ticket's).

**Referências:**
- [Oyster](https://mobbin.com/screens/0474c8d1-3b51-4c47-9f5f-b7de23b18f8c) — "Backup contact (optional)" carries a full field set under the required one, with a single `Add contact` at its foot. Exactly the shape of one required and a second optional, with the optionality said in the heading rather than in a footnote.
- [Jobber](https://mobbin.com/screens/0b87e9f7-02ee-41fb-a7ad-9c77ebc51452) — "Additional contacts" is a section whose header carries the add action and one line saying who belongs there. The secondary action lives in the Section header, which is where this system already allows one.
- [Tally](https://mobbin.com/screens/0f2523c5-d61e-4384-a934-c169dbb1eaeb) and [Typeform](https://mobbin.com/screens/12d883dc-d528-4003-8bed-12bab5a39af0) — the anatomy of a drawn empty state: a drawing, the true sentence, and exactly one action. Neither pads the space around it.

- [ ] The FERPA block is one block, at measure, with emphasis on a whole sentence and the link on its own line
- [ ] "Nobody has access to your record." becomes a drawn empty state inside a Well, carrying the one action that changes it
- [ ] One emergency contact is required and a second is optional, capped at two, with the invitation to add disappearing at two
- [ ] No content is invented to fill the sheet, and Ground under the sheet is accepted
- [ ] The Step still reads as two minutes of work
- [ ] `pnpm typecheck`, `pnpm test` and `pnpm lint` pass

## Comments

**Shipped.** The FERPA block is one `Prose` block at measure, the emphasis is a
whole sentence, and the link sits on its own line with a chevron.

**Where the delivery differs from the ticket.** The disclosure is a **list inside
a Well**, not a second paragraph. Rule 4 says one block of prose per Section, and
a progressively revealed second paragraph breaks it — but the substance of that
paragraph is three nouns (grades, bill, housing), and three nouns in a sentence
is a sentence you have to parse to find a list in. So the rule was applied rather
than worked around.

"Nobody has access to your record." is a drawn empty state inside a Well: a mark,
the true sentence, a line saying that leaving it that way is fine, and one
action. While the list is empty that action appears **only** in the empty state —
the same control twice on one Section makes the empty state read as decoration.

One contact required, a second optional, capped at two in `whoWeCallSchema` and
in the UI. Verified in the browser: adding a second removes the invitation and
adds a "Second contact (optional)" heading; removing it brings the invitation
back. The primary action counts both contacts, so a second added and left blank
reads as "3 fields to go" rather than failing into an error on Continue.

The screen still ends where the work ends, with Ground under it.
