// window
const { app, session, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

app.whenReady().then(async () => {
  const window = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "window-preload.js"), // Appropriate path to the file in your own project
    },
  });
  // console.log(app.getPath("userData")); // /Users/qianzhiqiang/Library/Application Support/my-electron
  let extensionPath = path.join(__dirname, "/minimal-chrome-extension");
  if (process.env.NODE_ENV === "production") {
    extensionPath = __dirname.split("app.asar")[0] + "minimal-chrome-extension";
  }
  const extension = await session.defaultSession.loadExtension(
    extensionPath,
    // allowFileAccess is required to load the devtools extension on file:// URLs.
    { allowFileAccess: true }
  );
  console.log("[debug extension loaded]", extension);
  // window.loadFile("./minimal-chrome-extension/demo.html");
  window.loadURL("http://localhost:6131/");
  handleIPC();
});

function handleIPC() {
  ipcMain.handle("load-extension", async function () {
    const extensionPath =
      __dirname.split("app.asar")[0] + "minimal-chrome-extension";
    console.log(
      "[debug handleIPC load-extension extensionPath]",
      extensionPath
    );

    const res = await session.defaultSession.loadExtension(
      // path.join(__dirname, "/minimal-chrome-extension"),
      extensionPath,
      // allowFileAccess is required to load the devtools extension on file:// URLs.
      { allowFileAccess: true }
    );
    console.log("[debug handleIPC after loaded]", res);
    const allExtensions = session.defaultSession.getAllExtensions();
    console.log("[debug handleIPC allExtensions]", allExtensions);
  });
}
