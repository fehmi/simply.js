# Conditionals

Conditional statements are defined using special HTML tags such as `<if>`, `<elsif>`, and `<else>`. This approach allows IDEs to easily colorize syntax and format the code without issues.

## If

Use `<if>` to conditionally render a block whenever its `cond` expression evaluates to truthy.

<details>
  <summary><ins>Live demo</ins></summary>
  <repl-component id="wdq2sxxka8gcy4m"/>
</details>

```html:index.html
<html>
  <head>
    <title>simply.js</title>
  </head>
  <body>
    <if-demo/>
    <script src="https://simply.js.org/simply.min.js"></script>
    <script>
      get("if-demo.html");
    </script>
  </body>
</html>
```

```html:if-demo.html
<html>
  <a onclick="data.show = !data.show;">Toggle</a>
  <if cond="data.show">
    <p>This paragraph is only rendered when `data.show` is truthy.</p>
  </if>
</html>

<script>
  class simply {
    data = {
      show: true
    }
  }
</script>
```

?> Please remember that every `if` statement must be closed with an `</if>` tag.

## Elsif

Add `<elsif>` to check additional conditions in sequence; it must be placed immediately after an `<if>` (or another `<elsif>`) block.

<details>
  <summary><ins>Live demo</ins></summary>
  <repl-component id="8sbrhwzf12idtte"/>
</details>

```html:index.html
<html>
  <head>
    <title>simply.js</title>
  </head>
  <body>
    <elsif-demo/>
    <script src="https://simply.js.org/simply.min.js"></script>
    <script>
      get("elsif-demo.html");
    </script>
  </body>
</html>
```

```html:elsif-demo.html
<html>
  <a onclick="data.score = (data.score + 1) % 3;">Next score</a>
  <if cond="data.score == 2">
    <p>Excellent!</p>
  </if>
  <elsif cond="data.score == 1">
    <p>Good!</p>
  </elsif>
  <elsif cond="data.score == 0">
    <p>Keep going!</p>
  </elsif>
</html>

<script>
  class simply {
    data = {
      score: 1
    }
  }
</script>
```

## Else

Use `<else>` to render a fallback block when none of the preceding conditions match.

<details>
  <summary><ins>Live demo</ins></summary>
  <repl-component id="1x1s35tdceji621"/>
</details>

```html:index.html
<html>
  <head>
    <title>simply.js</title>
  </head>
  <body>
    <else-demo/>
    <script src="https://simply.js.org/simply.min.js"></script>
    <script>
      get("else-demo.html");
    </script>
  </body>
</html>
```

```html:else-demo.html
<html>
  <a onclick="data.available = !data.available;">Toggle status</a>
  <if cond="data.available">
    <p>Available</p>
  </if>
  <else>
    <p>Unavailable</p>
  </else>
</html>

<script>
  class simply {
    data = {
      available: true
    }
  }
</script>
```

## Nested Conditionals

Conditionals can be nested inside one another to express more complex logic.

<details>
  <summary><ins>Live demo</ins></summary>
  <repl-component id="j786itznyoghw31"/>
</details>

```html:index.html
<html>
  <head>
    <title>simply.js</title>
  </head>
  <body>
    <nested-demo/>
    <script src="https://simply.js.org/simply.min.js"></script>
    <script>
      get("nested-demo.html");
    </script>
  </body>
</html>
```

```html:nested-demo.html
<html>
  <if cond="data.loggedIn">
    <h3>Welcome, {{data.username}}</h3>
    <if cond="data.isAdmin">
      <p>You have admin privileges.</p>
    </if>
  </if>
  <else>
    <p>Please log in.</p>
  </else>
</html>

<script>
  class simply {
    data = {
      loggedIn: true,
      isAdmin: false,
      username: "simply"
    }
  }
</script>
```

?> You can write any `if` statement that you would typically write with Vanilla JS, as shown below.

```html

  <if cond="data.who == 'Red Bird' && data.age == 3">
    ...
  </if>  

  <if cond="(data.a + 1) > 5 || data.a < 12">
    ...
  </if>

```
