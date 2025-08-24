# Slot

You can pass content to a component by placing it directly inside the component's tag. For example:

```html
<test-component>
  This content will be passed to the component's slot.
</test-component>
```

This content will be automatically rendered inside the `<simply-slot>` tag within the `test-component`.

Here is a live example:

<repl-component id="31b01iy4l6677cb" download="true" save="false"></repl-component>

You can also nest other components inside the slot, like so:

```html
<test-component>
  <p>This content will be passed to the component's slot.</p>
  <other-component></other-component>
</test-component>
```

!> Do not mix `<simply-slot>` with a native `<slot>` element. This can confuse the rendering engine. Always use `<simply-slot>` for slot behavior in SimplyJS.
