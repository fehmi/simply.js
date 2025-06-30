## Parent to Childs

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

Here is a working example:
<repl-component id="4g6y3ikfl9ihlgb" donwload="true"></repl-component>

## Child to Parent

It is possible to communicate with parent sdirectly.

```js
// To change a variable in parent's data
component.parent.data.name = "This changed by a child component";

// To call a method in parent's methods
component.parent.methods.functionName();
```

<repl-component id="n12menua0kfi0k7" donwload="true"></repl-component>

## Child to grand parents

```js
// You can use any number of parent.parent.parent ...
var grandParent = component.parent.parent;
grandParent.data.message = "This changed by a grand child";
grandParent.methods.saySomething();
```

<repl-component id="v5owc8geudzz349" donwload="true"></repl-component>

## Child to siblings

```js
// Communicate with grand parents directly
var sibling = component.parent.dom.querySelector("sibling-component");
sibling.data.message = "This changed by a sibling";
sibling.methods.saySomething();
```

<repl-component id="fgtv259ejp0bguh" donwload="true"></repl-component>

## Props

```html
<child-component message="This is a message from parent"></child-component>
```

Then you can access it in template section of the child component like this

```html
<template> {props.message} </template>
```

You can put any kind of values to the attributes. `Object`, `Array`, `String`, `Boolean`, `Number` and even `Function` are supported. In simply.js attributes synced to props. So, if you define an attribute value the prop will be defined too.

!> Don't change attributes directly with `setAttribute`. It breaks morphing algorithm of DOM.

Or you can access your predefined attributes as props from anywhere in the script section of the component like this.

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

## Short Story Long About Props

There are 4 ways to define them

1. Inside of a component class `class { props = {"myProp": "myValue"} }`.
2. As an inline attribute direcly with
   <br> `<my-app myProp='{a: "b"}'>`You may to stringify the value and wrap it with single quote if you want to store objects, arrays etc with this way. After stringify you may want to replace single quotes like this:

   ```js
   objToPropString: function (obj) {
        return JSON.stringify(obj).replace(/'/g, "&apos;");
   }
   ```

3. Inside component's logic part (methods/lifecycle etc.)<br>`props.myPprop = "myValue"`
4. With inline components see: [Inline Components](docs/inline-components)

```js
    <my-app>
			<script type="props/json" lang="text/javascript">
				{
					"myProp": "myValue",
					"anArray": [1,2,3, {
						'hey': {
							'b': 'c',
							'd': [1,2,3, {
								'r': [2,3,4]
							}]
						}
					}]
				}
			</script>
    </my-app>
```

#### component.props > props template > inline props

This is the way about overriding. The last word is belong to the props block (1) of your component class. The props in there will override the inline (2) and other props in the props template (3). Just remember that if you define props with same name in multiple places accidentally.

Props from Template
<repl-component id="mz6b2i2zj96fm8q"></repl-component>
