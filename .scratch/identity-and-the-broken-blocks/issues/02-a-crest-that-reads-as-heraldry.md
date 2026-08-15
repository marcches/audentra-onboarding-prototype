# 02 · A crest that reads as heraldry, not as an app icon

Status: todo

The client asked for "o símbolo de uma faculdade de verdade, pra simular como se
fosse real". Aster stays fictional — every fixture number in the prototype
derives from ADR 0005's ~7,000 undergraduates, and a real university's crest is
that university's registered trademark, which is an awkward thing to have on
screen when the demo is shown to a different university.

So the mark changes, not the institution. What makes the current one read as a
product logo is not that Aster is invented; it is that it is a violet→azure
gradient shield with a geometric eight-petal flower — the visual language of an
app icon.

## What it becomes

Real academic heraldry, at 36px:

- **Shield** with square shoulders drawn to a point, flat fill, no gradient.
- **Chief** — the band across the top — carrying the founding year.
- **Device** on the field: the aster survives as the institution's namesake, but
  drawn as a charge rather than as a logo mark.
- **An open book** below it, the commonest charge on a US collegiate arms.
- **Motto ribbon** under the point, with a Latin motto.

## Colour

Navy and gold, flat. Aster gets its own palette because Audentra owns
violet/azure/mint at the system layer, and two owners in the same colours is how
the distinction gets lost again.

The gold exists **inside the crest SVG and nowhere else**. It is not a token, it
does not enter `app.css`, and it must not be confusable with `amber-500`, which
means a warning.

## Also

`institution.founded` and `institution.motto` join the fixture, because a crest
that carries a year and a motto the rest of the app has never heard of is a
drawing rather than an institution.
