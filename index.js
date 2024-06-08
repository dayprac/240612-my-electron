// ffmpeg
const { exec } = require("node:child_process");
const ls = exec(
  "ffmpeg -f lavfi -i mandelbrot -f mp4 \
-movflags frag_keyframe -preset ultrafast -pix_fmt yuv420p -listen 1 http://localhost:8000"
);

console.log(ls.spawnargs);

// html
const http = require("http");
const html = `
    <video controls autoplay src=http://localhost:8000 />
`;
http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
  })
  .listen(8604);

// window
const { app, BrowserWindow } = require("electron");
app.whenReady().then(() => {
  const window = new BrowserWindow();
  window.loadURL("http://localhost:8604/");
});
