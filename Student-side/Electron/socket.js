const io = require("socket.io-client");
const { shutdownComputer } = require("./systemFuncs");
const monitorWindow = require("./monitorWindow");

let socket = null;
let blacklist = [];
let winMonitor = null;

/**
 * Connects to the teacher server and sets up all socket events.
 * @param {string} address - Teacher server address
 * @param {BrowserWindow} window - Electron BrowserWindow instance to send status updates
 */
function connectToTeacher(address, window) {
  console.log("🔗 Connecting to teacher at:", address);

  if (socket) {
    console.log("🔄 Disconnecting old socket...");
    socket.disconnect();
  }

  socket = io(address, { transports: ["websocket"] });

  socket.on("connect", () => {
    console.log("✅ Connected to teacher!");
    window.webContents.send("status", true);

    if(!winMonitor) {
      console.log("🟢 Initializing window monitor with blacklist");
      winMonitor = monitorWindow(() => blacklist, () => socket);
    }

  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected from server.");
    window.webContents.send("status", false);
    if(winMonitor) {
      winMonitor.stopMonitoring();
      winMonitor = null; // Clear for fresh init on next connect
    }
  });

  socket.on("connect_error", (err) => {
    console.log("❌ Connection Error:", err.message);
    window.webContents.send("status", false);
  });
  socket.on("Monitor-on",(newList)=>{
      blacklist = newList;
      console.log("🟢 Starting window monitoring with blacklist:", blacklist);
      if(winMonitor) {
        winMonitor.startMonitoring();
      }
  })
  socket.on("Monitor-off",()=>{
      if(winMonitor) {
        winMonitor.stopMonitoring();
      }
  });
  socket.on("poweroff", () => {
    console.log("🛑 Received power-off command from teacher.");
    shutdownComputer();
  });

  socket.on("registered", () => {
    window.webContents.send("registered", true);
  });
}

/**
 * Getter for current socket instance
 * @returns {Socket} - Current socket.io-client instance
 */
function getSocket() {
  return socket;
}

module.exports = { connectToTeacher, getSocket };
