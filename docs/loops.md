# Each Loops

It is possible to iterate through an array or object.

## Simple Form of Each Loops

<repl-component id="q6idul6gg6jdwby"></repl-component>

## Keys and Indexes

It is also possible to access keys and indexes.

<repl-component id="0yxb0nz329ku8qe"></repl-component>

?> Within a loop, you can directly access variables without specifying the root node (e.g., `data.variable`).

## Nested Loops

You can nest as many loops as needed.

<repl-component id="6d0k90xuhhb79c9" download="true"></repl-component>

?> You cannot wrap multiple `each` statements within conditionals like this:

```js
	<if data.flower == "rose">
		<each data.roses as rose>
			<else if data.flower == "jasmine">
				<each data.jasmines as jasmine>
			</if>
		{jasmine.name}
	</each>
```

?> Instead, use the following approach:

<repl-component id="vfwa6ska2wpsygd" download="true"></replcomponent>
