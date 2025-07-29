# Load Components
Components are loaded using the `get()` function. Load components at the top of your component's script area as follows:

`get("the-component-to-get.html");`

<repl-component id="2o6tah72m3u0y7v" download="true"></repl-component>

The filename without its extension will become your custom element's tag name. For example, `the-component-to-get.html` will result in the tag `<the-component-to-get>`, and the file's content will be mounted to this element.





## Get multiple components
You can also load multiple components by passing an array to the `get()` function, as shown below:

```html
<script>
get([
  "first-component.html",
  "second-component.html",
  "third-component.html"
])
</script>
```

You can then use the components in your template, as follows:

```html
<first-component></first-component>
<second-component></second-component>
<third-component></third-component>
```

Here is a working example:
<repl-component id="zuf6b6xtojemhtz" download="true"></repl-component>

As you can see, the filename (without its extension) becomes the tag name. You can also specify a custom tag name for your components, as follows:

<repl-component id="e1sagez1rj26c7i" download="true"></repl-component>

?> Remember to use the hyphen (`-`) character in your component's filenames or custom tag names.
