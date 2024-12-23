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
    periods: 4,
    workTime: 5,
    breakTime: 2,
    // periods: 2,
    // workTime: 10 * 60,
    // breakTime: 2 * 60,
    onWorkTick(_pomodoro, _countdown) {
      document.querySelector(".work").textContent = formatCount2MS(
        _countdown.count,
        _countdown.config.limit
      );
      let index = _pomodoro.config.periods - _pomodoro.activeIndex / 2;
      document.querySelector(".index").textContent = index;
    },
    onBreakTick(_pomodoro, _countdown) {
      document.querySelector(".break").textContent = formatCount2MS(
        _countdown.count,
        _countdown.config.limit
      );
    },
    onOver(_pomodoro) {
      console.log("[debug onOver]");
      document.querySelector(".work").textContent = "";
      document.querySelector(".index").textContent = "";
      document.querySelector(".break").textContent = "";
      const foreverWarning = new CountDown({
        id: "forever",
        onStart(_countdown) {
          const index = _pomodoro.countDownList.findIndex(
            (i) => i.config.id === _countdown.config.id
          );
          _pomodoro.activeIndex = index;
          // console.log("[debug 全部结束后 onStart 开始无限计时]");
          document.querySelector(".work").textContent = "00:00";
          document.querySelector(".index").textContent = "0";
        },
        onTick(_countdown) {
          let m = Math.floor(_countdown.count / 60);
          let s = _countdown.count - m * 60;
          document.querySelector(".work").textContent =
            m.toString().padStart(2, "0") + ":" + s.toString().padStart(2, "0");
        },
      });
      _pomodoro.countDownList.push(foreverWarning);
      foreverWarning.start();
    },
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
  document.querySelector(".index").textContent = "";
  document.querySelector(".break").textContent = "";
});
