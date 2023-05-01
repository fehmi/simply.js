# Inline Components

## Usage without SFC
You don't have to use SFC. You can define your components inline without creating a file. Inside your custom tag, you can define your component in a template tag. You only need to flah template tag with a "simply" prop. Simply.js detect your inline component this prop. Example inline component code:
<repl-component id="xunoibhy4v6ic2s" download="true"></repl-component>

## Overriding SFC
The other use case of inline components is to modify the template loaded via SFC. For example you can `append`, `prepend` or `replace` the html like below:
<repl-component id="l370we4zpzci3f2" download="true"></repl-component>

The same (`append`, `prepend` or `replace`) can be applied to the `style` tag too.
<repl-component id="2lhln8jsrf191g7" download="true"></repl-component>

The `methods`, `data`, `props`, `lifecycle` hooks will be merge with the SFC. You don't have to tag it with `append/prepend/replace`. The default behaviour is `merge`. For example, the `data.name `variable is defined in SFC and the `data.surname` variable is defined inside inline component. After that, you can reach both.
<repl-component id="u1wp618gxy4373n" download="true"></repl-component>

## Nested Inline Components
I don't know if you need this crazy inception approach but you can freely use endless nested inline components if you want:
<repl-component id="gugroqbnyf4bug6" download="true"></repl-component>
