const { CountDown, Pomodoro, CountDown2, Pomodoro2 } = require("./util");

const pomodoro = new Pomodoro({
  total: 4,
  workTime: 5,
  breakTime: 2,
  workFormatter: (obj) => {
    console.log(`work (${obj.id}): `, obj.count, `isPause: ${obj.isPause}`);
  },
  breakFormatter: (obj) => {
    console.log(`break (${obj.id}): `, obj.count, `isPause: ${obj.isPause}`);
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

function test中途停止() {
  pomodoro.start();

  setTimeout(() => {
    pomodoro.pause();
    setTimeout(() => {
      pomodoro.continue();
      setTimeout(() => {
        pomodoro.stop();
      }, 5000);
    }, 5000);
  }, 8000);
}

function test结束后持续() {
  pomodoro.onAllOver(() => {
    console.log("[debug onAllOver]");
    const foreverCountdown = new CountDown({
      limit: 24 * 60,
      pomodoro: this,
    });
    foreverCountdown.setFormatter((obj) => {
      console.log(`结束后无限计时：${obj.count}`);
    });
    pomodoro.countList.push(foreverCountdown);
    pomodoro.current = foreverCountdown;

    pomodoro.current.start();
  });
  pomodoro.start();
}

// test中途停止();
// test结束后持续();

// 重构后的版本

const formatCount2MS = (count, limit) => {
  let left = limit - count;
  let m = Math.floor(left / 60);
  let s = left - m * 60;
  return m.toString().padStart(2, "0") + ":" + s.toString().padStart(2, "0");
};

function test单个CountDown() {
  const countDown = new CountDown2({
    limit: 10,
    onStart(_countdown) {
      console.log(
        "[debug onStart]",
        formatCount2MS(_countdown.count, _countdown.config.limit)
      );
    },
    onTick(_countdown) {
      console.log(formatCount2MS(_countdown.count, _countdown.config.limit));
    },
    onEnd(_countdown) {
      console.log("[debug onEnd]");
    },
  });
  countDown.start();
}

function test多个CountDown() {
  const countDownList = [];
  let activeIndex = -1;
  for (let i = 0; i < 4; i++) {
    const work = new CountDown2({
      id: 2 * i,
      limit: 5,
      onStart(_countdown) {
        const index = countDownList.findIndex(
          (i) => i.config.id === _countdown.config.id
        );
        activeIndex = index;
        console.log(
          "[debug onStart]",
          formatCount2MS(_countdown.count, _countdown.config.limit)
        );
      },
      onTick(_countdown) {
        console.log(formatCount2MS(_countdown.count, _countdown.config.limit));
      },
      onEnd(_countdown) {
        console.log("[debug onEnd]");
        const index = countDownList.findIndex(
          (i) => i.config.id === _countdown.config.id
        );
        const next = countDownList[index + 1];
        if (next) {
          next.start();
        }
      },
    });
    countDownList.push(work);
    const midi = new CountDown2({
      id: i * 2 + 1,
      limit: 2,
      onStart(_countdown) {
        const index = countDownList.findIndex(
          (i) => i.config.id === _countdown.config.id
        );
        activeIndex = index;
        console.log(
          "[debug onStart]",
          formatCount2MS(_countdown.count, _countdown.config.limit)
        );
      },
      onTick(_countdown) {
        console.log(formatCount2MS(_countdown.count, _countdown.config.limit));
      },
      onEnd(_countdown) {
        console.log("[debug onEnd]");
        const index = countDownList.findIndex(
          (i) => i.config.id === _countdown.config.id
        );
        const next = countDownList[index + 1];
        if (next) {
          next.start();
        }
      },
    });
    countDownList.push(midi);
  }
  // console.log(countDownList);
  countDownList[0].start();

  // 8s时暂停5s
  setTimeout(() => {
    countDownList[activeIndex].pause();
    setTimeout(() => {
      countDownList[activeIndex].continue();
    }, 5000);
  }, 8000);
}

function testPomodoro2() {
  const pomodoro = new Pomodoro2({
    periods: 4,
    workTime: 5,
    breakTime: 2,
    onWorkTick(_pomodoro, _countdown) {
      console.log(formatCount2MS(_countdown.count, _countdown.config.limit));
    },
    onBreakTick(_pomodoro, _countdown) {
      console.log(formatCount2MS(_countdown.count, _countdown.config.limit));
    },
    onOver(_pomodoro) {
      console.log("[debug onOver]");
      const foreverWarning = new CountDown2({
        id: "forever",
        onStart(_countdown) {
          const index = _pomodoro.countDownList.findIndex(
            (i) => i.config.id === _countdown.config.id
          );
          _pomodoro.activeIndex = index;
          console.log("[debug 全部结束后 onStart 开始无限计时]");
        },
        onTick(_countdown) {
          let m = Math.floor(_countdown.count / 60);
          let s = _countdown.count - m * 60;
          console.log(
            m.toString().padStart(2, "0") + ":" + s.toString().padStart(2, "0")
          );
        },
      });
      _pomodoro.countDownList.push(foreverWarning);
      foreverWarning.start();
    },
  });
  pomodoro.start();
  // 8s时暂停5s
  setTimeout(() => {
    pomodoro.pause();
    setTimeout(() => {
      pomodoro.continue();
    }, 5000);
  }, 8000);
}

// test单个CountDown();
// test多个CountDown();
testPomodoro2();
