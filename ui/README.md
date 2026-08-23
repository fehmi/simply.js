# Simply UI — Component System

A shadcn-based UI component system for simply.js, built with **native CSS**. Zero-dependency, no build, no Tailwind.

This file is a **living document** for both humans and AI agents. Update it as new decisions, verified patterns, and components are added.

---

## 1. Architecture — 3 Layers

| Layer | File | Content |
|---|---|---|
| **1. Raw tokens** | `tokens.css` | OKLCH color palette (full Tailwind v4 palette), `--spacing`, typography, radius, shadow, easing + **semantic aliases** (`--color-primary: var(--primary)`) |
| **2. Semantic theme** | `theme.css` | `:root` + `.dark` blocks with `--primary`, `--background`, `--foreground`… + base reset. The variable blocks live in `theme-vars.css` (imported) so docs pages can load tokens without the reset |
| **3. Component styles** | each `.html`'s `<style>` block | variant/size/state styles, consuming tokens via `var(--color-*)` / `var(--spacing)` / `var(--radius-*)` |

**Where does CSS live?**
- **Global**: tokens + theme (`tokens.css`, `theme.css`) — loaded once, consumed by all components.
- **Per-component**: each component's `<style>` block — loaded lazily when the component loads, contains its own variant/size/state styles.
- Rationale: shadcn philosophy (self-contained, copy-paste friendly components); theming works everywhere via global tokens.

---

## 2. Folder Structure

```
ui/                    # at repo root
  tokens.css           # Layer 1 — raw tokens + semantic aliases (FULL palette)
  theme.css            # Layer 2 — semantic theme (default: vega/neutral) + reset
  theme-vars.css       # Layer 2 — `:root`/`.dark` variable blocks ONLY (no reset)
                       #   imported by theme.css; loaded directly on docs pages
  themes/              # Theme system — one file per theme (easy add/modify)
    nova.css           #   [data-theme="nova"] — Geist font
    maia.css           #   [data-theme="maia"] — Figtree font
    lyra.css           #   [data-theme="lyra"] — JetBrains Mono font
    mira.css           #   [data-theme="mira"] — Inter font (same as vega)
    luma.css           #   [data-theme="luma"] — Inter font (same as vega)
    sera.css           #   [data-theme="sera"] — taupe colors + Noto Sans/Playfair
    rhea.css           #   [data-theme="rhea"] — Inter font (same as vega)
  s-button.html        # Layer 3 — button component
  s-badge.html         # Layer 3 — badge component
  s-label.html         # Layer 3 — label component
  s-separator.html     # Layer 3 — separator component (orientation prop)
  s-skeleton.html      # Layer 3 — skeleton component (pulse animation)
  s-component-viewer.html  # Layer 3 — live preview tool (param editing + dark/theme)
  index.html           # demo/showcase page (includes theme switcher)
  README.md            # this file
```

References:
- `components/shadcn-original/` — original shadcn monorepo (CLI + registry). Component source is fetched from the `shadcn-ui/ui` GitHub repo at runtime.
- `components/ignore/` — old experiments (ignore).
- `components/shadcn-css-main/` — **DELETED** (2026-08-23). Original shadcn values are used instead.

---

## 3. Decisions Log

| Date | Decision | Detail |
|---|---|---|
| 2026-08-23 | **Color space: OKLCH** | Sustainable hover/alpha via `color-mix(in oklab, ...)` |
| 2026-08-23 | **Dark mode: `.dark` class** | Toggled on `<html>` |
| 2026-08-23 | **Folder: `ui/` at repo root** | Not under `components/` |
| 2026-08-23 | **Prefix: `s-`** | `s-button`, `s-input`, `s-card`… |
| 2026-08-23 | **Palette: FULL palette** | All OKLCH colors from shadcn-css-main tokens.css |
| 2026-08-23 | **Reference: original shadcn** | `shadcn-css-main/` deleted. Values from `shadcn-ui/ui` GitHub `apps/v4/registry/styles/style-vega.css` (main branch) |
| 2026-08-23 | **Default variant: `default`** | Original shadcn naming (NOT `primary`) |
| 2026-08-23 | **Size names: `xs`, `sm`, `default`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`** | Original shadcn |
| 2026-08-23 | **Slot: `isolated` + native `<slot>`** | `simply-slot` is OLD API. `isolated` attribute + `:host` style + native `<slot>` |
| 2026-08-23 | **Shadow DOM (isolated)** | Components render in shadow DOM with `isolated` |
| 2026-08-23 | **Theme system: `data-theme` + `themes/`** | 8 shadcn themes (Vega/Nova/Maia/Lyra/Mira/Luma/Sera/Rhea). Most share neutral colors + different fonts; Sera is taupe. `theme.css` default (vega), `themes/*.css` override |
| 2026-08-23 | **Font/line-height tokens** | Components use `--text-*--line-height` (original `text-sm`/`text-xs` line-heights) — dimension differences were font-related |
| 2026-08-23 | **Component tokens** | Component sizes/radii use `--button-*`, `--badge-*`, `--label-*` tokens (vega defaults in `theme.css`). Themes override them — CSS custom properties cross the shadow boundary |
| 2026-08-23 | **Docs: English only** | All documentation, comments, and README in English |

---

## 4. Component Authoring Guide

Each component is a single `.html` file: `<html>` + `<style>` + `<script>`.

### Template (`<html>`)

```html
<html>
  <button
    class="s-button"
    data-variant="{{props.variant || 'default'}}"
    data-size="{{props.size || 'default'}}"
    ?disabled="{{props.disabled === '' || props.disabled}}"
  >
    <slot>Button</slot>
  </button>
</html>
```

- **`{{...}}` double braces REQUIRED** (single `{}` renders literally).
- **Variant/size**: public props `variant`/`size` → bound to `data-variant`/`data-size` attributes on the inner element → CSS `[data-variant="..."]` selectors.
- **Slot**: native `<slot>fallback</slot>`. Add `isolated` attribute on usage; content passed as children.
- **Boolean**: `?attr="{{...}}"` toggle. `disabled` attribute arrives as `""` (empty string) → `?disabled="{{props.disabled === '' || props.disabled}}"` required.

### Style (`<style>`)

```css
:host {
  display: contents;   /* host doesn't affect layout; inner element controls */
}

.s-button {
  display: inline-flex;
  ...
  color: inherit;              /* override UA buttontext (black) */
  background-color: transparent; /* override UA buttonface (white) */
  ...
}

/* Variants */
.s-button[data-variant="default"] { ... }

/* Dark mode tweaks — :host-context(.dark) REQUIRED */
:host-context(.dark) .s-button[data-variant="destructive"] { ... }
```

- **`:host`** root style (host display, etc.).
- **Dark mode**: `.dark .s-button` selectors DON'T work in shadow DOM → use **`:host-context(.dark)`**.
- **Hover/alpha**: `color-mix(in oklab, var(--color-primary) 80%, transparent)`.
- **Dimensions**: `calc(var(--spacing) * N)`.

### Script (`<script>`)

```js
class simply {
  data = {
    doc: {
      name: "s-button",
      description: "...",
      props: {
        variant: { options: [...], default: "default" },
        size: { options: [...], default: "default" },
        disabled: { default: false }
      }
    }
  }
}
```

- **NO comment BEFORE `class simply`** (JSDoc block breaks the component).
- **Don't define `props = {...}` in class** — it overrides inline attributes. Provide defaults via template fallbacks.
- `data.doc.props` metadata feeds the component-viewer (future).

### Usage

```html
<s-button isolated variant="default">Click me</s-button>
<s-button isolated size="icon">★</s-button>
<s-button isolated disabled>Disabled</s-button>
```

---

## 5. Critical simply.js Gotchas (Verified)

1. **`{{...}}` double braces REQUIRED** — simply.js L31 `t.replace(/\{\{([\s\S]*?)\}\}/g, '${$1}')`. Single `{}` renders literally.
2. **JSDoc comment BEFORE `class simply` BREAKS the component** — `getClass` regex `/^class\s+(simply\s*)?\{/` uses `^` anchor; a leading `/** ... */` prevents the rename → `SyntaxError: Identifier 'simply' has already been declared`.
3. **Class `props = {...}` OVERRIDES inline attributes** — docs: "prop changes inside script overrides inline attributes". Provide defaults via template fallbacks.
4. **`disabled` attribute arrives as `""` (empty string)** — `?disabled="{{props.disabled === '' || props.disabled}}"` required.
5. **Slot: `simply-slot` is OLD API** — use `isolated` + native `<slot>`. `isolated` attribute is added on the component tag (usage), not via settings.
6. **`.dark .s-button` selectors DON'T work in shadow DOM** — regular selectors can't cross the shadow boundary. Use **`:host-context(.dark)`**.
7. **`<button>` UA default colors leak** — `color: buttontext` (black) + `background-color: buttonface` (white). `theme.css` reset + `color: inherit; background-color: transparent` in `.s-button` base required.
8. **`getComputedStyle` timing** — after toggling `.dark` or `data-theme`, the first read may return stale values; the second read is correct. Test timing issue, not a real bug.
9. **NEVER store DOM elements in reactive `data`** — `data` is an ObservableSlim proxy; assigning a DOM element (`data.comp = el`) wraps it in a proxy → `RangeError: Maximum call stack size exceeded` (ObservableSlim iterates the element's circular refs) and method calls like `el.setAttribute()` throw `Illegal invocation` (wrong `this`). Store element refs on `methods` (plain per-instance object) instead: `methods.comp = el`.
10. **`data.doc` is a proxy** — reading `el.data.doc` returns an ObservableSlim proxy; iterating it (e.g. building controls) can recurse infinitely. Copy it first: `JSON.parse(JSON.stringify(el.data.doc))`.
11. **`data` is set on connect, not constructor** — `document.createElement(tag).data` is `undefined` until the element is appended to the DOM. To read `data.doc` for metadata, temporarily `document.body.appendChild(el)`, read, then `el.remove()`.
12. **Set preview props via `comp.props[key] = value`, not `setAttribute`** — attribute observation doesn't pick up all props (e.g. `disabled`). Direct prop assignment triggers re-render reliably.
13. **Slot content via `simply.unsafeHTML(value)`** — returns a `DocumentFragment`; `comp.innerHTML = ""` then `comp.appendChild(simply.unsafeHTML(value))` sets slot children (supports HTML).

---

## 6. Theming / Sizing / Spacing

### Theming
- OKLCH color space. Raw palette → semantic token mapping (`tokens.css`: `--color-primary: var(--primary)`).
- `.dark` class on `<html>` → `theme.css` `.dark { --primary: ... }` override.
- Components consume `var(--color-*)` aliases.
- `--radius: 0.625rem` base + derived `--radius-sm/md/lg/xl` (via calc).

### Theme System (8 shadcn themes)
- **`theme.css`** is the default theme (Vega = neutral colors + Inter font) — in `:root`/`.dark`.
- **`themes/*.css`** additional themes — override via `[data-theme="..."]` selector.
- **Theme selection**: `<html data-theme="nova">` (or remove `data-theme` attribute → vega).
- **8 themes**: Vega (default), Nova (Geist), Maia (Figtree), Lyra (JetBrains Mono), Mira (Inter), Luma (Inter), Sera (taupe + Noto Sans/Playfair), Rhea (Inter).
- **Most themes share neutral colors** — difference is font + **component sizes/radii**.
- **Component tokens**: each component's dimensions use `--button-height-default`, `--button-radius`, etc. (vega defaults in `theme.css`). Each theme overrides these in `themes/*.css`. CSS custom properties cross the shadow boundary → works in shadow DOM.
- **Add a theme**: create `themes/xxx.css` → `[data-theme="xxx"] { --font-sans: ...; --button-height-default: ...; }` (+ color overrides if different).
- **Modify a theme**: edit the relevant `themes/*.css` file.
- **Dark mode**: `.dark` class — theme-specific dark overrides like `[data-theme="sera"].dark { ... }`.

### Theme-based Button sizes (verified)
| Theme | default h | radius | font |
|---|---|---|---|
| Vega | h-9 (36px) | rounded-md (8px) | 14px |
| Nova | h-8 (32px) | rounded-lg (10px) | 14px |
| Maia | h-9 (36px) | rounded-4xl (32px) | 14px |
| Lyra | h-8 (32px) | rounded-none (0) | 12px |
| Mira | h-7 (28px) | rounded-md (8px) | 12px |
| Luma | h-9 (36px) | rounded-4xl (32px) | 14px |
| Sera | h-10 (40px) | rounded-none (0) | 12px |
| Rhea | h-8 (32px) | rounded-2xl (16px) | 14px |

### Sizing
- `--spacing: 0.25rem` base unit; all dimensions `calc(var(--spacing) * N)`.
- Button sizes (main branch): xs `h-6` (24px), sm `h-8` (32px), default `h-9` (36px), lg `h-10` (40px), icon `size-9`, icon-xs `size-6`, icon-sm `size-8`, icon-lg `size-10`.
- Typography `--text-*` tokens + **`--text-*--line-height`** (original line-heights — dimension differences were font-related).

### Spacing
- Same `--spacing` scale; padding/gap/margin all `calc(var(--spacing) * N)`.
- Consistent scale: 0.5, 1, 1.5, 2, 2.5, 3, 4, 6, 8, 10, 12…

---

## 6b. Docs Integration (component viewer on docsify pages)

The component viewer is embedded in the docs pages (`docs/ui/*.md`) via `<s-component-viewer isolated component="ui/s-button">`.

- **Root `index.html`** (docsify shell) loads the viewer globally: `get("ui/s-component-viewer.html")` inside the `loadJS("simply.js", ...)` callback.
- **Theme tokens on docs pages**: root `index.html` `<head>` loads `ui/tokens.css` + `ui/theme-vars.css` + `ui/themes/*.css`. `theme-vars.css` (NOT `theme.css`) is used because `theme.css`'s aggressive reset (`* { margin:0; padding:0 }`, `a { color: inherit }`, `ul,ol { list-style: none }`) would break docsify's styling.
- **`component` prop accepts full or relative URLs** — the last path segment is used as the tag name. On docs pages use `"ui/s-button"` (relative to repo root; docsify keeps the URL at root so `fetch` resolves correctly).
- **Viewer dark-mode behavior**: opens in **dark mode by default** (`afterConstruct` adds `.dark` to `<html>`). The viewer's own UI is **always dark** (fixed `--cv-*` colors in its shadow CSS, radius 0) — only the **preview area** follows the light/dark theme. The toggle button label reflects the current mode (`{{data.dark ? 'Light' : 'Dark'}}`).
- **Multiple viewers stay in sync**: dark/light + theme are page-global. Each viewer sets up a `MutationObserver` on `<html>`'s `class`/`data-theme` attributes and syncs its `data.dark`/`data.theme` — so toggling in one viewer updates all viewers' labels + theme selects. `.cv-preview` sets `color: var(--color-foreground)` so preview content (e.g. label with `color: inherit`) follows the theme instead of the always-dark chrome (fixes white-on-white in light mode).
- **Keep `theme-vars.css` in sync** with the `:root`/`.dark` blocks in `theme.css` when adding tokens.

---

## 7. Verification Workflow

1. Serve: `python3 -m http.server 8000` (repo root) → `http://localhost:8000/ui/index.html` (NOT `/simply/ui/...` — that's the Apache path).
2. Check in browser:
   - All variants render correct colors (light + dark)
   - All sizes render correct dimensions
   - Hover/focus-visible/disabled/active states
   - `{{...}}` not rendered literally (no broken `{}`)
   - Dark toggle → theme changes with `.dark` class
   - Slot children project correctly
3. `get_errors` on new files — no errors.

---

## 8. Component Curriculum (Easy to Hard)

Progressive progression: each component teaches the **decisions and patterns** needed by the next. Don't skip levels.

### ✅ Level 0 — Foundation (done)

- [x] **Button** — base pattern: `isolated` + native `<slot>`, variant/size `data-*` attributes, `:host-context(.dark)`, token consumption, `color-mix` hover, focus/disabled/active states.

### Level 1 — Basic styles (reinforces button pattern, no new patterns)

- [x] **Badge** — variants (default/secondary/outline/destructive/ghost/link), pill radius (`rounded-4xl`), `w-fit`, `:host-context(a)` link hover. Reinforces what Button taught.
- [x] **Label** — form label, `for` passthrough, `disabled` prop, `:host-context([data-disabled])`. **New: form association.** (Note: `peer-disabled` done via `disabled` prop since sibling selectors don't work in shadow DOM.)
- [x] **Separator** — orientation (horizontal/vertical), `decorative` prop (`role="none"` vs `role="separator"`), `align-self: stretch` for vertical in flex containers. **New: orientation prop.** No slot → `isolated` is optional; `s-separator { display: contents }` in the style handles the light-DOM host (so vertical `align-self: stretch` works without shadow DOM).
- [x] **Skeleton** — loading placeholder, `bg-accent` + `rounded-md` + `animate-pulse` (opacity 1↔0.5, 2s, `cubic-bezier(0.4,0,0.6,1)`). **New: animation tokens.** No props, no slot. Host is the sizeable box (`display: block`, default `width:100%; height:1rem`); inner div fills it (`width/height:100%`) and inherits radius (`border-radius: inherit`) so users size via inline styles on the tag.
- [ ] **Skeleton** — pulse animation. **New: animation tokens.**

### Level 2 — Form controls (state + focus + validation)

- [ ] **Input** — form control, focus ring, placeholder, `aria-invalid`, disabled. **New: form state, validation.**
- [ ] **Textarea** — multi-line, resize. **New: resize, min-height.**
- [ ] **Checkbox** — checked state, label association. **New: interactive state, change event.**
- [ ] **Switch** — checked state, transition. **New: toggle animation.**
- [ ] **Radio Group** — group state, name, arrow key nav. **New: group coordination, keyboard nav.**

### Level 3 — Composite components (multi-part)

- [ ] **Card** — header/title/description/content/footer. **New: named slots, composite structure.**
- [ ] **Table** — thead/tbody/row/cell. **New: table structure.**
- [ ] **Tabs** — list/trigger/content, active state, roving tabindex. **New: state + a11y keyboard nav.**

### Level 4 — Overlays & positioning (hardest)

- [ ] **Tooltip** — hover/focus trigger, positioning, delay. **New: overlay, positioning.**
- [ ] **Popover** — overlay, outside-click close. **New: overlay management.**
- [ ] **Dropdown Menu** — complex overlay, keyboard nav, focus management. **New: menu a11y.**
- [ ] **Dialog** — modal, focus trap, escape, portal. **New: modal, focus trap.**
- [ ] **Select** — popover + form value, keyboard nav. **New: combobox pattern.**

### Level 5 — Advanced

- [ ] **Accordion** — expand/collapse, height animation. **New: collapsible.**
- [ ] **Slider** — range input, drag. **New: pointer interaction.**
- [ ] **Toast** — portal, queue, animations. **New: notification system.**
- [ ] **Progress** — bar, value display. **New: value display.**

---

## 9. Next Steps

> **Golden rule**: We build new features as needed.

- [ ] **Continue Level 2: Input** — the next component teaching form state, focus, and validation.
- [x] **Component-viewer** — `s-component-viewer.html` done. Live preview with parameter editing + dark/light toggle + theme switching. Used in `docs/ui/*.md` pages.
- [x] **Documentation** — component pages under `docs/ui/` (sidebar + `node scripts/build-llms.mjs` regen).
- [x] **`ui/` in docsify sidebar** — done (Simply UI category).