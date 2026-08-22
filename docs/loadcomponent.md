# Load Components

Components are loaded using the `get()` function. The filename without its extension becomes your custom element's tag name — `the-component-to-get.html` results in the tag `<the-component-to-get>`, and the file's content is mounted to this element.

## Single Component

<details>
  <summary><ins>Live demo</ins></summary>
  <repl-component id="2o6tah72m3u0y7v"/>
</details>

```html:index.html
<html>
  <head>
    <title>simply.js - Hello World!</title>
  </head>
  <body>
    <the-component-to-get></the-component-to-get>
    <script src="https://simply.js.org/simply.min.js"></script>
    <script>
      get("the-component-to-get.html");
    </script>
  </body>
</html>
```

```html:the-component-to-get.html
<html>
  The component
</html>
```

## Get Multiple Components

You can also load multiple components by passing an array to the `get()` function.

<details>
  <summary><ins>Live demo</ins></summary>
  <repl-component id="zuf6b6xtojemhtz"/>
</details>

```html:index.html
<html>
  <head>
    <title>simply.js - Hello World!</title>
  </head>
  <body>
    <the-component-to-get></the-component-to-get>
    <br>
    <another-component></another-component>
    <script src="https://simply.js.org/simply.min.js"></script>
    <script>
      get([
        "the-component-to-get.html",
        "another-component.html"
      ]);
    </script>
  </body>
</html>
```

```html:the-component-to-get.html
<html>
  The component
</html>
```

```html:another-component.html
<html>
  Another component
</html>
```

## Custom Tag Name

You can specify a custom tag name as the second argument of `get()`. The component file is loaded, but registered under the tag name you provide.

<details>
  <summary><ins>Live demo</ins></summary>
  <repl-component id="q91bigj0dnly648"/>
</details>

```html:index.html
<html>
  <head>
    <title>simply.js - Hello World!</title>
  </head>
  <body>
    <merhaba-dunya></merhaba-dunya>
    <script src="https://simply.js.org/simply.min.js"></script>
    <script>
      get("hello-world.html", "merhaba-dunya");
    </script>
  </body>
</html>
```

```html:hello-world.html
<html>
  <h1>Hello World!</h1>
  <p>Greetings from {{data.name}}</p>
</html>

<style>
  h1 {
    font-family: Arial, Helvetica;
    color: blue;
  }
</style>

<script>
  class simply {
    data = {
      name: "simply.js"
    }
  }
</script>
```

## Call `get()` Anywhere

`get()` can be called from anywhere in your application — not just the main page. You can load all components at once on the app's main page, or call it inside a component's `afterConstruct` hook or any method. Once `get()` fetches and defines a component, any `<the-component>` tag anywhere in the application is populated with it.

`get()` is asynchronous: it internally uses the native [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) API (with `{ cache: "no-cache" }`) to load the component file, so it never blocks the main thread. On a CORS or network error, it automatically retries through the `cors.woebegone.workers.dev` proxy. Note that `get()` is callback-based, not Promise-based, so it cannot be awaited directly — the component is registered and rendered as soon as the fetch resolves, no matter where the call was made.

!> Custom element tag names **must** contain a hyphen (`-`). The filename (without the extension) becomes the tag name, so name your component files like `first-component.html` to get `<first-component>`, not `first.html` which would produce `<first>` and fail to register.
