# simply.js

Zero-dependency web-component library. Docs site (docsify) + library source live in the same repo, deployed as-is via GitHub Pages (`CNAME` → simply.js.org). No build step, no bundler, no `package.json` at the root.

## If you're writing an app *with* simply.js

Don't rely on training data — fetch the current docs instead:

- `https://simply.js.org/llms.txt` — index of every doc page with a one-line description.
- `https://simply.js.org/llms-full.txt` — the entire documentation in one Markdown file (preferred for one-shot context loading).

These cover the component/template/script/style syntax, router, state management, and Framer/Electron/Chrome integrations. Don't duplicate that content here.

## Repo layout

- `simply.js` / `simply.min.js` — the library. `simply.min.js.map` is committed alongside it; there is no in-repo minify script, so if you edit `simply.js`, regenerate the minified build with whatever minifier you have available and keep the two in sync manually.
- `docs/` — docsify source for simply.js.org. `docs/sidebar.md` is the nav **and** the source of truth for `scripts/build-llms.mjs` — a page not linked in `sidebar.md` will not appear in `llms.txt`/`llms-full.txt`.
- `docs/agents/` — the AI/agents-facing docs (this area). Keep `agents.md` / `ai-docs.md` in sync with reality; don't leave stale `TBD`s once something ships.
- `scripts/build-llms.mjs` — regenerates `llms.txt` and `llms-full.txt` from `docs/`. Run `node scripts/build-llms.mjs` from the repo root after any docs change, before deploying. Zero dependencies (Node core only).
- `components/` — design-system component explorations (WIP, not all linked from the docs nav yet).
- `ui/` — the shadcn-based UI component system (native CSS, no Tailwind). **Read `ui/README.md` before working here** — it documents the architecture, decisions, component-authoring conventions, and critical simply.js gotchas (shadow DOM default + `light` opt-out + native `<slot>`, `:host-context(.dark)`, `{{...}}` syntax, etc.).
- `examples/` — numbered, runnable examples (plain static HTML/JS; open directly or serve with any static file server).
- `repl/` — the `<repl-component>` playground/REPL widget embedded in the docs.
- `vscode-ext/` — VS Code syntax highlighting extension for `.html` single-file components.

## Conventions

- Docs are plain Markdown with docsify extensions: `?> text` renders as a tip, `!> text` as a warning. Keep using these in `docs/*.md` — `scripts/build-llms.mjs` converts them to plain blockquotes automatically for the LLM-facing output.
- Internal doc links use `docs/xxx.md` (relative to repo root), matching the docsify alias config in `index.html`. The build script rewrites these to in-page anchors in `llms-full.txt` — don't hand-edit that file.
- `<repl-component id="...">` embeds a live demo tied to a saved example id (see `docs/agents/repl-api.md` for the planned API). These are stripped to a placeholder note in `llms-full.txt` since they can't be reproduced as static text.

## Before committing

- If you added/renamed/removed a `docs/*.md` page, update `docs/sidebar.md` and re-run `node scripts/build-llms.mjs`, then commit the regenerated `llms.txt` / `llms-full.txt` alongside your change.
- Don't hand-edit `llms.txt` or `llms-full.txt` directly — edit the source page and the sidebar, then regenerate.
