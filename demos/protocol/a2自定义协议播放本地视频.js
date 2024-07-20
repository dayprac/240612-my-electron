const { app, protocol, net, BrowserWindow } = require("electron");
const path = require("node:path");

// app.setAsDefaultProtocolClient("video");
protocol.registerSchemesAsPrivileged([
  {
    scheme: "video",
    privileges: {
      bypassCSP: true,
      stream: true,
    },
  },
]);

const html = `
<video autoPlay loop muted>
  <source src="video:///Users/qianzhiqiang/Downloads/Issue-WEB.mp4" type="video/mp4" />
</video>
`;

app.whenReady().then(async () => {
  protocol.handle("html", (request) => {
    return new Response(html, {
      headers: { "content-type": "text/html" },
    });
  });
  protocol.handle("video", function (request) {
    return net.fetch("file://" + request.url.slice("video://".length));
  });
  const win = new BrowserWindow();
  win.loadURL("html://demo");
});
