## Watch Variable Changes

This special event is triggered when a variable in data has changed. Here is an example about how you can use it.

```html
<template>
  <h1>Status</h1>
  {data.time}
</template>

<script>
  class {
    data = {
      time: "day"
    }
    watch(name, value, old, parents) {
      if (name == "time") {
        console.log(name + " variable in data has changed as " + value);
      }
    }
    lifecycle = {
      afterFirstRender() {  
        setTimeout(() => {
          data.time = "night";
        }, 1000);
      }                   
    }
  }
</script>
```