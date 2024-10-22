// MenuItem https://www.electronjs.org/docs/latest/api/menu-item
// 返回的 Menu实例不支持动态添加或删除菜单项， 但仍然可以动态修改 实例属性 。
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
    {
      label: "测试checkbox",
      type: "checkbox",
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
