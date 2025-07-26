// Notifications.jsx

import React, { useContext } from "react";
import { NotificationsContext } from "./NotificationsContext";
import usbIcon from "../assets/usb.png"; // Example for USB events (adjust path accordingly)
import alertIcon from "../assets/forbidden.png"; // Example for black-visited (adjust path accordingly)

export default function Notifications() {
  const { notifications } = useContext(NotificationsContext);

  const getIconForType = (type) => {
    switch (type) {
      case "usb":
        return usbIcon;
      case "black-visited":
        return alertIcon;
      default:
        return alertIcon; // default generic icon
    }
  };

  return (
    <div className="fixed top-4 right-4 flex flex-col gap-3 z-50">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className="bg-white border-l-4 border-blue-600 shadow-md rounded p-4 flex items-center gap-3 w-72 animate-slide-in-right"
        >
          <img
            src={getIconForType(notif.type)}
            alt={`${notif.type} icon`}
            className="w-8 h-8"
          />

          <div>
            <p className="font-bold text-gray-800">{notif.roll}</p>
            <p className="text-sm text-gray-600">{notif.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
