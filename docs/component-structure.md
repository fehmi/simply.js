# Component Syntax

Component concept is at the center of simply.js. All other things are shaped around it. Simply.js provide ways for the communication between the components and their orchestration. A component is just a simple HTML file that has three parts. `html`, `style` and `script`. So how does a component looks like. Let's have a quick look at it.

<repl-component id="to7pgcg4pg47ul1"></repl-component>

In the example above, "S" letter exists in DOM, because it is defined in template tag. Its color is blue because it is defined in style tag. And you can see an alert when you click on it because there is a click event defined in the script tag.

?> All of those there tags are optional. For example, your component can contains only a `<script>` tag or only a `<html>` tag or only a `<style>` tag.

<repl-component id="9yl7k6gtgkucjmw"></repl-component>

?> If you don't like shadow dom or you may need to serialize your form or something, you can always use your component as `<your-componen open>` This way your component adopt parent styles and reachable via JS from anywhere. And the best part you can create your custom form element components and easyly serialize them before sending to back-end.
