const { app, BrowserWindow } = require("electron");

// 创建时隐形，3s后显示
app.whenReady().then(async () => {
  console.time("win");
  const mainWindow = new BrowserWindow({
    show: false, // 仍被激活，虽然看不到窗口。点击dock图标时能注意到窗口左上角是“Electron”
  });
  console.timeLog("win");
  mainWindow.loadURL(
    "data:text/html;charset=UTF-8," + encodeURIComponent(`<h1>tmp</h1>`)
  ); // 注意到白屏片刻
  console.timeLog("win");

  await sleep(3);
  mainWindow.show();
});

const sleep = async (s) => {
  return new Promise((resovle) => {
    setTimeout(() => {
      resovle();
    }, s * 1000);
  });
};
