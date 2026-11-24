# x-height

The height of a font's small letters, measured from the [[baseline]] to the top of a flat lowercase letter such as `x`.

Most of what is read is lowercase, so the x-height does more than any other measurement to decide how big a font looks. Two fonts at the same [[font-size|font size]] can have quite different x-heights, and the one with the taller x-height looks larger and is usually easier to read at small sizes.

This is the usual cause when mixed fonts look mismatched: code inside a sentence that seems a size too big, or a new font that makes every label look smaller than before. The fix is to match the x-heights, not the font sizes. In CSS this is done by adjusting one font size by hand, or with `font-size-adjust`.

The letter `x` is used because its top and bottom are flat. Round letters go slightly past the line. See [[overshoot]].

The x-height is also what an icon is often centred on when it sits beside lowercase text.

## Related

- [[font-size|Font size]]: what the x-height is a fraction of
- [[cap-height|Cap height]]: the same measurement for capitals
- [[ascender|Ascender]], [[descender|Descender]]: the parts above and below it
- [[type-vocabulary|Type vocabulary]]: a figure that shows the line
