// window
const { app, session, BrowserWindow, ipcMain, screen } = require("electron");
const path = require("path");

app.whenReady().then(async () => {
  const window = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      // preload: path.join(__dirname, "window-preload.js"), // Appropriate path to the file in your own project
    },
  });
  // console.log(app.getPath("userData")); // /Users/qianzhiqiang/Library/Application Support/my-electron
  let extensionPath = path.join(
    __dirname.split("app.asar")[0],
    "minimal-chrome-extension"
  );
  const extension = await session.defaultSession.loadExtension(
    extensionPath,
    // allowFileAccess is required to load the devtools extension on file:// URLs.
    { allowFileAccess: true }
  );
  console.log("[debug extension loaded]", extension);
  // window.loadFile("./minimal-chrome-extension/demo.html");
  // window.loadURL("http://localhost:6131/");
  // window.loadURL("http://localhost:5175/");
  window.loadFile(
    path.join(__dirname.split("app.asar")[0], "renderer/explore-displays.html")
  );
  handleIPC();
});

function handleIPC() {
  ipcMain.handle("ping", () => "pong");
  ipcMain.handle("channel1", async (event, args) => {
    console.log("[debug handleIPC channel1]", event, args);
  });
  ipcMain.handle("new-window", async () => {
    const window = new BrowserWindow({
      width: 200,
      height: 200,
      webPreferences: {
        nodeIntegration: true,
        preload: path.join(__dirname, "window-preload.js"), // Appropriate path to the file in your own project
      },
    });
    window.loadFile(
      path.join(__dirname.split("app.asar")[0], "renderer/new-window.html")
    );
    setTimeout(() => {
      window.close();
    }, 5000);
  });
  ipcMain.handle("get-all-displays", async () => {
    let displays = screen.getAllDisplays();
    // console.log("[debug displays]", displays);
    return displays;
  });
  ipcMain.handle("load-extension", async () => {
    // 窗口出现后再加载加载项没有实际效果
    // 这里的代码只是为了测试加载项目录对不对（窗口出现前加载插件，如果目录不对会导致白屏）
    console.log("[debug handleIPC load-extension __dirname]", __dirname);
    let extensionPath = path.join(
      __dirname.split("app.asar")[0],
      "/minimal-chrome-extension"
    );
    // if (__dirname.includes("app.asar")) {
    //   extensionPath = path.join()
    //     __dirname.split("app.asar")[0] + "minimal-chrome-extension";
    // }
    // /Users/qianzhiqiang/bijoux/0602/my-electron/out/my-electron-darwin-x64/my-electron.app/Contents/Resources/app.asar
    // return __dirname;
    // return {
    //   extensionPath,
    //   node_env: process.env.NODE_ENV,
    // };

    const extension = await session.defaultSession.loadExtension(
      extensionPath,
      // allowFileAccess is required to load the devtools extension on file:// URLs.
      { allowFileAccess: true }
    );
    console.log(extension);
    return extension;
  });
}
