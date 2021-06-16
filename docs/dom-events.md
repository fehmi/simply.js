# DOM Events

There is nothing special of writing DOM events in SMPL from Vanilla JS.

```html
<template>
  <div onclick="sayHello()">Say Hello!</div>
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

## Most Used DOM Events

| Event   |      Description      |
|----------|:-------------|
| **onclick** |  The user clicks an HTML element |
| **onmouseover** |    The user moves the mouse over an HTML element   |
| **onmouseout** | The user moves the mouse away from an HTML element |
| **onkeydown** | The user pushes a keyboard key |

Source: [w3schools](https://www.w3schools.com/js/js_events.asp)<br>
Full List of Events: [w3schools](https://www.w3schools.com/js/js_events.asp) / [MDN](https://developer.mozilla.org/en-US/docs/Web/Events)

## Stop Propagation & Prevent Default

You can use native `stopPropagation()` and `preventDefault()` after your event function.

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
