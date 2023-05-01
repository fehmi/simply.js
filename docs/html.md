# HTML

Rendering part of the component. The elements in `<html>` tag will be mounted to the DOM after processing by template engine. Almost every component has a `<html>` tag but it is not a rule. Some components only contain `<script>` tag and has some logic in it.

The template engine of simply.js works in `<html>` tag and acts like a superset of HTML. The engine has [conditionals](conditionals.md), [each loops](loops.md), [reactive variables](variables.md), [literals](literals.md), [expressions](expressions.md), [DOM events](dom-events.md) and  [nested components](nested-components.md).

?> It is possible here to reach all of `{data}`, `{props}`, `{state}`, `{parent}`, `{dom}` and `{methods}` defined in the script tag.

You can learn more about the engine from the [template engine](template-engine.md) section.