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