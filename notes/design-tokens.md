# Design tokens

Named values for a design's basic decisions (colours, spacing, font sizes, radii, shadows), defined once and referred to by name everywhere.

Instead of writing `#2563eb` or `16px` in fifty places, code refers to `color-action` or `space-4`. In CSS they are often custom properties: `var(--color-action)`.

Tokens come in layers. A **primitive** token names a raw value (`blue-600`). A **semantic** token names a purpose and points at a primitive (`color-action` → `blue-600`). Semantic tokens are what make "each colour means the same thing everywhere" enforceable.

A **one-off value** is the opposite: a literal typed directly into one component (`margin-top: 13px`). One-offs are how a [spacing scale](spacing-scale.md), [type scale](type-scale.md), or [palette](colour-palette.md) drifts, so a polish fix should use an existing token rather than add a new literal.

## Related

- [Spacing scale](spacing-scale.md), [Type scale](type-scale.md), [Colour palette](colour-palette.md): the systems that tokens encode
- [Visual polish](visual-polish.md)
