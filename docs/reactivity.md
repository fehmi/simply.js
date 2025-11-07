# Reactivity

## Reactivity of Variables

All variables defined in the `data` section of your component will automatically be reactive. Anytime you change a variable, your template will be re-rendered if necessary.

!> When data or a property changes in a parent component, all children react to that change. However, children do not react to changes in their grandparents. If you need this functionality, use [state management](docs/state) instead.

## Element exception

You can disable reactivity for specific elements in your template, as shown below. The `div` element with the "passive" parameter will remain passive after the first render. It and its children will not be affected by data changes.

<repl-component id="k3lkxbulmflvlm9" download="true"></repl-component>

## Make changes without triggering react/render

?> This approach might be unnecessary as the new template and reactivity engine are fast enough to handle such cases. Further testing is required. This section may be removed after more comprehensive battle tests.

It can be helpful for performance reasons. In such scenarios, make your changes without triggering a reaction, and then render manually when finished.

<repl-component id="t509ixnfmmbk0n5" donwload="true"></repl-component>

You can also use a built-in method to set data without triggering a render. You can then manually render for increased performance.

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

## Assigning a reactive variable to another reactive variable

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

Perfect — here’s a refined version of your section title and description, inspired by the tone and style of the `getNodeKey` documentation:

---

### Preserve Elements Using `id` to Avoid Re-Spawning

By default, when elements shift position due to conditional rendering, morphdom may destroy and re-create them—even if they already exist in the DOM. This can cause loss of internal state or loaded content.

For example:

```html
<html>
  <if cond="state.something">
    <div>something</div>
  </if>
  <route></route>
</html>
```

When `state.something` becomes `true`, the `<div>` is inserted before `<route>`, causing `<route>` to be destroyed and re-added. If `<route>` has already loaded content, that content will be lost.

To prevent this, assign a unique `id` to the element. This allows morphdom to track the element and move it instead of re-spawning it:

```html
<route id="backbone"></route>
```

This works because `morphdom` uses the element’s `id` as a stable key by default (via `getNodeKey`) to preserve it during DOM updates.
