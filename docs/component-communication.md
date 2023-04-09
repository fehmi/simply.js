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

## Props
```html
  <child-component message="This is a message from parent"></child-component>
```
Then you can access it in template section of the child component like this

```html
<template>
  {props.message}
</template>
```

You can put any kind of values to the attributes. `Object`, `Array`, `String`, `Boolean`, `Number` and even `Function` are supported. In simply.js attributes and properties are automaticaly synced. So, if you define or change an attribute value the prop will be defined or changed too. When you set an attribute value with `dom.setAttribute("name", "{'a': 'b'}")`, you need to set the value as string. This is a limitation of HTML standart. But don't even worry, simply.js will detect its type while syncing attributes with props. Or if you don't want to stringify it, you can use the prepareAttr() function of simply.js like this: `setAttribute("name", prepareAttr({"a": "b"}))`

Just remember that, if you manually write object, array or function props as attribute values directly to your component, dont use double quotes inside of them (you may need them for objects, arrays or functions) bcs html attributes already starts and ends with double quotes. Use single quote instead or just escape double quotes with an `\`. So, if you use double quotes inside the value of your attributes, it will break the execution of the template engine.

Otherwise, you can be free when you define them with property template tag or doing it programmaticaly with setAttrbute(name, value) or component.props.name = value.

Or you can access it from anywhere in the script section of the component like this.

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
<br> `<my-app myProp='myValue'>` or  `myApp.setAttribute("propName", "propValue")`. You may to stringify the value if you want to store objects, arrays etc with this way.
3. Inside component's logic part (methods/lifecycle etc.)<br>`props.myPprop = "myValue"`
4. With a props template like below (You may need it when you want to init some complex data)


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


```js
  <prop-test str="simply" booleanstring="true" boolean=false number="111" number2="222" obj="{'a': 'true'}" arr="[1,2,3, {'hey': 'hat'}]" func="(function() {console.log('test')})"></prop-test>
```

!> One rule: Please don't use double aposroph when writing arrays, objects and functions as props.

<repl-component id="dteguywmqzok0z8"></repl-component>

<repl-component id="sieku4gvamxy86u"></repl-component>

<repl-component id="of3xucyxzahimyz"></repl-component>