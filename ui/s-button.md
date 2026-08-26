# Button

Displays a button or a component that looks like a button. The base component of the system — it establishes the core pattern (shadow DOM + native slot, variant/size via `data-*` attributes, theme tokens).

## Usage

<s-component-viewer subject="s-button"></s-component-viewer>
```html
<s-button variant="default">Click me</s-button>
```

<s-component-viewer subject="s-button" title="false" description="false"></s-component-viewer>
```html
<s-button variant="outline">Button</s-button>
<s-button variant="outline" size="icon">
  <s-icon name="arrow-up"></s-icon>
</s-button>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | string | `"default"` | `default` \| `destructive` \| `outline` \| `secondary` \| `ghost` \| `link` |
| `size` | string | `"default"` | `xs` \| `sm` \| `default` \| `lg` \| `icon` \| `icon-xs` \| `icon-sm` \| `icon-lg` |
| `disabled` | boolean | `false` | Disables the button (opacity 0.5, no pointer events) |

## Variants

<s-component-viewer subject="s-button" title="false" description="false"></s-component-viewer>
```html
<s-button variant="default">Default</s-button>
<s-button variant="secondary">Secondary</s-button>
<s-button variant="outline">Outline</s-button>
<s-button variant="ghost">Ghost</s-button>
<s-button variant="destructive">Destructive</s-button>
<s-button variant="link">Link</s-button>
```

## Sizes

<s-component-viewer subject="s-button" title="false" description="false" config="false"/></s-component-viewer>
```html
<s-button size="xs">Extra Small</s-button>
<s-button size="sm">Small</s-button>
<s-button size="default">Default</s-button>
<s-button size="lg">Large</s-button>
<s-button size="icon"><s-icon name="star"></s-icon></s-button>
```

## With Icon

<s-component-viewer subject="s-button" title="false" description="false" config="false"></s-component-viewer>
```html
<s-button><s-icon name="save" data-icon="inline-start"></s-icon> Save</s-button>
```

## Icon & Theme

The icon inherits the button's context: it scales with the button `size` and takes the button's color via `currentColor`. Change the `size`/`variant` in the config, or the theme (top-right), and watch the icon follow.

<s-component-viewer subject="s-button" title="false" description="false"></s-component-viewer>
```html
<s-button size="default" variant="default">
  <s-icon name="badge-check" data-icon="inline-start"></s-icon>
  Save
</s-button>
<s-button size="icon" variant="secondary">
  <s-icon name="heart"></s-icon>
</s-button>
<s-button size="lg" variant="outline">
  <s-icon name="send" data-icon="inline-end"></s-icon>
  Send
</s-button>
```

## Spinner

<s-component-viewer subject="s-button" title="false" description="false" config="false"></s-component-viewer>
```html
<s-button variant="outline">
  <s-spinner></s-spinner>Downloading
</s-button>
<s-button variant="outline">
  Downloading<s-spinner></s-spinner>
</s-button>
<s-button variant="outline" size="icon">
  <s-spinner></s-spinner>
</s-button>
```

## Button Group

Group buttons together with `s-button-group`. Buttons inside a group are joined (shared borders, rounded outer corners). Nested groups get a gap between them.

<s-component-viewer subject="s-button-group" title="false" description="false"></s-component-viewer>
```html
<s-button-group>
  <s-button-group>
    <s-button variant="outline" size="icon" aria-label="Go Back">
      <s-icon name="arrow-left"></s-icon>
    </s-button>
  </s-button-group>
  <s-button-group>
    <s-button variant="outline">Archive</s-button>
    <s-button variant="outline">Report</s-button>
  </s-button-group>
  <s-button-group>
    <s-button variant="outline">Snooze</s-button>
  </s-button-group>
</s-button-group>
```

> **Note:** The original shadcn demo includes a Dropdown Menu ("More Options") in the last group. We'll add that example once the `s-dropdown-menu` component is built.

## Disabled

<s-component-viewer subject="s-button" title="false" description="false" config="false"></s-component-viewer>
```html
<s-button disabled>Disabled</s-button>
```


## Theming

The button uses theme-dependent tokens for sizes and radii:

| Theme | default h | radius | font |
|---|---|---|---|
| Vega (default) | h-9 (36px) | rounded-md (8px) | 14px |
| Nova | h-8 (32px) | rounded-lg (10px) | 14px |
| Maia | h-9 (36px) | rounded-4xl (32px) | 14px |
| Lyra | h-8 (32px) | rounded-none (0) | 12px |
| Mira | h-7 (28px) | rounded-md (8px) | 12px |
| Luma | h-9 (36px) | rounded-4xl (32px) | 14px |
| Sera | h-10 (40px) | rounded-none (0) | 12px |
| Rhea | h-8 (32px) | rounded-2xl (16px) | 14px |

Tokens: `--button-radius`, `--button-height-*`, `--button-size-icon-*`, `--button-font-size-*`, `--button-padding-*`, `--button-gap-*`.