// run: npx electron  requestSingleInstanceLock.js
const { app } = require("electron/main");
const gotTheLock = app.requestSingleInstanceLock();

console.log("[debug gotTheLock]", gotTheLock);
if (!gotTheLock) {
  setTimeout(() => {
    app.quit();
  }, 1000);
}
