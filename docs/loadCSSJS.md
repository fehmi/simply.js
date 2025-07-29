# CSS

Add `<link rel="stylesheet" type="text/css" href="style.css">` inside the template,
or use `@import` within the `<style>` tag at the top:
```html
<template>
  Test
</template>

<style>
  @import url("style.css"); /* no ie11 */
  * {
    color: blue;
  }
</style>

<script>
  class {
    // ...
  }
</script>
```

# JS

```html
<script>
  class {
    // ...
    lifecycle = {
      afterFirstRender() {
        loadJS("jszip.min.js", function () {
          console.log("script is loaded");
        });
      }
    }
  }
</script>
```


# Store / State
