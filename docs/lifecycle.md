## Lifecycle Events

Lifecycle events let you hook into the different stages of a component's life — from construction, to rendering, to being removed from the DOM. Define them inside the `lifecycle` object of your component class.

| Event              | Description                                        |
|:-------------------|:---------------------------------------------------|
| **afterConstruct** | After creating and initializing the component      |
| **beforeFirstRender**| Before the component is rendered to the DOM for the first time|
| **afterFirstRender**| After the component is rendered to the DOM for the first time |
| **beforeRender**   | Before every render                                |
| **afterRender**    | After every render                                 |
| **beforeRerender** | Before the component is re-rendered/updated on the DOM|
| **afterRerender**  | After the component is re-rendered/updated on the DOM |
| **whenDataChange** | After a variable in the component's data object is changed|
| **whenPropChange** | After a prop is changed                            |
| **whenStateChange** | After a state is changed                            |
| **disconnected**   | Triggered when the component is removed from the DOM|
| **routerEnter**   | Triggered when the router enter with the component  |
| **framerPropsUpdated**   | When a prop is changed in Framer             |
| **framerComponentClicked**   | When a Framer component is clicked       |



!> DOM and state variables are not available during the "construct" phase. You can only access them in "render" events, especially if you are using routers.

## Logging Lifecycle Events

The following example logs every lifecycle event to a `data.log` array and renders it with an `each` loop. Click the buttons to trigger `data`, `prop` and `state` changes.

<details>
  <summary><ins>Live demo</ins></summary>
  <repl-component id="87bfcos3kft7omy"/>
</details>

```html:index.html
<html>
  <head>
    <title>simply.js</title>
  </head>
  <body style="margin: 0">
    <lifecycle-log count="0" isolated/>
    <script src="https://simply.js.org/simply.min.js"></script>
    <script>
      get("lifecycle-log.html");
    </script>
  </body>
</html>

```

```html:lifecycle-log.html
<html>
  <div class="controls">
    <button onclick="methods.updateData()">Update data</button>
    <button onclick="methods.updateProp()">Update prop</button>
    <button onclick="methods.updateState()">Update state</button>
  </div>
  <div class="values">
    <span>data: {{data.counter}}</span>
    <span>prop: {{props.count}}</span>
    <span>state: {{state.counter}}</span>
  </div>
  <div class="log">
    <each of="data.log" as="entry">
      <div class="entry">{{entry.time}} → {{entry.type}}</div>
    </each>
  </div>
</html>

<style>
  :host {
    display: flex;
    font-family: monospace;
    background: #131010;
    color: rgb(216 221 226);
    padding: 10px;
    font-size: 12px;
    height: 100%;
    box-sizing: border-box;
    flex-direction: column;
  }
  .controls {
    margin-bottom: 8px;
  }
  .controls button {
    margin-right: 6px;
    font-family: monospace;
    font-size: 12px;
    background: #2a2525;
    color: rgb(216 221 226);
    border: 1px solid #3d3838;
    padding: 4px 8px;
    cursor: pointer;
  }
  .values {
    margin-bottom: 8px;
    color: #82aaff;
  }
  .values span {
    margin-right: 12px;
  }
  .log {
    overflow: auto;
    border: 1px solid #3d3838;
    padding: 8px;
    flex: 1;
  }
  .entry {
    padding: 2px 0;
    border-bottom: 1px solid #2b2929;
  }
</style>

<script>
  class simply {
    data = {
      log: [],
      counter: 0
    }
    state = {
      counter: 0
    }
    methods = {
      // log push'u rerender tetiklediğinde hook'ların tekrar push
      // etmesini engelleyen guard bayrağı (sonsuz döngüyü önler)
      logging: false,
      log(type) {
        if (this.logging) return;
        var d = new Date();
        var time = d.getHours() + ":" + String(d.getMinutes()).padStart(2, "0") + ":" + String(d.getSeconds()).padStart(2, "0");
        data.log.unshift({ time, type });
      },
      updateData() {
        data.counter++;
      },
      updateProp() {
        props.count++;
      },
      updateState() {
        state.counter++;
      }
    }
    lifecycle = {
      afterConstruct() { methods.log("afterConstruct"); },
      beforeRender() { methods.log("beforeRender"); },
      beforeFirstRender() { methods.log("beforeFirstRender"); },
      afterFirstRender() { methods.log("afterFirstRender"); },
      afterRender() { if (!methods.logging) methods.log("afterRender"); methods.logging = false; },
      beforeRerender() { if (!methods.logging) methods.log("beforeRerender"); },
      afterRerender() { if (!methods.logging) methods.log("afterRerender"); },
      whenDataChange(changes) {
        var hasLog = changes.some(c => c.currentPath.includes("log"));
        var hasOther = changes.some(c => !c.currentPath.includes("log"));
        // önce log'la (hasOther), sonra guard'ı kur (sadece log değişimiyse)
        if (hasOther) methods.log("whenDataChange");
        if (hasLog && !hasOther) methods.logging = true;
      },
      whenPropChange() { methods.log("whenPropChange"); },
      whenStateChange() { methods.log("whenStateChange"); }
    }
  }
</script>
```
