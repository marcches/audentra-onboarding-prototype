# Brand masters

The delivered Audentra identity, in vector. **These three files are the source of
truth.** Nothing here is served — `public/brand/` is, and every file in it is
generated from these by `scripts/brand-variants.mjs`.

| File | What it is |
| --- | --- |
| `audentra-symbol.svg` | The mark alone — the ribbon folded into an A. |
| `audentra-logo.svg` | The lockup: the mark *is* the A of AUDENTRA. |
| `audentra-logo-full.svg` | The signature: lockup over the tagline. |

## Regenerating

```sh
node scripts/brand-variants.mjs
```

Re-run it after replacing any master. The script also prints the path data the
React components in `src/components/wordmark.tsx` inline — if the geometry
changes, that file has to be updated from the same run, not by hand.

## Why the masters are not the served files

Two reasons, both about the delivered files being drawn for Illustrator rather
than for a page:

1. **Class names leak.** The masters carry their fills in a `<style>` block as
   `.cls-1` … `.cls-5`. Inline one in a document and those five rules apply to
   the whole page. The generated files carry `fill` on each shape instead.
2. **One colouring is not enough.** The identity needs at minimum an on-dark
   lockup, a knockout for saturated grounds, and a `currentColor` silhouette for
   use as material. Those are four colourings of the same geometry; hand-copying
   the geometry four times is how the variants drift apart.
