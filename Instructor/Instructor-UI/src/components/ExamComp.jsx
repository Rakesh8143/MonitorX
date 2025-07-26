import React, { useContext } from 'react';
import { SocketContext } from '../socket/SocketProvider';

const ExamComp = () => {
  const { ExamMode, setExamMode, socket } = useContext(SocketContext);

  const toggleExam = () => {
    setExamMode((prev) => {
      const newMode = !prev;
      if (socket && socket.connected) {
        socket.emit("ExamMode", newMode);
        console.log("ExamMode set to:", newMode);
      } else {
        console.warn("Socket not connected. Cannot toggle ExamMode.");
      }
      return newMode;
    });
  };

  return (
    <div className="flex items-center">
      <label htmlFor="exam-toggle" className="mr-2 text-sm font-medium text-gray-700">
        Exam Mode
      </label>
      <button
        id="exam-toggle"
        type="button"
        onClick={toggleExam}
        aria-pressed={ExamMode}
        className={`relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none transition-colors ${
          ExamMode ? 'bg-blue-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
            ExamMode ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

export default ExamComp;
