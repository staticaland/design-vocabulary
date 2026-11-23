# Alignment axis

An invisible vertical or horizontal line that several elements are anchored to.

Count the distinct left edges on a screen: every x-position where some element starts is one vertical axis. A page where the logo, heading, paragraph, form fields, and button all start at the same x has one axis. A page where each starts somewhere slightly different has five, and feels scattered.

Fewer axes means a calmer layout. An element that shares its axis with nothing else is said to *float*: it has no visible reason to be where it is.

To **anchor** an element is to give it that reason by putting it on an edge something else already uses.

## Related

- [[alignment|Alignment]]
- [[grid|Grid]]: a way to decide the axes in advance
- [[padding|Padding]]: a common cause of accidental extra axes, when nested containers each add their own inset
