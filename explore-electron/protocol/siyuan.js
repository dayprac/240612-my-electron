const { app, protocol, shell, BrowserWindow } = require("electron");

app.whenReady().then(async () => {
  protocol.handle("my", (request) => {
    console.log(request.url); // 普通字符串
    // return new Response(`<h1>my</h1><p>${request.url}</p>`, {
    //   headers: { "content-type": "text/html" },
    // });
    shell.openExternal("swiftbar://notify?plugin=my", { activate: false });
  });
  const win = new BrowserWindow();
  win.loadURL("http://127.0.0.1:64511/stage/build/desktop/?r=qixra80");
});
