# Variables

You can define your variables within the `data` section of your component, as shown below. You can also use `props`, `state`, values returned from `methods`, globals like `window`, and anything on `component`. `data`, `props` and `state` are **reactive** — when they change, the template re-renders.

## Where Variables Live

- `data` — the component's own reactive data.
- `props` — reactive props passed as attributes on the component tag.
- `state` — reactive state shared with the entire component tree.
- `methods` — functions that return values, e.g. `{{methods.fullName()}}`.
- `window` — any global is reachable, e.g. `{{window.innerWidth}}` or `{{Math.round(data.x)}}`.
- `component` — anything on the element instance, e.g. `{{component.someProp}}`.

?> Only `data`, `props` and `state` are reactive. `methods` return values, globals and `component` properties are read at render time but do not trigger a re-render on their own. See [Reactivity](docs/reactivity.md) for details.

!> Never assign a value inside the template, such as `{{data.name = "x"}}`. Assignments cause an infinite render loop. Change variables from `methods` or lifecycle hooks instead.



## A Simple Example

<details>
  <summary><ins>Live demo</ins></summary>
  <repl-component id="r87o41dbwta1r0b"/>
</details>

```html:index.html
<html>
  <head>
    <title>simply.js</title>
  </head>
  <body>
    <greeting-comp some-prop="World"></greeting-comp>
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
  <p>Prop: {{props["some-prop"]}}</p>
  <p>State: {{state.counter}}</p>
  <p>Method: {{methods.fullName()}}</p>
  <p>Global: {{window.innerWidth}}px</p>
  <button onclick="methods.change()">Increment</button>
</html>

<script>
  class simply {
    props = {
      // Props available in <html>
    }
    data = {
      // Data available in <html>
      name: "Simply"
    }
    state = {
      // State available in <html>
      counter: 0
    }
    methods = {
      // Functions available in <html>
      fullName: function() {
        return data.name + " JS";
      },
      change: function() {
        state.counter++;
      }
    }
  }
</script>
```

## Expressions

Anything valid in JavaScript can be written inside `{{...}}` — math, ternaries, string methods and function calls:

```html
<html>
  <p>{{data.age + 10}}</p>
  <p>{{data.name.toUpperCase()}}</p>
  <p>{{data.count > 5 ? "many" : "few"}}</p>
  <p>{{methods.fullName()}}</p>
</html>
```

## Binding Values to Attributes

You can bind any value to an attribute with `{{...}}`. Three syntaxes are supported and they all become props on your component:

- `attr="{{...}}"`<br>
  String attribute. Values are written as strings, but Simply will convert them to the necessary types (Object, Boolean, Number, etc.) in the component's `props`.
- `.prop="{{...}}"`<br>
  JS property. Sets the property directly without serialization. Recommended for objects, arrays, and complex data, and required for form state (`checked`, `value`, `selected`, `enabled`, etc.).
- `?attr="{{...}}"`<br>
  Boolean attribute. Toggles by adding or removing the attribute. Use for declarative booleans like `hidden`/`open` — do not use for `checked`, `value`, `selected`, etc.

```html
<html>
  <!-- string attribute -->
  <child-comp title="{{data.title}}"></child-comp>

  <!-- JS property — recommended for objects/arrays/numbers/booleans AND for form state -->
  <child-comp .settings="{{data.settings}}"></child-comp>
  <input type="checkbox" .checked="{{data.enabled}}">
  <input .value="{{data.name}}">

  <!-- Toggle attribute by a boolean -->
  <button ?disabled="{{data.disabled}}">Submit</button>
  <div ?hidden="{{data.hidden}}">Panel</div>
</html>
```

?> You can pass objects/arrays via a string attribute with `simply.objToPropString()` and single quotes (`settings='{{simply.objToPropString(data.settings)}}'`), but it is a legacy API. For JS properties, `.prop="{{...}}"` is recommended — no stringification needed.

## Variables in `<static>`

Content inside a `<static>` tag is rendered only once. Even if a reactive variable inside it changes later, the static part is not re-rendered. Use it for parts of the template that never change.

```html
<html>
  <static>
    <p>Rendered once: {{data.name}}</p>
  </static>
  <p>Re-rendered: {{data.counter}}</p>
</html>
```

---

## Learn More

- [Template](docs/template.md)
- [Style](docs/style.md) — in the style tag use `var(data.color)`, not `{{...}}`
- [Each Loops](docs/loops.md) — inside an `each` loop you access items directly
- [Reactivity](docs/reactivity.md)
- [DOM Events](docs/dom-events.md)
