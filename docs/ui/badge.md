# Badge

Displays a badge or a component that looks like a badge. A small pill used for labels, counts, or statuses.

## Usage

```html
<s-badge isolated variant="default">Badge</s-badge>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | string | `"default"` | `default` \| `secondary` \| `outline` \| `destructive` \| `ghost` \| `link` |

## Variants

```html
<s-badge isolated variant="default">Default</s-badge>
<s-badge isolated variant="secondary">Secondary</s-badge>
<s-badge isolated variant="outline">Outline</s-badge>
<s-badge isolated variant="destructive">Destructive</s-badge>
<s-badge isolated variant="ghost">Ghost</s-badge>
<s-badge isolated variant="link">Link</s-badge>
```

## As a Link

```html
<a href="#"><s-badge isolated variant="outline">Link Badge</s-badge></a>
```

When wrapped in an anchor, the badge gets hover styles via `:host-context(a)`.

## With Icon

```html
<s-badge isolated variant="secondary">★ New</s-badge>
```

## Theming

The badge uses theme-dependent tokens:

| Theme | radius | font-size |
|---|---|---|
| Vega (default) | rounded-4xl (32px) | text-xs (12px) |
| Lyra | rounded-none (0) | text-xs (12px) |
| Mira | rounded-full | 0.625rem |
| Luma | rounded-3xl | text-xs (12px) |
| Sera | rounded-none (0) | 0.625rem |
| Rhea | rounded-2xl (16px) | text-xs (12px) |

Tokens: `--badge-radius`, `--badge-font-size`.

## Live Demo

<s-component-viewer isolated component="ui/s-badge"></s-component-viewer>