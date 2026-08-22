# Simply.js Chrome Extension Example

A minimal Chrome extension (Manifest V3) whose popup is a simply.js app with hashbang routing — the same `<base>` + `hashbang: true` pattern used by the Electron example, working on the `chrome-extension://` protocol.

## Load it

1. Open `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select this folder (`examples/11-chrome/`)

The popup should open with Home / About / Contact links that navigate via `sandbox.html#!/…`.

## Why a sandboxed page?

MV3 extension pages **cannot** use `'unsafe-eval'` — Chrome rejects the manifest at load time if you put it in `content_security_policy.extension_pages`. But simply.js evaluates component scripts and renders templates/styles with `eval()` / `new Function()`.

The fix is to run the app in a **sandboxed page** (`sandbox.html`), which gets a separate, lenient CSP that allows `'unsafe-eval'`. The popup (`popup.html`) is a normal extension page that just hosts the sandbox in an iframe.

```json
"sandbox": {
  "pages": ["sandbox.html"]
},
"content_security_policy": {
  "sandbox": "sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval'; child-src 'self'"
}
```

## Why simply.min.js is bundled

Chrome extensions are packaged — pages can only load resources inside the extension folder. `simply.min.js` is copied from the repo root. For a published extension, keep bundling it (Chrome Web Store forbids remote code); a CDN `<script>` only works for local development if you also add the host to the sandbox CSP.

## Files

- `manifest.json` — MV3 manifest (popup + sandboxed page)
- `popup.html` — normal extension page; hosts the sandbox in an iframe
- `popup.js` — bridge: receives postMessage from the sandbox and calls `chrome.storage`
- `sandbox.html` — sandboxed page: `<base href="sandbox.html">`, external scripts, `<route>`
- `sandbox.js` — loads components + `simply.go.setup({ hashbang: true }, …)`
- `bridge.js` — sandbox-side `storageGet`/`storageSet` helpers (postMessage to popup.html)
- `chrome-*.html` — routed components (incl. `chrome-counter.html`, a persistent counter using chrome.storage via the bridge)
- `simply.js` — bundled copy of the library (must include the `ctx`/`routerSettings` excludeList fix AND the `chrome-extension:` click-handler protocol exemption)

## Note

Sandboxed pages can't access `chrome.*` APIs. If you need them, talk to `popup.html` via `postMessage` and let the popup call the APIs.