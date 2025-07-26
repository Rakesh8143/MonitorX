import React, { useContext, useState, useMemo } from "react";
import { SocketContext } from "../socket/SocketProvider";
import { useNavigate } from "react-router-dom";
import { ArrowsPointingOutIcon, XMarkIcon } from "@heroicons/react/24/solid";

const StudentScreen = React.memo(({ roll, name, image, onFullScreenClick, navigateToStudent }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center border border-gray-200 relative">
      <button
        onClick={() => onFullScreenClick(image)}
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        title="Full Screen"
      >
        <ArrowsPointingOutIcon className="h-6 w-6" />
      </button>

      <h3
        className="text-lg font-semibold mb-2 text-blue-700 hover:underline cursor-pointer"
        onClick={() => navigateToStudent(roll)}
      >
        {roll} - {name}
      </h3>

      <img
        src={image}
        alt={`${roll} screen`}
        className="w-full object-contain rounded border"
      />
    </div>
  );
});

export default function ScreenList() {
  const { screens, students } = useContext(SocketContext);
  const [search, setSearch] = useState("");
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === "Escape") setFullScreenImage(null);
  };

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter((stu) => {
      const lower = search.toLowerCase();
      return stu.roll.toLowerCase().includes(lower) || stu.name.toLowerCase().includes(lower);
    });
  }, [search, students]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Live Screens</h2>

      <input
        type="text"
        placeholder="Search by roll or name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {filteredStudents.length === 0 ? (
        <p className="text-gray-600">No matching students found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredStudents.map((stu) => (
            <StudentScreen
              key={stu.roll}
              roll={stu.roll}
              name={stu.name}
              image={screens[stu.roll]}
              onFullScreenClick={setFullScreenImage}
              navigateToStudent={(roll) => navigate(`/student/${roll}`)}
            />
          ))}
        </div>
      )}

      {fullScreenImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <button
            onClick={() => setFullScreenImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <XMarkIcon className="h-8 w-8" />
          </button>
          <img src={fullScreenImage} alt="Full Screen View" className="max-w-full max-h-full rounded shadow-lg" />
        </div>
      )}
    </div>
  );
}
