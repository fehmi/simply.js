# DOM Events

There is nothing unique about writing DOM events in simply.js compared to Vanilla JavaScript. You can use any native event attribute (`onclick`, `onmouseover`, ...) and pass values from `data`, `props` or `state` directly to your methods.

?> Inside event attributes, variables are written **without** curly braces — `methods.alert(data.message)`, not `methods.alert({{data.message}})`. Curly braces (`{{ }}`) are only used in the template body and attribute values.

<details>
  <summary><ins>Live demo</ins></summary>
  <repl-component id="g9bcbmc7r077s43"/>
</details>

```html:index.html
<html>
  <head>
    <title>simply.js</title>
  </head>
  <body>
    <event-demo/>
    <script src="https://simply.js.org/simply.min.js"></script>
    <script>
      get("event-demo.html");
    </script>
  </body>
</html>
```

```html:event-demo.html
<html>
  <button onclick="methods.alert(data.message)">Alert</button>
  <button onclick="methods.handle(event)">Handle</button> 
</html>

<script>
  class simply {
    data = {
      message: "hello"
    }
    methods = {
      alert: function (message) {
        alert(message);
      },
      handle: function (event) {
        console.log(event);
      }
    }
  }
</script>
```

?> Avoid using `this` as a parameter name in your method's parameter, as `this` is reserved for the component's constructor. Use `el` or another suitable variable name when receiving the event.