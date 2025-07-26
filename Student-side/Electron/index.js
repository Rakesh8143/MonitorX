// index.js
const { app, BrowserWindow, ipcMain, desktopCapturer } = require("electron");
const { connectToTeacher, getSocket } = require("./socket");
const { startUsbMonitoring } = require("./usbMonitor");
const path = require('path'); 


let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false, 
            contextIsolation: true,
        },
    });

    mainWindow.loadURL("http://localhost:5174"); 

    ipcMain.handle("connect-to-teacher", (event, address) => {
        console.log("📡 Connecting to teacher...");
        connectToTeacher(address, mainWindow);
    });

    ipcMain.handle("capture-screen", async () => {
        try {
            return await desktopCapturer.getSources({ types: ["screen"] });
        } catch (error) {
            // console.error("⚠️ Error capturing screen");
            // throw error;
        }
    });

    ipcMain.on("sendScreen", (event, data) => {
        const socket = getSocket();
        if (socket && socket.connected) {
            socket.emit("screenData", data);
            // console.log("✅ Sent screen data.");
        } else {
            console.log("⚠️ No active socket connection!");
        }
    });

    ipcMain.on("register", (event, stu) => {
        const socket = getSocket();
        if (socket && socket.connected) {
            socket.emit("student-login", stu);
            console.log("✅ Registration ....");
        } else {
            console.log("⚠️ No active socket connection!");
        }
    });

  
    startUsbMonitoring(getSocket);
});
