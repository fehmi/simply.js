# Framer Integration with Simply.js

## Contents

- [Code Components](#code-components)
  - [First Code Component](#your-first-code-component)
  - [Supported Properties](#supported-property-types)
  - [Writing Simply.js Components](#writing-a-simplyjs-component)
  - [Using Props](#accessing-props)
  - [Prevent Flicker (FOUC)](#prevent-flicker-fouc)
  - [Mount Framer Components](#mount-framer-components-inside-simplyjs)
  - [Component Interactions](#framer-component-interactions)
  - [Collections](#collections)
    - [Multiple Queries in Collections](#multiple-queries-for-collection-references)
  - [Run Custom Code](#run-custom-code-in-framer)
  - [Scroll Event Listener](#listen-scroll-event)
  - [Multiple Instances on One Page](#multiple-simplyjs-instances-in-the-same-framer-page)
  - [Links](#links)
  - [Limitations](#limitations)
- [Plugins](#plugins)

You can use Simply.js to build Framer plugins and code components. This guide explains how to run Simply.js components inside Framer and develop plugins with it.

## Code Components

To make this work, I built a package called **Simply Loader**. It loads Simply.js components inside Framer code components within an encapsulated iframe environment and passes all props—including component instances and collections—from Framer to your Simply.js component.

### Your First Code Component

To get started, import `SimplyLoader` and return it in your code component. Here's an example:

```js
import { addPropertyControls, ControlType } from "framer";
import SimplyLoader from "https://framer.com/m/simplyLoader-YmpY.js";

export default function myComponent(props) {
  return <SimplyLoader {...props} />;
}

addPropertyControls(Testcomponent, {
  simply: {
    // Mandatory
    type: ControlType.String,
    displayTextArea: true,
    description: "Simply.js component URL.",
  },
  scripts: {
    // Optional
    type: ControlType.Array,
    control: {
      type: ControlType.String,
      displayTextArea: true,
    },
  },
});
```

- **`simply`** is required and should point to the URL of your Simply.js component.
- **`scripts`** is optional and allows you to inject additional scripts.

All Framer property types are supported and accessible inside your Simply.js component via the `props` variable.

### Supported Property Types

- `string`: `ControlType.String`
- `boolean`: `ControlType.Boolean`
- `number`: `ControlType.Number`
- `color`: `ControlType.Color`
- `array`: `ControlType.Array`
- `date`: `ControlType.Date`
- `file`: `ControlType.File`
- `image`: `ControlType.ResponsiveImage`
- `enum`: `ControlType.Enum`
- `object`: `ControlType.Object`
- `transition`: `ControlType.Transition`
- `link`: `ControlType.Link`
- `padding`: `ControlType.Padding`
- `borderRadius`: `ControlType.BorderRadius`
- `border`: `ControlType.Border`
- `shadow`: `ControlType.BoxShadow`
- `cursor`: `ControlType.Cursor`
- `font`: `ControlType.Font`
- `alignX`: `ControlType.Enum`
- `alignY`: `ControlType.Enum`
- `component`: `ControlType.ComponentInstance`
- `collection`: `ControlType.Array`

For details, refer to [Framer’s official property controls docs](https://www.framer.com/developers/property-controls).

### Writing a Simply.js Component

Example:

```html
<html>
  {props.message}
</html>
```

Save this on a public server and set its URL in the `simply` property in Framer.

?> If a CORS error occurs, Simply.js will attempt to fetch the file using a proxy. A random parameter is also added to the URL to prevent caching and always fetch the latest version.

We pass the value of the message property to our Simply.js component.

<img src="docs/images/framer-hello-world.jpg">

### Accessing Props

You can access all the properties defined in your Framer code component from within your Simply.js component. When any of these props change in Framer, the values in your Simply.js component are automatically updated.

Additionally, you can watch for prop changes by defining a special method called `propsUpdated()` inside your component. Here’s how:

```html
<html>
  <h1>Reach the props!</h1>
  <p>{props.message}</p>
</html>

<script>
  class simply {
    methods = {
      propsUpdated() {
        console.log("Props updated!", props);
      },
    };
  }
</script>
```

### Prevent Flicker (FOUC)

To avoid flicker during load, use a conditional based on prop availability or set a `data.ready` flag.

```html
<html>
  <if cond="data.ready">
    <h1>Reach the props!</h1>
    <p>{props.message}</p>
  </if>
</html>

<script>
  class simply {
    data = {
      ready: false,
    };
    methods = {
      propsUpdated() {
        console.log("Props updated!", props);
      },
    };
  }
</script>
```

OR

```html
<if cond="props.message">
  <p>{props.message}</p>
</if>
```

This prevents the user from seeing flickering of pre-compiled content including curly braces during the loading of the page.

### Mount Framer Components inside Simply.js

When you bind a component instance (such as a component, collection, or frame) to a prop in your Framer code component, you can mount that instance inside your Simply.js component.

To do this, use a special tag in your HTML: <framer-component path="props.component">. The path attribute should point to the prop where the component is assigned in Framer.

For example, let’s say you’ve connected a component to your code component like this:

```js
import { addPropertyControls, ControlType } from "framer";
import SimplyLoader from "https://framer.com/m/simplyLoader-YmpY.js";

export default function MountComponent(props) {
  return <SimplyLoader {...props} />;
}

addPropertyControls(MountComponent, {
  simply: {
    type: ControlType.String,
    displayTextArea: true,
    description: "Simply.js component URL",
  },
  component: {
    type: ControlType.ComponentInstance,
  },
});
```

<img src="docs/images/mount-component.jpg">

Then you can mount it in your Simply.js component with this code.

```html
<html>
  <h1>Mount Component</h1>
  <framer-component path="props.component"></framer-component>
</html>
```

When you do this, Simply Loader will locate the React component and mount it inside the <framer-component path="props.component"> tag. All styles, fonts, and even hover or overlay effects will be preserved. In preview mode, you’ll see your Framer component fully rendered within the Simply.js environment.

<img src="docs/images/mount-component-preview.gif">

?> 💡 The mounted component will not be affected by Simply.js’s reactive engine or re-renders.

You can also access additional data about the component through the `props` object. It will look like this:

```js
{
  "open": true,
  "component": ["html string of the component"],
  "height": "100%",
  "id": "Cs8UvUQCp",
  "simply": "https://fehmi.ozuseven.com/framer/components/mount-component.html",
  "style": {
    "height": "100%",
    "width": "100%"
  },
  "width": "100%",
  "isOnCanvas": false
}
```

After each mount, Framer runs a function called `framerComponentMounted()` defined in the `methods` of your Simply.js component. You can handle it like this.

```html
<html>
  <h1>Mount Component 2</h1>
  <framer-component path="props.component"></framer-component>
</html>

<style></style>

<script>
  class simply {
    methods = {
      framerComponentMounted(framerComponent) {
        console.log("framer component mounted", framerComponent);
      },
    };
  }
</script>
```

### Framer Component Interactions

Variants and their interactions, such as `hover` and `click`, will work out of the box. You may also want to detect the current variant state when a component is clicked. You can use `framerComponentClicked(framerComponent)` for that. Here is an example:

```html
<html>
  <h1>Interaction</h1>
  <framer-component path="props.component" id="myComp"></framer-component>
</html>

<script>
  class simply {
    methods = {
      framerComponentClicked(framerComponent) {
        var variant =
          framerComponent.getAttribute("data-framer-name") || "default";
        console.log(
          "this one clicked baby",
          framerComponent,
          "turned to ",
          variant
        );
      },
    };
  }
</script>
```

<img src="docs/images/framer-interactions.gif">

!> There is a minor limitation about variant transitions/animations. Its about the opacity property of Framer nodes. It seems they don't work. Try to use alpha value in colors to workaround it.

### Collections

You can also connect collections as component instances in Framer. These are special instances that include additional information, which you can access through `props` in your Simply.js component.

Mounting works exactly the same as described above. All entries in the collection will be returned and mounted automatically. It’s up to you to filter or display them as needed within your Simply.js component. You can use the `propsUpdated()` hook to handle that.

<img src="docs/images/mount-collection.jpg">

You’ll also receive some additional useful data when mounting a collection, which will be available in the `props` object as shown below:

```js
{
  decodedQueryData: [
    {
      "Categories": [],
      "Category": "AsAmBReo9",
      "Content": "<p>content</p>",
      "Count": 34,
      "Featured": false,
      "File": "https://framerusercontent.com/assets/doOdgR64Pal5raWCAxqcSFeVEs.jpg",
      "Gallery": [
        // Gallery images
      ],
      "Image": {
        "src": "https://framerusercontent.com/images/doOdgR64Pal5raWCAxqcSFeVEs.jpg",
        "srcSet": "https://framerusercontent.com/images/doOdgR64Pal5raWCAxqcSFeVEs.jpg 1600w",
        "pixelWidth": 1600,
        "pixelHeight": 1200
      },
      "Link": {
        "webPageId": "T5iu82oix"
      },
      "Next": {
        "Title": "Getting Started Copy",
        "Slug": "getting-started-copy",
        "Content": "<p>content</p>",
        "Link": {
          // example link
        },
        "Image": {
          // example image
        }
      },
      "Option": "Option 2",
      "Previous": null,
      "Slug": "getting-started-copy-copy",
      "Title": "Getting Started Copy Copy",
      "id": "eKWosqAED",
      "color": "rgb(191, 0, 255)"
    }
    // ...other items
  ],
  el: [...], // html strings of collection items
  from: {...}, // collection data for internal queries
  limit: {...}, // limit info, always get all
  queryData: [...], // encoded query data, similar to decodedQueryData
  select: [ // identifiers to select entries with from node
    {name: 'bvaSsPg31', type: 'Identifier'}
    {name: 'liNndhvu5', type: 'Identifier'}
    {name: 'oYZHvIA9G', type: 'Identifier'}
    ...
  ]
}
```

#### Multiple Queries for Collection References

You may notice that the `category` and `categories` fields in the decoded items are empty or contain encoded data. This is because those values come from reference collections.

To include them properly, instead of defining a single component instance, you should define an array of component instances. Then, add the reference collections immediately after the main collection instance in that array.

```js
collection: {
    type: ControlType.Array,
    description: "Add collection and its references.",
    control: {
        type: ControlType.ComponentInstance,
    },
},
```

<img src="docs/images/multiple-queries2.jpg">

After doing this, the encoded or empty values in `props` will be replaced with decoded real data pulled from the reference collections.

Since multiple collections are queried, the main data will now be available under an array called `multipleQueries` in `props`.

<img src="docs/images/multiple-queries.jpg">

Accessing your entire collection with fully decoded data is fantastic, isn’t it? With this data, you can build custom Simply.js components, apply any filters you want, and create custom layouts for rendering.

?> Accessing your entire collection with fully decoded data is fantastic, isn’t it? With this data, you can build custom Simply.js components, apply any filters you want, and create custom layouts for rendering. ⚡ This setup also supports localization — all data is automatically filtered and provided in the user’s or site’s current language preference within `props`.

### Run Custom Code In Framer

Another great feature is that you can send custom JavaScript code from Simply.js to run inside the parent Framer component via Simply Loader. This is easy to do using Simply.js’s built-in `component.runInFramer(codeToRun)` function. Here’s an example:

```html
<html>
  <h1>Run In Framer</h1>
  <if cond="data.result"> Result: {data.result} </if>
</html>

<script>
  class simply {
    methods = {
      runInFramerResult(result) {
        data.result = JSON.stringify(result);
        console.log("the result", result);
      },
    };
    lifecycle = {
      afterConstruct() {
        var codeToRun = function () {
          var data;
          if (!isOnCanvas) {
            const queryData = getCmsQueryData(props.collection[0]);
            data = useQueryData({
              ...queryData.query,
              select: queryData.query.select,
            });
          } else {
            data = "can't query on canvas";
          }

          // this is optionally where we return data
          useEffect(() => {
            component.methods.runInFramerResult(data);
          }, [data]);
        };

        setTimeout(() => {
          component.runInFramer(codeToRun);
        }, 1000);
      },
    };
  }
</script>
```

The line `component.methods.runInFramerResult(data);` inside the `useEffect` hook passes the collected data back into your current Simply.js `component`. Here, component refers to your Simply.js component instance, and calling its method allows you to send the data to any function you define inside its `methods`.

> The following variables and hooks are available inside the Framer component’s runtime scope:
>
> - `React`
> - `props`
> - `useQueryData`
> - `getCmsQueryData`
> - `useEffect`
> - `useMemo`
> - `useState`
> - `useRef`
> - `useCurrentLocation`
> - `useLocaleInfo`
> - `useRouter`
> - `renderToString`
> - `iframeRef`
> - `componentNameRef`
> - `processedProps`
> - `originalProps`
> - `setRenderThisTemporarily`
> - `renderThisTemporarily`
> - `isOnCanvas`
> - `component`

### Listen Scroll Event

If you'd like to listen to scroll events from Framer inside your Simply.js component, you can do so by defining a method called `framerOnScroll()` inside your component’s `methods` block.

Here’s how to set it up:

```js
class simply {
  methods = {
    framerOnScroll(data) {
      console.log(data);
    },
  };
}
```

The `data` object you receive will contain detailed scroll information. It looks like this:

```json
{
  "clientHeight": 477,
  "clientWidth": 936,
  "originalEvent": {
    "isTrusted": true,
    "type": "scroll",
    "target": "document",
    "currentTarget": null,
    "eventPhase": 0,
    "bubbles": false,
    "cancelable": false,
    "defaultPrevented": false,
    "composed": false
  },
  "scrollBottom": 230,
  "scrollHeight": 1000,
  "scrollLeft": 0,
  "scrollRight": -15,
  "scrollTop": 293,
  "scrollWidth": 921
}
```

You can use this data to trigger actions based on scroll position, such as detecting when the user is near the bottom of the page.

### Multiple Simply.js instances in a same Framer page

The great features don’t stop there. You can also create multiple Simply.js components on the same Framer page and enable them to communicate with each other.

<img src="docs/images/multiple-simply-instances.gif">

To send a message to other Simply.js instances, you can use the code below. It will broadcast the message to all Simply.js instances on the current page except itself.

```js
      sendMessage() {
        window.parent.postMessage({
          method: 'simply-message',
          name: dom.tagName.toLowerCase(),
          uid: component.uid,
          message: "hello world!"
        }, '*')
```

Then, in other instances, you can listen for messages like this:

```js
window.addEventListener("message", function (e) {
  if (e.data.method == "simply-message" && e.data.name == "masonry-layout") {
    // do anything you want with it
    data.message = e.data.message;
  }
});
```

### Links

All links in mounted components or collections will work seamlessly. Simply.js intercepts click events and forwards them to Framer’s internal router. You can also make any link in your Simply.js component trigger Framer navigation by adding the `route-framer` attribute, like this:

```html
<a href="./somepage" route-framer>Go!</a>
```

This will trigger routing in Framer and open the corresponding page.

### Limitations

Simply Loader relies on several hacks to function, which makes it fragile. If Framer changes anything these hacks depend on, it may break. I’ll try to update it when that happens, but please use it cautiously.

As a minor issue, opacity changes in transitions between variants don’t seem to work. Try using the color alpha value as a workaround.

---

## Plugins

You can easily develop Framer plugins using Simply.js. As a proof of concept, you can check out my latest plugin: [Image Alt Manager](https://www.framer.com/marketplace/plugins/image-alt-manager/preview/).

<img src="docs/images/framer-plugin.webp" alt="Image Alt Manager Preview" />

!> This section of the documentation will soon be updated with a boilerplate you can start from.
