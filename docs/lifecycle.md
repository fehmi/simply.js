## Lifecycle Events

| Event              | Description                                        |
|:-------------------|:---------------------------------------------------|
| **beforeConstruct**| Before creating and initializing the component     |
| **afterConstruct** | After creating and initializing the component      |
|                    |                                                    |
| **beforeFirstRender**| Before the component is rendered to the DOM for the first time|
| **afterFirstRender**| After the component is rendered to the DOM for the first time |
|                    |                                                    |
| **beforeRender**   | Before every render                                |
| **afterRender**    | After every render                                 |
|                    |                                                    |
| **beforeRerender** | Before the component is re-rendered/updated on the DOM|
| **afterRerender**  | After the component is re-rendered/updated on the DOM |
|                    |                                                    |
| **whenDataChange** | After a variable in the component's data object is changed|
| **whenPropChange** | After a prop is changed                            |
|                    |                                                    |
| **disconnected**   | Triggered when the component is removed from the DOM|

!> DOM and state variables are not available during the "construct" phase. You can only access them in "render" events, especially if you are using routers.

## Usage Example

<repl-component id="sp34gk6ealoxiwu" download="true"></repl-component>
