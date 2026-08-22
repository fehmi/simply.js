# Component Syntax

The component concept is central to Simply.js, with all other functionalities built around it. Simply.js facilitates communication and orchestration between components. A component is a simple HTML file comprising three parts: `html`, `style`, and `script`. Let's examine what a component looks like.

?> All three of these tags are optional. For instance, your component can contain only a `<script>` tag, only an `<html>` tag, or only a `<style>` tag.

## Component Structure

In the example below, the letter "S" is present in the DOM because it is defined within the template tag. Its color is blue, as specified in the style tag. Additionally, clicking on it triggers an alert, as a click event is defined in the script tag.

<details>
  <summary><ins>Live demo</ins></summary>
  <repl-component id="kn0r1qdmt2lnke1"/>
</details>

```html:index.html
<html>
  <head> <!--asdasd-->
    <title>simply.js - Hello World!</title>
  </head>
  <body>
    <a-letter></a-letter>
    <script src="https://simply.js.org/simply.min.js"></script>
    <script>
      get("a-letter.html");
    </script>
  </body>
</html>
```

```html:a-letter.html
<html>
  <h1 onclick="methods.anAlert();">{{data.letter}}</h1>
</html>

<style> 
  h1 {
  	color: blue;
    font-size: 70vw;
  }
</style>

<script>
  class simply { //hello
    data = {
      letter: "S"
    }
    methods = {
    	anAlert: function() {
        	alert(data.letter);
        }
    }
  }
</script>
```

!> Custom element tag names **must** contain a hyphen (`-`). The filename (without the extension) becomes the tag name, so name your component files like `a-letter.html` to get `<a-letter>`, not `letter.html` which would produce `<letter>` and fail to register.

## Context of Built-in Data

`data`, `props`, `state`, `methods`, `component`, `parent`, `dom` and `lifecycle` are available in every part of a component. You can access them directly without using `this.` prefix:

- **`<html>`** — `{{data.name}}`, `{{methods.fullName()}}`
- **`<style>`** — `var(state.color)`
- **`<script>`** — `data.name`, `state.counter`, `methods.foo()`

The library injects these names into the scope of each part, so you never have to write `this.data` or `this.state`. In fact, `this` is **not** available in any part of a component. Always use the bare names.

---

## Static Template

A component doesn't have to contain all three parts. This one consists of only a template.

<details>
  <summary><ins>Live demo</ins></summary>
  <repl-component id="9yl7k6gtgkucjmw"/>
</details>

```html:index.html
<html>
  <head>
    <title>simply.js - Hello World!</title>
  </head>
  <body>
    <static-template></static-template>
    <script src="https://simply.js.org/simply.min.js"></script>
    <script>
      get("static-template.html"); 
    </script>
  </body>
</html>
```

```html:static-template.html
<html>
	This is just a template without any dynamic or style parts in it.
</html>
```

---

## Component Attributes

You can customize how a component is mounted by adding attributes to its tag:

- **`isolated`** — creates a Shadow Root and keeps the component's styles encapsulated, isolating it from parent styles.
- **`cache`** — keeps the component's `data` and `props` across route navigation. See [Router Cache](docs/router.md).

```html
<my-component isolated cache></my-component>
```

?> By default, custom elements don't use Shadow DOM, so they inherit parent styles and remain accessible via JavaScript from anywhere. This also makes it easy to create custom form element components and serialize them before sending data to the backend.
