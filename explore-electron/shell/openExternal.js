const { shell } = require("electron");

setTimeout(() => {
  //   shell.openExternal("swiftbar://notify?plugin=my");
  shell.openExternal("swiftbar://notify?plugin=my", { activate: false });
}, 3000);
