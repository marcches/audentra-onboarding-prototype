# Design references: Mobbin is a gate, not a garnish

Every UI decision in this repo is made against real, cited references. This is a
gate on planning, not a step in implementation — by the time code is being
written the references should already be in the ticket.

## The rule

**No ticket enters `spec.md` without a `Referências` field carrying at least two
Mobbin links, each with one line saying what was taken from it.** A ticket
without that field is not planned yet, however clear it looks.

## How to search

- **Search by moment of UI, not by screen name.** "gamified onboarding checklist
  showing points earned" finds the answer; "university onboarding" does not. The
  strongest reference this project has found — Langdock's points-before-you-act
  checklist — would never have surfaced from a domain-shaped query.
- **Search before proposing a solution, not after.** A reference found afterwards
  is a justification, and it will always agree with whatever was already built.
- Use `mcp__mobbin__search_screens` (set `platform` to `web` or `ios`),
  `search_flows` for multi-step journeys, `search_sections` for marketing pages.
- Cite every screen as a markdown link to its `mobbin_url` so a human can open it.

## Where the record lives

- Per-ticket: the `Referências` field on the ticket itself.
- Per-component, with the reasoning: `docs/design-research.md`. Append to it in
  the round the research happens — a round that ships UI without adding to that
  file has skipped the gate.

## ReactBits

The same discipline applies to motion and personality: evaluate the ReactBits
catalogue alongside Mobbin, and justify the choice between plain shadcn and a
ReactBits treatment rather than defaulting to one for lack of looking.
