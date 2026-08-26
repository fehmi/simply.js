# HTML

This section describes the rendering portion of a component. Elements within the `<html>` tag are mounted to the DOM after being processed by the template engine. While most components include an `<html>` tag, it is not mandatory; some components may only contain a `<script>` tag with their logic.

The simply.js template engine operates within the `<html>` tag, functioning as a superset of HTML. This engine supports [conditionals](docs/conditionals.md), [each loops](docs/loops.md), [reactive variables](docs/variables.md), [DOM events](docs/dom-events.md), [slots](docs/slot.md), and [nested components](docs/nested-components.md).

?> Reactive variables are written with double curly braces, like `{{data.name}}`. You can reach all of `{{data}}`, `{{props}}`, `{{state}}`, `{{parent}}`, `{{dom}}`, `{{methods}}`, `{{component}}`, `{{lifecycle}}` and `{{name}}` defined in the script tag.

## A Simple Example

<details>
  <summary><ins>Live demo</ins></summary>
  <repl-component id="qr1ror4kde24hyw"/>
</details>

```html:index.html
<html>
  <head>
    <title>simply.js</title>
  </head>
  <body>
    <greeting-comp></greeting-comp>
    <script src="https://simply.js.org/simply.min.js"></script>
    <script>
      get("greeting-comp.html");
    </script>
  </body>
</html>
```

```html:greeting-comp.html
<html>
  <h1>Hello, {{data.name}}!</h1>
</html>

<script>
  class simply {
    data = {
      name: "World"
    }
  }
</script>
```

?> Custom element tags can be written self-closing, like `<greeting-comp/>`, but some older browsers require an explicit closing tag: `<greeting-comp></greeting-comp>`. Using the explicit form is the safest choice for maximum compatibility.

## The `<static>` Tag

Content wrapped inside a `<static>` tag is rendered only once. Even if a reactive variable inside it changes later, the static part will not be re-rendered. This is useful for performance when a part of the template never changes.

```html
<html>
  <static>
    <h1>This header is rendered once</h1>
  </static>
  <p>{{data.counter}}</p>
</html>
```

You can learn more about the engine in the [template engine](docs/variables.md) section.
