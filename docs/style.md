# Style

Encapsulated style definitions only affect the elements inside the template tag of the component. But there is one exception. The inherited styles of the document can affect all child components. For example, when you define `color` property of `body` as `red` in the document then texts of all components inside the document will be `red` if you don't define otherwise inside the style tag of a component.

### Styling Component Container

When you want to style the component itself inside the component you can use `::host` selector.

```html
<style>
  ::host {
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

?> Just don't forget to write variable name in apostrophes like `"{data.color}"`

<repl-component id="Q" download="true"></repl-component>