# DOM Events

There is nothing special of writing DOM events in simply from Vanilla JS.

```html
<template>
  <div onclick="methods.sayHello()">Say Hello!</div>
</template>

<script>
  class {
    methods = {
      sayHello: function() {
        alert("Hello friend!");
      }
    }
</script>
```

## `event` and `this`
You can pass them directly to your methods. Just keep in mind to use anyting other than `this` in your method's parameters. Bcs `this` will be using by the constructor of your components. You `el` or something else when needed like below:

<repl-component id="mc35kc8i6yg33ge" download="true"></repl-component>

## Most Used DOM Events

| Event   |      Description      |
|----------|:-------------|
| **onclick** |  The user clicks an HTML element |
| **onmouseover** |    The user moves the mouse over an HTML element   |
| **onmouseout** | The user moves the mouse away from an HTML element |
| **onkeydown** | The user pushes a keyboard key |

Source: [w3schools](https://www.w3schools.com/js/js_events.asp)<br>
Full List of Events: [w3schools](https://www.w3schools.com/js/js_events.asp) / [MDN](https://developer.mozilla.org/en-US/docs/Web/Events)

## Inline Self Executing Anonymous Functions
```js
 <button onclick="(function() { console.log('Hey i am calling') })()">hello</button></button>
```

## Stop Propagation & Prevent Default

You can use native `stopPropagation()` and `preventDefault()` after your event function. You can use event or this in the value of an incline on* event definition.

```html
<template>
  <div onclick="sayBye();">
    <div onclick="sayHello(); event.stopPropagation();">Say Hello!</div>
  </div>
</template>

<script>
  class {
    methods = {
      sayHello: function() {
        alert("Hello friend!");
      },
      sayBye: function() {
        alert("Bye!");
      }
    }
  }
</script>
```
