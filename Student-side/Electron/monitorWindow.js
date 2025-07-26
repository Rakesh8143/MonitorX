const { activeWindow } = require("get-windows");

function monitorWindow(getBlacklist, getSocket) {
    let monitoringIntervalId = null;
    let lastActiveTitle = null;

    async function monitor() {
        // console.log(" Monitoring active window...");
        try {
            const win = await activeWindow();
            if (!win) return;

            const title = win.title || "";
            const app = win.owner?.name || "";

            if (title !== lastActiveTitle) {
                console.log(`🪟 Active changed to: ${title}`);
                const socket = getSocket();
                const blacklist = getBlacklist();
                // console.log("blacklist:", blacklist);
                if (socket && socket.connected) {
                    const matched = blacklist.find(keyword =>
                        title.toLowerCase().includes(keyword)
                    );

                    if (matched) {
                        console.log(`🚨 Blacklisted keyword detected: ${matched}`);
                        socket.emit("black-visited", { keyword: matched, title, app });
                    }
                } else {
                    console.warn("⚠️ Socket disconnected, skipping emit.");
                }

                lastActiveTitle = title;
            }
        } catch (err) {
            console.error("Error reading active window:", err.message);
        }
    }

    function startMonitoring() {
        if (monitoringIntervalId) {
            console.warn("⚠️ Active window monitoring is already running.");
            return;
        }

        monitoringIntervalId = setInterval(monitor, 1000); // Poll every second
        console.log("🟢 Started active window monitoring.");
    }

    function stopMonitoring() {
        if (!monitoringIntervalId) {
            console.warn("⚠️ Active window monitoring was not running.");
            return;
        }

        clearInterval(monitoringIntervalId);
        monitoringIntervalId = null;
        lastActiveTitle = null; 
        console.log("🔴 Stopped active window monitoring.");
    }

    return {
        startMonitoring,
        stopMonitoring
    };
}

module.exports =  monitorWindow ;
