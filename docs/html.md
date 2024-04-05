# HTML

Rendering part of the component. The elements in `<html>` tag will be mounted to the DOM after processing by template engine. Almost every component has a `<html>` tag but it is not a rule. Some components only contain `<script>` tag and has some logic in it.

The template engine of simply.js works in `<html>` tag and acts like a superset of HTML. The engine has [conditionals](docs/conditionals.md), [each loops](docs/loops.md), [reactive variables](docs/variables.md), [DOM events](docs/dom-events.md) and  [nested components](docs/nested-components.md).

?> It is possible here to reach all of `{data}`, `{props}`, `{state}`, `{parent}`, `{dom}` and `{methods}` defined in the script tag.

You can learn more about the engine from the [template engine](docs/variables.md) section.