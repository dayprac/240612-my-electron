const setIntervalImmediately = (func, interval) => {
  func();
  return setInterval(func, interval);
};

class CountDown {
  constructor(config) {
    this.id = Math.floor(Math.random() * 1000) + 1;
    this.config = config;
    this.count = 0;
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
      if (this.count < this.limit) {
        this.formatter(this);
        this.count += 1;
      } else {
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
    let countList = [];
    for (let i = 0; i < config.total; i++) {
      const count = new CountDown({
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
  }
  onCountDownCompleted(next) {
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
  }
  continue() {
    this.current.continue();
  }
  stop() {
    if (this.current) {
      this.current.stop();
    }
  }
}

module.exports = { CountDown, Pomodoro };
