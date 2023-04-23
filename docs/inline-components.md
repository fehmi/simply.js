# Inline Components

You don't have to use a SFC. You can define your components inline without creating a file. Inside your custom tag, you can define your component in a template tag. You only need to flah template tag with a "simply" prop. Simply.js detect your inline component this prop. Example inline component code:

```html
<hello-world>
  <template simply>
    <html>
      <h1>Hello World!</h1>
      <p>Greetings from {data.name}</p>   
    </html>

    <style>
      h1 {
        font-family: Arial, Helvetica;
        color: blue;
      }
    </style>
    <script>
      class {
        data = {
          name: "simply.js"
        }
      }
    </script>      
  </template>
```
<repl-component id="xunoibhy4v6ic2s"></repl-component>

## Overriding SFC
The other use case of inline components is to modify the template loaded via SFC. For example you can `append`, `prepend` or `replace` the html like below:
<repl-component id="tnskr8z62u6ip3b"></repl-component>

The same (`append`, `prepend` or `replace`) can be applied to the `style` tag too.
<repl-component id="m0n8wwg4rquhcgo"></repl-component>

The methods, data, props, lifecycle hooks will be merge with the SFC. You don't have to tag it with append/prepend/replace. The default behaviour is merge. For example, the data.name variable is defined in SFC and the data.surname variable is defined inside inline component. After that, you can reach both.
<repl-component id="u1wp618gxy4373n"></repl-component>

## Nested Inline Components
I don't know if you need this inception thing but you can freely use endless nested inline components if you want like below:
<repl-component id="4d57aekfvftxgq1"></repl-component>
