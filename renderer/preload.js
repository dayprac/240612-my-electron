const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  // 注入自定义样式
  const style = document.createElement("style");
  style.textContent = `
    .abcde {
      position: fixed !important;
      top: 0 !important;
      bottom: 0 !important;
      right: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      max-width: initial !important;
      max-height: initial !important;
      z-index: 2147483647 !important;
      background-color: black;
    }
  `;
  document.head.appendChild(style);

  // 为所有视频元素添加自定义样式类
  function addCustomStyle(video) {
    let currentElement = video;
    while (currentElement && currentElement !== document.documentElement) {
      if (currentElement.classList.contains("plyr")) {
        currentElement.classList.add("abcde");
        break;
      }
      currentElement = currentElement.parentElement;
    }
  }

  let segmentIndex = 0;
  let totalSegments = 4;

  function setupVideoSegments(video) {
    addCustomStyle(video);
    video.onloadedmetadata = () => {
      const duration = video.duration;
      const segmentDuration = duration / totalSegments;
      const startTime = segmentIndex * segmentDuration;
      const endTime = (segmentIndex + 1) * segmentDuration;

      video.currentTime = startTime;
      video.ontimeupdate = () => {
        if (video.currentTime >= endTime) {
          video.currentTime = startTime;
        }
      };
    };
  }

  ipcRenderer.on("set-segment-index", (event, index) => {
    segmentIndex = index;
    const videos = document.querySelectorAll("video");
    videos.forEach(setupVideoSegments);
  });

  ipcRenderer.on("control-videos", (event, action) => {
    const videos = document.querySelectorAll("video");
    videos.forEach((video) => {
      if (action === "play") {
        video.play();
      } else if (action === "pause") {
        video.pause();
      } else if (action.startsWith("speed:")) {
        const speed = parseFloat(action.split(":")[1]);
        video.playbackRate = speed;
      }
    });
  });

  ipcRenderer.on("check-videos-state", (event) => {
    const videos = document.querySelectorAll("video");
    const isPaused =
      videos.length === 0 || Array.from(videos).every((video) => video.paused);
    ipcRenderer.sendToHost("videos-state-response", isPaused);
  });

  // 设置新加载的视频的分段
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeName === "VIDEO") {
          setupVideoSegments(node);
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});
