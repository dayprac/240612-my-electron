const setIntervalImmediately = (func, interval) => {
  func();
  return setInterval(func, interval);
};

class CountDown {
  constructor(config) {
    this.kind = config.kind;
    this.id = Math.floor(Math.random() * 1000) + 1;
    this.config = config;
    this.count = -1; // start后，立即执行设为0，一个tick结束后，加1
    this.limit = config.limit;
    this.intervalId = null;
    this.isPause = false;
    this.formatter = (obj) => {
      console.log(obj.count.toString());
    };
    this.next = null;
  }
  start() {
    this.intervalId = setIntervalImmediately(() => {
      // console.log("[debug CountDown id]", this.id);
      if (this.isPause) return;
      this.count += 1;
      this.formatter(this);
      if (this.count === this.limit) {
        clearInterval(this.intervalId);
        if (this.config.pomodoro) {
          this.config.pomodoro.onCountDownCompleted(this.next);
        }
      }
    }, 1000);
  }
  pause() {
    console.log("[debug CountDown 1 pause id]", this.id);
    this.isPause = true;
    console.log(
      "[debug CountDown 2 pause id, isPause, count]",
      this.id,
      this.isPause,
      this.count
    );
  }
  continue() {
    this.isPause = false;
  }
  stop() {
    clearInterval(this.intervalId);
  }
  setFormatter(formatter) {
    this.formatter = formatter;
  }
  setNext(next) {
    this.next = next;
  }
}

const formatCount2MS = (count, limit) => {
  let left = limit - count;
  let m = Math.floor(left / 60);
  let s = left - m * 60;
  return m.toString().padStart(2, "0") + ":" + s.toString().padStart(2, "0");
};

class Pomodoro {
  constructor(config) {
    this.config = config;
    let countList = [];
    for (let i = 0; i < config.total; i++) {
      const count = new CountDown({
        kind: "work",
        limit: config.workTime,
        pomodoro: this,
      });
      if (config.workFormatter) {
        count.setFormatter((obj) => {
          config.workFormatter(obj);
        });
      } else {
        count.setFormatter((obj) => {
          console.log(formatCount2MS(obj.count, obj.limit));
        });
      }
      if (countList.length > 0) {
        countList[countList.length - 1].setNext(count);
      }
      countList.push(count);
      const countBreak = new CountDown({
        kind: "break",
        limit: config.breakTime,
        pomodoro: this,
      });
      if (config.breakFormatter) {
        countBreak.setFormatter((obj) => {
          config.breakFormatter(obj);
        });
      } else {
        countBreak.setFormatter((obj) => {
          console.log(formatCount2MS(obj.count, obj.limit));
        });
      }
      count.setNext(countBreak);
      countList.push(countBreak);
    }
    this.countList = countList;
    this.current = null;
    this.isPaused = false;
  }
  onCountDownCompleted(next) {
    if (this.config.onCountDownCompleted) {
      const _onCountDownCompleted = this.config.onCountDownCompleted.bind(this);
      _onCountDownCompleted(next);
    } else {
      if (next) {
        console.log("[debug pomodoro next.id]", next.id);
        this.current = next;
        console.log("[debug pomodoro current.id]", this.current.id);
        this.current.start();
      } else {
        if (this.onAllOverFn) {
          this.onAllOverFn();
        }
      }
    }
  }
  onAllOver(fn) {
    this.onAllOverFn = fn;
  }
  start() {
    // console.log("[debug pomodoro start countList]", this.countList);
    this.current = this.countList[0];
    this.current.start();
  }
  pause() {
    this.current.pause();
    this.isPaused = true;
  }
  continue() {
    this.current.continue();
    this.isPaused = false;
  }
  stop() {
    if (this.current) {
      this.current.stop();
    }
  }
}

class CountDown2 {
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

class Pomodoro2 {
  constructor(config) {
    this.config = config;
    this.countDownList = [];
    this.activeIndex = -1;
    this.isPaused = false;
    const pomodoro = this;
    for (let i = 0; i < config.periods; i++) {
      const work = new CountDown2({
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
      const midi = new CountDown2({
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

module.exports = { CountDown, Pomodoro, CountDown2, Pomodoro2 };
