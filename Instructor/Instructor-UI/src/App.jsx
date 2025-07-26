import React from 'react'
import { useContext } from 'react'
import { SocketContext } from './socket/SocketProvider'
import Connect from './components/Connect'
import Login from './components/Login'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import StudentList from "./components/StudentList";
import ScreenList from "./components/ScreenList";
import StudentData from "./components/StudentData";
import Notifications from './components/Notifications'
import Violations from './components/Violations'


const App = () => {
  const { loggedIn, socket } = useContext(SocketContext);

  return (
    <>
      {!socket ? (
        <Connect />
      ) : !loggedIn ? (
        <Login />
      ) : (
        <>
        <Notifications />
        <Router>
          <NavBar />
          <div className="p-4">
            <Routes>
              <Route path="/students" element={<StudentList />} />
              <Route path="/screens" element={<ScreenList />} />
              <Route path="/student/:roll" element={<StudentData />} />
              <Route path="/violations" element={<Violations />} />
              <Route path="*" element={<Navigate to="/students" replace />} />
            </Routes>
          </div>
        </Router>
        </>
      )}
    </>
  )
}

export default App
