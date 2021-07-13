# State Management
simply.js is a simple toolkit for simple web apps. The template engine in simply.js developed from scratch. Then I brought various tools together and coded the bridge between them. The documentation contains all of the tools, bridges and their integrations between them. Have fun!

State management is pretty easy in simply.js. When you define a state in your component all of child components will share the state and can retrieve or change the state. When a manipulation in the state happen whenever in the component tree all the components that shares the same state will be affected and react to the new value.


## Define State in Parent Component
```html
<template>
  <h2>{state.name}</h2>
  <child-comp></child-comp>
</template>

<style>
  * {
    color: blue;
  }
</style>

<script>
  get([
    "child-comp.html"
  ]);
  class {
    state = {
      name: "fehmi"
    }
  }
</script>
```

## Access/Change from any Child Component
```html
<template>
  <h3>{state.name}</h3>
</template>

<style>
  * {
    color: green;
  }
</style>

<script>
  class {
    lifecycle = {
      setTimeout(function(){
        state.name = "Michael Jakson"
      }, 3000);
    }
  }
</script>
```