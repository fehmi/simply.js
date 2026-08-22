// Bridge: sandbox (no chrome.*) <-> popup (has chrome.* APIs)
// popup.html is a normal extension page, so it can call chrome.storage.
// The sandboxed iframe cannot access chrome.* APIs, so it posts messages
// here and this page calls chrome.storage on its behalf.
const iframe = document.querySelector("iframe");

// chrome.storage is only available after the extension is reloaded with the
// "storage" permission in the manifest. Guard so a stale manifest doesn't throw.
const storage = chrome.storage && chrome.storage.local;

window.addEventListener("message", (event) => {
  if (event.source !== iframe.contentWindow) return;
  const { type, key, value, id } = event.data || {};

  if (type === "storage:get") {
    if (!storage) return;
    storage.get(key, (result) => {
      iframe.contentWindow.postMessage({ type: "storage:get:result", id, value: result[key] }, "*");
    });
  } else if (type === "storage:set") {
    if (!storage) return;
    storage.set({ [key]: value }, () => {
      iframe.contentWindow.postMessage({ type: "storage:set:done", id }, "*");
    });
  }
});