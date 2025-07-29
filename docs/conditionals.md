# Conditionals

Conditional statements are defined using special HTML tags such as `<if>`, `<elsif>`, and `<else>`. This approach allows IDEs to easily colorize syntax and format the code without issues.

## If

<repl-component id="th73bi8vvx8q32v" download="true"></repl-component>

?> Please remember that every `if` statement must be closed with an `</if>` tag.

## Elsif

The `<elsif>` tag functions similarly to an `<if>` tag but must be placed immediately after an `<if>` (or another `<elsif>`) block.

<repl-component id="4te0gtxxiq2u9b1" download="true"></repl-component>

## Else

<repl-component id="lfkku59utqdlyix" download="true"></repl-component>

## Nested Conditionals

All variables defined in the `data` section of your component will automatically be reactive. Anytime you change a variable, your template will be re-rendered.

<repl-component id="erexq0k102v6bbz" download="true"></repl-component>

?> You can write any `if` statement that you would typically write with Vanilla JS, as shown below.

```html

  <if cond="data.who == 'Red Bird' && data.age == 3">
    ...
  </if>  

  <if cond="(data.a + 1) > 5 || data.a < 12">
    ...
  </if>

```
