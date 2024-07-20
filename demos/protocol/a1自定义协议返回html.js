const { app, protocol, net, BrowserWindow } = require("electron");

app.whenReady().then(async () => {
  protocol.handle("echo", (request) => {
    console.log(request.url); // 普通字符串
    return new Response(`<h1>echo</h1><p>${request.url}</p>`, {
      headers: { "content-type": "text/html" },
    });
  });
  await sleep(0.5);
  const res = await net.fetch("echo://hello");
  const html = await res.text();
  console.log(html);
  const win = new BrowserWindow();
  win.loadURL("echo://hello");
});

const sleep = async (s) => {
  return new Promise((resovle) => {
    setTimeout(() => {
      resovle();
    }, s * 1000);
  });
};
