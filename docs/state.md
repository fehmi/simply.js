# State Management
State management is pretty easy in simply.js. When you define a state in your component all of child components will share the state and can retrieve or change the state. When a manipulation in the state happen whenever in the component tree all the components that shares the same state will be affected and react to the new value.

?> The difference between data and state variables is, changes in data only affect the current component, but changes in state variable effects both child and parent components.

Define State in Parent Component and you will be able to access/change from any child component.

<repl-component id="zpb0cgtjrapmk9s" donwload="true"></repl-component>