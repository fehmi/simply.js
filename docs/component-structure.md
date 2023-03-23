# Component Syntax

Component concept is at the center of simply.js. All other things are shaped around it. Simply.js provide ways for the communication between the components and their orchestration. A component is just a simple HTML file that has three parts. `Template`, `style` and `script`. So how does a component looks like. Let's have a quick look at it.
<br><br><br>
<repl-component id="P"></repl-component>
<br><br>
In the example above, "S" letter exists because it is defined in template tag. Its color is blue because the definition in the style tag say so. And you can see an alert when you click on it because there is a click event defined in the script tag.

!> Don't user `<style>` or `<script>` to write your styles and your logics. Because the delimiters (`{`, `}`) will be confusing for the template engine. Instead use the root `<style>` and `<script>` tags of your component to write your styles and logics. Leran more about it from [Variables](docs/variables.md) section.

!> All of the are tags optional. For example, your component can contains only a `<script>` tag or only a `<template>` tag vice versa.




