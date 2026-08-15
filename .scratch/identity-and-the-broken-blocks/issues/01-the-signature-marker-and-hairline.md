# 01 · The signature: a marker with three states, and one hairline

Status: todo

The identity returns in exactly two places, and the rule for where it may not go
is as much of this ticket as the rule for where it goes.

## The hairline

`--au-gradient: linear-gradient(115deg, #6a38ff 0%, #1e5bff 62%, #14a5d6 100%)`
already exists in the app as `.brand-gradient`. A 2px rule of it sits at the top
of the screen's **work sheet** — one per screen, never on the guide, never on a
second sheet. `Sections` grows a `signature` prop; the route that owns the work
passes it and nothing else does.

Costs no height that the sheet's own border was not already spending.

## The marker

`Section`'s numbered marker has two states today — `bg-ink-200` and mint — which
means "not started" and "being filled in right now" are the same grey. Three:

| State | Fill |
|---|---|
| Untouched | `bg-ink-200 text-ink-600` |
| In progress | `.brand-gradient`, white numeral |
| Done | `bg-mint-500`, white check |

"In progress" is **the first incomplete Section on the screen**, decided by the
sheet, not by the Section. A Section cannot know it is first, and asking focus
would make the marker a cursor rather than a state. `Sections` walks its children
and hands the answer down through context.

This is the rail's own grammar — grey / brand / mint — repeated one level in.

## Not this

- No eyebrow above the `h1`. The Phase is already named in the rail and in the
  title; a third voice saying it is stacking.
- No gradient on the action pill, the fields, or the chips.
- No second hairline anywhere on a screen that already has one.
