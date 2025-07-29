## Simple form of variables

You can define your variables within the `data` section of your component, as shown below.

```bash
<script>
  class simply {
    data = {
      "name": "fehmi",
      "age": 37
    }
  }
</script>
```

You can then use them in your template as follows:

```html
<html>
  <p>
    Hello, my name is {data.name}<br>
    and I am {data.age} years old.
  </p>
</html>
```

<repl-component id="05loeqiinqkt8pb" download="true"></repl-component>

?> It is necessary to use dot notation with the `data` prefix when accessing variables. The only exception is within an `each` loop, where you can directly access current subjects.

## Variable Expressions

Of course, you can perform simple mathematical operations with your variables using basic expressions. All of the examples below are valid.

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
Possibilities are endless with a little imagination.

```html
<li class="{entry.method}">
	<if cond="entry.file">
    <span onclick="methods.openFile('{entry.char}')">GO!</span>
	</if>
</li>
```

## Complex Code Blocks
The key is that code blocks must return something because they are part of the component's rendering. For example, this will not work:

```js
<html>
  {
  	if (methods.someFunction() == "Some message") {
  		Yeah, the message is really Some message
  	}
  }
</html>
```

However, you can use a workaround with inline self-executing anonymous functions, as shown below:

<repl-component id="na29cvvjvjnmwd2" download="true"></repl-component>

It is not recommended, however. If you need a complex process, simply write a function in the `methods` section of your component and call it from your template section as follows:

<repl-component id="mheo1xu2xg8lemd" download="true"></repl-component>


## Escaping Delimiter Charactes
If you need to display any delimiter characters ("{" and "}") in the DOM, you must escape them with a backslash (`\`). This is because they can be confusing for the Simply.js template engine.

<repl-component id="7iznwtlsr26wa81" download="true"></repl-component>


You can actually write any complex JavaScript code within the variable delimiters and return anything to be rendered in your DOM.

## Variables in `each` loops

If you choose to use `key` and `index` when defining an `each` loop, you can access them directly without using dot notation.

<repl-component id="c0u41ol2ph7rgt8" download="true"></repl-component>

## Reactivity of Variables

All variables defined in the `data` section of your component will automatically be reactive. Anytime you change a variable, your template will be re-rendered.

<repl-component id="6rus94eoal01kbk" download="true"></repl-component>

## Variables in style tag

You can use your reactive data variables as property values within a style tag.

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

!> It is entirely unacceptable to change variables directly within the template, such as `{data.name = "marilyn monroe"}` or `<!-- {data.name = "marilyn monroe"} -->`. Doing so will cause an infinite reaction/render loop. Therefore, simply avoid this practice.

## Using variables from functions that returns values

This can be useful when you need to post-process your data before displaying it. Here is an example: you can write your return functions in `data` or `methods`. However, please remember that reactive variables reside only in `data` or `state`.

<repl-component id="w3wofrexw9ssy1y" download="true"></repl-component>

?> You can use your return values in your conditionals and loops if you like.

```html
<input :="variableName">
```

<repl-component id="hedq9svhen4ssz3" download="true"></repl-component>
