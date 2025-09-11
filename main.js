const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { startDataGeneration } = require('./backend/data-generator');

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      // preload: path.join(__dirname, 'renderer.js'), // We will use nodeIntegration directly
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');

  // Start generating data and sending it to the renderer process
  startDataGeneration((dataPoint) => {
    console.log('Generated data:', dataPoint.machineId, dataPoint.status);
    win.webContents.send('machine-data', dataPoint);
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
