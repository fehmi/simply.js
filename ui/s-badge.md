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

Use the `variant` prop to change the variant of the badge.

<s-component-viewer subject="s-badge" title="false" description="false" config="false"></s-component-viewer>
```html
<s-badge>Default</s-badge>
<s-badge variant="secondary">Secondary</s-badge>
<s-badge variant="destructive">Destructive</s-badge>
<s-badge variant="outline">Outline</s-badge>
<s-badge variant="ghost">Ghost</s-badge>
<s-badge variant="link">Link</s-badge>
```

## With Icon

You can render an icon inside the badge. Use `data-icon="inline-start"` to render the icon on the left and `data-icon="inline-end"` to render the icon on the right.

<s-component-viewer subject="s-badge" title="false" description="false" config="false"></s-component-viewer>
```html
<s-badge>
  <s-icon name="badge-check" data-icon="inline-start"></s-icon>
  Verified
</s-badge>
<s-badge variant="outline">
  <s-icon name="bookmark" data-icon="inline-end"></s-icon>
  Bookmark
</s-badge>
```

With a custom icon size, the badge's icon scales using `--s-icon-size` on the host.

## With Spinner

You can render a spinner inside the badge. Remember to add the `data-icon="inline-start"` or `data-icon="inline-end"` prop to the spinner.

<s-component-viewer subject="s-badge" title="false" description="false" config="false"></s-component-viewer>
```html
<s-badge>
  <s-spinner data-icon="inline-start"></s-spinner>
  Deleting
</s-badge>
<s-badge variant="secondary">
  <s-spinner data-icon="inline-end"></s-spinner>
  Generating
</s-badge>
```

## Link

Wrap a badge in an anchor to render a link as a badge.

<s-component-viewer subject="s-badge" title="false" description="false"></s-component-viewer>
```html
<a href="#">
  <s-badge variant="outline">
    <s-icon name="arrow-up-right" data-icon="inline-end"></s-icon>
    Open Link
  </s-badge>
</a>
```

When wrapped in an anchor, the badge gets hover styles via `:host-context(a)`.

## Custom Colors

Customize a badge's colors with the `--s-badge-bg`, `--s-badge-color`, and `--s-badge-border` CSS variables.

<s-component-viewer subject="s-badge" title="false" description="false" config="false"></s-component-viewer>
```html
<s-badge style="--s-badge-bg: var(--color-blue-100); --s-badge-color: var(--color-blue-800)">Blue</s-badge>
<s-badge style="--s-badge-bg: var(--color-green-100); --s-badge-color: var(--color-green-800)">Green</s-badge>
<s-badge style="--s-badge-bg: var(--color-sky-100); --s-badge-color: var(--color-sky-800)">Sky</s-badge>
<s-badge style="--s-badge-bg: var(--color-purple-100); --s-badge-color: var(--color-purple-800)">Purple</s-badge>
<s-badge style="--s-badge-bg: var(--color-red-100); --s-badge-color: var(--color-red-800)">Red</s-badge>
```

## Theming

The badge uses theme-dependent tokens for **radius** and **font-size** only. The **height is constant** across all themes (`--spacing × 5` = 20px, with `box-sizing: border-box`), matching shadcn — as in the original, the themes do not change the badge height.

| Theme | radius | font-size |
|---|---|---|
| Vega (default) | rounded-4xl (32px) | text-xs (12px) |
| Lyra | rounded-none (0) | text-xs (12px) |
| Mira | rounded-full | 0.625rem |
| Luma | rounded-3xl | text-xs (12px) |
| Sera | rounded-none (0) | 0.625rem |
| Rhea | rounded-2xl (16px) | text-xs (12px) |

Tokens: `--badge-radius`, `--badge-font-size`.