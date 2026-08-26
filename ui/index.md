# Simply UI

A shadcn-based UI component system for simply.js, built with **native CSS**. Zero-dependency, no build, no Tailwind.

This section documents the component system developed in the `ui/` folder. Components are single `.html` files loaded with simply.js.

?> **Golden rule**: We build new features as needed. To stay sustainable, each component teaches the patterns needed by the next one.

## Architecture — 3 Layers

| Layer | File | Content |
|---|---|---|
| **1. Raw tokens** | `ui/tokens.css` | OKLCH color palette (full Tailwind v4 palette), `--spacing`, typography, radius, shadow + semantic aliases |
| **2. Semantic theme** | `ui/theme.css` | `:root` + `.dark` semantic tokens + base reset + **component tokens** (vega defaults) |
| **3. Component styles** | each `.html`'s `<style>` block | variant/size/state styles, consuming tokens |

## Theme System

8 shadcn themes are supported: **Vega** (default), **Nova**, **Maia**, **Lyra**, **Mira**, **Luma**, **Sera**, **Rhea**.

- `ui/theme.css` — default theme (Vega = neutral colors + Inter font)
- `ui/themes/*.css` — additional themes, overriding via `[data-theme="..."]`
- Theme selection: `<html data-theme="nova">` (remove attribute → vega)
- Dark mode: `.dark` class

Themes change not only colors/fonts but also **component sizes and radii** (via the component token architecture).

## Components

- [Button](ui/s-button.md) — button with variants and sizes
- [Badge](ui/s-badge.md) — badge / pill
- [Label](ui/s-label.md) — form label
- [Separator](ui/s-separator.md) — horizontal / vertical rule
- [Skeleton](ui/s-skeleton.md) — loading placeholder
- [Kbd](ui/s-kbd.md) — keyboard key
- [Input](ui/s-input.md) — text input for forms
- [Textarea](ui/s-textarea.md) — multi-line text input
- [Field](ui/s-field.md) — form field (label + description + group)
- [Spinner](ui/s-spinner.md) — loading indicator
- [Native Select](ui/s-native-select.md) — styled native select
- [Switch](ui/s-switch.md) — toggle switch
- [Component Viewer](ui/s-component-viewer.md) — live preview tool

?> Each component page includes a live **component viewer** (parameter editing, dark/light toggle, theme switching).

## Usage

```html
<html>
  <head>
    <link rel="stylesheet" href="ui/tokens.css">
    <link rel="stylesheet" href="ui/theme.css">
    <!-- optional theme: <link rel="stylesheet" href="ui/themes/nova.css"> -->
  </head>
  <body>
    <s-label for="email">Email</s-label>
    <script src="simply.js"></script>
    <script>
      get("ui/s-label.html");
    </script>
  </body>
</html>
```

## Development Notes

- Components use shadow DOM (default) + native `<slot>`
- `{{...}}` double braces are required
- Dark mode selectors use `:host-context(.dark)`
- Detailed guide: `ui/README.md`