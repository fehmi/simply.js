# HTML

This section describes the rendering portion of a component. Elements within the `<html>` tag are mounted to the DOM after being processed by the template engine. While most components include an `<html>` tag, it is not mandatory; some components may only contain a `<script>` tag with their logic.

The Simply.js template engine operates within the `<html>` tag, functioning as a superset of HTML. This engine supports [conditionals](docs/conditionals.md), [each loops](docs/loops.md), [reactive variables](docs/variables.md), [DOM events](docs/dom-events.md), and [nested components](docs/nested-components.md).

?> It is possible here to reach all of `{data}`, `{props}`, `{state}`, `{parent}`, `{dom}` and `{methods}` defined in the script tag.

You can learn more about the engine in the [template engine](docs/variables.md) section.
