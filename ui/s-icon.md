# Icon

A lucide icon. Renders a scalable vector icon by name. The lucide UMD bundle is lazy-loaded **once** on first use, then every icon renders instantly from memory. Space is reserved (so there's no layout shift while the bundle loads).

## Usage

<s-component-viewer subject="s-icon" title="false" description="false" config="false"></s-component-viewer>
```html
<s-icon name="badge-check"></s-icon>
<s-icon name="bird"></s-icon>
<s-icon name="star"></s-icon>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | string | `""` | The lucide icon name (`badge-check`, `bird`, …) |

## Sizing

The icon fills a `--s-icon-size` box (default `1rem`). Override per icon or per scope:

```html
<!-- 24px -->
<s-icon name="camera" style="--s-icon-size: 1.5rem"></s-icon>
```

Color inherits from the surrounding text via `currentColor`.

## Inside a badge / button

Pass `data-icon="inline-start"` (or `"inline-end"`) so the badge/button applies its icon padding:

```html
<s-badge>
  <s-icon name="badge-check" data-icon="inline-start"></s-icon>
  Verified
</s-badge>
```
