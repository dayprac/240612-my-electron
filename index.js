// window
const { app, BrowserWindow } = require("electron");
app.whenReady().then(() => {
  const window = new BrowserWindow();
  window.loadURL("https://fs1.app/videos/ssis-313/");
});
