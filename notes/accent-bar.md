# Accent bar

A thick strip of [[accent-colour|accent colour]] along one edge of a box, most often the left. Also called a side stripe.

It is a form of [[emphasis]]: the strip says "this box is different from the text around it". Callouts, notes, warnings, and quoted text are the usual places. In CSS it is a border on one side only, such as `border-left: 4px solid`, on a box that has a plain border or none on the other three.

It is not a hairline. A hairline is one pixel thin and usually neutral, and its job is to separate. An accent bar is a few pixels thick and coloured, and its job is to draw the eye.

The bar is cheap to add, which is why it is overused. Typical problems:

- **It spends the accent.** An accent colour works by being scarce. A bar on every [[card]] uses it for decoration, and weakens it where it marks something to act on.
- **It adds weight to one side.** The box looks heavier on the left than the right, and the bar sets up a second left edge beside the text's own. See [[visual-weight|visual weight]] and [[alignment-axis|alignment axis]].
- **It repeats what the box already says.** A background fill or a border already sets the box apart by [[common-region|common region]]. The bar says the same thing again.
- **It looks like a default.** Generated interfaces reach for it often, so a page with many of them reads as generic.

A bar earns its place when it carries meaning of its own, such as red for an error and yellow for a warning in a list of messages, or when it is the only thing marking the box and there is no fill or border.

> **Remove**
>
> Remove the accent bar from this box: the thick coloured strip along its left edge. Keep the background fill and the padding as they are, and do not add a border or a shadow in its place.

## Flashcard

<details>
<summary>How is an accent bar made in CSS?</summary>

With a thick border on one side only, such as `border-left: 4px solid`.

</details>

## Related

- [[accent-colour|Accent colour]]: what the bar is made of, and why it should be scarce
- [[emphasis|Emphasis]]: what the bar is for
- [[card|Card]]: where it is most often overused
- [[quieter|Quieter]]: the steering word for taking it away
