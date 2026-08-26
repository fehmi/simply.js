# AI Docs Access

This page describes how AI agents can access the simply.js documentation. There are three ways to do it, depending on what you need.

## 1. Single, complete Markdown file (recommended for one-shot ingestion)

Fetch the entire library documentation — every doc page, concatenated and cleaned up for plain-text reading — in one request:

```
https://simply.js.org/llms-full.txt
```

- Format: single Markdown file, UTF-8.
- Content: About, Getting Started, Component/Template/Script/Style syntax, Router, Framer/Electron/Chrome integrations, and this Agents section — in the same order as the site's sidebar.
- Interactive live-demo widgets embedded in the human docs are replaced with a short note (they can't be represented as plain text); everything else is kept.
- Stable and cacheable — content only changes when the docs change.

```bash
curl https://simply.js.org/llms-full.txt
```

## 2. Index file (recommended if you only need part of the docs)

```
https://simply.js.org/llms.txt
```

Follows the [llms.txt](https://llmstxt.org) convention: a short project summary plus a categorized list of links to every doc page, each with a one-line description, so you can fetch only the section(s) relevant to the task instead of the whole file.

```bash
curl https://simply.js.org/llms.txt
```

## 3. Individual pages

The docs site is fully static (docsify + GitHub Pages), so every page is also fetchable directly as raw Markdown, no JavaScript execution needed:

```
https://simply.js.org/docs/<page>.md
```

e.g. `https://simply.js.org/docs/router.md`, `https://simply.js.org/docs/component-structure.md`. Useful when you already know exactly which page you need and don't want the rest.

## Current Documentation Site (for humans)

The interactive docs live at `https://simply.js.org/` — human-readable, multi-page, docsify-based, with live in-browser demos. Good for browsing; the three options above are better suited for LLM ingestion.

## Suggested Usage for AI Agents

```bash
# Get an index first, then fetch what you need
curl https://simply.js.org/llms.txt

# Or just pull everything in one shot
curl https://simply.js.org/llms-full.txt
```

Feed the response directly into the model context as reference material before writing simply.js code.

> Source: both `llms.txt` and `llms-full.txt` are generated from the same docs source with `scripts/build-llms.mjs` in the [repo](https://github.com/fehmi/simply.js) — see that script if a page looks stale.
