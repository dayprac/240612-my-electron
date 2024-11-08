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
test结束后持续();
