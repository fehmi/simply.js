# Go

**Go** is the full-featured SPA router of Simply JS, forked from **Page.js**. It’s tightly integrated with the template syntax and reactivity system.

In addition to the default Page.js features, it supports **nested routes**, **dynamic route creation**, **enter/exit transitions**, auto **web component integration**. 

Before anything else, you need to define a `<base>` tag in your HTML, like this:



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
simply.go.setup(
	{
		transition: true,
		stagger: 75,
		preserveParams: ["mode"],
		redirects: [
			{
				from: "/",
				to: "/subpage/10"
			}
		]		
	},
	[
		{
			path: "/", // The path of the route
			component: "home-page", // The component's tag name
			isolated: true, // Default: false — use shadow DOM
			cache: true, // Default: false — keep data/props in memory, restore on revisit
			same_page_refresh: true, // Default: false — re-render on same-route navigation
			title: "Home Page" // Sets the document title after routing
		}
	])
```

`simply.go.setup()` calls `simply.go()` for you — no extra init needed.

<details>
	<summary><ins>Live Demo</ins></summary>
	<repl-component id="df7q0uvz13h9hgs" addressbar="true"/>
</details>

## Route via Code

Use `simply.go("/about")` for that.

## Redirection

You can define a redirection when setup lie below.

```js
simply.go.setup(
	{
		redirects: [
			{
				from: "/",
				to: "/subpage/10"
			}
		]		
	},
	[
		...routes
	])
```

## Replacing Current Route

It's as easy as `simply.go.replace("new-path")`.

## Cache

Cache keeps a routed component's `data`/`props` in memory and restores them on revisit — no re-fetch.

### Via router

Recommended. Enable per route.

```js
simply.go.setup({}, [
  { path: "/photos", component: "cache-photos", cache: true, title: "Photos" }
])
```

This renders the component as `<cache-photos cache>` — the `cache` attribute is added automatically. You don't need to write it in your HTML.

### Via component tag

Anywhere, not only routes.

```html
<my-component cache></my-component>
```

### Check for restored data

Framework restores `data`/`props` synchronously before `afterConstruct`. Check the generic `component.cache.data` (works for any cached field) in `afterConstruct` — if it exists, you were restored from cache and can skip fetching:

```js
class simply {
  data = { photos: [], fetchedAt: "" }
  methods = {
    fetchPhotos() {
      // fetch remote data, assign to data.photos / data.fetchedAt
    }
  }
  lifecycle = {
    afterConstruct() {
      if (component.cache.data) {
        // cache hit — data.photos already restored, no fetch needed
        return;
      }
      methods.fetchPhotos();
    }
  }
}
```

> **Note:** Cache is keyed by route path + element identity (`simply.cache[path][elementId]`). Framework uses `simply.ctx.path` (current route) as primary key — the stale `simply.lastPath` (previous route) is not used for restores at construction time.

See `examples/08-go/cache/` for a live demo: initial visit fetches, second visit restores without network.

## Nested Routes

You can define child routes inside a `children` array. Nesting can be as deep as you want. Simply.js will look for a `<route></route>` tag inside the parent component to render the nested component. All properties available for top-level routes can also be applied to children.

```js
simply.go.setup([
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

You can detect if a route change was triggered by the browser's back/forward buttons by checking `ctx.state.popstate` (e.g. inside `lifecycle.routerEnter(ctx)` or via `simply.ctx.state.popstate`).

## Same Page Refresh

By default, when you click a link for the page you are already on, Simply will ignore it. Enable re-render on same-route navigation per route via `same_page_refresh`:

```js
simply.go.setup(
	{
		// global settings
	},
	[
		{
			path: "/",
			component: "home-page",
			root: document.querySelector("route"),
			same_page_refresh: true,
			title: "Home"
		}
	]
)
```

## Carry Params Between Routes

You may want to preserve URL parameters across all routes. You can enable this in settings when setop:

```js 
simply.go.setup(
	{
		preserveParams: ["mode", "utm"]		
	},
	[
		...routes
	])
```

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

!> **`ctx.query` is populated asynchronously.** The router fills `ctx.query` (via `simply.qs.parse`) in a `setTimeout`, so it may not be ready yet inside `routerEnter(ctx)`. If you need the query there, parse it directly from the URL instead:

```js
class simply {
	lifecycle = {
		routerEnter(ctx) {
			state.query = simply.qs.parse(location.search.slice(1));
		}
	}
}
```

## Reading URL Parameters

You can access URL parameters at any time from anywhere in your code via `simply.ctx.params.id`.

## Context

After the first navigation, framework exposes two globals:

| Global | What it holds | Example |
|---|---|---|
| `simply.ctx` | Current route's **Context** object — same `ctx` you receive in `routerEnter(ctx)` | `simply.ctx.path`, `simply.ctx.params`, … |
| `simply.lastPath` | Previous route's **path string** (set at end of each navigation) | `"/photos"` → `"/about"` |

Use `simply.ctx` for everything about the current route; use `simply.lastPath` only when you need the *previous* path (e.g. save scroll position).

**`simply.ctx` fields (from `Context` constructor + router):**

| Field | Type | Source | Description |
|---|---|---|---|
| `path` | `string` | `ctx.path` | Current path without base, e.g. `"/photos/2?foo=bar#sec"` → `"/photos/2"` (hash stripped, base stripped) |
| `canonicalPath` | `string` | `ctx.canonicalPath` | Full path including base, e.g. `"/simply/examples/08-go/album/photos/2"` |
| `pathname` | `string` | `ctx.pathname` | Decoded pathname without query/hash |
| `params` | `object` | `ctx.params` | Route params, e.g. `{ page: "2" }` for `"/photos/:page"` |
| `query` | `object` | `ctx.query` | Parsed query via `simply.qs.parse(location.search)` — set to `{}` if no query |
| `querystring` | `string` | `ctx.querystring` | Raw querystring without `?`, e.g. `"foo=bar"` |
| `hash` | `string` | `ctx.hash` | Fragment without `#`, e.g. `"sec"` for `#sec` |
| `state` | `object` | `ctx.state` | History state — includes `state.path` (original `canonicalPath`) and `state.popstate` on back/forward |
| `title` | `string` | `ctx.title` | `document.title` at navigation time |
| `routePath` | `string` | `ctx.routePath` | Matched route pattern, e.g. `"/photos/:page"` |
| `handled` | `boolean` | `ctx.handled` | Whether route was handled |
| `params` | `object` | `simply.ctx.params` / `ctx.params` | Shorthand — same as above, accessible anywhere via `simply.ctx` |

```js
// Anywhere (component, console, utility)
console.log(simply.ctx.path);        // "/photos/2"
console.log(simply.ctx.params.page); // "2"
console.log(simply.ctx.query);       // { foo: "bar" }
console.log(simply.ctx.hash);        // "sec"
console.log(simply.ctx.state.popstate); // true on back/forward
console.log(simply.lastPath);        // "/photos" (previous route)
```

```js
// Inside a routed component
class simply {
  lifecycle = {
    routerEnter(ctx) {
      // same object as simply.ctx
      console.log(ctx.params, ctx.query, ctx.hash, ctx.state);
    }
  }
}
```

## Hash

The router parses the URL fragment into `ctx.hash` (without `#`) and does **not** scroll automatically — you decide where to scroll and how.

Hash-only links (`/#a`, `#b`) on the **same path** are ignored by the router and fall back to native browser scrolling. Because the library renders components asynchronously, you may need to handle scrolling in the `routerEnter(ctx)` hook. 

| Anchor location | Lookup |
|---|---|
| Shell (`<route>` outside, in index.html) | `document.getElementById(hash)` |
| Component's own template | `dom.querySelector('#' + hash)` |
| Nested child component | chain through `component.querySelector(...)` yourself |

A robust pattern that covers both shell and component anchors:

```js
class simply {
  lifecycle = {
    routerEnter(ctx) {
      if (!ctx.hash) return;
      var el = dom.querySelector('#' + ctx.hash)        // inside this component
            || document.getElementById(ctx.hash);       // or in the shell
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  }
}
```

> **Note:** Use `behavior: 'instant'` if the target may re-render right after (smooth scroll can be interrupted). If your anchor is inside an `isolated` child, query its shadow root via `component.querySelector('child').shadowRoot.querySelector('#hash')`.

Live demo: `examples/08-go/hash/` — shell anchors (`#a`/`#b`) use native scroll; `section?name=tana#subsection` navigates and scrolls via `routerEnter`.

## Hashbang

Hashbang mode puts all routes after `#!` in the URL (`/page/#!/about`) instead of using the History API path (`/page/about`). Everything after `#!` is client-side only — **no server rewrites needed**. Useful for static hosting, `file://` usage, or legacy environments.

### Enabling via setup

Set `hashbang: true` in the settings object:

```js
simply.go.setup(
	{
		hashbang: true
	},
	[
		{ path: "/", component: "hashbang-index", title: "Hashbang" },
		{ path: "/about", component: "hashbang-about", title: "About" },
		{ path: "/contact/:contactName", component: "hashbang-contact", title: "Contact" },
		{ path: "*", component: "hashbang-notfound", title: "Not Found" }
	]
)
```

URLs become:

- `/about` → `/#!/about`
- `/contact/me` → `#!/contact/me`
- Query strings ride along: `/not-found?foo=bar` → `#!/not-found?foo=bar`

### Notes

- **`ctx.hash` is not parsed in hashbang mode:** the fragment *is* the route, so there is no separate anchor hash. The Context constructor only splits `#` when hashbang is off.
- **Deep links work:** on load, `start()` reads `loc.hash` (`#!/contact/me`) and dispatches `/contact/me`.
- **Root stays clean:** for `path === "/"`, pushState writes the plain canonical path without `#!`.

Live demo: `examples/08-go/hashbang/`

## Current Route

Simply automatically adds a `go-active` attribute to any `<a>` tags that match the current route, including nested routes. This allows you to style active links without any extra JavaScript.

For example, you can style the active link like this:

```css
a[go-active] {
	opacity: .5;
  pointer-events: none; /* Optional: disable clicks on the active link */
}
```

## Transitions

```js
simply.go.setup( 
  {
    transition: true,
  },
  [...routes]
)
```

When you set `transition` to `true` in the Go settings, Simply automatically adds an empty `enter` attribute to the root node of the component defined in the routes when the route enters, and removes it when the route exits. This lets you freely define enter and exit transitions in your component's CSS. Live example: `examples/08-go/nested/`.

```css
company-page > line {
	width: 0;
	
	/* EXIT duration — shrink before the next route mounts */
	transition: width 400ms ease-in-out;
}

company-page[enter] > line {
	width: 100%;

	/* ENTER duration — grow while the page appears */
	transition: width 800ms cubic-bezier(.22, 1, .36, 1);
}
```

With this setup the line grows from 0 → 100% (**800ms**) when entering, and shrinks back 100 → 0 (**400ms**) when exiting. Once the transition finishes, Simply switches to the next route.

### How Simply times a transition

After transition `[enter]`, simply collects the component plus all of its light-DOM descendants (`<route>` and `<style>` elements are skipped) and reads each element's computed `transition-duration` **and** `transition-delay`. It listens for `transitionend` on every element whose total is greater than zero, and only then mounts the next route. On **exit** there is also a fallback timer of `maxDuration + stagger delay`, so navigation never deadlocks if an event is missed.

Two consequences:

1. Every animated element must actually change a property between the `[enter]` and non-`[enter]` states — otherwise its `transitionend` never fires and Simply has to fall back to the timeout.
2. The measured totals include delays, so a "small" element with a long delay can silently become the longest transition in the chain.

### Adding fx animations to content elements

You can fade/rise the content pieces together with the line by giving them a class and animating it:

```html
<h2 class="fx d1">{{data.title}}</h2>
<p class="tagline fx d2">{{data.tagline}}</p>
<nav class="links fx d3">...</nav>
```

```css
/* 
 * IMPORTANT: We must prevent transitions defined within a component 
 * from leaking to parent or child components. If the component is 
 * not isolated, we can achieve this by strictly using the child 
 * combinator (>) to select the relevant elements. 
 */
company-page > .fx {
	opacity: 0;
	transform: translateY(8px);

	/* EXIT: no delay */
	transition: opacity .25s ease, transform .25s ease;
}
company-page[enter] > .fx {
	opacity: 1;
	transform: none;

	/* ENTER: longer + delayed cascade is fine */
	transition: opacity .45s ease, transform .45s cubic-bezier(.22, 1, .36, 1);
}
/* delays only in the [enter] state — exits stay snappy. */
company-page[enter] > .fx.d1 { transition-delay: .12s; }
company-page[enter] > .fx.d2 { transition-delay: .22s; }
company-page[enter] > .fx.d3 { transition-delay: .32s; }
```

!> Total duration of an exit fx inside a component must be less than its parent’s or container’s total duration to prevent animation cuts.


### Empty nested outlets

Nested hubs render a `<route></route>` outlet. To avoid an empty bordered box when no child route is active, hide empty outlets globally — one rule is enough since components are light DOM:

```css
route:empty { display: none; }
```

### Stagger

You can also add a **stagger effect** for nested routes by setting a millisecond value in the settings, like this:

```js
simply.go.setup(
	{
		transition: true,
		stagger: 75,
	},
	[
		...routes
	]
)
```

This adds a small delay (in milliseconds) between transitions of nested routes, creating a smoother, cascading animation effect.
