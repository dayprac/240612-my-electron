const { app, Tray, Menu, BrowserWindow } = require("electron");
const path = require("path");
const { Pomodoro } = require("./util");

let tray = null;
let contextMenu = null;
let pomodoro = null;

app.whenReady().then(async () => {
  const iconPath = path.join(
    __dirname.split("app.asar")[0],
    "images",
    "icon.png"
  );
  tray = new Tray(iconPath);
  const template = [
    {
      label: "开始",
      click: () => {
        const BLUE = "\u001b[34m";
        const RED = "\u001b[31m";

        const formatCount2MS = (count, limit) => {
          let left = limit - count;
          let m = Math.floor(left / 60);
          let s = left - m * 60;
          return (
            m.toString().padStart(2, "0") + ":" + s.toString().padStart(2, "0")
          );
        };

        pomodoro = new Pomodoro({
          // total: 4,
          // workTime: 5,
          // breakTime: 2,
          total: 1,
          workTime: 10 * 60,
          breakTime: 2 * 60,
          workFormatter: (obj) => {
            // console.log("work: ", obj.count);
            tray.setTitle(formatCount2MS(obj.count, obj.limit), {
              fontType: "monospaced",
            });
          },
          breakFormatter: (obj) => {
            // console.log("break: ", obj.count);
            tray.setTitle(BLUE + formatCount2MS(obj.count, obj.limit), {
              fontType: "monospaced",
            });
          },
        });
        pomodoro.onAllOver(() => {
          tray.setTitle(RED + "over", {
            fontType: "monospaced",
          });
        });
        pomodoro.start();
      },
    },
    {
      label: "暂停",
      id: "pause",
      click: () => {
        pomodoro.pause();
        const pauseMenuItem = contextMenu.items.filter(
          (i) => i.id === "pause"
        )[0];
        const continueMenuItem = contextMenu.items.filter(
          (i) => i.id === "continue"
        )[0];
        pauseMenuItem.visible = false;
        continueMenuItem.visible = true;
      },
    },
    {
      label: "继续",
      id: "continue",
      visible: false,
      click: () => {
        pomodoro.continue();
        const pauseMenuItem = contextMenu.items.filter(
          (i) => i.id === "pause"
        )[0];
        const continueMenuItem = contextMenu.items.filter(
          (i) => i.id === "continue"
        )[0];
        pauseMenuItem.visible = true;
        continueMenuItem.visible = false;
      },
    },
    {
      label: "结束",
      click: () => {
        pomodoro.stop();
      },
    },
  ];
  contextMenu = Menu.buildFromTemplate(template);
  tray.setContextMenu(contextMenu);
});
