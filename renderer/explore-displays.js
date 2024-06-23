console.log("[test.js]");
const { app, ipcRenderer, BrowserWindow, screen } = require("electron");
// let displays = screen.getAllDisplays();
// console.log("[debug displays]", displays);

(async () => {
  const screens = await ipcRenderer.invoke("get-all-displays");
  console.log(screens);
})();
