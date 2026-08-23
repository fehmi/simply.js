# Component Viewer

A live preview tool for Simply UI components. Lets you change every supported component parameter and see the result instantly, with dark mode and theme switching.

## Usage

```html
<s-component-viewer isolated component="s-button"></s-component-viewer>
```

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

- **Parameter editing** — every prop from the component's `data.doc.props` metadata gets a control
- **Slot editing** — the slot content is editable via a textarea (updates the preview's children)
- **Dark mode toggle** — toggles `.dark` on the document. The viewer opens in **dark mode by default**; the viewer's own UI stays dark regardless, only the **preview area** follows the light/dark theme. The toggle label reflects the current mode ("Light" in dark, "Dark" in light)
- **Theme switcher** — switches between all 8 themes (Vega, Nova, Maia, Lyra, Mira, Luma, Sera, Rhea)
- **Multiple viewers stay in sync** — dark/light and theme are page-global; changing them in one viewer updates all viewers on the page (via a `MutationObserver` on `<html>`'s `class`/`data-theme`)

## Control Types

The viewer infers the control type from each prop's metadata:

| Prop metadata | Control |
|---|---|
| `options` array | **Radio group** if `options.length <= radioThreshold`, else **select** |
| boolean default | **Checkbox** |
| `slot` key | **Textarea** |
| otherwise | **Text input** |

## How It Works

1. The viewer reads the target component's `data.doc.props` metadata
2. It builds a control list from the props
3. It creates a preview instance of the component and applies the initial prop values
4. When a control changes, it updates the preview component's prop (or children for slot)

## Example

```html
<s-component-viewer isolated component="ui/s-button"></s-component-viewer>
```

## Live Demo

<s-component-viewer isolated component="ui/s-button"></s-component-viewer>