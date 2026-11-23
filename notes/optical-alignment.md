# Optical alignment

Positioning an element so that it *looks* aligned or centred, even when measurement says it is not.

**Mathematical** (or metric) alignment places the element's bounding box: equal pixels on each side. **Optical** alignment places its perceived mass. The two differ whenever a shape does not fill its box evenly.

Standard examples:

- A play triangle centred by its box looks too far left, because most of its mass is on the left. It is nudged right.
- An icon beside text is centred on the height of the lowercase letters or capitals, not on the full line box, which includes empty space for descenders.
- Round shapes are drawn slightly larger than square ones to appear the same size.
- A logo with a long tail or flourish is centred on its main body.

The method is to start from the mathematical position and then adjust by eye, usually by a pixel or two.

## Related

- [Alignment](alignment.md)
- [Baseline](baseline.md)
- [Visual weight](visual-weight.md): the "mass" being balanced
