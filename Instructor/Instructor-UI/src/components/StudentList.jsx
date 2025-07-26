import React, { useContext } from "react";
import { SocketContext } from "../socket/SocketProvider";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export default function StudentList() {
  const { students } = useContext(SocketContext);
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Registered Students</h2>

      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-blue-600 text-white text-left">
            <tr>
              <th className="py-3 px-4">S.No</th>
              <th className="py-3 px-4">Roll Number</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Joined Time</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((stu, index) => (
                <tr
                  key={stu.roll}
                  className="hover:bg-gray-50 border-t cursor-pointer"
                  onClick={() => navigate(`/student/${stu.roll}`)}
                >
                  <td className="py-2 px-4 text-center">{index + 1}</td>
                  <td className="py-2 px-4">{stu.roll}</td>
                  <td className="py-2 px-4">{stu.name}</td>
                  <td className="py-2 px-4">
                    {stu.timeStamp
                      ? dayjs(stu.timeStamp).format("DD/MM/YYYY HH:mm:ss")
                      : "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 px-4 text-center text-gray-500">
                  No students registered yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
