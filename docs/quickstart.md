# Quick Start

## Installation

You can add simple to your document via `<script>` tag and that's all.

```bash
<script src="smpl.js"></script>
```

## Create Your First Component

Save it anywhere you want as `hello-world.html`

```html
<template>
  <p>Hello world! This is {data.name}. Nice to meet you.
</template>

<style>
  p {
    background: aquamarine;
    font-size: 20px;
  }
</style>

<script>
  class {
    data = {
      "name": "fehmi",
    };
  }
</script>
```

## Use the Component

```html
  <html>
    <head></head>
    <body>
      <hello-world></hello-world>
      <script src="smpl.js"></script>
      <script>
        importComponent("hello-world", "hello-world.html");
      </script>
    </body>
  </html>
```

## Preview your site

You can put the files to your server when they are ready. You can use any server tool MAMP, Prepros, Codekit etc.
