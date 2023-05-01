## Simple form of variables

You can define your variables on the data section in your component like this.

```bash
<script>
  class {
    data = {
      "name": "fehmi",
      "age": 37
    };
</script>
```

Then you will be able to use them in your template like this.

```html
<html>
  <p>
    Hello, my name is {data.name}<br>
    and I am {data.age} years old.
  </p>
</html>
```

<repl-component id="05loeqiinqkt8pb" download="true"></repl-component>

?> It is necessary to use dot notation with `data` prefix when reaching variables. The only exception is for `each` loop. When you are in a loop, you can directly reach current subjects.

## Variable Expressions

Of couse you can do some simple math with your variables using simple expressions. All of them below is valid.

```js
{ data.variable }
{ data.variable.sub }
{ data.variable + 10 }
{ data.variable * (10 / 2) }
{(function() {return 2 + 2})()}
{file.filename.replace('.html', '')}
{(data.currentUrlIndex < 2) ? "disabled" : "" }
{(data.resize.x || data.resize.y) ? "resizing" : "" }
```

```js
// Call any component's built-in objects
// like methods, parent, data, state, prop, methods
{someFunction(data.name)}
```
<repl-component id="nq485hdi5gxzrx1" download="true"></repl-component>

## Go Wild
Possibilities are endless with some imagination.

```html
<li class="{entry.method}">
	<if cond="entry.file">
    <span onclick="methods.openFile('{entry.char}')">GO!</span>
	</if>
</li>
```

## Complex Code Blocks
The thing is the code blocks must return something bcs it's in the rendering part of the component. For example this will not work.

```js
<html>
  {
  	if (methods.someFunction() == "Some message") {
  		Yeah, the message is really Some message
  	}
  }
</html>
```

But you have a workaorund with inline self executing anonymous functions like below:

<repl-component id="na29cvvjvjnmwd2" download="true"></repl-component>

It's not recommended though. If you need some complex process just write a function in the methods part of your component and call it from your template section like this.

<repl-component id="mheo1xu2xg8lemd" download="true"></repl-component>


## Escaping Delimiter Charactes
If you need to press any of delimiter characters ("{" and "}") to the dom you must escape them with "\". Bcs they must be confusing for the template engine of simply.js.

<repl-component id="7iznwtlsr26wa81" download="true"></repl-component>


Actually you can any complex JavaScript code in the variable delimiters and return anything to put your dom.

## Variables in `each` loops

If you decide to use `key` and `index` when you define `each` loop. You can reach them directly without using a dot notation.

<repl-component id="c0u41ol2ph7rgt8" download="true"></repl-component>

## Reactivity of Variables

All variables you define on the data section of your component automaticaly will be reactive. Anytime you change the variable, your template will be rerendered.

<repl-component id="6rus94eoal01kbk" download="true"></repl-component>

## Variables in style tag

You can use your reactive data variables as a property value in style tag.

```html
<template>
  <p>This color is blue and reactive!</p>
</template>

<style>
  p {
    color: "{data.color}";
  }
</style>

<script>
  class {
    data = {
      color: "blue"
    }
  }
</script>
```

<repl-component id="x9bgcdct6jlvr0r" download="true"></repl-component>

## Changing variable values in `<html>`

It's totally acceptable to change variables in template. Just do like `{data.name = "marilyn monroe"}`. It will change and render the new value right away and trigger reactions. If you want to change the variable value wihout rendering it just comment it like `<!-- {data.name = "marilyn monroe"} -->`

<repl-component id="pg5njqyn1pyud0g" download="true"></repl-component>

## Using variables from functions that returns values

It can be useful when need a post processing for your data before showing them. Here is an example for it. You can write your return functions in data or methods. But please don't forget that the only reactive variables lives in `data` or `state`.

<repl-component id="w3wofrexw9ssy1y" download="true"></repl-component>

?> You can use your return values in your conditionals and loops if you like.

```html
<input :="variableName">
```

<repl-component id="hedq9svhen4ssz3" download="true"></repl-component>

