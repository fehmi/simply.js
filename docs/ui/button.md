# Button

Displays a button or a component that looks like a button. The base component of the system — it establishes the core pattern (isolated + native slot, variant/size via `data-*` attributes, theme tokens).

## Usage

```html
<s-button isolated variant="default">Click me</s-button>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | string | `"default"` | `default` \| `destructive` \| `outline` \| `secondary` \| `ghost` \| `link` |
| `size` | string | `"default"` | `xs` \| `sm` \| `default` \| `lg` \| `icon` \| `icon-xs` \| `icon-sm` \| `icon-lg` |
| `disabled` | boolean | `false` | Disables the button (opacity 0.5, no pointer events) |

## Variants

```html
<s-button isolated variant="default">Default</s-button>
<s-button isolated variant="secondary">Secondary</s-button>
<s-button isolated variant="outline">Outline</s-button>
<s-button isolated variant="ghost">Ghost</s-button>
<s-button isolated variant="destructive">Destructive</s-button>
<s-button isolated variant="link">Link</s-button>
```

## Sizes

```html
<s-button isolated size="xs">Extra Small</s-button>
<s-button isolated size="sm">Small</s-button>
<s-button isolated size="default">Default</s-button>
<s-button isolated size="lg">Large</s-button>
<s-button isolated size="icon">★</s-button>
```

## With Icon

```html
<s-button isolated>★ Save</s-button>
```

## Disabled

```html
<s-button isolated disabled>Disabled</s-button>
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

## Live Demo

<s-component-viewer isolated component="ui/s-button"></s-component-viewer>