## Simple form of variables

You can define your variables within the `data` section of your component, as shown below.

```bash
<script>
  class {
    data = {
      "name": "fehmi",
      "age": 37
    };
</script>
```

You can then use them in your template as follows:

```html
<template>
  <p>
    Hello, my name is {data.name}<br>
    and I am {data.age} years old.
  </p>
</template>
```

?> It is necessary to use dot notation with the `data` prefix when accessing variables. The only exception is within an `each` loop, where you can directly access current subjects.

## Variable Expressions

Of course, you can perform simple mathematical operations with your variables using basic expressions. All of the examples below are valid.

```js
{ data.variable }
{ data.variable.sub }
{ data.variable + 10 }
{ data.variable * (10 / 2) }
```

## Variables in `each` loops

If you choose to use `key` and `index` when defining an `each` loop, you can access them directly without using dot notation.

```html
  <each data.hobbies as hobbie, key (index)>
    <li>{key}:{hobbie}:{index}</li>
  </each>
```

## Reactivity of Variables

All variables defined in the `data` section of your component will automatically be reactive. Anytime you change a variable, your template will be re-rendered.

```html
  <each data.hobbies as hobbie, key (index)> 
    <li>{key}:{hobbie}:{index}</li>
  </each>
```

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
