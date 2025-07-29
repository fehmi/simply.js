# Script

The script section is a crucial part of a component, containing its entire logic and data. It facilitates communication with both the HTML and style sections. As you might infer, scripts are written within a `class { ... }` or `class simply { ... }` object. This section can manage `data`, `props`, `lifecycle` hooks, handle variable changes with `watch`, manage `states`, and include `methods`, among other functionalities. Here is what an empty component script looks like:

```html
<script>
  class {
    props = {
      // Props available in <html>
    }    
    data = {
      // Data available in <html>
    }
    state = {
      // States available for the entire component tree
    }
    watch(name, value, old, parents) {
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

<repl-component id="x4x41e8kl1g9n9n" download="true"></repl-component>

You can learn more about all these parts in the [Script Syntax](loadcomponent.md) section.
