// NotificationsContext.jsx

import React, { createContext, useState } from "react";

const NotificationsContext = createContext(null);

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now();
    const notifWithId = { id, ...notification };

    setNotifications((prev) => [...prev, notifWithId]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  return (
    <NotificationsContext.Provider value={{ notifications, addNotification}}>
      {children}
    </NotificationsContext.Provider>
  );
};

export { NotificationsContext };