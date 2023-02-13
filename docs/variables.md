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
<template>
  <p>
    Hello, my name is {data.name}<br>
    and I am {data.age} years old.
  </p>
</template>
```

?> It is necessary to use dot notation with `data` prefix when reaching variables. The only exception is for `each` loop. When you are in a loop, you can directly reach current subjects.

## Variable Expressions

Of couse you can do some simple math with your variables using simple expressions. All of them below is valid.

```js
{ data.variable }
{ data.variable.sub }
{ data.variable + 10 }
{ data.variable * (10 / 2) }
```

## Variables in `each` loops

If you decide to use `key` and `index` when you define `each` loop. You can reach them directly without using a dot notation.

```html
  <each data.hobbies as hobbie, key (index)>
    <li>{key}:{hobbie}:{index}</li>
  </each>
```

## Reactivity of Variables

All variables you define on the data section of your component automaticaly will be reactive. Anytime you change the variable, your template will be rerendered.

```html
  <each data.hobbies as hobbie, key (index)>
    <li>{key}:{hobbie}:{index}</li>
  </each>
```

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

## Changing variable values in `<template>`

It's totally acceptable to change variables in template. Just do like `{data.name = "marilyn monroe"}`. It will change and render the new value right away and trigger reactions. If you want to change the variable value wihout rendering it just comment it like `<!-- {data.name = "marilyn monroe"} -->`

<repl-component id="86xhf51pxnmaa7j" download="true"></replcomponent>

## Using variables from functions that returns values

It can be useful when need a post processing for your data before showing them. Here is an example for it. You can write your return functions in data or methods. But please don't forget that the only reactive variables lives in `data` or `state`.

<repl-component id="6c0w9k4em2ywkix" download="true"></replcomponent>

?> You can use your return values in conditionals and loops if you like.

