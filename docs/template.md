# Template

Rendering part of the component. The elements in `<template>` tag will be mounted to the DOM. Almost every component has a `<template>` tag but it is not a rule. Some components only contain `<script>` tag and has some logic in it.

The template engine of simply.js works in `<template>` tag and acts like a superset of HTML. The engine has [conditionals](conditionals.md), [each loops](loops.md), [reactive variables](variables.md), [literals](literals.md), [expressions](expressions.md), [DOM events](dom-events.md) and  [nested components](nested-components.md).

?> It is possible to reach all of data, state, parent, dom and methods defined in the script tag.

You can learn more about the engine from the [template engine](template-engine.md) section.
