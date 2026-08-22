// Sandbox-side helpers: talk to popup.html via postMessage, which calls
// chrome.storage on our behalf (sandboxed pages can't access chrome.* APIs).
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