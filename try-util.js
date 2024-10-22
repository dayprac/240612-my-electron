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
pomodoro.start();

setTimeout(() => {
  // console.log("[debug try pomodoro.current.id]", pomodoro.current.id);
  // return;
  pomodoro.pause();
  setTimeout(() => {
    pomodoro.continue();
    setTimeout(() => {
      pomodoro.stop();
    }, 5000);
  }, 5000);
}, 8000);
