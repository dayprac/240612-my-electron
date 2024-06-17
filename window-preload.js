const { ipcRenderer } = require("electron");
const { contextBridge } = require("electron/renderer");

console.log("[debug window-proload]");

// In the app, if window.isElectron is defined and true, we know we're running in Electron
Object.defineProperty(window, "isElectron", { get: () => true });
Object.defineProperty(window, "ipcRenderer", ipcRenderer);
// 浏览器中有打印结果
// 但是手动在浏览器console中打印，返回undefined
console.log("[debug window-proload window.isElectron]", window.isElectron);

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke("ping"),
  channel1: () => ipcRenderer.invoke("channel1"),
});
