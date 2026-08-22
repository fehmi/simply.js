# Props

Props are reactive values passed as attributes on the component tag. In Simply.js, attributes are synchronized with properties (props) — if you define an attribute value, the corresponding prop will also be defined.

```html
<child-component message="This is a message from parent"/>
```

You can then access it in the template section of the child component as follows:

```html
<html> {props.message} </html>
```

You can assign any type of value to attributes, including `Object`, `Array`, `String`, `Boolean`, `Number`, and even `Function`.

Like Lit, three binding syntaxes are supported and they all become props on the component:

- `attr="{{...}}"`<br>
  String attribute. Values are written as strings, but Simply will convert them to the necessary types (Object, Boolean, Number, etc.) in the component's `props`.
- `.prop="{{...}}"`<br>
  JS property. Sets the property directly without serialization. Recommended for objects, arrays, and complex data, and required for form state (`checked`, `value`, `selected`, `enabled`, etc.).
- `?attr="{{...}}"`<br>
  Boolean attribute. Toggles by adding or removing the attribute. Use for declarative booleans like `hidden`/`open` — do not use for `checked`, `value`, `selected`, etc.

!> Do not use `?checked`/`?value` — use `.checked`/`.value` instead, otherwise list re-rendering reuses DOM nodes and the checked state appears to shift to the next item.

In the legacy API for string attributes, complex values need to be stringified and wrapped in single quotes with `simply.objToPropString()`.

```html
<my-app myProp='{a: "b"}'/>
<test-comp settings='{{simply.objToPropString(data.settings)}}'/>
```

With `.prop="{{}}"` you can pass the value directly — no stringification needed. The same applies to form state:

```html
<test-comp .settings="{{data.settings}}"></test-comp>
<input type="checkbox" .checked="{{data.enabled}}">
<input .value="{{data.name}}">
```

!> Using `?checked="{{data.enabled}}"` only sets the initial `checked` *attribute*. For live checkbox, radio, and select state, always use `.checked`/`.value`/`.selected` — otherwise deleting or reordering a list makes the checked state shift to the next DOM node.

Alternatively, you can access your predefined attributes as props from anywhere within the script section of the component, as shown below:

```html
<script>
  class {
    lifecycle = {
      afterFirstRender() {
        alert("The message from parent is " + props.message);
      }
    }
  }
</script>
```

!> Do not change attributes directly using `setAttribute`, as this can disrupt the DOM's rendering algorithm.

## Where Props Live

There are three primary ways to reach, define and modify props.

1.  **As an inline attribute directly in HTML:**<br>
    `<my-app myProp='hello'>`

2.  **Within a component class:**<br>
    `class { props = {"myProp": "myValue"} }`

3.  **Within the component's logic:**<br>
    In methods, lifecycle hooks etc like `props.myProp = "myValue"`

?> The prop changes inside script (class, logic) overrides the props defined in inline attributes.

## Example

Everything above in a single example — props passed as inline attributes (including a complex object via `simply.objToPropString()`), accessed in the template and in the script, and overridden inside the component.

<details>
  <summary><ins>Live demo</ins></summary>
  <repl-component id="wew4e293kzfmld0"/>
</details>

```html:index.html
<html>
  <head>
    <title>simply.js - Props</title>
  </head>
  <body>
    <parent-component></parent-component>
    <script src="https://simply.js.org/simply.min.js"></script>
    <script>
      get("parent-component.html");
      get("child-component.html");
    </script>
  </body>
</html>
```

```html:parent-component.html
<html>
  <child-component
    title="From parent"
    message="Hello from parent"
    count="3"
    settings='{{simply.objToPropString(data.settings)}}'
  ></child-component>
</html>

<script>
  class simply {
    data = {
      settings: {
        theme: "dark",
        items: [1, 2, 3]
      }
    }
  }
</script>
```

```html:child-component.html
<html>
  <h3>Title: {{props.title}}</h3>
  <p>Message: {{props.message}}</p>
  <p>Count: {{props.count}}</p>
  <p>Theme: {{props.settings.theme}}</p>
  <p>Items: {{props.settings.items.join(", ")}}</p>
  <p>Via method: {{methods.getTitle()}}</p>
</html>

<script>
  class simply {
    props = {
      // Overrides the inline attribute
      title: "Overridden in class"
    }
    methods = {
      getTitle: function () {
        // Props are accessible anywhere in the script
        return props.title;
      }
    }
  }
</script>
```

---

## Learn More

- [Script](docs/script.md)
- [Component Communication](docs/component-communication.md)
- [Variables](docs/variables.md)
