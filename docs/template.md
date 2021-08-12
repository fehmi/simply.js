# Template

Rendering part of the component. The template engine of simply.js works here and acts like a superset of HTML. The engine has conditionals, reactive variables, literals, expressions, DOM events and  nested components. It is possible to reach all of data, state, parent, dom and methods defined in the script tag.

You can learn more about the engine from the [template engine](template-engine.md) section.

## **\<style\>**

Encapsulated style definitions that only effects the elements inside the template tag of the component. Allows to use reactive JS variables defined in the script section of the component.

## **\<script\>**

Contains entire logic of the component. It can communicate with template section. Lifecycle hooks, load nested components, reactive data store, state management, component communiations etc.
