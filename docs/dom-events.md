# DOM Events

There is nothing special of writing DOM events in simply from Vanilla JS.

<repl-component id="djygyzm2tvkhfkp" download="true"></repl-component>

## `event` and `this`
You can pass them directly to your methods. Just keep in mind to use anyting other than `this` in your method's parameters. Bcs `this` will be using by the constructor of your components. You `el` or something else when needed like below:

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
<repl-component id="ab5dj9lvdajdkfe" donwload="true"></repl-component>

## Stop Propagation & Prevent Default

You can use native `stopPropagation()` and `preventDefault()` after your event function. You can use event or this in the value of an incline on* event definition.

<repl-component id="7hi32zis90kg7g9" donwload="true"></repl-component>
