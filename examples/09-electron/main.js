const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      contextIsolation: true,
      // Allow fetch() of local component .html files on file:// —
      // needed because simply.js loads components with fetch().
      // For production, prefer a custom protocol (protocol.handle) instead.
      webSecurity: false
    }
  });

  win.loadFile(path.join(__dirname, "app", "index.html"));
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
