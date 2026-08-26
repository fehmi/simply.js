# Spinner

A loading spinner indicator. No children, no slot.

```html
<s-spinner></s-spinner>
```

<s-component-viewer subject="s-spinner"></s-component-viewer>

?> The spinner is a self-contained SVG icon. It renders in shadow DOM by default. Size defaults to 16px; override with the `--spinner-size` CSS variable or an inline `style="--spinner-size: 1.5rem"`.

## In a Button

```html
<s-button disabled>
  <s-spinner></s-spinner>
  Loading
</s-button>
```

The spinner inherits the button's text color via `currentColor`.