# Alignment

Placing elements so that their edges or centres fall on a shared invisible line.

Elements can align on an edge (left, right, top, bottom), a centre line, or a text [[baseline]]. The eye is very good at detecting near misses: two things that almost line up look like a mistake, while two things that clearly do not line up look like a choice.

Alignment also carries meaning. Things on the same line read as belonging to the same set, so alignment is a quiet form of [[gestalt-principles|grouping]].

## Centre line

Elements of different sizes can share a centre instead of an edge. In a row of a tall panel, a small box, and a shorter panel, each item's vertical midpoint sits on the same horizontal line, so the row reads as one band even though the tops and bottoms differ. Stacked items can share a vertical centre line the same way.

Tools name it after the direction things move: "vertical centring", or "Align vertical centers" in Figma, for a row; "Align horizontal centers" for a stack. In CSS, `align-items: center` on a flex row centres the children on the cross axis.

A centre line is less visible than an edge, so it holds up best when the size difference is clear. Shapes that do not fill their box, like an arrow or an icon, may need [[optical-alignment|optical adjustment]] after measured centring.

## Related

- [[alignment-axis|Alignment axis]]: the invisible line itself
- [[grid|Grid]]: a system of predefined lines to align to
- [[ragged-edge|Ragged edge]]: what a failed edge looks like
- [[optical-alignment|Optical alignment]]: when aligned by the numbers is not aligned to the eye
