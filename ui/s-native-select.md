# Native Select

A styled native `<select>` element. Options are passed as children.

<s-component-viewer subject="s-native-select"></s-component-viewer>
```html
<s-native-select>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
  <option value="3">Option 3</option>
</s-native-select>
```

?> The native select uses **shadow DOM** (default) so the `<option>` children can be slotted (a native `<select>` can't render a `<slot>` as options, so the lifecycle clones the slotted options into the select on every render — this keeps them intact when props like `size` change). The selected value is exposed via `data.value` and a `change` event fires with `{ value }`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | string | `"default"` | `default` \| `sm` — matches input heights per theme |
| `disabled` | boolean | `false` | Disables the select |
| `ariaInvalid` | boolean | `false` | Marks the select as invalid (destructive border + ring) |

The select reuses the input theme tokens (`--input-radius`, `--input-height`, `--input-height-sm`, `--input-font-size`), so its radius/height/font match `<s-input>` per theme.

## Sizes

```html
<s-native-select>
  <option>Default</option>
</s-native-select>
<s-native-select size="sm">
  <option>Small</option>
</s-native-select>
```