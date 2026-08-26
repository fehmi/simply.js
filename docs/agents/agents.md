# Agents & AI

> This section explains how AI agents — LLMs, coding assistants, and agentic browser tools — can interact with simply.js.

simply.js exposes two main surfaces for AI agents:

## 1. Documentation Access — live

AIs can pull the full documentation as machine-friendly Markdown instead of crawling the site.

- [AI Docs](ai-docs.md) — how to fetch `llms.txt` (index) and `llms-full.txt` (single complete Markdown file), and how individual pages are also directly fetchable.

## 2. REPL API — planned (TBD)

Programmatic access to the REPL's saved examples — listing, searching, saving, and reading them by id. Backend not implemented yet.

- [REPL API](repl-api.md) — endpoints for listing (with pagination), searching by keyword, saving new examples, and reading an example by id.

---

## Capabilities

| Capability | Status |
| --- | --- |
| Single complete Markdown doc for AIs (`llms-full.txt`) | ✅ Live |
| Docs index for AIs (`llms.txt`) | ✅ Live |
| List saved examples (pagination) | TBD |
| Search saved examples by keyword | TBD |
| Save a new example | TBD |
| Read an example by id | TBD |

---

## Design Goals (for AI consumers)

- **`curl`-friendly** — every endpoint should be callable with a plain `curl` from the terminal, no auth required (unless rate-limiting requires a key).
- **JSON everywhere** — consistent JSON request/response bodies, UTF-8 encoded, for the REPL API once it lands.
- **Browser-ready URLs** — responses for saved examples will include a URL an agentic browser tool can open directly.
- **No scraping needed** — `llms-full.txt` is designed so an LLM can ingest the entire library in one fetch; `llms.txt` lets it fetch only what's relevant.

?> The REPL API section is still a placeholder until that backend work lands. The documentation-access section above is live today.
