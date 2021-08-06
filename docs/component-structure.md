## How it works

Component concept are at the center of simply.js. All other things are shaped around it. Simply.js is responsible the communication between the parts or components and their orchestration. Actually, a component is just a simple HTML file that has three parts. Template, style and script. So how does a component looks like.

## Component Syntax

You can define your variables on the data section in your component like this.

```html
<template>
  <p>Hello world! This is {data.name}. Nice to meet you.
</template>

<style>
  p {
    background: aquamarine;
    font-size: 20px;
  }
</style>

<script>
  class {
    data = {
      "name": "fehmi",
      "age": 37,
    };
  }
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

```html
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

