get("chrome-home.html");
get("chrome-about.html");
get("chrome-contact.html");
get("chrome-counter.html");
get("chrome-notfound.html");

// Restore the last route, then start the router.
storageGet("route").then((savedRoute) => {
  simply.go.setup(
    {
      hashbang: true
    },
    [
      { path: "/", component: "chrome-home", title: "Home" },
      { path: "/about", component: "chrome-about", title: "About" },
      { path: "/contact/:contactName", component: "chrome-contact", title: "Contact" },
      { path: "/counter", component: "chrome-counter", title: "Counter" },
      { path: "*", component: "chrome-notfound", title: "Not Found" }
    ]
  );

  if (savedRoute && savedRoute !== "/") {
    simply.go(savedRoute);
  }
});

// Save the current route whenever it changes (a component is rendered into <route>).
let lastSavedRoute = null;
const routeEl = document.querySelector("route");
new MutationObserver(() => {
  const path = simply.ctx && simply.ctx.path;
  if (path && path !== lastSavedRoute) {
    lastSavedRoute = path;
    storageSet("route", path);
  }
}).observe(routeEl, { childList: true, subtree: true });