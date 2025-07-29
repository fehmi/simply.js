# DOM Events

There is nothing unique about writing DOM events in Simply.js compared to Vanilla JavaScript.

<repl-component id="djygyzm2tvkhfkp" download="true"></repl-component>

## `event` and `this`
You can pass them directly to your methods. However, avoid using `this` as a parameter in your method's signature, as `this` is reserved for the component's constructor. Use `el` or another suitable variable name when needed, as shown below:

<repl-component id="1y6zj50s9suk23f" download="true"></repl-component>


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
<repl-component id="ab5dj9lvdajdkfe" download="true"></repl-component>

## Stop Propagation & Prevent Default

You can use the native `stopPropagation()` and `preventDefault()` methods after your event function. You can pass `event` or a reference to `this` in the value of an inline `on*` event definition.

<repl-component id="7hi32zis90kg7g9" download="true"></repl-component>
