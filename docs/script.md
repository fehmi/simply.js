# Script

The `<script>` tag contains the entire logic and data of a component. It is written as a `class simply {}` object. The class can define `props`, `data`, `state`, `methods`, `lifecycle` and `settings`.

## The Class

Here is the class of a component script:

```js
class simply {
  props = {} // Reactive props object set by attributes.
  data = {} // Reactive data object.
  state = {} // Reactive state object shared with the entire component tree. 
  methods = {} // Functions, callable from templates and lifecycle hooks.
  lifecycle = {
    afterConstruct() {} // Called after the component is constructed.
    beforeRender() {} // Called before each render. 
    beforeFirstRender() {} // Called before the first render.
    afterFirstRender() {} // Called after the first render.
    beforeRerender() {} // Called before a re-render.
    afterRerender() {} // Called after a re-render.
    afterRender() {} // Called after every render.
    disconnected() {} // Called when the component is removed from the DOM.
    whenDataChange(changes) {} // Called when data changes.
    whenStateChange(changes) {} // Called when state changes.
    whenPropChange(changes) {} // Called when a prop changes.
  }
  settings = {
    animate: true // Enables the animation/transition attribute system.
  }
}
```

## A Simple Example

<details>
  <summary><ins>Live demo</ins></summary>
  <repl-component id="ot9kcsd4xlfkjbc"/>
</details>

```html:index.html
<html>
  <head>
    <title>simply.js</title>
  </head>
  <body>
    <greeting-comp some-prop="hello"></greeting-comp>
    <script src="https://simply.js.org/simply.min.js"></script>
    <script>
      get("greeting-comp.html");
    </script>
  </body>
</html>
```

```html:greeting-comp.html
<html>
  <h1>Hello World!</h1>
  <p>Greetings from {{data.name}}</p>
  <p>The value of prop is {{props["some-prop"]}}</p>
  <button onclick="methods.change()">Change name</button>
</html>

<style>
  h1 {
    font-family: Arial, Helvetica;
    color: var(state.color);
  }
</style>

<script>
  class simply {
    props = {
      // Props available in <html>
    }
    data = {
      // Data available in <html>
      name: "simply.js"
    }
    state = {
      // State available for the entire component tree
      color: "purple"
    }
    methods = {
      // Component functions
      change: function() {
        data.name = "another name"
      }
    }
    lifecycle = {
      // Lifecycle events
      afterFirstRender() {
        console.log("The component is rendered");
      },
      whenDataChange(changes) {
        // Hook for data changes
        console.log("data changed", changes);
      }
    }
  }
</script>
```

?> Reactive variables in the template are written with double curly braces, like `{{data.name}}`. In the style tag, use `var(data.color)` instead.

---

## Learn More

- [Load Components](docs/loadcomponent.md)
- [Component Communication](docs/component-communication.md)
- [Lifecycle](docs/lifecycle.md)
- [Reactivity](docs/reactivity.md)
- [State Management](docs/state.md)
