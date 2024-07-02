# Reactivity

## Reactivity of Variables

All variables you define on the data section of your component automaticaly will be reactive. Anytime you change the variable, your template will be rerendered if necessarry.

!> When a data or prop changed in a parent component, all children react to that. But children not react to the changes in granparents. If you need to do that use [state management](docs/state) instead.

## Element exception

You can disable reactivity for specific elements in your template like below. The div that has "passive" parameter remain passive after first render. It and its children will not affected from data changes.

<repl-component id="k3lkxbulmflvlm9" donwload="true"></repl-component>

## Make changes without triggering react/render

It can be helpful for performance reasons. In that scenario, do your changes withot triggering reaction and then render manually when you finish.

<repl-component id="t509ixnfmmbk0n5" donwload="true"></repl-component>
