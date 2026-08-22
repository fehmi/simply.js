## Parent to Child

Using `component.querySelector("child-component")` you can directly access a child component's scope — read its data, call its methods, or change its data to trigger reactivity inside it. Everything in that child's scope is reachable, and you can keep chaining `querySelector` to reach deeper children.

```js
// Read a variable from child's data
component.querySelector("child-component").data.name;

// Change a variable in child's data (triggers reactivity in the child)
component.querySelector("child-component").data.name = "New name";

// Call a method from a child
component.querySelector("child-component").methods.functionName();

// Access a grandchild through the child
var child = component.querySelector("child-component");
child.querySelector("grand-child").data.name = "New name";
child.querySelector("grand-child").methods.functionName();
```

<details>
  <summary><ins>Live demo</ins></summary>
  <repl-component id="xcjmqha6hl04p3r"/>
</details>

```html:index.html
<html>
  <head>
    <title>simply.js - Parent to Child Communication</title>
  </head>
  <body>
    <parent-component></parent-component>
    <script src="https://simply.js.org/simply.min.js"></script>
    <script>
      get(["parent-component.html", "child-component.html", "grand-child.html"]);
    </script>
  </body>
</html>
```

```html:parent-component.html
<html>
  <h2>Parent</h2>
  <child-component></child-component>
  <br>
  <button onclick="methods.talkToChild()">Talk to child</button>
</html>

<script>
  class simply {
    methods = {
      talkToChild: function () {
        // Read a variable from child's data
        var child = component.querySelector("child-component");
        console.log(child.data.name); // => "Child"

        // Change a variable in child's data (triggers reactivity)
        child.data.name = "New name";

        // Call a method from the child
        child.methods.sayHello();

        // Access the grandchild through the child
        var grandChild = child.querySelector("grand-child");
        grandChild.data.name = "New name";
        grandChild.methods.sayHello();
      }
    }
  }
</script>
```

```html:child-component.html
<html>
  <h3>Child: {{data.name}}</h3>
</html>

<script>
  class simply {
    data = {
      name: "Child"
    }
    methods = {
      sayHello: function () {
        console.log("Hello from the child");
      }
    }
  }
</script>
```

```html:grand-child.html
<html>
  <h3>Grand Child: {{data.name}}</h3>
</html>

<script>
  class simply {
    data = {
      name: "Grand Child"
    }
    methods = {
      sayHello: function () {
        console.log("Hello from the grand child");
      }
    }
  }
</script>
```

## Props

Another way to pass data from a parent to a child is through **props** — attributes on the component tag. The child accesses them via `props` in its template, script or style.

```html
<child-component message="This is a message from parent"></child-component>
```

```html:child-component.html
<html>
  <p>{{props.message}}</p>
</html>
```

Props are reactive — when the parent changes the attribute, the child re-renders. For details on defining, passing and overriding props, see [Props](docs/props.md).

## Child to Parent

It is possible to communicate directly with parent components using `component.parent`. The same scope as parent-to-child applies — you can read the parent's data, call its methods, or change its data to trigger reactivity in the parent.

```js
// Read a variable from parent's data
component.parent.data.name;

// Change a variable in parent's data (triggers reactivity in the parent)
component.parent.data.name = "Changed by a child component";

// Call a method in parent's methods
component.parent.methods.functionName();
```

<details>
  <summary><ins>Live demo</ins></summary>
  <repl-component id="h0568vj6qo1sj0o"/>
</details>

```html:index.html
<html>
  <head>
    <title>simply.js - Child to Parent Communication</title>
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
  <h2>Parent: {{data.name}}</h2>
  <child-component></child-component>
</html>

<script>
  class simply {
    data = {
      name: "Parent"
    }
    methods = {
      sayHello: function () {
        console.log("Hello from the parent");
      }
    }
  }
</script>
```

```html:child-component.html
<html>
  <h3>Child: {{data.name}}</h3>
  <button onclick="methods.talkToParent()">Talk to parent</button>
</html>

<script>
  class simply {
    data = {
      name: "Child"
    }
    methods = {
      talkToParent: function () {
        // Read a variable from parent's data
        console.log(component.parent.data.name); // => "Parent"

        // Change a variable in parent's data (triggers reactivity)
        component.parent.data.name = "Changed by child";

        // Call a method in parent's methods
        component.parent.methods.sayHello();
      }
    }
  }
</script>
```

?> You can chain component.parent to reach any ancestor like `component.parent.parent`. Also you can reach siblings with `component.parent.querySelector("sibling-component")`