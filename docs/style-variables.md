# Style Variables

Reactive JavaScript values can be injected anywhere inside the style tag with `var()`. The expression is evaluated against the component scope (`data`, `state`, `props`, ...) and the result is re-applied automatically when the underlying value changes.

```css
color: var(data.color);
transform: rotate(var(state.deg)deg);
width: var(data.asd == 1 && (data.asd == 1 || data.asd == 2) ? "100px" : "200px");
```

?> Only `var(...)` calls whose expression does **not** start with `--` are treated as JavaScript. Native CSS custom properties like `var(--my-token)` keep their standard meaning.

<details>
  <summary><ins>Live demo</ins></summary>
  <repl-component id="jl1mu317vtx6xnd"/>
</details>

```html:index.html
<html>
  <head>
    <title>simply.js</title>
  </head>
  <body>
    <dynamic-color></dynamic-color>
    <script src="https://simply.js.org/simply.min.js"></script>
    <script>
      get("dynamic-color.html");
    </script>
  </body>
</html>
```

```html:dynamic-color.html
<html>
  <div class="box" onclick="state.color = state.color === 'tomato' ? '#0984e3' : 'tomato';">Toggle Color</div>
</html>

<style>
  .box {
    width: 120px;
    height: 120px;
    color: white;
    font-family: sans-serif;
    border-radius: 12px;
    background: var(state.color);
    transform: rotate(var(state.deg)deg);
    transition: all 250ms ease;
  }
  a {
    color: var(data.linkColor);
  }
</style>

<script>
  class simply {
    data = {
      linkColor: "#6c5ce7"
    }
    state = {
      color: "tomato",
      deg: 12
    }
  }
</script>
```

See [Style](docs/style.md) for an overview of component styling.
