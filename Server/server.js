
import { Server } from "socket.io";

const io = new Server(5000, {
  cors: { origin: "*" },
});

const username = "teacher";
const password = "password";
let LabMode = false;
let ExamMode = false;
const students = new Map();
const socketToRoll = new Map();
let teacher = null;
const blacklist1 = ["facebook", "whatsapp", "discord", "game", "youtube", "instagram", "tiktok", "reddit", "twitter"];
const blacklist2 = ["facebook", "whatsapp", "discord", "game","chatgpt","gemini", "youtube", "instagram", "tiktok", "reddit", "twitter"];
function updateTeacher() {
  if (teacher) {
    const minimalStudents = Array.from(students.values()).map(s => ({
      roll: s.roll,
      name: s.name,
      timeStamp: new Date().toISOString(),
    })).sort((a, b) => a.roll.localeCompare(b.roll));
    io.to(teacher).emit("stu-data", minimalStudents);
  }
}

io.on("connection", (socket) => {
  console.log("📡 Client connected:", socket.id);
  socket.on("teacher-login", ({ username: user, password: pass }, callback) => {
    if (user === username && pass === password) {
      teacher = socket.id;
      callback({ success: true });
      console.log("🎓 Teacher logged in:", teacher);
      io.to("students-room").emit("Monitor-on", blacklist1);
      updateTeacher();
    } else {
      callback({ success: false, message: "Invalid credentials" });
    }
  });
  socket.on("student-login", (stu) => {
    const studentObj = {
      socketId: socket.id,
      roll: stu.roll,
      name: stu.name,
      screen: null,
      usbLogs: [],
    };
    students.set(stu.roll, studentObj);
    socketToRoll.set(socket.id, stu.roll);
    socket.join("students-room");
    if (teacher) {
      socket.emit("Monitor-on", ExamMode ? blacklist2 : blacklist1);
    }
    console.log(`👨‍🎓 Student logged in: ${stu.roll}, ${stu.name}`);
    socket.emit("registered");
    updateTeacher();
  });
  socket.on("ExamMode", (mode) => {
    if(mode)
    {
      ExamMode = true;
      io.to("students-room").emit("Monitor-on", blacklist2);
    }
    else {
      ExamMode = false;
      io.to("students-room").emit("Monitor-on", blacklist1);
    }
  });
  socket.on("power-off", ({ roll }) => {
    const student = students.get(roll);
    if (student) {
      io.to(student.socketId).emit("poweroff");
      console.log(`🔌 Power-off command sent to ${roll}`);
    } else {
      console.warn(`⚠️ No student found with roll: ${roll}`);
    }
  });
  socket.on("black-visited", ({ keyword, title, app }) => {
  console.log(`🚨 Blacklisted window detected by ${socket.id}: ${keyword} in ${title}`);
  const roll = socketToRoll.get(socket.id);
  const student = students.get(roll);
  if (teacher && student) {
    io.to(teacher).emit("black-visited", {
      roll,
      keyword,
      name: student.name,
    });
  }
});
  socket.on("screenData", (data) => {
    const roll = socketToRoll.get(socket.id);
    if (roll && students.has(roll)) {
      students.get(roll).screen = data;
      if (teacher) {
        io.to(teacher).emit("screen-update", { roll, image: data });
      }
    }
  });
  socket.on("usb-event", ({ type, device }) => {
    const roll = socketToRoll.get(socket.id);
    if (roll && students.has(roll)) {
      const logEntry = { type, device, timestamp: new Date() };
      students.get(roll).usbLogs.push(logEntry);
      console.log(`🔌 USB ${type} by ${roll}`, device);
      if (teacher) {
        io.to(teacher).emit("usb-event", {
          roll,
          event: type,
          name: students.get(roll).name,
        });
      }
    }
  });
  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);
    const roll = socketToRoll.get(socket.id);
    if (roll) {
      students.delete(roll);
      console.log(`🗑️ Removed student ${roll} due to disconnect.`);
    }
    socketToRoll.delete(socket.id);
    updateTeacher();
  });
});
console.log("📡 WebSocket server running on port 5000...");
