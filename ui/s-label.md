# Label

Renders an accessible label associated with controls. Links to a control via the `for` attribute.

## Usage

<s-component-viewer subject="s-label"></s-component-viewer>
```html
<s-label for="email">Your email address</s-label>
```

## With a Checkbox

<s-component-viewer subject="s-label" title="false" description="false" config="false"></s-component-viewer>
```html
<div style="display: flex; align-items: center; gap: calc(var(--spacing) * 2)">
  <s-checkbox id="terms"></s-checkbox>
  <s-label for="terms">Accept terms and conditions</s-label>
</div>
```

The checkbox and label sit in a `gap-2` (8px) flex row, matching shadcn. Clicking the label toggles the associated checkbox via `for` (native `label[for]` can't reach a checkbox rendered in a shadow DOM, so the label activates the control programmatically).

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `for` | string | `""` | The `id` of the associated form control |
| `disabled` | boolean | `false` | Fades the label (opacity 0.5) |

## Label in Field

For form fields, use the `s-field` component which includes built-in `s-field-label`, `s-field-description`, and `s-field-error` components.

<s-component-viewer subject="s-field" title="false" description="false"></s-component-viewer>
```html
<s-field>
  <s-field-label for="email">Your email address</s-field-label>
  <s-input light id="email" type="email" placeholder="you@example.com"></s-input>
</s-field>
```

A full form combines the field family with inputs, selects, textarea, checkbox, and buttons into a `s-field-group`:

<s-component-viewer subject="s-field-group" title="false" description="false"></s-component-viewer>
```html
<div style="max-width: 28rem">
<s-field-group>
  <s-field-set>
    <s-field-legend>Payment Method</s-field-legend>
    <s-field-description>All transactions are secure and encrypted</s-field-description>
    <s-field-group>
      <s-field>
        <s-field-label for="card-name">Name on Card</s-field-label>
        <s-input light id="card-name" placeholder="Evil Rabbit" required></s-input>
      </s-field>
      <s-field>
        <s-field-label for="card-number">Card Number</s-field-label>
        <s-input light id="card-number" placeholder="1234 5678 9012 3456" required></s-input>
        <s-field-description>Enter your 16-digit card number</s-field-description>
      </s-field>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem">
        <s-field>
          <s-field-label for="exp-month">Month</s-field-label>
          <s-select>
            <s-select-trigger id="exp-month">
              <s-select-value placeholder="MM"></s-select-value>
            </s-select-trigger>
            <s-select-content>
              <s-select-group>
                <s-select-item value="01">01</s-select-item>
                <s-select-item value="02">02</s-select-item>
                <s-select-item value="03">03</s-select-item>
                <s-select-item value="04">04</s-select-item>
                <s-select-item value="05">05</s-select-item>
                <s-select-item value="06">06</s-select-item>
                <s-select-item value="07">07</s-select-item>
                <s-select-item value="08">08</s-select-item>
                <s-select-item value="09">09</s-select-item>
                <s-select-item value="10">10</s-select-item>
                <s-select-item value="11">11</s-select-item>
                <s-select-item value="12">12</s-select-item>
              </s-select-group>
            </s-select-content>
          </s-select>
        </s-field>
        <s-field>
          <s-field-label for="exp-year">Year</s-field-label>
          <s-select>
            <s-select-trigger id="exp-year">
              <s-select-value placeholder="YYYY"></s-select-value>
            </s-select-trigger>
            <s-select-content>
              <s-select-group>
                <s-select-item value="2024">2024</s-select-item>
                <s-select-item value="2025">2025</s-select-item>
                <s-select-item value="2026">2026</s-select-item>
                <s-select-item value="2027">2027</s-select-item>
                <s-select-item value="2028">2028</s-select-item>
                <s-select-item value="2029">2029</s-select-item>
              </s-select-group>
            </s-select-content>
          </s-select>
        </s-field>
        <s-field>
          <s-field-label for="cvv">CVV</s-field-label>
          <s-input light id="cvv" placeholder="123" required></s-input>
        </s-field>
      </div>
    </s-field-group>
  </s-field-set>
  <s-field-separator></s-field-separator>
  <s-field-set>
    <s-field-legend>Billing Address</s-field-legend>
    <s-field-description>The billing address associated with your payment method</s-field-description>
    <s-field-group>
      <s-field orientation="horizontal">
        <s-checkbox id="same-as-shipping" default-checked></s-checkbox>
        <s-field-label for="same-as-shipping" font-normal>Same as shipping address</s-field-label>
      </s-field>
    </s-field-group>
  </s-field-set>
  <s-field-set>
    <s-field-group>
      <s-field>
        <s-field-label for="comments">Comments</s-field-label>
        <s-textarea light id="comments" placeholder="Add any additional comments"></s-textarea>
      </s-field>
    </s-field-group>
  </s-field-set>
  <s-field orientation="horizontal">
    <s-button type="submit">Submit</s-button>
    <s-button variant="outline">Cancel</s-button>
  </s-field>
</s-field-group>
</div>
```

## Disabled

```html
<s-label disabled>Disabled</s-label>
```

The `disabled` attribute fades the label. The label also fades automatically when a parent element has `data-disabled="true"`.

?> **Note**: shadcn's `peer-disabled` pattern (auto-fading when a sibling input with class `peer` is disabled) is not directly supported because sibling selectors don't cross the shadow DOM boundary. Use the `disabled` prop instead.

## Theming

The label uses theme-dependent tokens. **Vega, Nova, Maia, Rhea, and Luma all share the base values** (`text-sm` 14px, `font-medium` 500, `leading-none`) — matching shadcn, where the label typography is theme-independent (`text-sm font-medium` in every theme). Only a few themes override it:

| Theme | font-size | font-weight | transform |
|---|---|---|---|
| Vega (default) | text-sm (14px) | medium (500) | none |
| Nova | text-sm (14px) | medium (500) | none |
| Maia | text-sm (14px) | medium (500) | none |
| Luma | text-sm (14px) | medium (500) | none |
| Rhea | text-sm (14px) | medium (500) | none |
| Lyra | text-xs (12px) | normal (400) | none |
| Mira | text-xs (12px) | medium (500) | none |
| Sera | text-xs (12px) | semibold (600) | uppercase |

> The `gap-2` (8px) used by the label is the same in every theme — it's a fixed token (`--label-gap`), like shadcn's `gap-2`.

Tokens: `--label-font-size`, `--label-font-weight`, `--label-line-height`, `--label-text-transform`, `--label-letter-spacing`, `--label-gap`.