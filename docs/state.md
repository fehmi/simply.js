# State Management

State management is straightforward in Simply.js. When you define a `state` in a component, all child components share that same state and can retrieve or modify it. Any manipulation of the state — no matter where it happens in the component tree — affects every component sharing that state, causing them all to react to the new value.

?> The key difference between `data`/`props` and `state` is that changes to `data` or `props` affect the current component and its children, but not its parents. Changes to `state` affect every component in the tree — both children and parents.

## How State Works

- **One shared object**
<br>The first component in the tree that defines a `state` creates it. Every descendant reuses that same object instead of creating its own, so there is only ever one source of truth.
- **Read & write from anywhere**<br>Any component in the tree can read `state.counter` or write `state.counter = 5`.
- **Reacts everywhere**<br>When the state changes, every component that references the changed value in its template or style re-renders automatically.
- **Merging**<br>If a child component defines its own `state` keys in its class, they are merged into the shared state object and become visible to the whole tree.
- **`whenStateChange(changes)`**<br>A lifecycle hook that fires whenever the state changes. Returning `false` from it prevents the re-render.

## Example

This example has a parent and two children sharing a single state. Click the parent's button and watch every component react; click a child's button and the parent reacts too.

<details>
  <summary><ins>Live demo</ins></summary>
  <repl-component id="ebc7rwx9w4orh5u"/>
</details>

```html:index.html
<html>
  <head>
    <title>simply.js - State Management</title>
    <style>
      body {
        background: #1a1718;
        color: #f2eded;
        font-family: Arial, Helvetica, sans-serif;
      }
    </style>
  </head>
  <body>
    <parent-component></parent-component>
    <script src="https://simply.js.org/simply.min.js"></script>
    <script>
      get(["parent-component.html", "child-component.html"]);
    </script>
  </body>
</html>
```

```html:parent-component.html
<html>
  <div class="parent-box">
    <h2>Parent</h2>
    <p>Counter: <strong>{{state.counter}}</strong></p>
    <button onclick="methods.increment()">+1 from parent</button>
    <child-component></child-component>
    <child-component></child-component>
  </div>
</html>

<style>
  .parent-box {
    border: 2px solid #b8b2b2;
    border-radius: 10px;
    padding: 16px;
    margin: 8px;
    background: #2a2526;
    color: #f2eded;
  }
  h2 {
    margin-top: 0;
  }
  button {
    background: #b8b2b2;
    color: #1a1718;
    border: none;
    border-radius: 6px;
    padding: 8px 14px;
    cursor: pointer;
  }
</style>

<script>
  class simply {
    state = {
      counter: 0
    }
    methods = {
      increment: function () {
        state.counter++;
      }
    }
    lifecycle = {
      whenStateChange(changes) {
        console.log("State changed:", changes);
      }
    }
  }
</script>
```

```html:child-component.html
<html>
  <div class="child-box">
    <h3>Child</h3>
    <p>Counter: <strong>{{state.counter}}</strong></p>
    <button onclick="methods.increment()">+1 from child</button>
  </div>
</html>

<style>
  .child-box {
    border: 2px solid #b8b2b2;
    border-radius: 10px;
    padding: 16px;
    margin: 8px;
    background: #1a1718;
    color: #b8b2b2;
  }
  h3 {
    margin-top: 0;
  }
  button {
    background: #b8b2b2;
    color: #1a1718;
    border: none;
    border-radius: 6px;
    padding: 8px 14px;
    cursor: pointer;
  }
</style>

<script>
  class simply {
    methods = {
      increment: function () {
        state.counter++;
      }
    }
  }
</script>
```

---

## Learn More

- [Variables](docs/variables.md)
- [Reactivity](docs/reactivity.md)
- [Component Communication](docs/component-communication.md)
