# Line length

The width of a block of text, counted in characters per line. Typographers call it the measure.

When lines are too long, the eye loses its place on the way back to the start of the next line, and reading becomes tiring. When they are too short, the eye has to jump back too often, and sentences are broken into fragments. The range usually recommended for body text is about 45 to 75 characters per line, spaces included.

On a wide screen, text that simply fills its container will go far past that. The fix is to limit the width of the text itself, not the page. In CSS, the `ch` unit is roughly the width of one character, so `max-width: 65ch` keeps a paragraph in range at any font size.

The range is for running text meant to be read in sequence. Headings, labels, and table cells follow other rules.

Line length and [[line-height|line height]] are set together: the longer the line, the more space between lines it needs.

## Flashcard

<details>
<summary>What line length is usually recommended for body text?</summary>

About 45 to 75 characters per line, spaces included.

</details>

## Related

- [[line-height|Line height]]
- [[ragged-edge|Ragged edge]]: the shape of the side where lines end
- [[practical-typography|Practical Typography]]: treats line length as one of the few decisions that matter most

