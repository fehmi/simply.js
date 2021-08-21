# Script

The last and most important part of a component. It contains all entire logic and data of a component. It can communicate with template section. As you guess we are writing our script in a `class { ... }` object. It can hold data, hook variable changes with `watch`, manage states, and contain functions etc. Here is how an empty component script looks like.

```html
<script>
  class {
    data = {
      // Datas that available in <template>
    }
    state = {
      // States available for all children
    }
    watch = {
      // Hook for variable changes
    }
    methods = {
      // Component functions
    }
    lifecycle = {
      // Lifecycle events
    }
  }
</script>
```

You can learn more about all of the parts from the [Script Syntax](yaa.md) section.

Encapsulated style definitions only affect the elements inside the template tag of the component. But there is one exception. The inherited styles of the document can affect all child components. For example, when you define `color` property of `body` as `red` in the document then texts of all components inside the document will be `red` if you don't define otherwise inside the style tag of a component.

### Styling Component Container

When you want to style the component itself inside the component you can use `:host` selector. Also you can define your CSS variables in it.

```html
<style>
  :host {
    --my-blue: lightblue;
    border: 2px solid cyan;
  }
</style>
```

### Link a CSS file

You can link a CSS file inside the template tag of the component like this.

```html
<template>
  <link rel="stylesheet" href="mystyle.css">
  <div>Test</div>
</template>
```

### Import a CSS file

An other option to add a CSS file to the component is `@import`. It brings a style sheet into a component like this.

?> Be sure to use import statement at the top of your style tag. Otherwise it doesn't work.

```html
<style>
  @import "styleguide.css";
  p {
    color: coral;
  }
</style>
```

### JavaScript Variables

The best thing about styling is you can use reactive JS variables in style tag. Syntax is like `color: "{data.color}";`.

?> Just don't forget to write variable name between apostrophes like `"{data.color}"`

<repl-component id="Q" download="true"></repl-component>