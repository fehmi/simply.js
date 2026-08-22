# Agents & AI

> This section explains how AI agents — LLMs, coding assistants, and agentic browser tools — can interact with Simply.js. All content here is a work in progress; endpoints and URLs marked as `TBD` are placeholders to be filled in as the backend is developed.

Simply.js exposes two main surfaces for AI agents:

## 1. Documentation Access

AIs can pull the full documentation as machine-friendly input instead of crawling the site.

- [AI Docs](ai-docs.md) — the documentation access URL and the planned single, complete Markdown version of the entire documentation for AI consumption.

## 2. REPL API

Programmatic access to the REPL's saved examples — listing, searching, saving, and reading them by id.

- [REPL API](repl-api.md) — endpoints for listing (with pagination), searching by keyword, saving new examples, and reading an example by id.

---

## Planned Capabilities

| Capability | Status |
| --- | --- |
| Single complete Markdown doc for AIs | TBD |
| List saved examples (pagination) | TBD |
| Search saved examples by keyword | TBD |
| Save a new example | TBD |
| Read an example by id | TBD |

---

## Design Goals (for AI consumers)

- **`curl`-friendly** — every endpoint should be callable with a plain `curl` from the terminal, no auth required (unless rate-limiting requires a key).
- **JSON everywhere** — consistent JSON request/response bodies, UTF-8 encoded.
- **Browser-ready URLs** — responses for saved examples include a URL an agentic browser tool can open directly.
- **No scraping needed** — the single Markdown doc is designed so an LLM can ingest the entire library in one fetch.

?> Everything on this page is a placeholder until the backend work lands. When endpoints are finalized, the `TBD` values below will be replaced with concrete URLs, parameters, and examples.
