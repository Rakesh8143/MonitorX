import React from 'react'
import { useContext } from 'react'
import { SocketContext } from '../socket/SocketProvider'
const Login = () => {
    const { socket, setLoggedIn, setLabMode } = useContext(SocketContext);
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        if (socket && username && password) {
            socket.emit("teacher-login", { username, password }, (response) => {
                if (response.success) {
                    setLoggedIn(true);
                    setLabMode(true); // Set LabMode to true on successful login
                    socket.emit("LabMode-on", true); // Notify server about LabMode
                } else {
                    setError(response.message || "Login failed. Please try again.");
                    console.error("Login error: ", response.message);
                }
            });
        } else {
            setError("Please enter both username and password.");
            console.error("Login error: ", error);
        }
    };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">Instructor Login</h1>
        {error && (
          <p className="mb-4 text-center text-red-600 font-medium">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              type="text"
              name="username"
              id="username"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              name="password"
              id="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
