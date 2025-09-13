## Router

First, you need to define a `base` tag in your HTML before anything else, like this:


```html
<base href="/simply/examples/page/">
```

Then, add the `<route>` placeholder in the `<body>` or inside a component.

```html
<body>
	<route></route>
</body>
```

After that, you are ready to define your routes.

```js
simply.router([
	{
		path: "/", // The path of the route
		component: "home-page", // The component's tag name
		shadow_root: true, // Default: false
		cache: true, // Default: false
		same_page_refresh: true, // Default: false
		title: "Home Page" // Sets the document title after routing
	}
])
```

Then init via `simply.page();` and the router will land you to the corresponding route.

## Route via Code

Use `simply.page("/about")` for that.

## Redirection

You can define a redirection using `simply.page("/subpage", "/subpage2");` or the more explicit `simply.page.redirect("/subpage", "/subpage2");`.

Redirect definitions must be placed before your route definitions.

## Cache

Besides the router, you can cache any other component in your Simply app by adding the `cache` attribute to the component tag, like this:

```html
`<my-component cache></cache>`
```

You can check if a component has cached data from within the component itself, like this:

```js
class simply {
	lifecycle = {
		afterFirstRender() {
			if (cache.data.name) {
				console.log(cache.data.name)
			}
		}
	}
}
```

## Nested Routes

You can define child routes inside a `children` array. Nesting can be as deep as you want. Simply.js will look for a `<route></route>` tag inside the parent component to render the nested component. All properties available for top-level routes can also be applied to children.

```js
simply.router([
	{
		path: "/component",
		component: "company-page",
		children: [
			{
				path: "/about",
				component: "about-page"
			},
			{
				path: "/contact",
				component: "contact-page",
				children: [
					{
						path: "/istanbul",
						component: "contact-istanbul",
					},
					{
						path: "/amsterdam",
						component: "contact-amsterdam",
					},
				]
			},
		]
	},
	...
]
```

## Detect Popstate

You can detect if a route change was triggered by the browser's back/forward buttons by checking `window.state.popstate` anywhere in your component.

## Same Page Refresh

By default, when you click a link for the page you are already on, Simply will reload the corresponding route. You can disable this behavior for specific routes by setting `same_page_refresh` to `false` in the route definition:

```js
simply.router([
	{
		path: "/",
		component: "home-page",
		root: document.querySelector("route"),
		same_page_refresh: false,
		callbacks: [
			...
		]
	},
```

## Carry Params

You may want to preserve URL parameters across all routes. You can enable this as follows:

`simply.preserveParams = ["mode"];`

For example, if you land on a page with parameters like `?mode=canvas&ts=1749752255326` and you want to carry them to another page, like `/other-page`, this feature is for you. When the user navigates to `/other-page`, the URL will become `/other-page?mode=canvas&ts=1749752255326`. This can be useful when developing a Framer plugin, where the `mode` parameter is essential.

## Router Enter

If a component is defined in your router definitions, you can run code when that route is entered, like this:

```js
class simply {
	lifecycle = {
		routerEnter(ctx) {
			console.log("hello", ctx);
		}
	}
}
```

`ctx` is the router's context object, and it contains all data related to the current route.

## Reading URL Parameters

You can access URL parameters at any time from anywhere in your code via `simply.ctx.params.id`.

## Current Route

Simply automatically adds a `router-active` attribute to any `<a>` tags that match the current route, including nested routes. This allows you to style active links without any extra JavaScript.

For example, you can style the active link like this:

```css
a[router-active] {
	opacity: .5;
  pointer-events: none; /* Optional: disable clicks on the active link */
}
```
