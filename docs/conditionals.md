# Conditionals

We are defining conditional statemens as special html tags like `<if>`, `<elsif>`, `<else>`. This way helps our IDE to easyly colorize syntax and format the code without and issue.

## If

<repl-component id="th73bi8vvx8q32v" download="true"></repl-component>

?> Please remember that every if statement must be closed with an `</if>`

## Elsif

It works just like an `<if>` but just after an `<if>` as you know.

<repl-component id="4te0gtxxiq2u9b1" download="true"></repl-component>

## Else

<repl-component id="lfkku59utqdlyix" download="true"></repl-component>

## Nested Conditionals

All variables you define on the data section of your component automaticaly will be reactive. Anytime you change the variable, your template will be rerendered.

<repl-component id="erexq0k102v6bbz" donwload="true"></repl-component>

?> You can write any if statement that you can write with Vanilla JS like below.

```html

  <if cond="data.who == 'Red Bird' && data.age == 3">
    ...
  </if>  

  <if cond="(data.a + 1) > 5 || data.a < 12">
    ...
  </if>

```