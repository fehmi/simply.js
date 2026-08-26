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
  s-kbd.html           # Layer 3 — kbd component (keyboard key)
  s-kbd-group.html     # Layer 3 — kbd-group component (groups keys)
  s-input.html         # Layer 3 — input component (form control)
  s-textarea.html      # Layer 3 — textarea component (multi-line form control)
  s-field-label.html   # Layer 3 — field-label component (field family)
  s-field-description.html  # Layer 3 — field-description component (field family)
  s-field-group.html   # Layer 3 — field-group component (field family)
  s-field.html         # Layer 3 — field component (field family)
  s-field-set.html     # Layer 3 — field-set component (field family)
  s-field-separator.html  # Layer 3 — field-separator component (field family)
  s-field-content.html  # Layer 3 — field-content component (field family)
  s-field-title.html   # Layer 3 — field-title component (field family)
  s-field-legend.html  # Layer 3 — field-legend component (field family)
  s-field-error.html   # Layer 3 — field-error component (field family)
  s-checkbox.html      # Layer 3 — checkbox component (field family)
  s-input-group.html   # Layer 3 — input-group component (compound input)
  s-input-group-input.html  # Layer 3 — input-group-input component (borderless input)
  s-input-group-addon.html  # Layer 3 — input-group-addon component (addon)
  s-input-group-text.html   # Layer 3 — input-group-text component (addon text)
  s-input-group-textarea.html  # Layer 3 — input-group-textarea component (borderless textarea)
  s-input-group-button.html   # Layer 3 — input-group-button component (addon button)
  s-spinner.html       # Layer 1 — spinner component (loading indicator)
  s-icon.html          # Layer 3 — lucide icon component (lazy-loaded UMD once)
  s-native-select.html # Layer 2 — native-select component (styled <select>)
  s-switch.html        # Layer 2 — switch component (toggle control)
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
| 2026-08-24 | **Shadow DOM is DEFAULT** | All components render in shadow DOM. Opt into light DOM with the `light` attribute (form controls: `s-input`, `s-textarea`, `s-input-group-input`, `s-input-group-textarea`). `isolated` removed |
| 2026-08-23 | **Slot: native `<slot>`** | `simply-slot` is OLD API. Shadow DOM (default) + `:host` style + native `<slot>` |
| 2026-08-23 | **Theme system: `data-theme` + `themes/`** | 8 shadcn themes (Vega/Nova/Maia/Lyra/Mira/Luma/Sera/Rhea). Most share neutral colors + different fonts; Sera is taupe. `theme.css` default (vega), `themes/*.css` override |
| 2026-08-23 | **Font/line-height tokens** | Components use `--text-*--line-height` (original `text-sm`/`text-xs` line-heights) — dimension differences were font-related |
| 2026-08-23 | **Component tokens** | Component sizes/radii use `--button-*`, `--badge-*`, `--label-*` tokens (vega defaults in `theme.css`). Themes override them — CSS custom properties cross the shadow boundary |
| 2026-08-23 | **Docs: English only** | All documentation, comments, and README in English |
| 2026-08-25 | **Icons: lucide, lazy-loaded UMD once** | `<s-icon name="...">`. Nothing loads upfront; on first `<s-icon>` use the lucide UMD bundle (~96 KB gzip) loads once and is cached on `window.__sIconLucidePromise`. After that every icon renders instantly from memory. `:host` reserves a `--s-icon-size` box (default 1rem) so there's no layout shift while the bundle loads. `data-icon` passes through for badge/button `:has()` padding. Chosen over per-icon SVG fetching (which loaded icons late) and over eager load-all (which costs 96 KB even if you only use a few icons). |

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
- **Slot**: native `<slot>fallback</slot>`. Components render in shadow DOM by default; content passed as children.
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
<s-button variant="default">Click me</s-button>
<s-button size="icon">★</s-button>
<s-button disabled>Disabled</s-button>
```

---

## 5. Critical simply.js Gotchas (Verified)

1. **`{{...}}` double braces REQUIRED** — simply.js L31 `t.replace(/\{\{([\s\S]*?)\}\}/g, '${$1}')`. Single `{}` renders literally.
2. **JSDoc comment BEFORE `class simply` BREAKS the component** — `getClass` regex `/^class\s+(simply\s*)?\{/` uses `^` anchor; a leading `/** ... */` prevents the rename → `SyntaxError: Identifier 'simply' has already been declared`.
3. **Class `props = {...}` OVERRIDES inline attributes** — docs: "prop changes inside script overrides inline attributes". Provide defaults via template fallbacks.
4. **`disabled` attribute arrives as `""` (empty string)** — `?disabled="{{props.disabled === '' || props.disabled}}"` required.
5. **Slot: `simply-slot` is OLD API** — use native `<slot>`. Components render in shadow DOM by default; add `light` on the component tag (usage) to opt into light DOM. **`light` is a RESERVED keyword** — it's consumed at mount time (shadow vs light DOM), not a user-facing prop. Like every attribute it still lands in `props.light` (`""` when present), so never use `light` as a real prop name. The component-viewer excludes it from the config panel.
6. **`.dark .s-button` selectors DON'T work in shadow DOM** — regular selectors can't cross the shadow boundary. Use **`:host-context(.dark)`**.
7. **`<button>` UA default colors leak** — `color: buttontext` (black) + `background-color: buttonface` (white). `theme.css` reset + `color: inherit; background-color: transparent` in `.s-button` base required.
8. **`getComputedStyle` timing** — after toggling `.dark` or `data-theme`, the first read may return stale values; the second read is correct. Test timing issue, not a real bug.
9. **NEVER store DOM elements in reactive `data`** — `data` is an ObservableSlim proxy; assigning a DOM element (`data.comp = el`) wraps it in a proxy → `RangeError: Maximum call stack size exceeded` (ObservableSlim iterates the element's circular refs) and method calls like `el.setAttribute()` throw `Illegal invocation` (wrong `this`). Store element refs on `methods` (plain per-instance object) instead: `methods.comp = el`.
10. **`data.doc` is a proxy** — reading `el.data.doc` returns an ObservableSlim proxy; iterating it (e.g. building controls) can recurse infinitely. Copy it first: `JSON.parse(JSON.stringify(el.data.doc))`.
11. **`data` is set on connect, not constructor** — `document.createElement(tag).data` is `undefined` until the element is appended to the DOM. To read `data.doc` for metadata, temporarily `document.body.appendChild(el)`, read, then `el.remove()`.
12. **Set preview props via `comp.props[key] = value`, not `setAttribute`** — attribute observation doesn't pick up all props (e.g. `disabled`). Direct prop assignment triggers re-render reliably.
13. **Slot content via `simply.unsafeHTML(value)`** — returns a `DocumentFragment`; `comp.innerHTML = ""` then `comp.appendChild(simply.unsafeHTML(value))` sets slot children (supports HTML).
14. **Native form elements keep UA fonts in shadow DOM** — `theme.css` reset `button,input,select,textarea { font-family: inherit }` only works in LIGHT DOM (can't cross the shadow boundary). In shadow DOM (default), `<button>`/`<input>` show `Arial`, `<textarea>` shows `monospace` (UA defaults). FIX: each component's `.s-*` base must explicitly set `font-family: inherit` (works in both light + shadow DOM). Verified: button/input/textarea inherit theme font in viewer preview, and font changes with theme.

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
- **Component tokens**: each component's dimensions use `--button-*`, `--badge-*`, `--label-*`, `--input-*`, `--textarea-*`, `--skeleton-*`, `--kbd-*` tokens (vega defaults in `theme-vars.css`). Each theme overrides these in `themes/*.css`. CSS custom properties cross the shadow boundary → works in shadow DOM. **Every component that has theme-varying size/radius/font-size needs a component token** (e.g. Lyra = `rounded-none` + `text-xs` for button/input/textarea/skeleton/kbd; Luma = `rounded-3xl` input, `rounded-2xl` skeleton/kbd).
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

The component viewer is embedded in the component docs pages (`ui/s-*.md`) via `<s-component-viewer subject="s-button">`.

- **Root `index.html`** (docsify shell) loads the viewer globally: `get("ui/s-component-viewer.html")` inside the `loadJS("simply.js", ...)` callback.
- **Theme tokens on docs pages**: root `index.html` `<head>` loads `ui/tokens.css` + `ui/theme-vars.css` + `ui/themes/*.css`. `theme-vars.css` (NOT `theme.css`) is used because `theme.css`'s aggressive reset (`* { margin:0; padding:0 }`, `a { color: inherit }`, `ul,ol { list-style: none }`) would break docsify's styling.
- **`component` prop accepts full or relative URLs** — the last path segment is used as the tag name. On docs pages use `"ui/s-button"` (relative to repo root; docsify keeps the URL at root so `fetch` resolves correctly).
- **Viewer dark-mode behavior**: opens in **dark mode by default** (`afterConstruct` adds `.dark` to `<html>`). The viewer's own UI is **always dark** (fixed `--cv-*` colors in its shadow CSS, radius 0) — only the **preview area** follows the light/dark theme. The toggle button label reflects the current mode (`{{data.dark ? 'Light' : 'Dark'}}`).
- **Multiple viewers stay in sync**: dark/light + theme are page-global. Each viewer sets up a `MutationObserver` on `<html>`'s `class`/`data-theme` attributes and syncs its `data.dark`/`data.theme` — so toggling in one viewer updates all viewers' labels + theme selects. `.cv-preview` sets `color: var(--color-foreground)` so preview content (e.g. label with `color: inherit`) follows the theme instead of the always-dark chrome (fixes white-on-white in light mode).
- **Config panel ↔ docs example sync** (2026-08-24): when the viewer is followed by an HTML code block (the docs example `<pre data-lang="html">`), the viewer (a) reads the example's attributes into the config panel controls on load, and (b) rewrites the example markup + re-highlights with `Prism.highlightElement` when a control changes. The slot content (inner HTML) is preserved; the outer tag's self-closing form is kept. **Serialization rules**: boolean attributes are written bare (`disabled`, not `disabled=""`); attributes equal to the prop's default are dropped (`size="default"` → omitted); camelCase prop keys map to kebab-case attribute names (`ariaInvalid` → `aria-invalid`).
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

Progressive progression: each component teaches the **decisions and patterns** needed by the next. Don't skip levels. Related/compound components are grouped with their parent (e.g. Field / Input Group / Input OTP sit with Input).

### ✅ Level 0 — Foundation (done)

- [x] **Button** — base pattern: shadow DOM + native `<slot>`, variant/size `data-*` attributes, `:host-context(.dark)`, token consumption, `color-mix` hover, focus/disabled/active states.

### Level 1 — Basic styles (reinforces button pattern, no new patterns)

- [x] **Badge** — variants (default/secondary/outline/destructive/ghost/link), pill radius (`rounded-4xl`), `w-fit`, `:host-context(a)` link hover. Reinforces what Button taught.
- [x] **Label** — form label, `for` passthrough, `disabled` prop, `:host-context([data-disabled])`. **New: form association.** (Note: `peer-disabled` done via `disabled` prop since sibling selectors don't work in shadow DOM.)
- [x] **Separator** — orientation (horizontal/vertical), `decorative` prop (`role="none"` vs `role="separator"`), `align-self: stretch` for vertical in flex containers. **New: orientation prop.** No slot → works in both light + shadow DOM; `s-separator { display: contents }` in the style handles the light-DOM host.
- [x] **Skeleton** — loading placeholder, `bg-accent` + `rounded-md` + `animate-pulse`. **New: animation tokens.** No props, no slot. Host is the sizeable box; inner div fills it and inherits radius.
- [x] **Kbd** — keyboard key, `pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm bg-muted px-1 font-sans text-xs font-medium text-muted-foreground select-none`. **New: inline element, mono font.** Has slot (children = key label). `s-kbd-group` companion: `inline-flex items-center gap-1`.
- [x] **Spinner** — loading indicator, inline lucide Loader2 SVG, `size-4` (16px) `animate-spin`, `role="status"` `aria-label="Loading"`. **New: rotation animation.** No children, no slot. Size override via `--spinner-size` CSS variable. Inherits text color via `currentColor` (works inside buttons). No theme tokens (fixed size in original).
- [ ] **Typography** — text styles (h1–h4, p, blockquote, code, lead, muted, large, small). **New: text utility classes.**
- [ ] **Aspect Ratio** — maintains a fixed aspect ratio. **New: ratio prop, padding-top trick.**

### Level 2 — Form controls (state + focus + validation)

- [x] **Input** — form control, `h-9 w-full rounded-md border-input bg-transparent px-3 py-1 text-base shadow-xs`, `::selection` primary, `::placeholder` muted-fg, `::file-selector-button`, `disabled`, `focus-visible` ring, `aria-invalid` destructive border+ring, `dark:bg-input/30`. **New: form state, validation.** Use WITH `light` (light DOM) so the native `<input>` participates in forms. `aria-invalid` prop: template reads both `props.ariaInvalid` and `props['aria-invalid']`; CSS uses `[aria-invalid]` presence selector. `--input-radius`/`--input-height(-xs/sm/default/lg)`/`--input-font-size` tokens (Lyra/Sera radius 0, Lyra/Mira font 12px). **`size` prop added (xs/sm/default/lg)** — matches button heights per theme so `<s-input size="sm">` + `<s-button size="sm">` align (original shadcn input has no sizes, but user needed standalone sizing; heights mirror `--button-height-*` per theme).
- [x] **Textarea** — multi-line form control, `flex field-sizing-content min-h-16 w-full rounded-md border-input bg-transparent px-3 py-2 text-base shadow-xs`, `::placeholder` muted-fg, `disabled`, `focus-visible` ring, `aria-invalid` destructive border+ring, `dark:bg-input/30`. **New: resize, min-height.** Use WITH `light` (light DOM). `--textarea-radius`/`--textarea-font-size` tokens (Lyra/Sera radius 0, Lyra/Mira font 12px).
- [x] **FieldLabel** — form field label, `for` passthrough, `disabled` prop, `:host-context([data-disabled])`. **New: field family.** Renders in shadow DOM (default) (slot projects label text). `for` doesn't cross shadow boundary → JS click handler (`focusControl`) focuses the control by id. `s-field-label { display: contents }` for light DOM host.
- [x] **FieldDescription** — form field description, `text-sm leading-normal font-normal text-muted-foreground`, links underlined → `primary` on hover. **New: field family.** Renders in shadow DOM (default) (slot projects description text). `margin: 0` (base reset removes `<p>` default margin; spacing via field wrapper/flex gap). `s-field-description { display: contents }` for light DOM host. **Font size via `--font-size-sm` token** (Lyra/Mira 12px, others 14px).
- [x] **FieldGroup** — layout wrapper that stacks related fields, `flex w-full flex-col gap-7` (28px). **New: field family.** Renders in shadow DOM (default) (slot projects the fields — light DOM would replace children on template render). `:host`/`s-field-group { display: contents }`, inner `.s-field-group` div is the flex container. **`data-slot` passthrough** (`props['data-slot'] || props.dataSlot || 'field-group'`) — `data-slot="checkbox-group"` tightens gap to 12px. **Gap varies per theme** via `--field-group-gap` token (Vega/Maia/Luma 28px, Nova/Lyra 20px, Mira 16px, Sera 40px, Rhea 24px). Container query (`@container/field-group`) deferred until responsive Field orientation.
- [x] **Field** — form field wrapper, `flex w-full gap-3` (12px), `role="group"`, `data-orientation` (vertical/horizontal). **New: field family.** Renders in shadow DOM (default) (slot projects children). Vertical = `flex-col`; horizontal = `flex-row items-center` + `::slotted(s-field-label) { flex: auto }` (label grows). `:host`/`s-field { display: contents }`. **Gap varies per theme** via `--field-gap` token (Vega/Maia/Luma/Sera/Rhea 12px, Nova/Lyra/Mira 8px). `data-invalid`/`data-disabled` propagation deferred.
- [x] **FieldSet** — semantic `<fieldset>` grouping, `flex flex-col gap-6` (24px). **New: field family.** Renders in shadow DOM (default). Resets `<fieldset>` UA defaults (margin/padding/border/min-width) since theme.css reset only works in light DOM. **Gap varies per theme** via `--field-set-gap` token (Vega/Maia/Luma/Sera/Rhea 24px, Nova/Lyra/Mira 16px). **Checkbox/radio-group gap detection via lifecycle** — `:has()` can't cross the shadow boundary AND `:host:has()` isn't applied reliably, so `afterFirstRender` checks slotted `data-slot="checkbox-group"`/`radio-group` and sets `data-checkbox-group`/`data-radio-group` on the host → `:host([data-checkbox-group]) { --field-set-gap: 12px }` (custom property cascades into shadow DOM).
- [x] **FieldContent** — flex column that groups a label + description when the label sits beside the control, `flex flex-1 flex-col gap-1.5 leading-snug`. **New: field family.** Renders in shadow DOM (default) (slot projects children). **Gap varies per theme** via `--field-content-gap` token (Vega/Maia/Luma/Sera/Rhea 4px, Nova/Lyra/Mira 2px).
- [x] **FieldTitle** — title with label styling inside FieldContent, `flex w-fit items-center gap-2 text-sm leading-snug font-medium`. **New: field family.** Renders in shadow DOM (default) (slot projects title text).
- [x] **FieldLegend** — `<legend>` for a FieldSet, `mb-3 font-medium`, `variant` (legend = text-base, label = text-sm). **New: field family.** Renders in shadow DOM (default) (slot projects legend text).
- [x] **FieldError** — accessible error container, `<div role="alert">` with `text-sm font-normal text-destructive`. **New: field family.** Renders in shadow DOM (default) (slot projects error message). Hides itself when no children (via `afterFirstRender` slot check → `s-hidden` class), like the original returning `null`.
- [x] **FieldSeparator** — divider between sections, `relative -my-2 h-5 text-sm`, 1px `border` line at `top: 50%`. **New: field family.** Renders in shadow DOM (default). Optional centered content span (`bg-background px-2 text-muted-foreground`) — hidden via `afterFirstRender` slot check (`data.hasContent` → `s-hidden` class) when no children.
- [x] **Checkbox** — `<button role="checkbox">`, `size-4` (16px), `rounded-[4px]`, `border-input`, `shadow-xs`, focus-visible ring, `aria-invalid` destructive, checked = `border-primary bg-primary text-primary-foreground`, `dark:bg-input/30`. **New: interactive state, change event.** Renders in shadow DOM (default). `default-checked` (attribute arrives as `""`) → `data.checked` in `afterConstruct`; `toggle()` method flips `data.checked` (respects `disabled`). Checkmark = inline lucide SVG (14px).
- [x] **Input Group** — compound input with addons/buttons (icons, text, buttons inside). **New: compound structure.** Parts: `s-input-group` (container, `flex w-full items-center h-9 border border-input rounded-md shadow-xs`, focus/error via lifecycle since `:has()` can't cross shadow boundary — `data-focus`/`data-invalid` on host → custom properties `--input-group-border`/`--input-group-ring`; `data-textarea` → auto height), `s-input-group-input` (borderless input, light DOM form control, `flex: 1`), `s-input-group-textarea` (borderless textarea, light DOM form control, group auto-heights), `s-input-group-addon` (flex container, `align` inline-start/end/block-start/block-end via `order`, **click-to-focus** — clicking the addon focuses the group's input, skips interactive elements), `s-input-group-text` (muted text), `s-input-group-button` (standalone button, ghost/xs defaults, sizes xs/icon-xs/sm/icon-sm). **Focus/error detection**: group's `afterFirstRender` + MutationObserver on host childList finds the slotted control (light or shadow DOM) and attaches focus/blur + aria-invalid observers. **Addon click-to-focus**: `component.parent.methods.control.focus()`; skips `button, a, input, select, textarea, s-input-group-button` (button's event target is its host since the real `<button>` is in a shadow root). **Addon-aware layout**: matches the original's `has-[>[data-align=...]]` selectors via lifecycle (since `:has()` can't cross the shadow boundary) — inline-start/inline-end addons tighten the control's inline padding (`--input-group-input-pl/pr` = 8px, else removed → control falls back to 12px); block-start/block-end addons flip the group to a **column layout** (`data-block-start`/`data-block-end` on host → `flex-direction: column; align-items: stretch`) so the addon becomes a full-width row and the control takes the rest, plus pad the control's vertical edge facing the addon (`--input-group-input-pt/pb` = 12px). The control reads these via `padding-left/right: var(--input-group-input-pl/pr, ...)` and `padding-top/bottom: var(--input-group-input-pt/pb, ...)`. Custom properties cascade into the control's shadow root, so it works for both light-DOM and shadow-DOM controls. Addon has `box-sizing: border-box` (else `width: 100%` + padding overflows the group). **Font sizes per theme**: `s-input-group-input`/`s-input-group-textarea` use `var(--text-base)` + `@media (min-width:768px) { font-size: var(--input-font-size)/var(--textarea-font-size) }`; `s-input-group-text`/`s-input-group-addon` use `--font-size-sm` (Lyra/Mira 12px, others 14px). Related to Input.
- [ ] **Input OTP** — one-time password input (grouped slots). **New: group coordination, paste handling.** Related to Input.
- [x] **Switch** — `<button role="switch">`, track + thumb, `size` (default/sm), `default-checked` → `data.checked` in `afterConstruct`, `toggle()` flips state + fires `change`. **New: toggle animation.** Renders in shadow DOM (default). **Theme tokens** (`--switch-*`): sizes/radius/border vary per theme — Vega/Nova/Maia/Lyra 32×18.4 thumb 16, Mira 28×16.6 thumb 14, Luma 44×20 thumb 24×16 (rectangular), Sera 33×18 thumb 14 radius 0, Rhea 32×20 thumb 16 radius 2xl; border 1px except Luma/Rhea 2px; thumb translate via `--switch-thumb-translate` (per-theme calc). Checked = `bg-primary border-primary`, unchecked = `bg-input` (`dark:bg-input/80`), thumb `bg-background` (`dark:checked:bg-primary-foreground`, `dark:unchecked:bg-foreground`).
- [ ] **Radio Group** — group state, name, arrow key nav. **New: group coordination, keyboard nav.**
- [x] **Native Select** — styled native `<select>`, `size` (default/sm), chevron icon. **New: select styling, chevron icon.** Renders in shadow DOM (default) (options are slotted children — a native `<select>` can't render a `<slot>` as options, so `afterRender` **clones** the slotted `<option>`/`<optgroup>` elements into the select; cloning (not moving) keeps the light-DOM options intact so the slot always has assigned nodes, and re-cloning on every render survives prop changes like `size` default→sm). Value exposed via `data.value` + `change` event. **Reuses `--input-*` tokens** (radius/height/height-sm/font-size) so it matches `<s-input>` per theme. **Padding/chevron tokens** `--native-select-padding-x/right/y` + `--native-select-icon-right` (Vega/Nova/Lyra/Rhea 10/32/4/10px, Maia 12/32/4/14px, Mira 8/24/2/6px, Luma 12/32/4/10px, Sera 0/32/8/0px).
- [ ] **Toggle** — button-like on/off toggle. **New: pressed state.**
- [ ] **Toggle Group** — group of toggles, single/multi select. **New: group state.**

### Level 3 — Composite components (multi-part)

- [ ] **Card** — header/title/description/content/footer. **New: named slots, composite structure.**
- [ ] **Table / Data Table** — thead/tbody/row/cell. **New: table structure.**
- [ ] **Tabs** — list/trigger/content, active state, roving tabindex. **New: state + a11y keyboard nav.**
- [ ] **Accordion** — expand/collapse, height animation. **New: collapsible.**
- [ ] **Collapsible** — expand/collapse trigger. **New: collapsible (simpler than Accordion).**
- [ ] **Breadcrumb** — navigation trail with separators. **New: nested slots, separator.**
- [ ] **Avatar** — image with fallback. **New: image fallback, initials.**
- [ ] **Alert** — message display with variants. **New: icon slot, variant.**
- [ ] **Empty** — empty state placeholder. **New: media/description slots.**
- [ ] **Item** — list item with media/content. **New: item structure.**
- [ ] **Marker** — status marker (separator/status). **New: marker variants.**
- [ ] **Button Group** — group of buttons with shared radius. **New: group radius, `:has()` selectors.** Related to Button.

### Level 4 — Overlays & positioning (hardest)

- [ ] **Tooltip** — hover/focus trigger, positioning, delay. **New: overlay, positioning.**
- [ ] **Popover** — overlay, outside-click close. **New: overlay management.**
- [ ] **Hover Card** — hover preview popover. **New: hover-triggered overlay.**
- [ ] **Dropdown Menu** — complex overlay, keyboard nav, focus management. **New: menu a11y.**
- [ ] **Context Menu** — right-click menu. **New: context trigger.**
- [ ] **Menubar** — horizontal menu bar. **New: menu bar structure.**
- [ ] **Navigation Menu** — nav menu with submenus. **New: nested nav.**
- [ ] **Dialog** — modal, focus trap, escape, portal. **New: modal, focus trap.**
- [ ] **Alert Dialog** — confirmation modal. **New: modal + destructive action.**
- [ ] **Sheet** — side panel. **New: side overlay.**
- [ ] **Drawer** — bottom/side drawer. **New: drawer overlay.**
- [ ] **Select** — popover + form value, keyboard nav. **New: combobox pattern.**
- [ ] **Combobox** — searchable select. **New: search + list filtering.**
- [ ] **Command** — command palette. **New: keyboard-driven list.**
- [ ] **Calendar** — date calendar grid. **New: date grid, month nav.**
- [ ] **Date Picker** — calendar + trigger. **New: date selection.**

### Level 5 — Advanced

- [ ] **Slider** — range input, drag. **New: pointer interaction.**
- [ ] **Progress** — bar, value display. **New: value display.**
- [ ] **Toast** — portal, queue, animations. **New: notification system.**
- [ ] **Carousel** — scrollable slides. **New: scroll snap.**
- [ ] **Chart** — data visualization. **New: SVG rendering.**
- [ ] **Resizable** — resizable panels. **New: pointer drag, split.**
- [ ] **Scroll Area** — custom scrollbar. **New: scrollbar styling.**
- [ ] **Pagination** — page navigation. **New: page state.**
- [ ] **Sidebar** — app sidebar layout. **New: layout structure.**
- [ ] **Direction** — RTL direction wrapper. **New: direction context.**
- [ ] **Message / Message Scroller** — chat messages. **New: message list, scroll anchoring.**
- [ ] **Bubble** — chat bubble. **New: bubble variants.**
- [ ] **Questionnaire** — multi-step form. **New: step state.**
- [ ] **Attachment** — file attachment. **New: file display.**

---

## 9. Next Steps

- [ ] **Next: Input OTP** — one-time password input. After that: Switch.
- [x] **Component-viewer** — `s-component-viewer.html` done. Live preview with parameter editing + dark/light toggle + theme switching. Used in `ui/s-*.md` pages.
- [x] **Documentation** — component pages under `ui/` as `s-*.md` (sidebar + `node scripts/build-llms.mjs` regen).
- [x] **`ui/` in docsify sidebar** — done (Simply UI category).