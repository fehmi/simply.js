# Field

Form field components: `s-field`, `s-field-label`, `s-field-description`, `s-field-group`, `s-field-set`, `s-field-separator`, `s-field-content`, `s-field-title`, `s-field-legend`, `s-field-error`, and `s-checkbox`. They work together to build accessible form fields.

## s-field

The core wrapper for a single field — combines a label, control, and helper text.

```html
<s-field>
  <s-field-label for="name">Full name</s-field-label>
  <s-input light id="name" placeholder="Evil Rabbit"></s-input>
  <s-field-description>This appears on invoices and emails.</s-field-description>
</s-field>
```

?> The field content is **slot content** — components render in shadow DOM by default, so the slot projects it. The wrapper is a flex container with a `gap` of `calc(var(--spacing) * 3)` (12px). Use `orientation="horizontal"` to place the label and control side by side.

| Prop | Type | Default | Description |
|---|---|---|---|
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | Stack children vertically or side by side |
| `slot` | string | `"<s-field-label>…<s-input>…<s-field-description>…"` | The field children (label + control + description) |

<s-component-viewer subject="s-field"></s-component-viewer>

## s-field-content

Flex column that groups a label and description when the label sits beside the control.

```html
<s-field orientation="horizontal">
  <s-checkbox id="notifications"></s-checkbox>
  <s-field-content>
    <s-field-label for="notifications">Notifications</s-field-label>
    <s-field-description>Email, SMS, and push options.</s-field-description>
  </s-field-content>
</s-field>
```

?> The content is **slot content** — components render in shadow DOM by default, so the slot projects it. It's a flex column with a `gap` of `calc(var(--spacing) * 1)` (4px, Vega) that varies per theme via the `--field-content-gap` token.

| Prop | Type | Default | Description |
|---|---|---|---|
| `slot` | string | `"<s-field-label>…<s-field-description>…"` | The label + description |

<s-component-viewer subject="s-field-content"></s-component-viewer>

## s-field-title

Renders a title with label styling inside a `s-field-content`.

```html
<s-field-content>
  <s-field-title>Enable Touch ID</s-field-title>
  <s-field-description>Unlock your device faster.</s-field-description>
</s-field-content>
```

?> The title text is **slot content** — components render in shadow DOM by default, so the slot projects it. It's a flex row with `w-fit`, `gap-2`, `text-sm`, and `font-medium`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `slot` | string | `"Enable Touch ID"` | The title text |

<s-component-viewer subject="s-field-title"></s-component-viewer>

## s-field-label

A label for a form field, associated with a control via the `for` attribute.

```html
<s-field-label for="username">Username</s-field-label>
<s-input light id="username" placeholder="Enter your username"></s-input>
```

?> The label text is **slot content** — components render in shadow DOM by default, so the slot projects it. Since `for` doesn't cross the shadow boundary, clicking the label focuses the control via a JS handler.

| Prop | Type | Default | Description |
|---|---|---|---|
| `for` | string | `""` | The `id` of the associated form control |
| `disabled` | boolean | `false` | Fades the label (opacity 0.5) |
| `slot` | string | `"Label"` | The label text |

<s-component-viewer subject="s-field-label"></s-component-viewer>

## s-field-description

A description for a form field, rendered below the control.

```html
<s-field-label for="email">Email</s-field-label>
<s-input light id="email" type="email" placeholder="name@example.com"></s-input>
<s-field-description>We'll never share your email with anyone.</s-field-description>
```

?> The description text is **slot content** — components render in shadow DOM by default, so the slot projects it. Links inside the description are underlined and turn `primary` on hover.

| Prop | Type | Default | Description |
|---|---|---|---|
| `slot` | string | `"Description"` | The description text |

<s-component-viewer subject="s-field-description"></s-component-viewer>

## s-field-group

Groups related form fields, stacking them vertically with a gap.

```html
<s-field-group>
  <s-field>
    <s-field-label for="name">Name</s-field-label>
    <s-input light id="name" placeholder="Jordan Lee"></s-input>
  </s-field>
  <s-field>
    <s-field-label for="email">Email</s-field-label>
    <s-input light id="email" type="email" placeholder="name@example.com"></s-input>
    <s-field-description>We'll send updates to this address.</s-field-description>
  </s-field>
</s-field-group>
```

?> The fields are **slot content** — components render in shadow DOM by default, so the slot projects them. The group is a flex column with a `gap` of `calc(var(--spacing) * 7)` (28px), matching the original `flex flex-col gap-7`. Add `data-slot="checkbox-group"` for the tighter 12px gap used with checkbox/radio rows.

| Prop | Type | Default | Description |
|---|---|---|---|
| `data-slot` | string | `"field-group"` | Override the slot name (e.g. `"checkbox-group"`) |
| `slot` | string | `"<s-field>…<s-field>…"` | The grouped fields |

<s-component-viewer subject="s-field-group"></s-component-viewer>

## s-field-set

Semantic grouping of fields with a legend, usually containing a `s-field-group`.

```html
<s-field-set>
  <s-field-label>Responses</s-field-label>
  <s-field-description>Get notified when ChatGPT responds to requests that take time.</s-field-description>
  <s-field-group data-slot="checkbox-group">
    <s-field orientation="horizontal">
      <s-checkbox id="push" default-checked disabled></s-checkbox>
      <s-field-label for="push">Push notifications</s-field-label>
    </s-field>
  </s-field-group>
</s-field-set>
```

?> Renders a semantic `<fieldset>` with a flex column layout and a `gap` of `calc(var(--spacing) * 6)` (24px). When it contains a `data-slot="checkbox-group"` or `data-slot="radio-group"`, the gap tightens to 12px (detected via the lifecycle, since `:has()` can't cross the shadow boundary).

| Prop | Type | Default | Description |
|---|---|---|---|
| `slot` | string | `"<s-field-group>…"` | The set children (a field group) |

<s-component-viewer subject="s-field-set"></s-component-viewer>

## s-field-legend

Legend element for a `s-field-set`. Switch to the `label` variant to align with label sizing.

```html
<s-field-set>
  <s-field-legend>Address Information</s-field-legend>
  <s-field-description>We need your address to deliver your order.</s-field-description>
  <s-field-group>
    <s-field>
      <s-field-label for="street">Street Address</s-field-label>
      <s-input light id="street" type="text" placeholder="123 Main St"></s-input>
    </s-field>
  </s-field-group>
</s-field-set>
```

?> Renders a semantic `<legend>` with `mb-3 font-medium`. The `legend` variant uses `text-base`; the `label` variant uses `text-sm`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"legend" \| "label"` | `"legend"` | `legend` = text-base, `label` = text-sm |
| `slot` | string | `"Profile"` | The legend text |

<s-component-viewer subject="s-field-legend"></s-component-viewer>

## s-field-separator

Visual divider to separate sections inside a `s-field-group`. Accepts optional inline content.

```html
<s-field-group>
  <s-field-set>...</s-field-set>
  <s-field-separator></s-field-separator>
  <s-field-set>...</s-field-set>
</s-field-group>
```

?> The separator is a 1px `border` line centered in a 20px-tall container. If you pass children, they render as centered text on top of the line (with `background` covering it). Without children, only the line shows.

| Prop | Type | Default | Description |
|---|---|---|---|
| `slot` | string | `"Or continue with"` | Optional centered content |

<s-component-viewer subject="s-field-separator"></s-component-viewer>

## s-checkbox

A checkbox control with a checked state, used inside a horizontal `s-field`.

```html
<s-field orientation="horizontal">
  <s-checkbox id="push" default-checked disabled></s-checkbox>
  <s-field-label for="push">Push notifications</s-field-label>
</s-field>
```

?> Renders a `<button role="checkbox">` with `aria-checked`. Clicking toggles the state. `default-checked` sets the initial checked state; `disabled` prevents toggling.

| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | string | `""` | The `id` of the checkbox |
| `default-checked` | boolean | `false` | Initial checked state |
| `disabled` | boolean | `false` | Disables the checkbox |

<s-component-viewer subject="s-checkbox"></s-component-viewer>

## s-field-error

Accessible error container for validation messages.

```html
<s-field data-invalid>
  <s-field-label for="email">Email</s-field-label>
  <s-input light id="email" type="email" aria-invalid></s-input>
  <s-field-error>Enter a valid email address.</s-field-error>
</s-field>
```

?> Renders a `<div role="alert">` with `text-sm font-normal text-destructive`. The error text is **slot content** — components render in shadow DOM by default, so the slot projects it. When there are no children, the element hides itself (like the original returning `null`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `slot` | string | `"Choose another username."` | The error message |

<s-component-viewer subject="s-field-error"></s-component-viewer>