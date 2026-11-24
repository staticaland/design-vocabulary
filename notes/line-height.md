# Line height

The vertical distance from one [[baseline]] of text to the next. In print it is called leading, after the strips of lead that typesetters placed between lines.

Too little, and the lines crowd each other and the eye struggles to stay on one. Too much, and the lines drift apart and stop reading as a paragraph. For body text, a line height of about 1.4 to 1.6 times the font size is a common range.

The right value depends on two other things:

- **Font size:** large text needs proportionally less. A heading often sits at 1.1 to 1.25, and looks loose at a value that suits body text.
- **[[line-length|Line length]]:** long lines need more, because the eye has further to travel back and needs a clearer path to the start of the next line.

In CSS it is the `line-height` property. A unitless value such as `1.5` is the safe form, since it scales with the font size of whatever element inherits it.

Line height also sets the height of the box around a line of text, so it affects spacing and vertical centring. A single-line label with a generous line height carries extra space above and below that no [[padding]] value shows.

## Related

- [[line-length|Line length]]: the other half of comfortable body text
- [[baseline|Baseline]]
- [[type-scale|Type scale]]: each step usually has its own line height
- [[white-space|White space]]
