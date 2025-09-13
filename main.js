const { app, BrowserWindow } = require('electron');
const path = require('path');
const { startDataGeneration, machines } = require('./backend/data-generator');

if (require('electron-squirrel-startup')) {
  app.quit();
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 940,
    minHeight: 600,
    backgroundColor: '#f3f3f3',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile('index.html');

  mainWindow.webContents.on('did-finish-load', () => {
    const initialMachineState = machines.map(m => ({
        machineId: m.machineId,
        machineName: m.machineName,
        status: 'Initializing',
        metrics: {
            temperature: { value: '...', unit: '°C' },
            pressure: { value: '...', unit: 'PSI' },
            vibration: { value: '...', unit: 'g' },
        },
        timestamp: new Date().toISOString(),
        logMessage: 'Awaiting first data packet...'
    }));
    mainWindow.webContents.send('initial-machines', initialMachineState);
  });

  startDataGeneration((dataPoint) => {
    if (!mainWindow.isDestroyed()) {
        mainWindow.webContents.send('machine-data-update', dataPoint);
    }
  });
}

app.on('ready', createWindow);
app.on('window-all-closed', () => app.quit());
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});