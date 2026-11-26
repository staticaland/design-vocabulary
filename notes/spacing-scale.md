# Spacing scale

A short, fixed list of allowed distances that all [[padding]] and [[gap|gaps]] are chosen from.

A typical scale is 4, 8, 12, 16, 24, 32 (pixels), built on a 4px base unit. The steps grow as the values do, because the eye judges distances relatively: 4 versus 8 is obvious, 28 versus 32 is not.

A scale helps in two ways. It removes decisions (the question becomes "small, medium, or large?" not "13 or 14?"), and it makes differences meaningful: if two gaps differ, they differ by a whole step, so the difference is visible and intended.

The sign of a missing scale is many near-identical values: 10, 12, 14, 15, and 16 all in one screen.

## Flashcard

<details>
<summary>Why do the steps of a spacing scale grow as the values do?</summary>

The eye judges distances relatively. 4 versus 8 is obvious, and 28 versus 32 is not.

</details>

## Related

- [[grid|Grid]]: the base unit behind the scale
- [[type-scale|Type scale]]: the same idea applied to font sizes
- [[design-tokens|Design tokens]]: how a scale is named and shared
- [[proximity|Proximity]]: what the scale is used to express

