const { ipcRenderer } = require("electron");
const { contextBridge } = require("electron/renderer");

console.log("[debug window-proload]");
// // In the app, if window.isElectron is defined and true, we know we're running in Electron
// Object.defineProperty(window, "isElectron", { get: () => true });
// Object.defineProperty(window, "ipcRenderer", ipcRenderer);
// console.log(window.isElectron);

// contextBridge.exposeInMainWorld("versions", {
//   node: () => process.versions.node,
//   chrome: () => process.versions.chrome,
//   electron: () => process.versions.electron,
// });

contextBridge.exposeInMainWorld("electron", {
  //   ipcRenderer,
  loadExtension: () => {
    console.log("[debug loadExtension]");
    ipcRenderer.invoke("load-extension");
  },
});
