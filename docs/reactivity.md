# Reactivity

## Reactivity of Variables

All variables you define on the data section of your component automaticaly will be reactive. Anytime you change the variable, your template will be rerendered if necessarry.

!> When a data or prop changed in a parent component, all children react to that. But children not react to the changes in granparents. If you need to do that use [state management](docs/state) instead.

## Element exception

You can disable reactivity for specific elements in your template like below. The div that has "passive" parameter remain passive after first render. It and its children will not affected from data changes.

<repl-component id="k3lkxbulmflvlm9" donwload="true"></repl-component>

## Make changes without triggering react/render

?> This aproach can be unnecessary because new template and reactivity engine is fast enough to handle cases like that. Need more test though. This section can be deleted after some battle tests.

It can be helpful for performance reasons. In that scenario, do your changes withot triggering reaction and then render manually when you finish.

<repl-component id="t509ixnfmmbk0n5" donwload="true"></repl-component>

You can also use built-in method to set data without triggering render. Then you can render manually for increasing performance.

```js
simply.setWithoutRender(data, {
  total: response.response.headers["X-WP-Total"],
  offset: data.offset + data.perPage,
  themes: response.meta.themes,
  meta: response.meta,
});
component.render(); // or component.react()
```

You can also pasue/resume reactivity for that. data, state and props supported.

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

## Assigning a reactive variable to another reactive variable

Each node in `data`, `state`, or `props` is a reactive proxy object. Assigning one to another can be problematic and may break the reactivity engine by causing infinite loops. For example, assigning `data.person = state.person` or vice versa can lead to a "maximum call stack size exceeded" error.

It might work the first time you assign it, but subsequent assignments can trigger these issues.

To prevent this, you should first **remove the existing reference** before reassigning. You can do this by either:

```js
delete data.person;
```

or

```js
data.person = {};
```

After that, it's safe to assign it again as you did the first time:

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
