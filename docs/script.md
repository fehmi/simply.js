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
