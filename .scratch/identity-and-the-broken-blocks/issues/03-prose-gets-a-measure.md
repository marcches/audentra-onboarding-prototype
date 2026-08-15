# 03 · Prose gets a measure

Status: todo

Measured on `who-we-call` at 1366×768: the FERPA paragraph sets at **89
characters per line** (577px at 13px). The same size of prose inside the guide
sets at **38**. The readable band is 45–75. Same system, same type, 2.3× apart.

That is the whole of "texto com o bloco quebrado ou inconsistente". A paragraph
20% past the reading limit cannot be rescued by the words inside it, and the
bold clause dropped into the middle of it has nowhere to land.

## The rule, in code

A `--measure-prose` token, and a `Prose` element that carries it. Prose inside a
Section stops tracking the sheet's width. Fields, lists, tables and drawn empty
states are unaffected — they were never the problem, and capping them would put
a 68ch limit on a two-column field grid.

## The rule, in writing

Four lines into `docs/copy-inventory.md`, beside the rules already there:

1. Prose inside a Section sets to a maximum of ~68ch regardless of sheet width.
2. Emphasis is a whole sentence or nothing.
3. A link never shares a line with the tail of a paragraph.
4. One block of prose per Section.

## Scope

All ten screens. Half a sweep is how this arrived at its third complaint: the
place that was pointed at gets fixed and the rest waits to be found.
