# Label

A label associated with a form control. Links to an input via the `for` attribute.

## Usage

<s-component-viewer subject="s-label"></s-component-viewer>
```html
<s-label for="email">Email</s-label>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `for` | string | `""` | The `id` of the associated form control |
| `disabled` | boolean | `false` | Fades the label (opacity 0.5) |

## Example

<s-component-viewer subject="s-label" title="false" description="false"></s-component-viewer>
```html
<div class="field" style="display: flex; flex-direction: column; gap: 0.5rem">
  <s-label for="name">Name</s-label>
  <s-input light id="name" placeholder="Enter your name"></s-input>
</div>
<div class="field" style="display: flex; align-items: center; gap: 0.5rem">
  <s-checkbox id="push"></s-checkbox>
  <s-label for="push">Push notifications</s-label>
</div>
```

## Disabled

```html
<s-label disabled>Disabled</s-label>
```

The `disabled` attribute fades the label. The label also fades automatically when a parent element has `data-disabled="true"`.

?> **Note**: shadcn's `peer-disabled` pattern (auto-fading when a sibling input with class `peer` is disabled) is not directly supported because sibling selectors don't cross the shadow DOM boundary. Use the `disabled` prop instead.

## Theming

The label uses theme-dependent tokens:

| Theme | font-size | font-weight | transform |
|---|---|---|---|
| Vega (default) | text-sm (14px) | medium (500) | none |
| Lyra | text-xs (12px) | normal (400) | none |
| Mira | text-xs (12px) | medium (500) | none |
| Sera | text-xs (12px) | semibold (600) | uppercase |

Tokens: `--label-font-size`, `--label-font-weight`, `--label-line-height`, `--label-text-transform`, `--label-letter-spacing`, `--label-gap`.