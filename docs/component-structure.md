# Component Syntax

The component concept is central to Simply.js, with all other functionalities built around it. Simply.js facilitates communication and orchestration between components. A component is a simple HTML file comprising three parts: `html`, `style`, and `script`. Let's examine what a component looks like.

<repl-component id="to7pgcg4pg47ul1"></repl-component>

In the example above, the letter "S" is present in the DOM because it is defined within the template tag. Its color is blue, as specified in the style tag. Additionally, clicking on it triggers an alert, as a click event is defined in the script tag.

?> All three of these tags are optional. For instance, your component can contain only a `<script>` tag, only an `<html>` tag, or only a `<style>` tag.

<repl-component id="9yl7k6gtgkucjmw"></repl-component>

?> If you prefer not to use Shadow DOM or need to serialize your form, you can always use your component as `<your-component open>`. This allows your component to inherit parent styles and be accessible via JavaScript from anywhere. The key advantage is that you can create custom form element components and easily serialize them before sending data to the backend.
