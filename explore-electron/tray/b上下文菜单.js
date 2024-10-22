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
      label: "有子菜单",
      submenu: [
        { label: "Item1", type: "radio" },
        { label: "Item2", type: "radio" },
        { label: "Item3", type: "radio", checked: true },
        { label: "Item4", type: "radio" },
      ],
    },
  ];
  const contextMenu = Menu.buildFromTemplate(template);
  tray.setContextMenu(contextMenu);
});
