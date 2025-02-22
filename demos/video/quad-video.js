const electron = require('electron');
const { app, BrowserWindow, ipcMain, dialog } = electron;
const path = require('path');

app.whenReady().then(() => {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // 处理选择视频文件的 IPC 消息
    ipcMain.handle('select-video', async () => {
        const result = await dialog.showOpenDialog(win, {
            properties: ['openFile'],
            filters: [{ name: '视频文件', extensions: ['mp4', 'webm', 'ogg'] }]
        });
        if (!result.canceled && result.filePaths.length > 0) {
            return result.filePaths[0];
        }
        return null;
    });

    win.loadFile(path.join(__dirname, '../../renderer/quad-video.html'));

    // 开发时打开开发者工具
    if (process.env.NODE_ENV === 'development') {
        win.webContents.openDevTools();
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});