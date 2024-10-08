## Lifecycle Events

| <br>Event<br><br>   |      Description      |
|:----------|:-------------|
| **beforeConstruct** |  Before creating and intializing component |
| **afterConstruct** |    After creating and intializing component   |
|||
| **beforeFirstRender** | Before component rendered to the DOM at the first time |
| **afterFirstRender** | After component rendered to the DOM at the first time |
|||
| **beforeRender** | Before every render |
| **afterRender** | After every render |
|||
| **beforeRerender** | Before component rerendered/updated on the DOM |
| **afterRerender** | After component rerendered/updated on the DOM |
|||
| **whenDataChange** | After a variable in data object of a component is changed |
| **whenPropChange** | After a prop is is changed |
|||
| **disconnected** | Triggered when the component is removed from the DOM |

!> DOM and state variables is not available in "construct". You can only reach them in "render" events, especially if you are using routers.

## Usage Example

<repl-component id="sp34gk6ealoxiwu" donwload="true"></repl-component>