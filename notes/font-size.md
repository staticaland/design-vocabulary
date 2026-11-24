# Font size

The height of the box a font is designed in, called the em. It is not the height of any letter.

The name comes from metal type, where the size was the height of the metal block that carried a letter. The block had to be tall enough for the highest [[ascender]] and the lowest [[descender]], with a little to spare, so no single letter filled it. Digital fonts keep the idea: `font-size: 16px` sets the box to 16 pixels, and each letter takes up whatever share of the box its designer gave it.

That share differs from font to font. This is why two fonts at the same font size can look like different sizes, and why a number that worked for one font cannot be assumed to work for the next. What the eye judges is mostly the [[x-height]].

The CSS units follow from this. `1em` is the font size of the current element, and `1rem` is the font size of the root element.

Font size also does not set the distance between lines. That is [[line-height|line height]].

## Related

- [[x-height]]: what decides how big a font looks
- [[type-scale|Type scale]]: choosing a set of font sizes
- [[line-height|Line height]]
- [[type-vocabulary|Type vocabulary]]: a figure that compares two fonts at one size
