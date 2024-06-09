// window
const { app, session, BrowserWindow } = require("electron");
const path = require("path");

app.whenReady().then(async () => {
  const window = new BrowserWindow();
  // console.log(app.getPath("userData")); // /Users/qianzhiqiang/Library/Application Support/my-electron
  await session.defaultSession.loadExtension(
    path.join(__dirname, "/minimal-chrome-extension"),
    // allowFileAccess is required to load the devtools extension on file:// URLs.
    { allowFileAccess: true }
  );
  window.loadFile("./minimal-chrome-extension/demo.html");
});
