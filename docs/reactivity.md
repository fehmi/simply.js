# Reactivity

## Reactivity of Variables

All variables you define on the data section of your component automaticaly will be reactive. Anytime you change the variable, your template will be rerendered if necessarry.

## Element exception

You can disable reactivity for specific elements in your template like below. The div that has "passive" parameter remain passive after first render. It and its children will not affected from data changes.

<repl-component id="k3lkxbulmflvlm9" donwload="true"></repl-component>
