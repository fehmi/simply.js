# Style Conditions

Rules can be wrapped in `&cond:[if="..." ]`, `&cond:[elsif="..." ]` and `&cond:[else]` blocks and are only applied when the expression is truthy. Conditions can be nested.

<details>
  <summary><ins>Live demo</ins></summary>
  <repl-component id="mtzbh77y2n05oko"/>
</details>

```html:index.html
<html>
  <head>
    <title>simply.js</title>
  </head>
  <body>
    <badge-comp/>
    <script src="https://simply.js.org/simply.min.js"></script>
    <script>
      get("badge-comp.html");
    </script>
  </body>
</html>
```

```html:badge-comp.html
<html>
  <span class="badge">Rank</span>
  <a onclick="data.level = (data.level + 1) % 3;">Level up</a>
</html>

<style>
  .badge {
    padding: 4px 10px;
    border-radius: 999px;
    color: white;
  }

  &cond:[if="data.level >= 2"] {
    .badge {
      background: #f1c40f;
    }
  }

  &cond:[elsif="data.level >= 1"] {
    .badge {
      background: #95a5a6;
    }
  }

  &cond:[else] {
    .badge {
      background: #cd7f32;
    }
  }
</style>

<script>
  class simply {
    data = {
      level: 1
    }
  }
</script>
```

Conditions can also be nested, and combined with dynamic variables:

```css
&cond:[if="data.asd && data.asd == 10"] {
  .status {
    background: var(data.color);
  }

  &cond:[if="data.loggedIn"] {
    .status {
      border: 2px solid white;
    }
  }
}
```

See [Style](docs/style.md) for an overview of component styling.
