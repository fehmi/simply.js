# Textarea

Displays a form textarea or a component that looks like a textarea. A multi-line input for longer text.

## Usage

<s-component-viewer subject="s-textarea"></s-component-viewer>
```html
<s-textarea light placeholder="Type your message here."></s-textarea>
```

?> The textarea is a **form control** — use it **with `light`** (light DOM) so the native `<textarea>` participates in forms. It has no slot.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `placeholder` | string | `""` | Placeholder text |
| `disabled` | boolean | `false` | Disables the textarea (opacity 0.5, no pointer events) |
| `ariaInvalid` | boolean | `false` | Marks the textarea as invalid (destructive border + ring) |

Other native attributes (`id`, `name`, `required`) pass through to the inner `<textarea>`.

## Basic

```html
<s-textarea light placeholder="Type your message here."></s-textarea>
```

## With Label

```html
<div class="field">
  <s-label for="message">Message</s-label>
  <s-textarea light id="message" placeholder="Type your message here."></s-textarea>
</div>
```

## Disabled

```html
<s-textarea light placeholder="Cannot edit" disabled></s-textarea>
```

## Invalid

```html
<s-textarea light placeholder="This field has an error" aria-invalid></s-textarea>
```

## Theming

The textarea uses theme-dependent tokens:

| Token | Value |
|---|---|
| `--textarea-radius` | theme-dependent border radius |
| `--color-input` | border color |
| `--color-ring` | focus ring color |
| `--color-destructive` | invalid border/ring color |
| `--color-muted-foreground` | placeholder color |