const { app, BrowserWindow } = require("electron");

app.whenReady().then(async () => {
  const win = new BrowserWindow();
  // mac: { x: 368, y: 180, width: 800, height: 600 }
  console.log(win.getBounds());
  // mac: [ 368, 180 ]
  console.log(win.getPosition());

  await sleep(3);
  // y虽然是0，实际会自动加上顶部栏
  win.setBounds({ x: 0, y: 0, width: 300, height: 300 });
  await sleep(3);
  console.log(win.getBounds());
});

const sleep = async (s) => {
  return new Promise((resovle) => {
    setTimeout(() => {
      resovle();
    }, s * 1000);
  });
};
