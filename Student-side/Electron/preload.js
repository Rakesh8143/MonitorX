const { contextBridge, ipcRenderer } = require("electron");

// Expose only safe APIs to the renderer
contextBridge.exposeInMainWorld("electronAPI", {
  // The renderer should implement screen capture logic using captureScreen
  captureScreen: () => ipcRenderer.invoke("capture-screen"),
  sendScreenData: (data) => ipcRenderer.send("sendScreen", data),
  sendInfo: (stu) => ipcRenderer.send("register", stu),
  onRegister: (callback) => ipcRenderer.on("registered", (_, data) => callback(data)),
  onServerMessage: (callback) => ipcRenderer.on("server-message", (_, data) => callback(data)),
  status: (callback) => ipcRenderer.on("status", (_, data) => callback(data)),
  connectToTeacher: (address) => ipcRenderer.invoke("connect-to-teacher", address),
  removeServerMessageListener: () => ipcRenderer.removeAllListeners("server-message"),
  removeStatusListener: () => ipcRenderer.removeAllListeners("status"),
  removeRegisterListener: () => ipcRenderer.removeAllListeners("registered")
});
