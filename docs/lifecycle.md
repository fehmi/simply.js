## Lifecycle Events

| <br>Event<br><br>   |      Description      |
|:----------|:-------------|
| **beforeConstruct** |  Before creating and intializing component |
| **afterConstruct** |    After creating and intializing component   |
|||
| **beforeFirstRender** | Before component rendered to the DOM at the first time |
| **afterFirstRender** | After component rendered to the DOM at the first time |
|||
| **beforeRerender** | Before component rerendered/updated on the DOM |
| **afterRerender** | After component rerendered/updated on the DOM |
|||
| **whenDataChange** | After a variable in data object of a component is changed |
| **whenPropChange** | After a prop is is changed |
|||
| **disconnected** | Triggered when the component is removed from the DOM |

## Usage Example

```html
<script>
  class {
    data = {
      // ...
    }
    methods = {
      // ...
    }
    lifecycle = {
      whenDataChange(name, value, old, parents) {  
        console.log("whenDataChange", name, value, old, parents);
      },
      whenPropChange(name, oldValue, newValue) {  
        console.log("PROP", a,b,c);
      },
      disconnected() {  
        console.log("disconnected");
      }                      
    }
  }
</script>
```