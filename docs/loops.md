# Each Loops

It is possible to walk through with and array or object.

## Simple Form of Each Loops

```html
<template>
  <each data.hobbies as hobby>
    <li>{hobby}</li>
  </each>
<template>

<script>
  class {
    data = {
      hobbies: {
        Music: "Daily",
        Gaming: "Weekly",
        Sports: "Monthly",
      }
    }
  }
</script>
```

## Keys and Indexes

It is also possible to reach key and indexes.

```html
<template>
  <each data.hobbies as hobby, key (index)>
    <li>{hobby} : {key} : {index}</li>
  </each>
<template>

<script>
  class {
    data = {
      hobbies: {
        Music: "Daily",
        Gaming: "Weekly",
        Sports: "Monthly",
      }
    }
  }
</script>
```

?> When you are in a loop you can directly access variables without specifying root node. (for example `data.variable`)

## Nested Loops

You can write many nested loops as you like.

```html
<template>
  <each data.hobbies as hobby, key (index)>
    <each hobby as item>
      <li>{item}</li>
    </each>
  </each>
<template>

<script>
  class {
    data = {
      hobbies: {
        Music: ["Drum", "Guitar", "Keyboard"],
        Gaming: ["Spelunky", "Gunpoint", "Portal 2"],
        Sports: "Swimming", "Cycling", "Walking",
      }
    }
  }
</script>
```

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

<repl-component id="6jm5yqws8q0ojr6" download="true"></replcomponent>