# AI Docs Access

> Placeholder — the single complete Markdown version is planned but not yet generated.

This page describes how AI agents can access the Simply.js documentation. The goal is a **single, complete Markdown file** covering the entire library, so an LLM can ingest everything in one request instead of crawling dozens of pages.

## Current Documentation Site

The interactive docs (for humans) live at:

```
https://simply.js.org/
```

- Human-readable, multi-page, docsify-based.
- Suitable for browsing, not ideal for LLM ingestion (many pages, navigation, embedded demos).

## Single Markdown Version (Planned)

> TBD — URL not finalized yet.

Once generated, AIs will fetch the entire documentation from one URL:

```
https://simply.js.org/docs/ai/simply.md   <!-- TBD -->
```

**Planned characteristics:**

| Field | Value |
| --- | --- |
| URL | `TBD` |
| Format | Single Markdown file (`.md`) |
| Content | All doc pages concatenated: component syntax, template, style, script, lifecycle, reactivity, state, router, REPL API, etc. |
| Encoding | UTF-8 |
| Caching | Stable — content changes infrequently, safe for AIs to cache |

**Planned table of contents (sections that will be included):**

1. Getting Started
2. Component Syntax (Structure, Template, Style, Script)
3. Template Syntax (Variables, Conditionals, Loops, DOM Events, Nested Components, Slot)
4. Script Syntax (Load Components, Communication, Lifecycle, Reactivity, State)
5. Style (Variables, Conditions, Scope & Encapsulation)
6. Router
7. Integrations (Framer, Electron)
8. REPL API (see [REPL API](repl-api.md))

## Suggested Usage for AI Agents

```bash
# Fetch the entire library documentation in one shot (TBD)
curl https://simply.js.org/docs/ai/simply.md   <!-- TBD -->
```

Then feed the response directly into the model context as a reference.

> TODO: Generate the single Markdown file from the docs source and publish it. The URL above is a placeholder.
