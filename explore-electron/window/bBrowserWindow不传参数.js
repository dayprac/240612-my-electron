const { app, BrowserWindow } = require("electron");
app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({});
  mainWindow.loadURL(
    "data:text/html;charset=UTF-8," + encodeURIComponent(`<h1>tmp</h1>`)
  ); // 注意到白屏片刻
});
