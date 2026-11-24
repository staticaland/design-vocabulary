# Tabular figures

Digits that all have the same width, so that numbers line up in columns.

In many fonts the default digits are proportional: a `1` is narrower than an `8`, as an `i` is narrower than an `m`. That suits numbers inside a sentence. In a column it does not, because the digits of one row no longer sit above the digits of the next, and the numbers become hard to compare.

Tabular figures fix this by giving every digit the same width. Where they are needed:

- **Tables of numbers:** prices, totals, and measurements, usually right-aligned so that units sit above units. See [[alignment-axis|alignment axis]].
- **Numbers that change in place:** timers, counters, and progress percentages. With proportional digits the text shifts sideways each time a digit changes.

In CSS they are turned on with `font-variant-numeric: tabular-nums`. The font has to include them. Many interface fonts do, and all monospaced fonts have them by nature.

## Related

- [[alignment|Alignment]], [[alignment-axis|Alignment axis]]
- [[type-vocabulary|Type vocabulary]]
