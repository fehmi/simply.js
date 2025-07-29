## Parent to Child Communication

### Direct Manipulation

You can directly modify a variable in a child component or invoke a function on it, as shown below:

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
<repl-component id="4g6y3ikfl9ihlgb" download="true"></repl-component>

## Child to Parent Communication

It is possible to communicate directly with parent components.

```js
// To change a variable in parent's data
component.parent.data.name = "This changed by a child component";

// To call a method in parent's methods
component.parent.methods.functionName();
```

<repl-component id="n12menua0kfi0k7" download="true"></repl-component>

## Child to Grandparent Communication

```js
// You can chain parent properties to reach any ancestor (e.g., parent.parent.parent).
var grandParent = component.parent.parent;
grandParent.data.message = "This was changed by a grandchild.";
grandParent.methods.saySomething();
```

<repl-component id="v5owc8geudzz349" download="true"></repl-component>

## Child to Sibling Communication

```js
// Communicate directly with sibling components.
var sibling = component.parent.dom.querySelector("sibling-component");
sibling.data.message = "This was changed by a sibling.";
sibling.methods.saySomething();
```

<repl-component id="fgtv259ejp0bguh" download="true"></repl-component>

## Props

```html
<child-component message="This is a message from parent"></child-component>
```

You can then access it in the template section of the child component as follows:

```html
<template> {props.message} </template>
```

You can assign any type of value to attributes, including `Object`, `Array`, `String`, `Boolean`, `Number`, and even `Function`. In Simply.js, attributes are synchronized with properties (props). Therefore, if you define an attribute value, the corresponding prop will also be defined.

!> Do not change attributes directly using `setAttribute`, as this can disrupt the DOM's morphing algorithm.

Alternatively, you can access your predefined attributes as props from anywhere within the script section of the component, as shown below:

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

## Detailed Explanation of Props

There are four primary ways to define properties (props):

1.  **Within a component class:**
    `class { props = {"myProp": "myValue"} }`
2.  **As an inline attribute directly in HTML:**
    `<my-app myProp='{a: "b"}'>`
    If you need to store objects, arrays, or similar complex data types using this method, you may need to stringify the value and wrap it with single quotes. After stringifying, you might also need to replace single quotes within the string, like this:

   ```js
   objToPropString: function (obj) {
        return JSON.stringify(obj).replace(/'/g, "&apos;");
   }
   ```

3.  **Within the component's logic (e.g., methods, lifecycle hooks):**
    `props.myProp = "myValue"`
4.  **Using inline components:**
    Refer to [Inline Components](docs/inline-components) for details.

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

#### Property Precedence: `component.props` > Props Template > Inline Props

This section describes the order of precedence for overriding properties. The properties defined within the `props` block (1) of your component class take ultimate precedence, overriding both inline attributes (2) and properties defined in the props template (3). Keep this in mind if you accidentally define properties with the same name in multiple locations.

Props from Template
<repl-component id="mz6b2i2zj96fm8q" download="true"></repl-component>
