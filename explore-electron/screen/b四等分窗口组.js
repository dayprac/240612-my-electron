const { app, BrowserWindow, screen } = require("electron");
app.whenReady().then(() => {
  setTimeout(() => {
    const primaryDisplay = screen.getPrimaryDisplay();
    // console.log(primaryDisplay);
    const { x, y, width, height } = primaryDisplay.workArea;
    const w00 = new BrowserWindow({
      x,
      y,
      width: Math.floor(width / 2),
      height: Math.floor(height / 2), // 验证了如果不取整数，会视为无效，实际设为默认height
      frame: false,
    });
    w00.loadURL(
      "data:text/html;charset=UTF-8," + encodeURIComponent(`<h1>00</h1>`)
    );
    const w01 = new BrowserWindow({
      x: Math.floor(width / 2),
      y,
      width: Math.floor(width / 2),
      height: Math.floor(height / 2),
      frame: false,
    });
    w01.loadURL(
      "data:text/html;charset=UTF-8," + encodeURIComponent(`<h1>01</h1>`)
    );

    const w10 = new BrowserWindow({
      x,
      y: Math.floor(y + height / 2),
      width: Math.floor(width / 2),
      height: Math.floor(height / 2),
      frame: false,
    });
    w10.loadURL(
      "data:text/html;charset=UTF-8," + encodeURIComponent(`<h1>10</h1>`)
    );
    const w11 = new BrowserWindow({
      x: Math.floor(width / 2),
      y: Math.floor(y + height / 2),
      width: Math.floor(width / 2),
      height: Math.floor(height / 2),
      frame: false,
    });
    w11.loadURL(
      "data:text/html;charset=UTF-8," + encodeURIComponent(`<h1>11</h1>`)
    );
  }, 3000);
});
