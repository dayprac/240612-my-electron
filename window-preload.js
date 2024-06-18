const { ipcRenderer } = require("electron");
const { contextBridge } = require("electron/renderer");

console.log("[debug window-proload]");

// In the app, if window.isElectron is defined and true, we know we're running in Electron
Object.defineProperty(window, "isElectron", { get: () => true });
Object.defineProperty(window, "ipcRenderer", ipcRenderer);
// 浏览器中有打印结果
// 但是手动在浏览器console中打印，返回undefined
console.log("[debug window-proload window.isElectron]", window.isElectron);

contextBridge.exposeInMainWorld("electron", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  // 打包后 /Users/qianzhiqiang/bijoux/0602/my-electron/out/my-electron-darwin-x64/my-electron.app/Contents/Resources/
  rootPath: () => __dirname.split("app.asar")[0],
  ping: () => ipcRenderer.invoke("ping"),
  loadExtension: () => ipcRenderer.invoke("load-extension"),
  channel1: () => ipcRenderer.invoke("channel1"),
});
