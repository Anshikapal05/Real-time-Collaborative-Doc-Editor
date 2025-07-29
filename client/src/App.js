import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './App.css';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState("");
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState(searchParams.get("room") || "");
  const socketRef = useRef(null);

  useEffect(() => {
    if (!joined || !username || !roomId) return;

    const ws = new WebSocket(`ws://localhost:5000`);
    socketRef.current = ws;
    setSocket(ws);

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'join', roomId, username }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case 'init':
          setDocument(message.data);
          break;
        case 'update':
          setDocument(message.data);
          setLastUpdated(new Date().toLocaleTimeString());
          break;
        case 'user_list':
          setOnlineUsers(message.users || []);
          break;
        default:
          console.warn("Unknown message type", message);
      }
    };

    ws.onclose = () => console.log('WebSocket closed');

    return () => ws.close();
  }, [joined, username, roomId]);

  const handleChange = (e) => {
    const newDoc = e.target.value;
    setDocument(newDoc);
    setLastUpdated(new Date().toLocaleTimeString());

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'update',
        roomId,
        data: newDoc
      }));
    }
  };

  const handleCreateRoom = () => {
  if (roomId.trim()) {
    setSearchParams({ room: roomId });
  }
};


  const handleJoin = () => {
    if (username.trim() && roomId.trim()) setJoined(true);
  };

  if (!joined) {
    return (
      <div className="App">
        <h2>Join or Create a Room</h2>
        <input
          type="text"
          placeholder="Your Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div>
          <input
            type="text"
            placeholder="Enter Room ID or create one"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button onClick={handleCreateRoom}>Create Room</button>
        </div>
        <button onClick={handleJoin}>Join Room</button>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>📄 Real-time Collaborative Editor</h1>
      <div className="info-bar">
        👤 <strong>{username}</strong> | 🏷️ Room: {roomId} | 🟢 Online: {onlineUsers.length} | 🕒 Last edit: {lastUpdated || "N/A"}
      </div>
      <textarea
        value={document}
        onChange={handleChange}
        placeholder="Start typing..."
      />
      <div className="user-list">
        <h4>👥 Online Users:</h4>
        <ul>
          {onlineUsers.map((user, i) => (
            <li key={i}>{user}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
