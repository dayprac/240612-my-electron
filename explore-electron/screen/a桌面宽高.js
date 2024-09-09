const { app, screen } = require("electron");
app.whenReady().then(() => {
  for (const display of screen.getAllDisplays()) {
    console.log(display);
    //region mac上
    // {
    //     accelerometerSupport: 'unknown',
    //     bounds: { x: 0, y: 0, width: 1536, height: 960 },
    //     colorDepth: 24,
    //     colorSpace: '{r:[0.6797, 0.3203], g:[0.2650, 0.6901], b:[0.1504, 0.3203], w:[0.3127, 0.3290]}, transfer:{0.0777*x + 0.0000 if abs(x) < 0.0450 else sign(x)*((0.9495*abs(x) + 0.0495)**2.3955 + 0.0003)}, matrix:RGB, range:FULL}',
    //     depthPerComponent: 8,
    //     detected: true,
    //     displayFrequency: 59.99968338012695,
    //     id: 69734662,
    //     internal: true,
    //     label: '内建视网膜显示器',
    //     maximumCursorSize: { width: 0, height: 0 },
    //     monochrome: false,
    //     nativeOrigin: { x: 0, y: 0 },
    //     rotation: 0,
    //     scaleFactor: 2,
    //     size: { width: 1536, height: 960 },
    //     workArea: { x: 0, y: 25, width: 1536, height: 935 },
    //     workAreaSize: { width: 1536, height: 935 },
    //     touchSupport: 'unknown'
    //   }
    //   {
    //     accelerometerSupport: 'unknown',
    //     bounds: { x: 1536, y: -120, width: 1920, height: 1080 },
    //     colorDepth: 24,
    //     colorSpace: '{r:[0.6590, 0.3341], g:[0.2998, 0.6395], b:[0.1494, 0.3341], w:[0.3127, 0.3290]}, transfer:{0.0777*x + 0.0000 if abs(x) < 0.0450 else sign(x)*((0.9495*abs(x) + 0.0495)**2.3955 + 0.0003)}, matrix:RGB, range:FULL}',
    //     depthPerComponent: 8,
    //     detected: true,
    //     displayFrequency: 59.99662399291992,
    //     id: 724049863,
    //     internal: false,
    //     label: 'DELL P2415Q',
    //     maximumCursorSize: { width: 0, height: 0 },
    //     monochrome: false,
    //     nativeOrigin: { x: 0, y: 0 },
    //     rotation: 0,
    //     scaleFactor: 2,
    //     size: { width: 1920, height: 1080 },
    // //  😊 双击数字，上下文高亮，方便观察含义
    // //  从大屏左上角往左移动 一边下降，到122的记录才会移进小屏幕 -122 + 25 = -97
    //     workArea: { x: 1536, y: -95, width: 1920, height: 958 }, //  1080 - 958 = 122 = 24（上方） + 91（下方） + 7（估计是一些间隔）
    //     workAreaSize: { width: 1920, height: 958 },
    // // 如果dock栏在小屏幕
    // //   workAreaSize: { width: 1920, height: 1055 }, 1055- 958 = 97 即dock栏
    //     touchSupport: 'unknown'
    //   }
    //endregion
  }
});
