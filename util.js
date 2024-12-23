class CountDown {
  constructor(config) {
    this.config = config;
    this.intervalId = null;
    this.count = 0;
    this.isPause = false;
  }
  start() {
    if (this.config.onStart) {
      this.config.onStart(this);
    }
    this.intervalId = setInterval(() => {
      if (this.isPause) return;
      this.count += 1;
      if (this.config.onTick) {
        this.config.onTick(this);
      }
      if (this.config.limit && this.count === this.config.limit) {
        clearInterval(this.intervalId);
        if (this.config.onEnd) {
          this.config.onEnd(this);
        }
      }
    }, 1000);
  }
  pause() {
    this.isPause = true;
    if (this.config.onPause) {
      this.config.onPause(this);
    }
  }
  continue() {
    this.isPause = false;
  }
  stop() {
    clearInterval(this.intervalId);
  }
}

class Pomodoro {
  constructor(config) {
    this.config = config;
    this.countDownList = [];
    this.activeIndex = -1;
    this.isPaused = false;
    const pomodoro = this;
    for (let i = 0; i < config.periods; i++) {
      const work = new CountDown({
        id: 2 * i,
        limit: config.workTime,
        onStart(_countdown) {
          const index = pomodoro.countDownList.findIndex(
            (i) => i.config.id === _countdown.config.id
          );
          pomodoro.activeIndex = index;
          console.log("[debug onWorkStart]");
          config.onWorkTick(pomodoro, _countdown);
        },
        onTick(_countdown) {
          config.onWorkTick(pomodoro, _countdown);
        },
        onEnd(_countdown) {
          console.log("[debug onWorkEnd]");
          const index = pomodoro.countDownList.findIndex(
            (i) => i.config.id === _countdown.config.id
          );
          const next = pomodoro.countDownList[index + 1];
          if (next) {
            next.start();
          }
        },
      });
      pomodoro.countDownList.push(work);
      const midi = new CountDown({
        id: i * 2 + 1,
        limit: 2,
        onStart(_countdown) {
          const index = pomodoro.countDownList.findIndex(
            (i) => i.config.id === _countdown.config.id
          );
          pomodoro.activeIndex = index;
          console.log("[debug onBreakStart]");
          config.onBreakTick(pomodoro, _countdown);
        },
        onTick(_countdown) {
          config.onBreakTick(pomodoro, _countdown);
        },
        onEnd(_countdown) {
          console.log("[debug onBreakEnd]");
          const index = pomodoro.countDownList.findIndex(
            (i) => i.config.id === _countdown.config.id
          );
          const next = pomodoro.countDownList[index + 1];
          if (next) {
            next.start();
          } else {
            if (pomodoro.config.onOver) {
              pomodoro.config.onOver(pomodoro);
            }
          }
        },
      });
      pomodoro.countDownList.push(midi);
    }
  }
  start() {
    this.countDownList[0].start();
  }
  pause() {
    this.isPaused = true;
    this.countDownList[this.activeIndex].pause();
  }
  continue() {
    this.isPaused = false;
    this.countDownList[this.activeIndex].continue();
  }
  stop() {
    this.countDownList[this.activeIndex].stop();
  }
}

module.exports = { CountDown, Pomodoro };
