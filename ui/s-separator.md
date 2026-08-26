# Separator

Visually or semantically separates content. A thin rule that can be horizontal or vertical.

## Usage

<s-component-viewer subject="s-separator"></s-component-viewer>
```html
<s-separator></s-separator>
```

?> The separator has **no slot**, so it works in both light DOM and shadow DOM. It renders in shadow DOM by default; add `light` if you want the component's styles in the light DOM.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `orientation` | string | `"horizontal"` | `horizontal` \| `vertical` |
| `decorative` | boolean | `true` | When `true`, renders `role="none"` (purely visual). Set `decorative="false"` for a semantic `role="separator"` |

## Horizontal

```html
<s-separator></s-separator>
```

A 1px rule spanning the full width of its container.

## Vertical

```html
<div style="display: flex; align-items: center; gap: 1rem; height: 40px">
  <span>Blog</span>
  <s-separator orientation="vertical"></s-separator>
  <span>Docs</span>
  <s-separator orientation="vertical"></s-separator>
  <span>Source</span>
</div>
```

A 1px vertical rule. Uses `align-self: stretch` so it fills the height of a flex container.

## Semantic Separator

```html
<s-separator decorative="false"></s-separator>
```

By default the separator is decorative (`role="none"`). Set `decorative="false"` to expose it to assistive technology as `role="separator"`.

## Theming

The separator uses the theme's border color:

| Token | Value |
|---|---|
| `--color-border` | theme-dependent border color |