# Component Viewer

A live preview tool for Simply UI components. Shows the component with its default props and slot content, with a config panel to edit props, dark mode, and theme switching.

## Usage

```html
<s-component-viewer subject="s-button"></s-component-viewer>
```

<s-component-viewer subject="s-button"></s-component-viewer>

The `component` prop is the path to the component file (without `.html`). It accepts **full or relative URLs** — the last path segment is used as the tag name:

| `component` value | Loads | Tag |
|---|---|---|
| `"s-button"` | `s-button.html` (relative to current page) | `s-button` |
| `"ui/s-button"` | `ui/s-button.html` (relative to current page) | `s-button` |
| `"https://example.com/ui/s-button"` | full URL | `s-button` |

The viewer loads the component itself via `get()`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `component` | string | `""` | Path to the component to preview (e.g. `"ui/s-button"`) |
| `radioThreshold` | number | `4` | Max options before switching from radio group to select |

## Features

- **Config panel** — every prop from the component's `data.doc.props` metadata gets a control (the `slot` prop is **excluded** — the docs example code shows the slot markup). The panel auto-hides when a component has no props
- **Live preview** — renders the component with its default props and default slot content (from the docs example code or the component's slot default)
- **Dark mode toggle** — toggles `.dark` on the document. The viewer opens in **dark mode by default**; the viewer's own UI stays dark regardless, only the **preview area** follows the light/dark theme. The toggle label reflects the current mode ("Light" in dark, "Dark" in light)
- **Theme switcher** — switches between all 8 themes (Vega, Nova, Maia, Lyra, Mira, Luma, Sera, Rhea)
- **Multiple viewers stay in sync** — dark/light and theme are page-global; changing them in one viewer updates all viewers on the page (via a `MutationObserver` on `<html>`'s `class`/`data-theme`)

## Control Types

The viewer infers the control type from each prop's metadata:

| Prop metadata | Control |
|---|---|
| `options` array | **Radio group** if `options.length <= radioThreshold`, else **select** |
| boolean default | **Checkbox** |
| otherwise | **Text input** |

## How It Works

1. The viewer reads the target component's `data.doc.props` metadata
2. It builds a control list from the props (skipping `slot`)
3. It creates a preview instance of the component (shadow DOM by default) and applies the initial prop values
4. It injects the slot content — from the docs example code block that follows the viewer (inner content only), or the component's `data.doc.props.slot.default`
5. When a control changes, it updates the preview component's prop

## Example

```html
<s-component-viewer subject="s-button"></s-component-viewer>
```