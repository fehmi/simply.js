# Scope & Encapsulation

## Light DOM

Custom elements render **without** a Shadow DOM by default. In this mode the component's style sheet is adopted by the whole document, so a plain selector like `h1 { }` can affect matching elements anywhere on the page — not just inside the component. They are also affected by any stylesheet added to the main document, as long as they are not inside a shadow root.

## Shadow DOM

Adding the `isolated` attribute mounts the component with a Shadow Root instead. The style sheet is then scoped to that shadow root: the component's styles no longer leak to the page.

?> Inherited styles from the document (for example `color` or `font` on `body`) still cascade into the component. Encapsulation only stops the component's own styles from leaking out.

## Host

The `:host` selector targets the component's own element. It is only available when the component is rendered with a Shadow Root, i.e. when its tag has the `isolated` attribute. Without `isolated` there is no Shadow Root, so a bare `:host { }` rule matches nothing.

<details>
  <summary><ins>Live demo</ins></summary>
  <repl-component id="aekn0cg3ar4tjnn"/>
</details>

```html:index.html
<html>
  <head>
    <title>simply.js</title>
  </head>
  <body>
    <host-demo isolated></host-demo>
    <script src="https://simply.js.org/simply.min.js"></script>
    <script>
      get("host-demo.html");
    </script>
  </body>
</html>
```

```html:host-demo.html
<html>
  <p>I live inside a shadow root 🛡️</p>
</html>

<style>
  /* Only applies when the component has the isolated attribute */
  :host {
    display: block;
    padding: 16px;
    border-radius: 8px;
    background: #dfe6e9;
  }

  /* Covers both modes: :host (isolated) + host-demo (light DOM) */
  :host, host-demo {
    border: 2px solid #6c5ce7;
  }

  p {
    color: #2d3436;
  }
</style>
```

To write a rule that works in **both** modes, repeat the selector with the component's tag name:

```css
:host, host-demo {
  border: 2px solid #6c5ce7;
}
```

- When `isolated` is present, `:host` matches the component element inside the shadow root.
- When it is not, the `host-demo` selector matches the element in the light DOM.

## Linking a CSS File

You can link an external stylesheet from inside the component's template tag, or via `@import` at the beginning of the `<style>` tag. This is a clean way to share design tokens across components.

Since Shadow DOM is off by default, a `:host {}` block inside the linked file only takes effect when the component uses the `isolated` attribute — otherwise define the tokens on `:root` (or on the component's tag name) so they apply in the light DOM.

<details>
  <summary><ins>Live demo</ins></summary>
  <repl-component id="qu6um8cudd2oxxw"/>
</details>

```html:index.html
<html>
  <head>
    <title>simply.js</title>
  </head>
  <body>
    <styled-comp isolated></styled-comp>
    <script src="https://simply.js.org/simply.min.js"></script>
    <script>
      get("styled-comp.html");
      get("another-comp.html");
    </script>
  </body>
</html>
```

```html:styled-comp.html
<html>
  <link rel="stylesheet" href="tokens.css" />
  <h1>Hello World!</h1>
  <p>Greetings from {{data.name}}</p> 
  <another-comp/>
</html>

<style>
  h1 {
    color: var(--s-color-accent);
  }
</style>

<script>
  class simply {
    data = {
      name: "simply.js"
    }
  }
</script>
```

```html:another-comp.html
<html>
  <h1>Child component</h1>
  <p>Greetings from child component</p> 
</html>

<style>
  h1 {
    color: var(--s-color-accent);
  }
</style>

<script>
  class simply {
    data = {
      name: "simply.js"
    }
  }
</script>
```

```css:tokens.css
:host {
  --s-color-accent: #0984e3;
  --s-color-bg: #dfe6e9;
}
```

Because custom properties follow normal CSS inheritance, the tokens defined on the parent's `:host` cascade into every nested component's shadow root — that's why `another-comp` can use `var(--s-color-accent)` without loading `tokens.css` itself.

- **Custom properties** (`--s-color-*`) cross the shadow boundary — inherited properties and custom properties pass through.
- **Regular selectors** (`button { }`) do not — the shadow boundary still protects the child from the parent's other rules.
- A child can **override** a token by redefining it on its own `:host`:

```css
:host {
  --s-color-accent: red; /* overrides the inherited token for this subtree */
}
```

See [Style](docs/style.md) for an overview of component styling.
