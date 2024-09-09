// run: npx electron  defaultApp.js
const path = require("path");
const { app, BrowserWindow } = require("electron");
app.whenReady().then(() => {
  console.log(process.defaultApp); // true
  //   [
  //     '/Users/qianzhiqiang/bijoux/0602/my-electron/node_modules/electron/dist/Electron.app/Contents/MacOS/Electron',
  //     'defaultApp.js'
  //   ]
  console.log(process.argv);

  //   /Users/qianzhiqiang/bijoux/0602/my-electron/node_modules/electron/dist/Electron.app/Contents/MacOS/Electron
  console.log(process.execPath);

  //   /Users/qianzhiqiang/bijoux/0602/my-electron/demos/process/defaultApp.js
  console.log(path.resolve(process.argv[1]));
});
