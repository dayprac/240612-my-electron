const { app, BrowserWindow } = require("electron");
const path = require("path");

async function createWindow() {
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // 加载Chrome扩展
  const chatExtensionPath = path.join(__dirname, "..", "a向页面注入聊天室");
  await mainWindow.webContents.session.loadExtension(chatExtensionPath);

  // // 加载第二个Chrome扩展
  // const secondExtensionPath = '/Users/qianzhiqiang/bijoux/1227/241227-Windowed/extension';
  // await mainWindow.webContents.session.loadExtension(secondExtensionPath);

  // 加载uBlock Origin扩展
  // const uBlockPath = path.join(__dirname, "uBlock0.chromium");
  // await mainWindow.webContents.session.loadExtension(uBlockPath);

  // 加载bilibili视频页面
  await mainWindow
    .loadURL
    // "https://www.bilibili.com/video/BV1DEPYeCEi5/?vd_source=ef211418322095bed4b3efb4dd97afc2"
    // "https://www.bilibili.com"
    ();
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
