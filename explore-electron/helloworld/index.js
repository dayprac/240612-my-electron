const { app, BrowserWindow } = require("electron");

app.whenReady().then(async () => {
  const window = new BrowserWindow({
    width: 500,
    height: 300,
  });
  window.loadURL("https://example.com");
});
