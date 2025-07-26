import React, { useContext, useState } from 'react';
import { SocketContext } from '../socket/SocketProvider';

const Connect = () => {
  const { connectSocket } = useContext(SocketContext);
  const [serverUrl, setServerUrl] = useState("");
  const [port, setPort] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullUrl = `${serverUrl}:${port}`;
    setError("");
    connectSocket(fullUrl, (errMsg) => {
      setError(`Failed to connect: ${errMsg}`);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-200">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Connect to Server</h1>
          {error && (
            <p className="mb-4 text-center text-red-600 font-medium">{error}</p>
          )}
          <div>
            <label htmlFor="serverUrl" className="block text-sm font-semibold text-gray-700 mb-1">Server URL</label>
            <input
              type="text"
              name="serverUrl"
              id="serverUrl"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="port" className="block text-sm font-semibold text-gray-700 mb-1">Port</label>
            <input
              type="number"
              name="port"
              id="port"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition"
          >
            Connect
          </button>
        </form>
      </div>
    </div>
  );
};

export default Connect;
