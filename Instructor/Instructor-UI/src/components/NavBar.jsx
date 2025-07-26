import React from "react";
import { Link, useLocation } from "react-router-dom";
import ExamComp from "./ExamComp"; // Adjust the path if needed

export default function NavBar() {
  const location = useLocation();

  const linkClasses = (path) =>
    `px-4 py-2 rounded hover:bg-blue-100 ${
      location.pathname === path ? "bg-blue-200 text-blue-800 font-semibold" : "text-gray-700"
    }`;

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          <div className="flex space-x-4">
            <Link to="/students" className={linkClasses("/students")}>
              Students
            </Link>
            <Link to="/screens" className={linkClasses("/screens")}>
              Screens
            </Link>
            <Link to="/violations" className={linkClasses("/violations")}>
              Violations
            </Link>
          </div>

          {/* Add ExamComp here on the right */}
          {/* <ExamComp /> */}
        </div>
      </div>
    </nav>
  );
}
