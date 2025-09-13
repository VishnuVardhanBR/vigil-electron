const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  on: (channel, callback) => {
    const safeCallback = (event, ...args) => callback(...args);
    ipcRenderer.on(channel, safeCallback);
    return () => ipcRenderer.removeListener(channel, safeCallback);
  },
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});