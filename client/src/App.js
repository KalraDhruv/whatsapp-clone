import "./App.css";
import { useState } from "react";
import RoomManager from "./components/RoomManager";
import ChatWindow from "./components/ChatWindow";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [showLogin, setShowLogin] = useState(true);
  const [activeRooms, setActiveRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);

  const joinRoom = () => {
    if (username !== "") {
      setShowLogin(false);
    }
  };

  const handleCreateRoom = () => {
    const roomId = `Room ${activeRooms.length + 1}`;
    const newRoom = {
      id: roomId,
      name: `Room ${activeRooms.length + 1}`,
      unreadCount: 0,
    };

    socket.emit("join_room", { username, room: roomId });
    setActiveRooms([...activeRooms, newRoom]);
    setCurrentRoom(roomId);
  };

  const handleJoinRoom = (roomId) => {
    // Check if room already exists
    const existingRoom = activeRooms.find((r) => r.id === roomId);
    if (existingRoom) {
      setCurrentRoom(roomId);
      return;
    }

    const newRoom = {
      id: roomId,
      name: roomId,
      unreadCount: 0,
    };

    socket.emit("join_room", { username, room: roomId });
    setActiveRooms([...activeRooms, newRoom]);
    setCurrentRoom(roomId);
  };

  const handleCloseRoom = (roomId) => {
    socket.emit("leave_room", roomId);
    const updatedRooms = activeRooms.filter((r) => r.id !== roomId);
    setActiveRooms(updatedRooms);
    
    if (currentRoom === roomId) {
      setCurrentRoom(updatedRooms.length > 0 ? updatedRooms[0].id : null);
    }
  };

  const handleRoomClick = (roomId) => {
    setCurrentRoom(roomId);
    // Reset unread count
    setActiveRooms(
      activeRooms.map((room) =>
        room.id === roomId ? { ...room, unreadCount: 0 } : room
      )
    );
  };

  const handleNewMessage = (roomId) => {
    // Increment unread count if not current room
    if (roomId !== currentRoom) {
      setActiveRooms(
        activeRooms.map((room) =>
          room.id === roomId
            ? { ...room, unreadCount: room.unreadCount + 1 }
            : room
        )
      );
    }
  };

  return (
    <div className="App">
      <div className="bg"></div>
      <div className="app-container">
        {showLogin ? (
          <div className="login-container">
            <div className="login-box">
              <h1>Join Chat</h1>
              <input
                type="text"
                placeholder="Enter your name..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    joinRoom();
                  }
                }}
              />
              <button onClick={joinRoom}>Enter</button>
            </div>
          </div>
        ) : (
          <>
            <RoomManager
              activeRooms={activeRooms}
              currentRoom={currentRoom}
              onCreateRoom={handleCreateRoom}
              onJoinRoom={handleJoinRoom}
              onRoomClick={handleRoomClick}
              onCloseRoom={handleCloseRoom}
            />
            <div className="chat-windows-container">
              {activeRooms.map((room) => (
                <ChatWindow
                  key={room.id}
                  room={room}
                  username={username}
                  socket={socket}
                  isActive={currentRoom === room.id}
                  onNewMessage={handleNewMessage}
                  onClose={handleCloseRoom}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
