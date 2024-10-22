// MenuItem https://www.electronjs.org/docs/latest/api/menu-item
// 返回的 Menu实例不支持动态添加或删除菜单项， 但仍然可以动态修改 实例属性 。
const { app, Tray, Menu } = require("electron");

let tray = null;
let contextMenu = null;

app.whenReady().then(async () => {
  tray = new Tray("icon.png");
  const template = [
    {
      id: "test", // 如果不加id，console打印发现不会有默认的id
      label: "测试click",
      click: (menuItem) => {
        console.log("[debug 测试click menuItem]", menuItem);
        console.log("[debug 测试click contextMenu]", contextMenu);
        const testMenuItem = contextMenu.items.filter(
          (i) => i.id === "test"
        )[0];
        console.log("[debug 测试click 查找menuItem]", testMenuItem);
        // testMenuItem.label = "x"; // 发现改不了label

        // 相比之下，enabled visible 可以改
        // [Class: MenuItem | Electron](https://www.electronjs.org/docs/latest/api/menu-item#menuitemenabled)
        // 文档中明确提了 this property can be dynamically changed.
        // 》文档中用 dynamically change 搜索
        testMenuItem.enabled = false;
      },
    },
  ];
  contextMenu = Menu.buildFromTemplate(template);
  // console.log(contextMenu);
  tray.setContextMenu(contextMenu);
});
