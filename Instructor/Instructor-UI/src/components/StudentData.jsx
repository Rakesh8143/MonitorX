import React, { useContext, useState, useMemo } from "react";
import { SocketContext } from "../socket/SocketProvider";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

export default function StudentData() {
  const { students, screens, violations, socket } = useContext(SocketContext);
  const { roll } = useParams();
  const [filter, setFilter] = useState("ALL");

  const student = students.find((stu) => stu.roll === roll);
  const screen = screens[roll];

  const studentViolations = useMemo(() => {
    return violations.filter((v) => {
      const isMatch = v.roll === roll;
      const matchesFilter =
        filter === "ALL" ||
        (filter === "USB" && v.type === "usb") ||
        (filter === "SITE" && v.type === "siteVisit");

      return isMatch && matchesFilter;
    });
  }, [violations, roll, filter]);

  const handleShutdown = () => {
    if (socket && socket.connected) {
      socket.emit("power-off", { roll });
      console.log(`Sent power-off command to ${roll}`);
    } else {
      console.warn("Socket not connected. Cannot send power-off command.");
    }
  };

  if (!student)
    return <p className="p-6 text-red-600 font-semibold">Student not found</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-700">Student Details</h2>
        <button
          onClick={handleShutdown}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow"
        >
          Shutdown
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p>
            <span className="font-semibold">Roll No:</span> {student.roll}
          </p>
          <p>
            <span className="font-semibold">Name:</span> {student.name}
          </p>
          <p>
            <span className="font-semibold">Joined:</span>{" "}
            {dayjs(student.timeStamp).format("DD/MM/YYYY HH:mm:ss")}
          </p>
        </div>

        {screen && (
          <div>
            <img
              src={screen}
              alt={`${student.roll} screen`}
              className="rounded border shadow w-full object-contain"
            />
          </div>
        )}
      </div>

      <h3 className="text-xl font-semibold mb-2">Violations</h3>

      <div className="flex items-center justify-between mb-4">
        <div className="flex bg-gray-100 rounded overflow-hidden">
          {["ALL", "USB", "SITE"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 text-sm font-medium ${
                filter === type ? "bg-blue-600 text-white" : "text-gray-700"
              }`}
            >
              {type === "SITE" ? "Site" : type}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Action</th>
              <th className="px-4 py-2 text-left">Time</th>
            </tr>
          </thead>
          <tbody>
            {studentViolations.length > 0 ? (
              studentViolations.map((v) => (
                <tr key={v.timestamp} className="border-t">
                  <td className="px-4 py-2 capitalize">
                    {v.type === "siteVisit" ? "Site Visit" : "USB"}
                  </td>
                  <td className="px-4 py-2">{v.msg}</td>
                  <td className="px-4 py-2">
                    {dayjs(v.timestamp).format("DD/MM/YYYY HH:mm:ss")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="px-4 py-2 text-center text-gray-500"
                  colSpan="3"
                >
                  No violations recorded.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
