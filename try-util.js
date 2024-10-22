const { CountDown, Pomodoro } = require("./util");

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
  });
  pomodoro.start();
}

// test中途停止();
test结束后持续();
