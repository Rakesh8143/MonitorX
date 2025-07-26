import React, { createContext, useContext, useState } from "react";
import { io } from "socket.io-client";
import { NotificationsContext } from "../components/NotificationsContext.jsx";
const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [students, setStudents] = useState([]);
  const [usbLogs, setUsbLogs] = useState([]);
  const [screens, setScreens] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [violations, setViolations] = useState([]);
  const { addNotification } = useContext(NotificationsContext);

  const connectSocket = (url, onError) => {
    if (socket) {
      socket.disconnect();
    }

    const newSocket = io(url, { reconnectionAttempts: 3, timeout: 5000 });

    newSocket.on("connect", () => {
      console.log("Connected to server:", url);
    });

    newSocket.on("stu-data", (data) => {
      setStudents([...data]);
    });

    newSocket.on("usb-event", ({ roll, event, name }) => {
      const timestamp = new Date();
      const violation = {
        type: "usb",
        roll,
        name,
        msg: `USB ${event} detected`,
        timestamp,
      };
      setViolations((prev) => [violation, ...prev]);
      addNotification({
        type: "usb",
        roll,
        message: violation.msg,
      });
      setUsbLogs((prev) => {
        if (event === "inserted") {
          return [{ roll, inserted: timestamp, removed: null }, ...prev];
        } else {
          return prev.map((log) =>
            log.roll === roll && !log.removed
              ? { ...log, removed: timestamp }
              : log
          );
        }
      });
    });

    newSocket.on("black-visited", ({ roll, keyword, name }) => {
      const timestamp = new Date();
      const violation = {
        type: "siteVisit",
        roll,
        name,
        msg: `Visited blacklisted keyword: ${keyword}`,
        timestamp,
      };
      setViolations((prev) => [violation, ...prev]);
      addNotification({
        type: "black",
        roll,
        message: violation.msg,
      });
    });

    newSocket.on("screen-update", ({ roll, image }) => {
      setScreens((prev) => ({
        ...prev,
        [roll]: image,
      }));
    });

    newSocket.on("disconnect", (reason) => {
      console.warn("Socket disconnected:", reason);
      setSocket(null);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
      onError && onError(err.message);
      setSocket(null);
      newSocket.disconnect();
    });

    setSocket(newSocket);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        students,
        usbLogs,
        screens,
        loggedIn,
        setLoggedIn,
        connectSocket,
        violations,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export { SocketContext };
