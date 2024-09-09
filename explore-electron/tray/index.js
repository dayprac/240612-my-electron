const { app, Tray, Menu, BrowserWindow } = require("electron");

let tray = null;

app.whenReady().then(async () => {
  tray = new Tray("icon.png");
  const contextMenu = Menu.buildFromTemplate([
    { label: "Item1", type: "radio" },
    { label: "Item2", type: "radio" },
    { label: "Item3", type: "radio", checked: true },
    { label: "Item4", type: "radio" },
  ]);
  tray.setToolTip("This is my application.");
  tray.setContextMenu(contextMenu);
  tray.setTitle("hello");

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

  // setTimeout(() => {
  //   const window = new BrowserWindow({
  //     width: 500,
  //     height: 300,
  //   });
  //   window.loadURL("https://example.com");
  // }, 5000);
});
