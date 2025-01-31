const { ipcRenderer } = require("electron");

const btnSiyuanHelper = document.querySelector("#siyuan-helper");
btnSiyuanHelper.addEventListener("click", function () {
  ipcRenderer.invoke("openSiyuanHelper");
});

const btnVideoHelper = document.querySelector("#video-helper");
btnVideoHelper.addEventListener("click", function () {
  ipcRenderer.invoke("openVideoHelper");
});

const btnPomodoro = document.querySelector("#pomodoro");
btnPomodoro.addEventListener("click", function () {
  ipcRenderer.invoke("openPomodoro");
});
