console.log("[debug mic.js]");
const { Porcupine, BuiltinKeyword } = require("@picovoice/porcupine-node");
const { PvRecorder } = require("@picovoice/pvrecorder-node");

const accessKey = "I8BjCaiHwzkfWtzMs97tR1ivLpiBt42dkZ2r2XhlpY5szi0Hwb9X/Q==";
const audioDeviceIndex = -1;
const keywordNames = [BuiltinKeyword.GRASSHOPPER, BuiltinKeyword.BUMBLEBEE];

let isInterrupted = false;

async function micDemo(callback) {
  let handle = new Porcupine(accessKey, keywordNames, [0.5, 0.65]);
  const frameLength = handle.frameLength;

  const recorder = new PvRecorder(frameLength, audioDeviceIndex);
  recorder.start();
  while (!isInterrupted) {
    const pcm = await recorder.read();
    let index = handle.process(pcm);
    if (index !== -1) {
      const keyWordName = keywordNames[index];
      //   console.log(`Detected '${keyWordName}'`);
      if (callback) {
        callback(keyWordName);
      }
    }
  }
  recorder.release();
  console.log("[debug mic.js ecorder.release]");
}

process.on("SIGINT", function () {
  isInterrupted = true;
});

// (async function () {
//   try {
//     await micDemo();
//   } catch (e) {
//     console.error(e.toString());
//   }
// })();

module.exports = {
  micDemo,
};
