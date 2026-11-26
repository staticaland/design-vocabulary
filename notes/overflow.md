# Overflow

What happens when content is larger than the container meant to hold it.

Unhandled, overflowing content spills out: text runs over a neighbouring element, pokes past a card's border, or forces a horizontal scrollbar onto the page. It tends to appear only with real data (a long name, a translated string, an unbroken URL), which is why designs made with tidy placeholder text miss it.

There are three clean ways to handle it:

- **Wrap:** let the content flow onto more lines and the container grow taller.
- **Scroll:** keep the container's size and let the content scroll inside it.
- **Truncate:** cut the content short. See [[truncation]].

## Flashcard

<details>
<summary>Why do designs made with placeholder text miss overflow?</summary>

Overflow tends to appear only with real data, such as a long name or a translated string.

</details>

## Related

- [[truncation|Truncation]]
- [[padding|Padding]]: overflowing content often eats the padding first

