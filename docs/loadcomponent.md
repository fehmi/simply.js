# Load Components
We are loading out component with the get() function. Load components at the top of your component's script area like this.

`get("the-component-to-get.html");`

<repl-component id="2o6tah72m3u0y7v" donwload="true"></repl-component>

Filename without extension will be your custom element tag name. This one will be `<the-component-to-get>` and the content of the file mounted to the element.





## Get multiple components
You can also load multiple components by passing an array to the get function like this

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

Here is a working example:
<repl-component id="zuf6b6xtojemhtz" donwload="true"></repl-component>

As you can see filename bofere file extension becomes the tag name. You can also specify custom tag name for your components like this

<repl-component id="e1sagez1rj26c7i" donwload="true"></repl-component>

?> Just don't forget to use "-" character in your component's filenames or custom tag names.