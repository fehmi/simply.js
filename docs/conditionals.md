# Conditionals

We are defining conditional statemens as special html tags like `<if>`, `<else if>`, `<else>`. This way helps our IDE to easyly colorize syntax and format the code without and issue.

## If

```html
<template>
  <if data.who == "Blue Bird">
    Hello Blue Bird!
  </if>
<template>

<script>
  class {
    data = {
      who: "Blue Bird"
    }
  }
</script>
```

?> Please remember that every if statement must be closed with an `</if>`

## Else If

It works just like an `<if>` but just after an `<if>` as you know.

```html
<template>
  <if data.who == "Blue Bird">
    Hello Blue Bird!
  <else if data.who == "Red Bird">
    Hello Red Bird!
  </if>  
<template>

<script>
  class {
    data = {
      who: "Red Bird"
    }
  }
</script>
```

## Else

```html
<template>
  <if data.who == "Blue Bird">
    Hello Blue Bird!
  <else if data.who == "Red Bird">
    Hello Red Bird!
  <else>
    Hello Green Bird!
  </if>  
<template>

<script>
  class {
    data = {
      who: "Green Bird"
    }
  }
</script>
```

## Nested Conditionals

All variables you define on the data section of your component automaticaly will be reactive. Anytime you change the variable, your template will be rerendered.

```html
<template>
  <if data.who == "Red Bird">
    Hello Blue Bird!
    <if data.age == 3>
      You are 3 years old.
    </if>
  </if>  
<template>

<script>
  class {
    data = {
      who: "Red Bird",
      age: 3
    }
  }
</script>
```

## Expressions

All variables you define on the data section of your component automaticaly will be reactive. Anytime you change the variable, your template will be rerendered.

```html
  <each data.hobbies as hobbie, key (index)>
    <li>{key}:{hobbie}:{index}</li>
  </each>
```
