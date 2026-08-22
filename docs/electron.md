## Electron Integration

Simply works inside Electron out of the box. The key is **hashbang routing** (`hashbang: true`): routes live after `#!` in the URL, so everything works on the `file://` protocol — no server, no rewrites.

A complete runnable example lives in `examples/electron/` (main process + app folder). Run it with:

```bash
cd examples/electron
npm install
npm start
```

### index.html

Point the `<base>` tag at `index.html`. simply.js reads this tag and sets the router base from it, so every route resolves against `index.html` on any protocol. With this base, links must start with `/`.

```html
<head>
  <base href="index.html">
</head>
```

### Router setup

Load your components, then enable hashbang in `setup()` settings:

```js
get("home.html");
get("about.html");
get("contact.html");
get("not-found.html");

simply.go.setup(
  {
    hashbang: true
  },
  [
    { path: "/", component: "home", title: "Home" },
    { path: "/about", component: "about", title: "About" },
    { path: "/contact/:contactName", component: "contact", title: "Contact" },
    { path: "*", component: "not-found", title: "Not Found" }
  ]
);
```

### Links

Links start with `/` — the router turns them into `index.html#!/…` URLs automatically:

```html
<a href="/">Home</a>
<a href="/about">About</a>
<a href="/contact/kim">Contact Kim</a>
```

Resulting URLs look like:

```
file:///…/app/index.html#!/about
file:///…/app/index.html#!/contact/kim
```

?> Deep links work too: opening `index.html#!/contact/kim` directly renders the contact route with `ctx.params.contactName = "kim"`.

### Notes

- **Keep `<base>` pointing at a file (`index.html`), not a directory:** with hashbang routing the router prepends the base to route paths; a directory base would produce broken URLs.
- **No server needed:** `hashbang: true` makes all navigation happen in the fragment, which is why this setup is ideal for Electron's `file://` loading via `win.loadFile()`.
- **Component fetching:** simply.js loads `.html` components with `fetch()`. On `file://`, either launch Electron with `webSecurity: false` for local development or serve components through a custom protocol for production.

Live demo: `examples/09-electron/`

That completes the setup!
