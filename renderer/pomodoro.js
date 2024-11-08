let pomodoro = null;

document.querySelector(".pomodoro-start").addEventListener("click", (event) => {
  const formatCount2MS = (count, limit) => {
    let seconds = count;
    if (limit) {
      seconds = limit - count;
    }
    let m = Math.floor(seconds / 60);
    let s = seconds - m * 60;
    return m.toString().padStart(2, "0") + ":" + s.toString().padStart(2, "0");
  };

  pomodoro = new Pomodoro({
    total: 4,
    workTime: 10,
    breakTime: 5,
    // total: 2,
    // workTime: 10 * 60,
    // breakTime: 2 * 60,
    workFormatter: (obj) => {
      // console.log("work: ", obj.count);
      document.querySelector(".work").textContent = formatCount2MS(
        obj.count,
        obj.limit
      );
    },
    breakFormatter: (obj) => {
      // console.log("break: ", obj.count);
      document.querySelector(".break").textContent = formatCount2MS(
        obj.count,
        obj.limit
      );
    },
    onCountDownCompleted(next) {
      // console.log("[config this,next]", this, next);
      if (next) {
        if (this.current.kind === "work") {
        } else if (this.current.kind === "break") {
        }

        console.log("[debug pomodoro next.kind, next.id]", next.kind, next.id);
        this.current = next;
        console.log("[debug pomodoro current.id]", this.current.id);
        this.current.start();
      } else {
        if (this.onAllOverFn) {
          this.onAllOverFn();
        }
      }
    },
  });
  pomodoro.onAllOver(() => {
    console.log("[debug onAllOver]");
    // dialog.showMessageBox({
    //   //   icon: "icon.png",
    //   type: "info",
    //   title: "消息标题", // 可能不显示
    //   message: "番茄周期结束",
    //   detail: "点确定，然后到tray中关闭，不然2min后开始反复弹框",
    //   buttons: ["确定"],
    // });

    const foreverCountdown = new CountDown({
      limit: 24 * 60,
      pomodoro: this,
    });

    foreverCountdown.setFormatter((obj) => {
      // console.log(`结束后无限计时：${obj.count}`);
      if (obj.count % 2 === 0) {
        document.querySelector(".work").textContent = formatCount2MS(obj.count);
      } else {
        document.querySelector(".work").textContent = formatCount2MS(obj.count);
      }
    });
    pomodoro.countList.push(foreverCountdown);
    pomodoro.current = foreverCountdown;

    pomodoro.current.start();
  });
  pomodoro.start();
});

document
  .querySelector(".pomodoro-pause-continue")
  .addEventListener("click", (event) => {
    if (pomodoro.isPaused) {
      pomodoro.continue();
    } else {
      pomodoro.pause();
    }
  });

document.querySelector(".pomodoro-stop").addEventListener("click", (event) => {
  pomodoro.stop();
  document.querySelector(".work").textContent = "";
  document.querySelector(".break").textContent = "";
});
