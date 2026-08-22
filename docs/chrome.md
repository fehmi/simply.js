## Chrome Extension Integration

Simply works inside a Chrome extension (Manifest V3). The key is the same **hashbang routing** (`hashbang: true`) used by the [Electron integration](docs/electron.md): routes live after `#!` in the URL, so everything works on the `chrome-extension://` protocol — no server, no rewrites.

One extra step is required: MV3 extension pages **cannot** use `'unsafe-eval'`, but simply.js needs `eval`/`new Function` to render templates. The solution is to run the app inside a **sandboxed page** — sandboxed pages get a separate, lenient CSP that allows `'unsafe-eval'`.

A complete runnable example lives in `examples/11-chrome/`. Load it unpacked from `chrome://extensions` (enable **Developer mode** → **Load unpacked** → select the folder).

### manifest.json

The popup is declared via `action.default_popup`. The simply.js app lives in `sandbox.html`, which is listed under `sandbox.pages`. The `content_security_policy.sandbox` value is the default sandbox CSP — it allows `'unsafe-eval'`:

```json
{
  "manifest_version": 3,
  "name": "Simply.js Popup",
  "version": "1.0.0",
  "action": {
    "default_popup": "popup.html",
    "default_title": "Simply.js"
  },
  "sandbox": {
    "pages": ["sandbox.html"]
  },
  "content_security_policy": {
    "sandbox": "sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval'; child-src 'self'"
  }
}
```

!> **Do not put `'unsafe-eval'` in `extension_pages`.** Chrome rejects the manifest at load time (`Insecure CSP value "'unsafe-eval'"`). The sandbox CSP is the only place `'unsafe-eval'` is allowed.

### popup.html

The popup itself is a normal extension page (no `eval` needed) — it just hosts the sandboxed app in an iframe:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    iframe { width: 640px; height: 500px; border: none; }
  </style>
</head>
<body>
  <iframe src="sandbox.html"></iframe>
</body>
</html>
```

### sandbox.html

The simply.js app runs here. Point the `<base>` tag at `sandbox.html` — simply.js reads this tag and sets the router base from it, so every route resolves against `sandbox.html` on the `chrome-extension://` protocol. With this base, links must start with `/`.

MV3 blocks **inline scripts** on extension pages, so the setup lives in an external file (`sandbox.js`):

```html
<head>
  <base href="sandbox.html">
</head>
<body>
  <div class="shell">
    <h1>Simply in Chrome</h1>
    <div class="links">
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/contact/kim">Contact Kim</a>
    </div>
    <route></route>
  </div>

  <script src="simply.js"></script>
  <script src="sandbox.js"></script>
</body>
```

### Router setup

Load your components, then enable hashbang in `setup()` settings — exactly like the [Electron example](docs/electron.md#router-setup):

```js
get("chrome-home.html");
get("chrome-about.html");
get("chrome-contact.html");
get("chrome-notfound.html");

simply.go.setup(
  {
    hashbang: true
  },
  [
    { path: "/", component: "chrome-home", title: "Home" },
    { path: "/about", component: "chrome-about", title: "About" },
    { path: "/contact/:contactName", component: "chrome-contact", title: "Contact" },
    { path: "*", component: "chrome-notfound", title: "Not Found" }
  ]
);
```

### Links

Links start with `/` — the router turns them into `chrome-extension://…/sandbox.html#!/…` URLs automatically:

```html
<a href="/">Home</a>
<a href="/about">About</a>
<a href="/contact/kim">Contact Kim</a>
```

Resulting URLs look like:

```
chrome-extension://<id>/sandbox.html#!/about
chrome-extension://<id>/sandbox.html#!/contact/kim
```

### Using chrome.* APIs from the sandbox

Sandboxed pages have a unique origin and **no access to `chrome.*` APIs**. To use them, talk to `popup.html` via `postMessage` and let the popup call the APIs.

`popup.html` (a normal extension page) listens for messages from the sandbox iframe and calls `chrome.storage` on its behalf. MV3 blocks inline scripts on extension pages, so the bridge lives in an external file (`popup.js`):

```js
// popup.js
const iframe = document.querySelector("iframe");

window.addEventListener("message", (event) => {
  if (event.source !== iframe.contentWindow) return;
  const { type, key, value, id } = event.data || {};

  if (type === "storage:get") {
    chrome.storage.local.get(key, (result) => {
      iframe.contentWindow.postMessage({ type: "storage:get:result", id, value: result[key] }, "*");
    });
  } else if (type === "storage:set") {
    chrome.storage.local.set({ [key]: value }, () => {
      iframe.contentWindow.postMessage({ type: "storage:set:done", id }, "*");
    });
  }
});
```

```html
<!-- popup.html -->
<iframe src="sandbox.html"></iframe>
<script src="popup.js"></script>
```

On the sandbox side, small helpers (`bridge.js`) wrap the `postMessage` round-trip in promises:

```js
function storageGet(key) {
  return new Promise((resolve) => {
    const id = Math.random().toString(36).slice(2);
    const onMessage = (event) => {
      if (event.data && event.data.type === "storage:get:result" && event.data.id === id) {
        window.removeEventListener("message", onMessage);
        resolve(event.data.value);
      }
    };
    window.addEventListener("message", onMessage);
    window.parent.postMessage({ type: "storage:get", key, id }, "*");
  });
}

function storageSet(key, value) {
  return new Promise((resolve) => {
    const id = Math.random().toString(36).slice(2);
    const onMessage = (event) => {
      if (event.data && event.data.type === "storage:set:done" && event.data.id === id) {
        window.removeEventListener("message", onMessage);
        resolve();
      }
    };
    window.addEventListener("message", onMessage);
    window.parent.postMessage({ type: "storage:set", key, value, id }, "*");
  });
}
```

### Restoring the last route

A popup is destroyed when it closes, so the next open starts at `/`. To reopen on the last route, save `simply.ctx.path` on navigation and restore it before starting the router:

```js
// sandbox.js
storageGet("route").then((savedRoute) => {
  simply.go.setup({ hashbang: true }, [ /* routes */ ]);
  if (savedRoute && savedRoute !== "/") simply.go(savedRoute);
});

// Save the route whenever it changes (a component is rendered into <route>).
let lastSavedRoute = null;
new MutationObserver(() => {
  const path = simply.ctx && simply.ctx.path;
  if (path && path !== lastSavedRoute) {
    lastSavedRoute = path;
    storageSet("route", path);
  }
}).observe(document.querySelector("route"), { childList: true, subtree: true });
```

### Persisting state across popup opens

A popup is destroyed when it closes, so component `data`/state is lost. To keep it, save to `chrome.storage` (via the bridge) and restore on open.

Component `data`/`state`/`props` are **ObservableSlim proxies** — serializing them directly would recurse forever. Unwrap them with `__getTarget` to get the plain object:

```js
const plain = JSON.parse(JSON.stringify(data.__getTarget));
```

The example's `chrome-counter` shows the minimal boilerplate: it saves its count on every change and restores it in `afterConstruct`. You decide what to save and when — there's no automatic session system:

```js
class simply {
  data = { count: 0 }
  methods = {
    increment() {
      data.count++;
      storageSet("count", data.count);   // save what you want, when you want
    }
  }
  lifecycle = {
    afterConstruct() {
      storageGet("count").then((value) => {
        if (typeof value === "number") data.count = value;   // restore manually
      });
    }
  }
}
```

For more complex state, serialize the whole `data`/`state`/`props` with `__getTarget` and restore by assigning through the proxies:

```js
// save
storageSet("my-component", {
  data: JSON.parse(JSON.stringify(data.__getTarget)),
  state: JSON.parse(JSON.stringify(state.__getTarget))
});

// restore (in afterConstruct)
storageGet("my-component").then((saved) => {
  if (!saved) return;
  Object.assign(data, saved.data);
  Object.assign(state, saved.state);
});
```

?> There's no built-in session persistence — save/restore is left to you so you control exactly what survives a popup close/reopen.

Try it: open the popup, go to **Counter**, click `+1` a few times, close the popup, reopen it — the count is restored.

Live demo: `examples/11-chrome/`

That completes the setup!