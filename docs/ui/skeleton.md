# Skeleton

Use to show a placeholder while content is loading. A pulsing block that mimics the shape of the eventual content.

## Usage

```html
<s-skeleton></s-skeleton>
```

The skeleton has a default size (`width: 100%; height: 1rem`). Size it via inline styles on the tag:

```html
<s-skeleton style="width: 3rem; height: 3rem; border-radius: 9999px"></s-skeleton>
```

?> The skeleton has **no slot**, so `isolated` is **optional** — it works in both light DOM and shadow DOM. The host is the sizeable box; the inner div fills it and inherits the radius.

## Props

The skeleton has no props — it's a styled placeholder div.

## Avatar

```html
<div style="display: flex; align-items: center; gap: 1rem">
  <s-skeleton style="width: 3rem; height: 3rem; border-radius: 9999px"></s-skeleton>
  <div style="display: flex; flex-direction: column; gap: 0.5rem; flex: 1">
    <s-skeleton style="width: 60%; height: 1rem"></s-skeleton>
    <s-skeleton style="width: 40%; height: 1rem"></s-skeleton>
  </div>
</div>
```

## Text

```html
<div style="display: flex; flex-direction: column; gap: 0.5rem">
  <s-skeleton></s-skeleton>
  <s-skeleton></s-skeleton>
  <s-skeleton style="width: 75%"></s-skeleton>
</div>
```

## Theming

The skeleton uses the theme's accent color and radius:

| Token | Value |
|---|---|
| `--color-accent` | theme-dependent accent color |
| `--radius-md` | theme-dependent radius |

## Live Demo

<s-component-viewer isolated component="ui/s-skeleton"></s-component-viewer>