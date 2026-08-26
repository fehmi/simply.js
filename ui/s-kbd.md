# Kbd

Used to display textual user input from keyboard. A small keycap-style element.

## Usage

```html
<s-kbd>Ctrl</s-kbd>
```

<s-component-viewer subject="s-kbd"></s-component-viewer>

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `slot` | string | `"⌘K"` | The key label (children) |

## Basic

```html
<s-kbd>Ctrl</s-kbd>
<s-kbd>⌘K</s-kbd>
<s-kbd>Ctrl + B</s-kbd>
```

## Group

Use `s-kbd-group` to group keyboard keys together:

```html
<s-kbd-group>
  <s-kbd>⌘</s-kbd>
  <s-kbd>⇧</s-kbd>
  <s-kbd>⌥</s-kbd>
  <s-kbd>⌃</s-kbd>
</s-kbd-group>
```

## In a Button

```html
<s-button variant="outline" size="sm">Accept <s-kbd>⏎</s-kbd></s-button>
```

## Theming

The Kbd uses theme-dependent tokens:

| Token | Value |
|---|---|
| `--color-muted` | background |
| `--color-muted-foreground` | text color |
| `--radius-sm` | border radius |