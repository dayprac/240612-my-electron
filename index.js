const { BrowserWindow, app, Tray, Menu, dialog } = require("electron");
const path = require("path");
const { Pomodoro, CountDown } = require("./util");

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
          let seconds = count;
          if (limit) {
            seconds = limit - count;
          }
          let m = Math.floor(seconds / 60);
          let s = seconds - m * 60;
          return (
            m.toString().padStart(2, "0") + ":" + s.toString().padStart(2, "0")
          );
        };

        pomodoro = new Pomodoro({
          periods: 2,
          workTime: 10 * 60,
          breakTime: 2 * 60,
          onWorkTick(_pomodoro, _countdown) {
            tray.setTitle(
              formatCount2MS(_countdown.count, _countdown.config.limit),
              {
                fontType: "monospaced",
              }
            );
          },
          onBreakTick(_pomodoro, _countdown) {
            tray.setTitle(
              BLUE + formatCount2MS(_countdown.count, _countdown.config.limit),
              {
                fontType: "monospaced",
              }
            );
          },
          onOver(_pomodoro) {
            console.log("[debug onOver]");
            dialog.showMessageBox({
              //   icon: "icon.png",
              type: "info",
              title: "消息标题", // 可能不显示
              message: "番茄周期结束",
              detail: "点确定，然后到tray中关闭，不然2min后开始反复弹框",
              buttons: ["确定"],
            });
            const foreverWarning = new CountDown({
              id: "forever",
              onStart(_countdown) {
                const index = _pomodoro.countDownList.findIndex(
                  (i) => i.config.id === _countdown.config.id
                );
                _pomodoro.activeIndex = index;
                console.log("[debug 全部结束后 onStart 开始无限计时]");
                tray.setTitle(RED + "00:00", {
                  fontType: "monospaced",
                });
              },
              onTick(_countdown) {
                if (_countdown.count % 2 === 0) {
                  tray.setTitle(RED + formatCount2MS(_countdown.count), {
                    fontType: "monospaced",
                  });
                } else {
                  tray.setTitle(formatCount2MS(_countdown.count), {
                    fontType: "monospaced",
                  });
                }
              },
            });
            _pomodoro.countDownList.push(foreverWarning);
            foreverWarning.start();
          },
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
        tray.setTitle("");
      },
    },
  ];
  contextMenu = Menu.buildFromTemplate(template);
  tray.setContextMenu(contextMenu);

  const window = new BrowserWindow({
    width: 500,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  window.loadFile("./renderer/pomodoro.html");
});
