# Reactivity

All variables defined in the `data` section of your component are automatically reactive — and so are `props` and `state`. Anytime you change a variable, your template is re-rendered if necessary.

Reactivity flows top-down for `data` and `props`. Children that read `parent.data` or `parent.props` stay up to date when those change. This includes grandchildren and deeper. The reverse is not true. If a parent reads a child's value directly (e.g. `component.querySelector("child-component").data.something`) and that value changes, the parent is not notified. In that case use [state management](docs/state) instead. `state` is reactive across the entire component tree.

## The `<static>` Tag

You can disable reactivity for specific parts of your template with the `<static>` tag. Content inside it is rendered only once — even if a reactive variable inside it changes later, the static part is not re-rendered. This is useful for performance when part of the template never changes.

```html
<html>
  <static>
    <h1>This header is rendered once</h1>
  </static>
  <p>{{data.counter}}</p>
</html>
```

## Update without re-render

?> This approach might be unnecessary as the new template and reactivity engine are fast enough to handle such cases. Further testing is required. This section may be removed after more comprehensive battle tests.

It can be helpful for performance reasons. In such scenarios, make your changes without triggering a reaction, and then render manually when finished.

You can use a built-in method to set data without triggering a render. You can then manually render for increased performance.

```js
simply.setWithoutRender(data, {
  total: response.response.headers["X-WP-Total"],
  offset: data.offset + data.perPage,
  themes: response.meta.themes,
  meta: response.meta,
});
component.render(); // or component.react()
```

You can also pause/resume reactivity for this. Data, state, and properties are supported.

```js
ObservableSlim.pause(data);
result.results.forEach(function (entry, i) {
  const imageObj = images[i];
  const uid = imageObj.uid;
  const alt = entry && entry.alt_text;

  const imageItem = methods.findFeImageObjByUid(uid);

  if (alt) {
    methods.changeAlt(alt, uid);
  }

  if (imageItem) {
    imageItem.status = alt ? "idle" : "error";
  }

  state.bulk.current = i + 1;
});
ObservableSlim.resume(data);
```

Or just do

```
data.__getTarget.currentZoomPercent = 100; 
```

You can also make changes without triggering render by replacing the property descriptors:

```js
// make changes without triggering render
const allUpdates = { ...data, name: "hede" };
const changes = Object.getOwnPropertyDescriptors(allUpdates);
Object.defineProperties(data, changes);
```

## Assigning reactive variables

Each node in `data`, `state`, or `props` is a reactive proxy object. Assigning one to another can be problematic and may break the reactivity engine by causing infinite loops. For example, assigning `data.person = state.person` or vice versa can lead to a "Maximum call stack size exceeded" error.

While it might work the first time you assign it, subsequent assignments can trigger these issues.

To prevent this, you should first **remove the existing reference** before reassigning it. You can do this by either:

```js
delete data.person;
```

or

```js
data.person = {};
```

After that, it is safe to assign it again as you did the first time:

```js
data.person = state.person;
```

This ensures that the assignment doesn't recursively trigger reactive updates between proxies.

---