const { app, Tray, Menu, dialog } = require("electron");

app.whenReady().then(async () => {
  tray = new Tray("icon.png");
  const template = [
    {
      label: "测试消息对话框",
      click: async (menuItem) => {
        const it = await dialog.showMessageBox({
          //   icon: "icon.png",
          type: "info",
          title: "消息标题", // 可能不显示
          message: "消息内容",
          detail: "更详细的信息",
          buttons: ["按钮1", "按钮2"],
        });
        // 从右往左 0、1、2 ... ， 或从下往上
        // esult { response: 0, checkboxChecked: false }
        console.log("result", it);
      },
    },
  ];
  const contextMenu = Menu.buildFromTemplate(template);
  tray.setContextMenu(contextMenu);
});
