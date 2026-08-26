# Switch

A toggle switch control. No children, no slot.


<s-component-viewer subject="s-switch"></s-component-viewer>
```html
<s-switch></s-switch>
<s-switch default-checked></s-switch>
<s-switch size="sm" default-checked></s-switch>
<s-switch disabled></s-switch>
```

?> The switch is a self-contained `<button role="switch">`. It renders in shadow DOM by default. `default-checked` sets the initial checked state; clicking toggles it and fires a `change` event with `{ checked }`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | string | `"default"` | `default` \| `sm` |
| `default-checked` | boolean | `false` | Initial checked state |
| `disabled` | boolean | `false` | Disables the switch |

## Theme tokens

The switch sizes/radius/border vary per theme via `--switch-*` tokens:

| Theme | Track (default) | Thumb | Radius |
|---|---|---|---|
| Vega / Nova / Maia / Lyra | 32×18.4 | 16 | full |
| Mira | 28×16.6 | 14 | full |
| Luma | 44×20 | 24×16 | full |
| Sera | 33×18 | 14 | 0 |
| Rhea | 32×20 | 16 | 16px |