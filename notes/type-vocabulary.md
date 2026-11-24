---
type: map
---

# Type vocabulary

An entry point, not a concept. It shows the lines every letter is drawn against, and gathers the words needed to say what is wrong when text looks misaligned or the wrong size.

## The lines of a font

Every font is drawn against the same five lines. They are part of the font, set by its designer, and the letters keep their proportions to them at any size.

<figure data-figure="font-lines">
<figcaption>The site draws this figure live: the word "Hdxpo" in the font your browser uses for these notes, with each of the five lines measured and marked.</figcaption>
</figure>

## Same size, different size

Font size does not say how tall the letters are. Two fonts at the same font size can have different x-heights, and the one with the taller x-height looks bigger. Code inside a sentence is the usual case: the code font is often the taller one, so the code looks a size too large and sits heavily in the line.

The fix is to match the x-heights, not the font sizes.

<figure data-figure="x-height-match">
<figcaption>The site draws this figure live: a sentence with code in it, set twice in your browser's fonts. First with text and code at the same font size, then with the code scaled until its x-height meets the dashed line.</figcaption>
</figure>

In CSS the scaling can be done by hand, with a smaller font size on the code, or left to the browser with `font-size-adjust`.

## The terms

| Term | What it is | Where it matters |
| --- | --- | --- |
| [[baseline\|Baseline]] | The line the letters stand on. Text of different sizes and fonts on one row shares it. | A large number beside a small unit, or a heading beside a small link. |
| [[x-height]] | The height of the small letters, from the baseline to the top of `x`. It decides how big a font looks. | Mixing two fonts in one line, as in the figure above. |
| [[cap-height\|Cap height]] | The height of the capitals, from the baseline to the top of `H`. | What an icon or a badge is centred on when it sits beside a label in capitals. |
| [[ascender\|Ascender]] | The part of `d`, `b`, and `k` that rises above the x-height, often a little above the capitals. | Tight line heights, where ascenders touch the descenders of the line above. |
| [[descender\|Descender]] | The part of `p`, `g`, and `y` that hangs below the baseline. | A label with no descenders can look too high in its button, because the line still keeps room for them. |
| [[overshoot\|Overshoot]] | Round letters such as `o` go slightly past the baseline and the x-height, so that they look as tall as flat ones. | Measure a font on flat letters such as `x` and `z`, not on round ones. |
| [[font-size\|Font size]] (em) | The size of the box the font is designed in. It is not the height of any letter. | Why two fonts at 16px can look like different sizes. |
| [[line-height\|Line height]] | The distance from one baseline to the next. Print calls it leading. | Cells in a row need the same line height for their first lines to sit level. |
| [[font-weight\|Weight]] | How thick the strokes are: light (300), regular (400), medium (500). | A regular-weight word inside light text reads as bold. |
| [[typographic-colour\|Typographic colour]] | The overall greyness of a block of text. Even colour means nothing stands out by accident. | A heavier or larger font mixed into a paragraph makes a dark spot. The [[squint-test\|squint test]] shows it. |
| [[optical-alignment\|Optical alignment]] | Aligning by what the eye sees, not by the numbers. | The numbers can say two baselines match while the eye says one word sits low. |
| [[tabular-figures\|Tabular figures]] | Digits that all have the same width, so that numbers line up in a column. | Tables of numbers, and counters that would otherwise jitter as they change. In CSS, `font-variant-numeric: tabular-nums`. |

## Related

- [[typographic-hierarchy|Typographic hierarchy]], [[type-scale|Type scale]]: choosing sizes and weights, where this note is about measuring them
- [[line-length|Line length]]: the other measurement of a block of text
- [[practical-typography|Practical Typography]]: where to read more
