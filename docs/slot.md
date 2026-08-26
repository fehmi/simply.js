# Slot

You can pass content to a component by placing it directly inside the component's tag. simply.js uses the **native Web Components slot** mechanism, so slots work on components that are mounted with a Shadow Root — which is the default. Add `light` to a component only when you need it in the light DOM (e.g. form controls); slots won't project there.

<details>
  <summary><ins>Live demo</ins></summary>
  <repl-component id="09c8wbdhkpv5kf5"/>
</details>

```html:index.html
<html>
  <head>
    <title>simply.js</title>
  </head>
  <body>
    <page-component></page-component>
    <script src="https://simply.js.org/simply.min.js"></script>
    <script>
      get("page-component.html");
      get("card-component.html");
    </script>
  </body>
</html>
```

```html:page-component.html
<html>
  <card-component>
    <h2 slot="title">{{data.title}}</h2>
    <p>{{data.message}}</p>
  </card-component>
</html>

<script>
  class simply {
    data = {
      title: "Dynamic page title",
      message: "This content comes from the parent's data."
    }
  }
</script>
```

```html:card-component.html
<html>
  <div class="card">
    <slot name="title"></slot>
    <slot></slot>
  </div>
</html>

<style>
  .card {
    border: 2px solid #6c5ce7;
    border-radius: 8px;
    padding: 16px;
  }
</style>
```

## How It Works

- **Shadow DOM is the default**<br>
  Components mount with a Shadow Root by default, so `<slot>` projects content. Add `light` to opt into the light DOM — there `<slot>` has no effect.

- **Native behavior**<br>
  Usage is identical to native Web Components: define `<slot>` in the component's template and place the content inside the component's tag.

- **Default slot**<br>
  `<slot></slot>` renders all content placed inside the tag.

- **Named slots**<br>
  `<slot name="title">` matches content marked with `slot="title"`.

- **Fallback content**<br>
  Content written inside `<slot>` is shown when nothing is passed: `<slot>Default text</slot>`.

## Slot Content Uses the Parent's Scope

Slot content is part of the **parent's** template, so it can use the parent's `data`, `props` and `state` — not the child's. In the example above, `{{data.title}}` and `{{data.message}}` refer to `page-component`'s data, even though they are rendered inside `card-component`.
