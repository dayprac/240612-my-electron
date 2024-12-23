const { CountDown, Pomodoro } = require("./util");

const formatCount2MS = (count, limit) => {
  let left = limit - count;
  let m = Math.floor(left / 60);
  let s = left - m * 60;
  return m.toString().padStart(2, "0") + ":" + s.toString().padStart(2, "0");
};

function test单个CountDown() {
  const countDown = new CountDown({
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
    const work = new CountDown({
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
    const midi = new CountDown({
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

function testPomodoro() {
  const pomodoro = new Pomodoro({
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
      const foreverWarning = new CountDown({
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
testPomodoro();
