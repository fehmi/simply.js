# Each Loops

It is possible to iterate through an array or object.

## Simple Form of Each Loops

Use `<each>` to iterate over an array or object.

<details>
  <summary><ins>Live demo</ins></summary>
  <repl-component id="t0ypxgljuu059ot"/>
</details>

```html:index.html
<html>
  <head>
    <title>simply.js</title>
  </head>
  <body>
    <hobby-list/>
    <script src="https://simply.js.org/simply.min.js"></script>
    <script>
      get("hobby-list.html");
    </script>
  </body>
</html>
```

```html:hobby-list.html
<html>
  <each of="data.hobbies" as="hobby">
    <li>{{hobby}}</li>
  </each>
</html>

<script>
  class simply {
    data = {
      hobbies: {
        Music: "Daily",
        Gaming: "Weekly",
        Sports: "Monthly",
      }
    }
  }
</script>
```

## Keys and Indexes

It is also possible to access keys and indexes.

<details>
  <summary><ins>Live demo</ins></summary>
  <repl-component id="8uobm2743rsv838"/>
</details>

```html:index.html
<html>
  <head>
    <title>simply.js</title>
  </head>
  <body>
    <hobby-list/>
    <script src="https://simply.js.org/simply.min.js"></script>
    <script>
      get("hobby-list.html");
    </script>
  </body>
</html>
```

```html:hobby-list.html
<html>
  <each of="data.hobbies" as="hobby" key="key" index="index">
    <li>{{hobby}} : {{key}} : {{index}}</li>
  </each>
</html>

<script>
  class simply {
    data = {
      hobbies: {
        Music: "Daily",
        Gaming: "Weekly",
        Sports: "Monthly",
      }
    }
  }
</script>
```

?> Within a loop, you can directly access variables without specifying the root node (e.g., `data.variable`).

## Nested Loops

You can nest as many loops as needed.

<details>
  <summary><ins>Live demo</ins></summary>
  <repl-component id="eclmm3y1krpf2r6"/>
</details>

```html:index.html
<html>
  <head>
    <title>simply.js</title>
  </head>
  <body>
    <hobby-list/>
    <script src="https://simply.js.org/simply.min.js"></script>
    <script>
      get("hobby-list.html");
    </script>
  </body>
</html>
```

```html:hobby-list.html
<html>
  <each of="data.hobbies" as="hobby" key="key" index="index">
    <each of="hobby" as="item">
      <li>{{item}}</li>
    </each>
  </each>
</html>

<script>
  class simply {
    data = {
      hobbies: {
        Music: ["Drum", "Guitar", "Keyboard"],
        Gaming: ["Spelunky", "Gunpoint", "Portal 2"],
        Sports: ["Swimming", "Cycling", "Walking"]
      }
    }
  }
</script>
```
