import React, { useContext, useState } from "react";
import { SocketContext } from "../socket/SocketProvider";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const Violations = () => {
  const { violations } = useContext(SocketContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("ALL");
  const navigate = useNavigate();

  const filteredViolations = violations.filter((v) => {
    const matchesSearch =
      v.roll.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === "ALL" ||
      (filter === "USB" && v.type === "usb") ||
      (filter === "SITE" && v.type === "siteVisit");

    return matchesSearch && matchesFilter;
  });

  const handleNavigate = (roll) => {
    navigate(`/student/${roll}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white rounded shadow">
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search by Roll No or Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-3 py-2 w-1/3 focus:outline-none focus:ring focus:border-blue-300"
        />

        <div className="flex bg-gray-100 rounded overflow-hidden">
          {["ALL", "USB", "SITE"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 text-sm font-medium ${
                filter === type ? "bg-green-400 text-white" : "text-gray-700"
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
              <th className="px-4 py-2 text-left">Roll No</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Action</th>
              <th className="px-4 py-2 text-left">Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredViolations.length > 0 ? (
              filteredViolations.map((v) => (
                <tr key={v.timestamp} className="border-t">
                  <td
                    className="px-4 py-2 text-blue-600 hover:underline cursor-pointer"
                    onClick={() => handleNavigate(v.roll)}
                  >
                    {v.roll}
                  </td>
                  <td
                    className="px-4 py-2 text-blue-600 hover:underline cursor-pointer"
                    onClick={() => handleNavigate(v.roll)}
                  >
                    {v.name}
                  </td>
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
                <td className="px-4 py-2 text-center" colSpan="5">
                  No violations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Violations;
