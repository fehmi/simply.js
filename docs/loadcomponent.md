# Load Components
  We are loading out component with the get() function. Load components at the top of your component's script area like this.

  `get("commented-get.html");`

  Filename without extension will be your custom element tag name. This one will be `<commented-get>` and the content of the file mounted to the element.

  You can also load multiple components by passing an array to the get function like this

```html
  <script>
  get([
    "my-component.html",
    "another-component.html"
  ]);
  class {
    // ...
  }
</script>
```

## Get multiple components

```html
<script>
get([
  "first-component.html",
  "second-component.html",
  "third-component.html"
])
</script>
```

Then you can use component in your template likes.

```html
<first-component></first-component>
<second-component></second-component>
<third-component></third-component>
```

As you can see filename bofere file extension becomes the tag name. You can also specify custom tag name for your components like this

```html
<template>
  <hello-world></hello-world>
</template>

<script>
  get("first-component.html", "hello-world");
</script>
```

?> Just don't forget to use "-" character in your component's filenames or custom tag names.