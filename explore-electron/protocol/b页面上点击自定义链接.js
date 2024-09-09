const { app, protocol, shell, BrowserWindow } = require("electron");
const path = require("node:path");

// app.setAsDefaultProtocolClient("video");

app.whenReady().then(async () => {
  protocol.handle("my", function (request) {
    console.log(request.url); // 普通字符串
    // return new Response(`<h1>my</h1><p>${request.url}</p>`, {
    //   headers: { "content-type": "text/html" },
    // });
    shell.openExternal("swiftbar://notify?plugin=my", { activate: false });
  });
  const win = new BrowserWindow();
  win.loadFile("b页面上点击自定义链接.html");
});
