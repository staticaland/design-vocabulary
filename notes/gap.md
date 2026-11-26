# Gap

The space between sibling elements inside a container.

In CSS, `gap` is a property on flex and grid containers that puts equal space between children, and none before the first or after the last. More loosely, designers say "gap" for any space between neighbouring elements.

Gaps do the work of [[proximity]]: a small gap says "these belong together", a large one says "this is a new group". A layout with only one gap size has no grouping; a layout with too many has no system.

Setting spacing with `gap` on the parent, rather than margins on each child, keeps spacing decisions in one place.

## Flashcard

<details>
<summary>Where does the CSS <code>gap</code> property put space?</summary>

Between the children of a flex or grid container, with none before the first or after the last.

</details>

## Related

- [[padding|Padding]]
- [[spacing-scale|Spacing scale]]
- [[proximity|Proximity]]

