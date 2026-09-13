# Select

A custom dropdown select. Unlike the native `<select>`, it's fully styled and composed from a trigger, a value, and a list of options. Use it when you need a styled picker (e.g. months, years) or a custom dropdown.

<s-component-viewer subject="s-select"></s-component-viewer>
```html
<s-select>
  <s-select-trigger>
    <s-select-value placeholder="Select an option"></s-select-value>
  </s-select-trigger>
  <s-select-content>
    <s-select-group>
      <s-select-item value="1">Option 1</s-select-item>
      <s-select-item value="2">Option 2</s-select-item>
    </s-select-group>
  </s-select-content>
</s-select>
```

?> The selected value is exposed on the `s-select` root via `data.value` and a `change` event fires with `{ value }`. Clicking a `s-select-item` selects it and closes the dropdown. Clicking the trigger toggles the dropdown; clicking outside closes it.

## Composition

A Select is built from a trigger (with a value) and a content panel (with grouped items):

```
s-select
├── s-select-trigger
│   └── s-select-value
└── s-select-content
    ├── s-select-group
    │   ├── s-select-label
    │   ├── s-select-item
    │   └── s-select-item
    ├── s-select-separator
    └── s-select-group
        ├── s-select-label
        ├── s-select-item
        └── s-select-item
```

## Parts

| Component | Purpose |
|---|---|
| `<s-select>` | Root — owns the open/selected state |
| `<s-select-trigger>` | The button that opens the dropdown and shows the value |
| `<s-select-value>` | Displays the selected value (or a `placeholder` when empty) |
| `<s-select-content>` | The dropdown panel, shown when open; matches the trigger width and scrolls |
| `<s-select-group>` | Groups a set of items |
| `<s-select-item>` | A selectable option (`value`) |
| `<s-select-label>` | A muted heading that titles a group |
| `<s-select-separator>` | A horizontal divider between groups |

## Props

### `s-select-trigger`

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | string | `"default"` | `default` \| `sm` |
| `disabled` | boolean | `false` | Disables the trigger |
| `ariaInvalid` | boolean | `false` | Marks the trigger as invalid |

### `s-select-value`

| Prop | Type | Default | Description |
|---|---|---|---|
| `placeholder` | string | `""` | Text shown when no value is selected |

### `s-select-item`

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | string | `""` | The value returned when this item is selected |
| `label` | string | `""` | Optional label; defaults to the item's text |

## Groups

Use `s-select-group`, `s-select-label`, and `s-select-separator` to organize items.

<s-component-viewer subject="s-select" title="false" description="false" config="false"></s-component-viewer>
```html
<s-select>
  <s-select-trigger><s-select-value placeholder="Select a fruit"></s-select-value></s-select-trigger>
  <s-select-content>
    <s-select-group>
      <s-select-label>Select a fruit</s-select-label>
      <s-select-item value="apple">Apple</s-select-item>
      <s-select-item value="banana">Banana</s-select-item>
    </s-select-group>
    <s-select-separator></s-select-separator>
    <s-select-group>
      <s-select-label>More</s-select-label>
      <s-select-item value="cherry">Cherry</s-select-item>
    </s-select-group>
  </s-select-content>
</s-select>
```

## Scrollable

A select with many items scrolls. Scroll buttons appear at the top/bottom of the panel when there's content to scroll.

<s-component-viewer subject="s-select" title="false" description="false" config="false"></s-component-viewer>
```html
<s-select>
  <s-select-trigger><s-select-value placeholder="Pick a fruit"></s-select-value></s-select-trigger>
  <s-select-content>
    <s-select-group>
      <s-select-item value="1">Apple</s-select-item>
      <s-select-item value="2">Banana</s-select-item>
      <s-select-item value="3">Blueberry</s-select-item>
      <s-select-item value="4">Cherry</s-select-item>
      <s-select-item value="5">Grapes</s-select-item>
      <s-select-item value="6">Kiwi</s-select-item>
      <s-select-item value="7">Mango</s-select-item>
      <s-select-item value="8">Orange</s-select-item>
      <s-select-item value="9">Peach</s-select-item>
      <s-select-item value="10">Pear</s-select-item>
      <s-select-item value="11">Pineapple</s-select-item>
      <s-select-item value="12">Plum</s-select-item>
    </s-select-group>
  </s-select-content>
</s-select>
```

## Disabled

<s-component-viewer subject="s-select" title="false" description="false" config="false"></s-component-viewer>
```html
<s-select disabled>
  <s-select-trigger><s-select-value placeholder="Disabled"></s-select-value></s-select-trigger>
  <s-select-content>
    <s-select-group>
      <s-select-item value="1">Option 1</s-select-item>
    </s-select-group>
  </s-select-content>
</s-select>
```

## Invalid

Add `aria-invalid` to the `s-select-trigger` to show an error state.

<s-component-viewer subject="s-select" title="false" description="false" config="false"></s-component-viewer>
```html
<s-select>
  <s-select-trigger aria-invalid><s-select-value placeholder="Select a fruit"></s-select-value></s-select-trigger>
  <s-select-content>
    <s-select-group>
      <s-select-item value="apple">Apple</s-select-item>
    </s-select-group>
  </s-select-content>
</s-select>
```

## Sizes

<s-component-viewer subject="s-select-trigger" title="false" description="false" config="false"></s-component-viewer>
```html
<s-select>
  <s-select-trigger size="default"><s-select-value placeholder="Default"></s-select-value></s-select-trigger>
  <s-select-content>
    <s-select-item value="a">Default</s-select-item>
  </s-select-content>
</s-select>
<s-select>
  <s-select-trigger size="sm"><s-select-value placeholder="Small"></s-select-value></s-select-trigger>
  <s-select-content>
    <s-select-item value="a">Small</s-select-item>
  </s-select-content>
</s-select>
```

## Theming

The select uses theme-dependent tokens (matching shadcn's `style-*.css` `.cn-select-trigger`). The **height, radius, font-size, and padding vary per theme** — e.g. Vega `rounded-md`/`h-9`, Nova `rounded-lg`/`h-8`, Maia `rounded-4xl`/`h-9`/`px-3`, Lyra `rounded-none`/`h-8`/`text-xs`, Mira `rounded-md`/`h-7`, Sera underline/`h-10`/`px-0`, Rhea `rounded-2xl`/`h-8`.

Tokens: `--select-trigger-radius`, `--select-trigger-height-default`, `--select-trigger-height-sm`, `--select-trigger-font-size`, `--select-trigger-padding-x`, `--select-trigger-padding-y`, `--select-trigger-gap`, `--select-icon-size`.
