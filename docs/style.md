# Style

The `<style>` tag of a component is processed by Simply.js' own style engine, which extends plain CSS with reactive values and conditions:

- **Dynamic variables** — inject reactive values with `var(data.color)`, `var(state.deg)` or any expression.
- **Conditions** — toggle rule blocks with `&cond:[if="..." ]`, `&cond:[elsif="..." ]` and `&cond:[else]`.

Everything else behaves like standard CSS, including native custom properties such as `var(--my-token)`.

?> By default components render **without** Shadow DOM, so `:host` only works when the `isolated` attribute is present. See [Scope & Encapsulation](docs/style-scope.md).

## A Simple Example

Styles defined inside a component's `<style>` tag style the template rendered by the component.

<details>
  <summary><ins>Live demo</ins></summary>
  <repl-component id="kpryxkvrikhsij6"/>
</details>

```html:index.html
<html>
  <head>
    <title>simply.js</title>
  </head>
  <body>
    <styled-box></styled-box>
    <script src="https://simply.js.org/simply.min.js"></script>
    <script>
      get("styled-box.html");
    </script>
  </body>
</html>
```

```html:styled-box.html
<html>
  <h1>Hello from the style tag!</h1>
</html>

<style>
  h1 {
    color: var(data.color);
    font-family: sans-serif;
  }

  &cond:[if="data.big"] {
    h1 {
      font-size: 64px;
    }
  }
</style>

<script>
  class simply {
    data = {
      color: "#6c5ce7",
      big: true
    }
  }
</script>
```

!> Reactive CSS is more expensive than reactive HTML: every change re-renders the whole layout. Modern browsers are very fast, but use it cautiously — prefer static CSS and native custom properties (`var(--token)`) where possible.

---

## Learn More

- [Style Variables](docs/style-variables.md) — reactive `var(...)` expressions
- [Style Conditions](docs/style-conditions.md) — `&cond:[...]` blocks
- [Scope & Encapsulation](docs/style-scope.md) — `isolated`, `:host`, linking CSS files
