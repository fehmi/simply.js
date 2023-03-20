## Parent to Childs

### Props
```html
  <child-component message="This is a message from parent"></child-component>
```
Then you can access it in template section of the child component like this

```html
<template>
  {props.message}
</template>
```

Or you access it from anywhere in the script section of the child component like this.

```html
<script>
  class {
    lifecycle = {
      afterFirstRender() {
        alert("The message from parent is " + props.message);
      }
    }
  }
  </script>
```

### Direct

You can directly change a variable in a child component or call a function from it like this.

```js

// Change a variable in child's data
component.dom.querySelector("child-component").data.name = "New name";

// Call a method from a child
component.dom.querySelector("child-component").methods.functionName();

// Change a variable in grand child's data
var child = component.dom.querySelector("child-component");
child.querySelector("grand-child").data.name = "New name";

// Call a method from a grand child
var child = component.dom.querySelector("child-component");
cchild.querySelector("grand-child").methods.functionName();
```

## Child to Parent

It is possible to communicate with parent sdirectly.

```js
// To change a variable in parent's data
component.parent.data.name = "This changed by a child component";

// To call a method in parent's methods
component.parent.methods.functionName();

```

## Child to grand parents
```js
  // You can use any number of parent.parent.parent ...
  var grandParent = component.parent.parent;
  grandParent.data.message = "This changed by a grand child";
  grandParent.methods.saySomething();
```

## Child to siblings
```js
  // Communicate with grand parents directly
  var sibling = component.parent.dom.querySelector("sibling-component");
  sibling.data.message = "This changed by a sibling";
  sibling.methods.saySomething();
```

You can use all kind of data (string, number, boolean, array, object and function) as props like this

```js
  <prop-test str="simply" booleanstring="true" boolean=false number="111" number2="222" obj="{'a': 'true'}" arr="[1,2,3, {'hey': 'hat'}]" func="(function() {console.log('test')})"></prop-test>
```

!> One rule: Please don't use double aposroph when writing arrays, objects and functions as props.

