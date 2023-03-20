# CSS

Template içine `<link rel="stylesheet" type="text/css" href="style.css">` ekle
ya da style tag i içinde `@import` kullan `<style>` tagi içinde en üstte
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
    lifecycle() {
      afterFirstRender = {
        loadJS("jszip.min.js", function () {
          console.log("script is loaded");
        }
      }
    }
  }
</script>
```


# Store / State