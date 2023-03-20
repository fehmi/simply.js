# Nested Components

You can call other components inside your components. It has same principle with your main component. You can do it with `get` function inside at the beginnig of your parent component's script tag. Then you can call it with its tag (`child-component`) in your template tag.


```html
<template>
  <children-component></children-component>
</template>

<script>
  get("child-component", "child-component.html");

  ...
</script>
```

There is no limit about the amount of nested components. Here is an example content of `child-component` that calls `grand-child-component`.

```html
<template>
  Hello from children.
  <grand-child-component></grand-child-component>
</template>

<script>
  get("grand-child-component", "grand-child-component.html");

  ...
</script>
```