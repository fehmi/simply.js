# Script

The last and most important part of a component. It contains entire logic and data of a component. It can communicate with html and style sections. As you guess, we are writing our script in a `class { ... }` or `class simply { ... }` object. It can hold `data`, `props`, `lifecycle` hooks, variable changes with `watch`, manage `states`, and contain `methods` etc. Here is how an empty component script looks like.

```html
<script>
  class {
    props = {
      // Props that available in <html>
    }    
    data = {
      // Datas that available in <html>
    }
    state = {
      // States available for all tree
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

You can learn more about all of the parts from the [Script Syntax](loadcomponent.md) section.
