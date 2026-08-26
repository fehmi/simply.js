# Button Group

Groups buttons together, joining them with shared borders and rounded outer corners. Nested groups get a gap (`gap-2`, constant across themes) between them.

## Usage

<s-component-viewer subject="s-button-group" title="false" description="false"></s-component-viewer>
```html
<s-button-group>
  <s-button variant="outline">Archive</s-button>
  <s-button variant="outline">Report</s-button>
</s-button-group>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `orientation` | string | `"horizontal"` | `horizontal` \| `vertical` |

## Nested

Group nested button-groups to add a gap between them (e.g. a toolbar):

<s-component-viewer subject="s-button-group" title="false" description="false"></s-component-viewer>
```html
<s-button-group>
  <s-button-group>
    <s-button variant="outline" size="icon" aria-label="Go Back">
      <s-icon name="arrow-left"></s-icon>
    </s-button>
  </s-button-group>
  <s-button-group>
    <s-button variant="outline">Archive</s-button>
    <s-button variant="outline">Report</s-button>
  </s-button-group>
</s-button-group>
```
