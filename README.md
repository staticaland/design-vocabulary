# design-vocabulary

Short notes on design vocabulary, one concept per note, linked to each other.

**Read them at <https://staticaland.github.io/design-vocabulary/>.** The site has a searchable list, a graph of how the notes connect, and a preview when hovering over a link.

The notes use Obsidian's `[[link]]` syntax, so the links do not work when browsing the files on GitHub. Use the site, or open this folder as a vault in [Obsidian](https://obsidian.md).

## Where to start

- [polish-ui](notes/polish-ui.md): the vocabulary needed to understand the [polish-ui skill](https://github.com/staticaland/skills/tree/main/plugins/polish-ui)
- [Type vocabulary](notes/type-vocabulary.md): the lines a font is drawn against, and the words for text that looks misaligned or the wrong size
- [Sources](notes/sources.md): the books, sites, and tools behind the collection
- [Steering words](notes/steering-words.md): words for the direction a design should move in, such as bolder, quieter, and distill

## How the notes work

- All notes live flat in [`notes/`](notes/). There are no folders or categories; structure comes from links.
- One concept per note. The file name is the term in kebab-case.
- Each note opens with a `# Title` and a one-sentence definition, explains the concept in a few short paragraphs, and ends with a `Related` list.
- Links between notes are written `[[file-name]]`, or `[[file-name|text to show]]`. A link without text shows the file name as it is.
- A note is a concept unless its frontmatter says otherwise. `type: steering-word` marks a word for directing a design, `type: source` marks a note about an outside book, site, or tool, and `type: map` marks an entry point that maps a source or topic to the notes that explain it.

## The site

The site is built from `notes/` by `site/build.mjs` and deployed to GitHub Pages by `.github/workflows/pages.yml` on every push to `main`. The build fails if a note links to a note that does not exist.

To preview locally:

```bash
npm install
```

```bash
npm run serve
```
