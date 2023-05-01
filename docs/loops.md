# Each Loops

It is possible to walk through with and array or object.

## Simple Form of Each Loops

<repl-component id="q6idul6gg6jdwby"></repl-component>

## Keys and Indexes

It is also possible to reach key and indexes.

<repl-component id="0yxb0nz329ku8qe"></repl-component>

?> When you are in a loop you can directly access variables without specifying root node. (for example `data.variable`)

## Nested Loops

You can write many nested loops as you like.

<repl-component id="6d0k90xuhhb79c9" download="true"></repl-component>

?> You can't wrap multiple each in conditionals like:

```js
	<if data.flower == "rose">
		<each data.roses as rose>
	<else if data.flower == "jasmine">
		<each data.jasmines as jasmine>
	</if>
		{jasmine.name}
	</each>
```

?> Use like below instead:

<repl-component id="vfwa6ska2wpsygd" download="true"></replcomponent>