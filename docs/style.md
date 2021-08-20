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

The best thing about styling for simpy.js components is you can use reactive JS variables defined in the script section of the component.

The template engine of simply.js works in `<template>` tag and acts like a superset of HTML. The engine has [conditionals](conditionals.md), [each loops](loops.md), [reactive variables](variables.md), [literals](literals.md), [expressions](expressions.md), [DOM events](dom-events.md) and  [nested components](nested-components.md).

?> It is possible to reach all of data, state, parent, dom and methods defined in the script tag.

You can learn more about the engine from the [template engine](template-engine.md) section.
