# State Management
State management is straightforward in Simply.js. When you define a state in your component, all child components will share that state and can retrieve or modify it. Any manipulation of the state, regardless of where it occurs in the component tree, will affect all components sharing that state, causing them to react to the new value.

?> The key difference between data and state variables is that changes to data variables only affect the current component, whereas changes to state variables impact both child and parent components.

Define state in a parent component, and you will be able to access and modify it from any child component.

<repl-component id="zpb0cgtjrapmk9s" download="true"></repl-component>
