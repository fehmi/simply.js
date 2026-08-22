# Nested Components

You can embed other components within your components. Load the nested component with the `get` function, then use its tag inside your template — just like any other element. There is no limit to the number of nested components. Here is an example of `child-component` that calls `grand-child-component`.

<details>
  <summary><ins>Live demo</ins></summary>
  <repl-component id=""/>
</details>

```html:index.html
<html>
  <head>
    <title>simply.js - Hello World!</title>
  </head>
  <body>
    <child-component></child-component>
    <script src="https://simply.js.org/simply.min.js"></script>
    <script>
      get("child-component.html");
      get("grand-child-component.html");
    </script>
  </body>
</html>
```

```html:child-component.html
<html>
  Hello from child
  <br>
  <grand-child-component></grand-child-component>
</html>
```

```html:grand-child-component.html
<html>
  Hello from grand-child
</html>
```


?> For details on how nested components communicate with each other, see [Component Communication](docs/component-communication.md).
