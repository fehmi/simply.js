# Input

A text input component for forms and user data entry with built-in styling and accessibility features.

## Usage

```html
<s-input light placeholder="Enter text"></s-input>
```

?> The input is a **form control** — use it **with `light`** (light DOM) so the native `<input>` participates in forms. It has no slot.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | string | `"default"` | `xs` \| `sm` \| `default` \| `lg` — matches button heights per theme |
| `type` | string | `"text"` | `text` \| `email` \| `password` \| `number` \| `tel` \| `url` \| `search` \| `file` \| `date` |
| `placeholder` | string | `""` | Placeholder text |
| `disabled` | boolean | `false` | Disables the input (opacity 0.5, no pointer events) |
| `ariaInvalid` | boolean | `false` | Marks the input as invalid (destructive border + ring) |

Other native attributes (`id`, `name`, `value`, `required`, `readonly`) pass through to the inner `<input>`.

## Sizes

```html
<s-input light size="xs" placeholder="Extra Small"></s-input>
<s-input light size="sm" placeholder="Small"></s-input>
<s-input light placeholder="Default"></s-input>
<s-input light size="lg" placeholder="Large"></s-input>
```

Input sizes match button sizes per theme, so `<s-input size="sm">` + `<s-button size="sm">` align perfectly.

## Basic

```html
<s-input light placeholder="Enter text"></s-input>
```

## With Label

```html
<div class="field">
  <s-label for="email">Email</s-label>
  <s-input light id="email" type="email" placeholder="name@example.com"></s-input>
</div>
```

## Disabled

```html
<s-input light placeholder="Cannot edit" disabled></s-input>
```

## Invalid

```html
<s-input light placeholder="This field has an error" aria-invalid></s-input>
```

## File

```html
<s-input light type="file"></s-input>
```

## Theming

The input uses theme-dependent tokens:

| Token | Value |
|---|---|
| `--color-input` | border color |
| `--color-ring` | focus ring color |
| `--color-destructive` | invalid border/ring color |
| `--color-muted-foreground` | placeholder color |
| `--color-primary` / `--color-primary-foreground` | selection colors |
| `--radius-md` | border radius |

<s-component-viewer subject="s-input"></s-component-viewer>
```html
<s-input light placeholder="test"/>
```

## s-input-group

Compound input with addons, buttons, or text inside. The group provides the border; the inner control is borderless.



?> The group is a flex container with a border and `h-9` height. The inner control (`s-input-group-input`) is **borderless** — use it **with `light`** (light DOM form control). The group highlights on focus and turns destructive when the control is `aria-invalid` (detected via lifecycle, since `:has()` can't cross the shadow boundary).

| Prop | Type | Default | Description |
|---|---|---|---|
| `slot` | string | `"<s-input-group-input>…<s-input-group-addon>…"` | The input + addons |

<s-component-viewer subject="s-input-group"></s-component-viewer>
```html
<s-input-group>
  <s-input-group-input placeholder="Search..." light></s-input-group-input>
  <s-input-group-addon>🔍</s-input-group-addon>
</s-input-group>
```

## s-input-group-input

A borderless input for use inside an `s-input-group`.

?> The input is a **form control** — use it **with `light`** (light DOM) so the native `<input>` participates in forms. It has `flex: 1` and no border (the group provides it).

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | string | `"text"` | `text` \| `email` \| `password` \| `number` \| `tel` \| `url` \| `search` \| `file` \| `date` |
| `placeholder` | string | `""` | Placeholder text |
| `disabled` | boolean | `false` | Disables the input |
| `ariaInvalid` | boolean | `false` | Marks the input as invalid (group turns destructive) |

<s-component-viewer subject="s-input-group-input"></s-component-viewer>
```html
<s-input-group>
  <s-input-group-input light placeholder="Search..."></s-input-group-input>
</s-input-group>
```

## s-input-group-addon

An addon (icon, text, or button) inside an `s-input-group`.

```html
<s-input-group>
  <s-input-group-input light placeholder="example.com"></s-input-group-input>
  <s-input-group-addon align="inline-end">
    <s-input-group-text>.com</s-input-group-text>
  </s-input-group-addon>
</s-input-group>
```

?> The addon is a flex container with `text-muted-foreground`. `align` controls placement: `inline-start` (left), `inline-end` (right), `block-start` (top), `block-end` (bottom).

| Prop | Type | Default | Description |
|---|---|---|---|
| `align` | `"inline-start" \| "inline-end" \| "block-start" \| "block-end"` | `"inline-start"` | Addon placement |
| `slot` | string | `"🔍"` | The addon content (icon, text, button) |

<s-component-viewer subject="s-input-group-addon"></s-component-viewer>

## s-input-group-text

Text inside an `s-input-group-addon`.

```html
<s-input-group-addon>
  <s-input-group-text>https://</s-input-group-text>
</s-input-group-addon>
```

?> The text is a flex span with `text-sm` and `text-muted-foreground`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `slot` | string | `"https://"` | The text |

<s-component-viewer subject="s-input-group-text"></s-component-viewer>

## s-input-group-button

A button for use inside an `s-input-group-addon`.

```html
<s-input-group>
  <s-input-group-input light placeholder="Enter your username"></s-input-group-input>
  <s-input-group-addon align="inline-end">
    <s-input-group-button>Send</s-input-group-button>
  </s-input-group-addon>
</s-input-group>
```

?> A standalone button with `ghost` variant and `xs` size defaults. Clicking it does **not** focus the input (the addon's click-to-focus skips interactive elements).

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "icon-xs" \| "sm" \| "icon-sm"` | `"xs"` | Button size |
| `variant` | `"default" \| "destructive" \| "outline" \| "secondary" \| "ghost" \| "link"` | `"ghost"` | Button variant |
| `disabled` | boolean | `false` | Disables the button |
| `slot` | string | `"Button"` | The button text |

<s-component-viewer subject="s-input-group-button"></s-component-viewer>

## s-input-group-textarea

A borderless textarea for use inside an `s-input-group`.

```html
<s-input-group>
  <s-input-group-textarea light placeholder="Enter your message"></s-input-group-textarea>
  <s-input-group-addon align="block-end">
    <s-input-group-button>Send</s-input-group-button>
  </s-input-group-addon>
</s-input-group>
```

?> The textarea is a **form control** — use it **with `light`** (light DOM). The group auto-heights when it contains a textarea (detected via lifecycle → `data-textarea`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `placeholder` | string | `""` | Placeholder text |
| `disabled` | boolean | `false` | Disables the textarea |
| `ariaInvalid` | boolean | `false` | Marks the textarea as invalid (group turns destructive) |

<s-component-viewer subject="s-input-group-textarea"></s-component-viewer>