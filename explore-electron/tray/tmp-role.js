// MenuItem https://www.electronjs.org/docs/latest/api/menu-item
const { app, Tray, Menu } = require("electron");

let tray = null;

app.whenReady().then(async () => {
  tray = new Tray("icon.png");
  const template = [
    {
      label: "测试click",
      click: (menuItem) => {
        console.log(menuItem);
      },
    },
    {
      role: "about",
    },
  ];
  const contextMenu = Menu.buildFromTemplate(template);
  tray.setContextMenu(contextMenu);
});
