const usb = require("usb");

let previousDeviceIds = new Set();


function isMassStorage(device) {
  const desc = device.deviceDescriptor;

  if (desc.bDeviceClass === 0x08) {
    return true;
  }
  const config = device.configDescriptor;
  if (config?.interfaces) {
    return config.interfaces.some((ifaceArray) =>
      ifaceArray.some((iface) => iface.bInterfaceClass === 0x08)
    );
  }

  return false;
}

function getMassStorageDevices() {
  return usb.getDeviceList()
    .filter(isMassStorage)
    .map(d => ({
      vendorId: d.deviceDescriptor.idVendor,
      productId: d.deviceDescriptor.idProduct,
      key: `${d.deviceDescriptor.idVendor}:${d.deviceDescriptor.idProduct}`
    }));
}

function startUsbMonitoring(getSocket) {
  console.log("🔍 Starting USB polling-based monitoring...");

  setInterval(() => {
    const socket = getSocket();
    const currentDevices = getMassStorageDevices();
    const currentIds = new Set(currentDevices.map(d => d.key));

    currentDevices.forEach(device => {
      if (!previousDeviceIds.has(device.key)) {
        console.log("🟢 Mass Storage USB inserted:", device);
        if (socket && socket.connected) {
          socket.emit("usb-event", {
            type: "inserted",
            device,
          });
        }
      }
    });

    previousDeviceIds.forEach(key => {
      if (!currentIds.has(key)) {
        const [vendorId, productId] = key.split(":");
        console.log("🔴 Mass Storage USB removed:", { vendorId, productId });
        if (socket && socket.connected) {
          socket.emit("usb-event", {
            type: "removed",
            device: { vendorId, productId },
          });
        }
      }
    });

    previousDeviceIds = currentIds;
  }, 3000); 
}

module.exports = { startUsbMonitoring };
