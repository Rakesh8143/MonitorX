import { useEffect, useState, useRef } from "react";
import startScreenCapture from "./screenCapture.js";

export default function App() {
  const [address, setAddress] = useState("");
  const [connected, setConnected] = useState(false);
  const [valid, setValid] = useState(true);
  const [logged, setLog] = useState(false);
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");

  const captureIntervalRef = useRef(null);


  useEffect(() => {
    const registerHandler = (data) => setLog(data);
    window.electronAPI.onRegister(registerHandler);
    const handleStatus = (data) => {
      setConnected(data);
      setValid(data);
      if (!data) {
        setLog(false);
      }
    };
    window.electronAPI.status(handleStatus);
    return () => {
      window.electronAPI.removeRegisterListener();
      window.electronAPI.removeStatusListener();
      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current);
      }
    };
  
  }, []);

  useEffect(() => {
    if (connected && logged) {
      startScreenCapture();
    } else {
      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current);
      }
    }
   
  }, [connected, logged]);

  return (
    <div>
      <h1>Hello Student</h1>
      {!valid && <p>Invalid address !!</p>}
      {!connected ? (
        <>
          <label htmlFor="address">Enter server address:</label>
          <input
            type="text"
            onChange={(event) => setAddress(event.target.value)}
            name="address"
            value={address}
          />
          <button onClick={() => window.electronAPI.connectToTeacher(address)}>Submit</button>
        </>
      ) : !logged ? (
        <div>
          <label htmlFor="roll">ROLL.NO:</label>
          <input type="text" name="roll" value={roll} onChange={(event) => setRoll(event.target.value)} />
          <label htmlFor="name">Name:</label>
          <input type="text" name="name" value={name} onChange={(event) => setName(event.target.value)} />
          <button onClick={() => window.electronAPI.sendInfo({roll,name})}>Login</button>
        </div>
      ) : (
        <div>
          <h2>Successfully Logged In!</h2>
        </div>
      )}
    </div>
  );
}
