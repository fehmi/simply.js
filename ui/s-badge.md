# Badge

Displays a badge or a component that looks like a badge. A small pill used for labels, counts, or statuses.

## Usage

<s-component-viewer subject="s-badge"></s-component-viewer>
```html
<s-badge>Badge</s-badge>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | string | `"default"` | `default` \| `secondary` \| `outline` \| `destructive` \| `ghost` \| `link` |

## Variants


<s-component-viewer subject="s-badge" title="false" description="false" config="false"></s-component-viewer> 
```html
<s-badge variant="default">Default</s-badge>
<s-badge variant="secondary">Secondary</s-badge>
<s-badge variant="outline">Outline</s-badge>
<s-badge variant="destructive">Destructive</s-badge>
<s-badge variant="ghost">Ghost</s-badge>
<s-badge variant="link">Link</s-badge>
```

## As a Link

<s-component-viewer subject="s-badge" title="false" description="false"></s-component-viewer> 
```html
<a href="#"><s-badge variant="outline">Link Badge</s-badge></a>
```

When wrapped in an anchor, the badge gets hover styles via `:host-context(a)`.

## With Icons

The icon scales to the badge's 12px icon and sits in a `gap-1` (4px) row with the text (matching shadcn `px-2` + `gap-1`). Place the icon before the text with `data-icon="inline-start"`, after with `data-icon="inline-end"`.

<s-component-viewer subject="s-badge" title="false" description="false"></s-component-viewer>
```html
<s-badge>
  <s-icon name="badge-check" data-icon="inline-start"></s-icon>
  Verified
</s-badge>
<s-badge variant="secondary">
  <s-icon name="badge-check" data-icon="inline-start"></s-icon>
  Verified
</s-badge>
<s-badge variant="outline">
  <s-icon name="bookmark" data-icon="inline-end"></s-icon>
  Bookmark
</s-badge>
<s-badge variant="destructive">
  <s-icon name="alert-circle" data-icon="inline-start"></s-icon>
  Error
</s-badge>
<s-badge variant="ghost">
  <s-icon name="star" data-icon="inline-end"></s-icon>
  Ghost
</s-badge>
<s-badge variant="link">
  <s-icon name="link" data-icon="inline-start"></s-icon>
  Link
</s-badge>
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