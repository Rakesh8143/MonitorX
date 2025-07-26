const {app, BrowserWindow}= require('electron');
const path = require('path');

let mainWindow;
app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webpreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    mainWindow.loadURL('http://localhost:5173/');
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}
);