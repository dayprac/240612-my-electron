const { app, Tray, Menu, BrowserWindow } = require("electron");
const path = require("path");
const { Pomodoro } = require("./util");

let tray = null;
let pomodoro = null;

app.whenReady().then(async () => {
  const iconPath = path.join(
    __dirname.split("app.asar")[0],
    "images",
    "icon.png"
  );
  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "开始",
      click: () => {
        const RED = "\u001b[31m";

        const formatCount2MS = (count, limit) => {
          let left = limit - count;
          let m = Math.floor(left / 60);
          let s = left - m * 60;
          return (
            m.toString().padStart(2, "0") + ":" + s.toString().padStart(2, "0")
          );
        };

        const pomodoro = new Pomodoro({
          total: 4,
          workTime: 5,
          breakTime: 2,
          workFormatter: (obj) => {
            // console.log("work: ", obj.count);
            tray.setTitle(formatCount2MS(obj.count, obj.limit), {
              fontType: "monospaced",
            });
          },
          breakFormatter: (obj) => {
            // console.log("break: ", obj.count);
            tray.setTitle(RED + formatCount2MS(obj.count, obj.limit), {
              fontType: "monospaced",
            });
          },
        });
        pomodoro.start();
      },
    },
    {
      label: "暂停",
      click: () => {
        pomodoro.pause();
      },
    },
    {
      label: "结束",
      click: () => {
        pomodoro.stop();
      },
    },
  ]);
  tray.setContextMenu(contextMenu);
});
