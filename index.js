const { app, Tray, Menu, BrowserWindow } = require("electron");
const path = require("path");

let tray = null;

app.whenReady().then(async () => {
  const iconPath = path.join(
    __dirname.split("app.asar")[0],
    "images",
    "icon.png"
  );
  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    { label: "Item1", type: "radio" },
    { label: "Item2", type: "radio" },
    { label: "Item3", type: "radio", checked: true },
    { label: "Item4", type: "radio" },
  ]);
  tray.setToolTip("This is my application.");
  tray.setContextMenu(contextMenu);
  // tray.setTitle("hello");

  // Setting up a variety of color code constants
  const RED = "\u001b[31m";
  const BLUE = "\u001b[34m";
  const WHITE_CYAN = "\u001b[37;46m";
  const RED_YELLOW = "\u001b[31;43m";
  const PINK = "\u001b[38;5;201m";
  const LAVENDER = "\u001b[38;5;147m";
  const AQUA = "\u001b[38;2;145;231;255m";
  const PENCIL = "\u001b[38;2;253;182;0m";

  // Change the color constant below and see what happens!
  // console.log(RED + "I'm a chameleon.");
  // tray.setTitle(RED + "I'm a chameleon.");

  // Printing with multiple colors
  // console.log(PENCIL + "Look " + BLUE + "at " + PINK + "me " + AQUA + "go!");
  // tray.setTitle(RED + "Look " + BLUE + "at " + RED + "me " + BLUE + "go!");

  // setInterval(() => {
  //   tray.setTitle(
  //     new Date().toLocaleString("zh-CN", {
  //       timeZone: "Asia/Shanghai",
  //     })
  //   );
  // }, 1000);

  const setIntervalImmediately = (func, interval) => {
    func();
    return setInterval(func, interval);
  };

  let isTomato = false;
  // const tomatoLimit = 10 * 60;
  const tomatoLimit = 5;
  let tomatoTick = 0;
  let isBreak = false;
  // const breakLimit = 2 * 60;
  const breakLimit = 3;
  let breakTick = 0;

  isTomato = true;

  setIntervalImmediately(() => {
    if (isTomato) {
      if (tomatoTick < tomatoLimit) {
        tray.setTitle(tomatoTick.toString(), { fontType: "monospaced" });
        tomatoTick += 1;
      } else {
        tomatoTick = 0;
        isTomato = false;
        isBreak = true;
        breakTick = 0;
        tray.setTitle(RED + breakTick.toString(), { fontType: "monospaced" });
        breakTick = 1;
      }
    } else {
      if (breakTick < breakLimit) {
        tray.setTitle(RED + breakTick.toString(), { fontType: "monospaced" });
        breakTick += 1;
      } else {
        breakTick = 0;
        isBreak = false;
        isTomato = true;
        tomatoTick = 0;
        tray.setTitle(tomatoTick.toString(), { fontType: "monospaced" });
        tomatoTick = 1;
      }
    }
  }, 1000);
});
