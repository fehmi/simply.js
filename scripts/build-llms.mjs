#!/usr/bin/env node
/**
 * build-llms.mjs
 *
 * Generates /llms.txt and /llms-full.txt for simply.js from the existing
 * docsify docs, using docs/sidebar.md as the single source of truth for
 * which pages exist and in what order.
 *
 * Usage:
 *   node scripts/build-llms.mjs
 *
 * Run this from the repo root. Zero dependencies (fits simply.js's own
 * "no build step" ethos) - just Node's fs/path.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, ".."); // repo root
const DOCS = path.join(ROOT, "docs");
const SITE = "https://simply.js.org";

// ---------------------------------------------------------------------------
// 1. Parse docs/sidebar.md into an ordered [{section, label, relPath}] list.
//    This is deliberately the ONLY source of truth for what gets included:
//    if a page isn't in the nav, it isn't "real" docs yet, so it's skipped.
// ---------------------------------------------------------------------------
function parseSidebar() {
  const raw = fs.readFileSync(path.join(DOCS, "sidebar.md"), "utf8");
  const lines = raw.split("\n");
  const items = [];
  let section = null;

  for (const line of lines) {
    const sectionMatch = line.match(/^- (?:<br>)?(.+)$/);
    const itemMatch = line.match(/^\s*-\s*\[(.+?)\]\((.+?)\)\s*$/);

    if (itemMatch) {
      items.push({ section, label: itemMatch[1], href: itemMatch[2] });
    } else if (sectionMatch) {
      section = sectionMatch[1].trim();
    }
  }
  return items;
}

// ---------------------------------------------------------------------------
// 2. Resolve a sidebar href ("docs/getting-started.md", "docs/") to an
//    on-disk file + a stable slug used for in-document anchors.
// ---------------------------------------------------------------------------
function resolveHref(href) {
  if (href === "docs/") {
    return { file: path.join(ROOT, "README.md"), slug: "about", relPath: "docs/" };
  }
  // Sidebar hrefs are relative to the repo root: "docs/getting-started.md"
  // or "ui/s-button.md". Resolve to the on-disk file + a stable slug.
  const withExt = href.endsWith(".md") ? href : `${href}.md`;
  return {
    file: path.join(ROOT, withExt),
    slug: withExt.replace(/\.md$/, "").replace(/\//g, "-"),
    relPath: withExt,
  };
}

// ---------------------------------------------------------------------------
// 3. Content cleanup: strip docsify/site-only constructs that make no sense
//    (or actively mislead) outside the interactive docsify site.
// ---------------------------------------------------------------------------
// Remove <s-component-viewer ...> live-widget tags, but ONLY outside fenced
// code blocks. The Component Viewer page documents the tag inside its own
// fenced examples, which must survive for LLMs. A viewer tag on its own line
// (the rendered widget) is stripped, leaving any code block that follows it.
function stripViewerOutsideFences(text) {
  const fence = /^\s*```/; // a line starting a (or closing a) fence
  let inFence = false;
  const lines = text.split("\n");
  const out = [];
  for (const line of lines) {
    if (fence.test(line)) {
      inFence = !inFence;
      out.push(line);
      continue;
    }
    if (!inFence) {
      // Strip the viewer tag pair / self-closing form on this line.
      out.push(
        line.replace(
          /<s-component-viewer[^>]*\/?>\s*<\/s-component-viewer>|<s-component-viewer[^>]*\/?>/gi,
          ""
        )
      );
    } else {
      out.push(line);
    }
  }
  return out.join("\n");
}

function cleanContent(text, { slugByRelPath }) {
  let out = text;

  // docsify tip/warning callouts: "?> ..." / "!> ..." -> plain blockquotes
  out = out.replace(/^\?>\s?(.*)$/gm, "> **Note:** $1");
  out = out.replace(/^!>\s?(.*)$/gm, "> **Warning:** $1");

  // <details><summary>Live demo</summary><repl-component .../></details>
  out = out.replace(
    /<details>\s*<summary>\s*<ins>?Live demo<\/ins>?\s*<\/summary>\s*<repl-component[^>]*\/?>\s*(<\/repl-component>)?\s*<\/details>/gi,
    "> _Interactive live demo on the docs site (not reproduced in this text export)._"
  );

  // any remaining standalone <repl-component .../> or <s-component-api ...></...>
  out = out.replace(/<repl-component[^>]*>(\s*<\/repl-component>)?/gi,
    "> _Interactive live demo on the docs site (not reproduced in this text export)._");
  out = out.replace(/<s-component-api[^>]*>(\s*<\/s-component-api>)?/gi,
    "> _Interactive component demo on the docs site (not reproduced in this text export)._");

  // <s-component-viewer ...> is a live preview widget (meaningless in text).
  // Strip it only OUTSIDE fenced code blocks — the Component Viewer doc page
  // legitimately shows the tag inside its own example code blocks, which we
  // keep. The example code block that follows a stripped viewer is preserved.
  out = stripViewerOutsideFences(out);

  // /#/playground -> absolute URL
  out = out.replace(/\]\(\/#\/playground\)/g, `](${SITE}/#/playground)`);

  // internal doc links: docs/xxx(.md)(#anchor) or ui/s-xxx(.md)(#anchor)
  // -> local anchor if known, else absolute URL
  out = out.replace(/\]\(((?:docs|ui)\/[^)#]+)(#[^)]*)?\)/g, (m, target, anchor) => {
    const norm = target.endsWith(".md") ? target : `${target}.md`;
    if (slugByRelPath.has(norm)) {
      return `](#${slugByRelPath.get(norm)})`;
    }
    return `](${SITE}/${norm})`;
  });

  return out.trim();
}

// ---------------------------------------------------------------------------
// 4. Build llms-full.txt
// ---------------------------------------------------------------------------
function buildLlmsFull(items) {
  const resolved = items.map((it) => ({ ...it, ...resolveHref(it.href) }));
  const slugByRelPath = new Map(resolved.map((r) => [r.relPath, r.slug]));

  const missing = resolved.filter((r) => !fs.existsSync(r.file));
  if (missing.length) {
    console.warn("WARNING: missing files referenced in sidebar.md:");
    missing.forEach((m) => console.warn("  -", m.relPath));
  }

  const toc = resolved
    .filter((r) => fs.existsSync(r.file))
    .map((r) => `- [${r.label}](#${r.slug})${r.section ? `  <!-- ${r.section} -->` : ""}`)
    .join("\n");

  const sections = resolved
    .filter((r) => fs.existsSync(r.file))
    .map((r) => {
      const raw = fs.readFileSync(r.file, "utf8");
      const cleaned = cleanContent(raw, { slugByRelPath });
      // demote the doc's own H1 to H2 so headings nest under our top-level title
      const demoted = cleaned.replace(/^#\s+/m, "## ");
      return `<a id="${r.slug}"></a>\n\n${demoted}`;
    });

  const header = `# simply.js — Full Documentation (LLM-ready, single file)

> Generated from https://github.com/fehmi/simply.js/tree/main/docs — do not edit by hand, edit the source .md files and re-run \`node scripts/build-llms.mjs\`.
> Canonical human docs: ${SITE} — Source: ${SITE}/llms.txt

## Contents

${toc}

---
`;

  return header + "\n" + sections.join("\n\n---\n\n") + "\n";
}

// ---------------------------------------------------------------------------
// 5. Build llms.txt (index, per https://llmstxt.org convention)
// ---------------------------------------------------------------------------
function buildLlmsTxt(items) {
  const bySection = new Map();
  for (const it of items) {
    const key = it.section || "Docs";
    if (!bySection.has(key)) bySection.set(key, []);
    bySection.get(key).push(it);
  }

  const descriptions = {
    "docs/": "What simply.js is, design goals, and how it works.",
    "docs/getting-started.md": "Add the script tag, create your first component, serve it locally.",
    "docs/component-structure.md": "The `<html>`/`<style>`/`<script>` single-file component format.",
    "docs/template.md": "The template tag and what the template engine supports.",
    "docs/style.md": "The `<style>` tag: scoping, variables, conditions.",
    "docs/script.md": "The `<script>` tag: the `class simply { ... }` shape.",
    "docs/variables.md": "Reactive `{{ }}` variables: data, props, state, methods, etc.",
    "docs/conditionals.md": "Conditional rendering in templates.",
    "docs/loops.md": "`each` loops over arrays/objects in templates.",
    "docs/dom-events.md": "Binding DOM events (`onclick`, etc.) in templates.",
    "docs/nested-components.md": "Composing components inside components.",
    "docs/slot.md": "Slot-based content projection.",
    "docs/loadcomponent.md": "Loading/registering components with `get()`.",
    "docs/component-communication.md": "Parent/child communication patterns.",
    "docs/props.md": "Passing props into components.",
    "docs/lifecycle.md": "Component lifecycle hooks.",
    "docs/reactivity.md": "How the reactive data layer works.",
    "docs/state.md": "Cross-component state management.",
    "docs/style-variables.md": "CSS variables driven by component state.",
    "docs/style-conditions.md": "Conditional CSS classes/styles.",
    "docs/style-scope.md": "Style scoping and Shadow DOM encapsulation.",
    "docs/router.md": "The `go` client-side router.",
    "docs/framer.md": "Using simply.js inside Framer.",
    "docs/electron.md": "Using simply.js inside Electron apps.",
    "docs/chrome.md": "Using simply.js to build Chrome extensions.",
    "docs/agents/agents.md": "Overview of how AI agents/LLMs can consume these docs and (planned) APIs.",
    "docs/agents/ai-docs.md": "Where to fetch machine-readable docs (this file's own index).",
    "docs/agents/repl-api.md": "Planned REPL API for programmatic example access (TBD, not live yet).",
  };

  let out = `# simply.js

> Zero-dependency web-component library for building interactive UIs with plain HTML, CSS and JavaScript. Single-file components (\`<html>\`/\`<style>\`/\`<script>\` in one \`.html\` file), a reactive template engine, router and state management. No compiler, bundler, or build step — everything runs directly in the browser.

Use this file to decide which page(s) to fetch. Every link is a plain Markdown file you can \`curl\`/fetch directly — this is a static site, no JavaScript execution required to read the docs. For one-shot ingestion of the whole library, fetch [llms-full.txt](${SITE}/llms-full.txt) instead of crawling page by page.

`;

  for (const [section, list] of bySection) {
    out += `## ${section}\n`;
    for (const it of list) {
      const url =
        it.href === "docs/" ? `${SITE}/docs/` : `${SITE}/${it.href}`;
      const desc = descriptions[it.href] ? `: ${descriptions[it.href]}` : "";
      out += `- [${it.label}](${url})${desc}\n`;
    }
    out += "\n";
  }

  out += `## Optional

- [Full documentation, single file](${SITE}/llms-full.txt): the entire library documentation concatenated into one Markdown file.
- [Examples gallery](${SITE}/docs/examples.md): links to the runnable examples in the \`examples/\` folder of the repo.
- [Playground](${SITE}/docs/playground.md): in-browser REPL to try simply.js without setting up a project.
- [Source repository](https://github.com/fehmi/simply.js): source code, issues, and the \`examples/\` folder referenced above.
`;

  return out;
}

// ---------------------------------------------------------------------------
function main() {
  const items = parseSidebar();
  const llmsFull = buildLlmsFull(items);
  const llmsTxt = buildLlmsTxt(items);

  fs.writeFileSync(path.join(ROOT, "llms-full.txt"), llmsFull, "utf8");
  fs.writeFileSync(path.join(ROOT, "llms.txt"), llmsTxt, "utf8");

  console.log(`Wrote llms.txt (${llmsTxt.length} bytes) and llms-full.txt (${llmsFull.length} bytes) to ${ROOT}`);
}

main();
