import { useState } from "react";

function RoomManager({
  activeRooms,
  currentRoom,
  onCreateRoom,
  onJoinRoom,
  onRoomClick,
  onCloseRoom,
}) {
  const [roomIdToJoin, setRoomIdToJoin] = useState("");

  const handleJoinRoom = () => {
    if (roomIdToJoin.trim() !== "") {
      onJoinRoom(roomIdToJoin.trim());
      setRoomIdToJoin("");
    }
  };

  return (
    <div className="room-manager">
      <h2>Chat Rooms</h2>

      <div className="room-controls">
        <button onClick={onCreateRoom}>Create New Room</button>
      </div>

      <ul className="room-list">
        {activeRooms.length === 0 ? (
          <li style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", padding: "10px" }}>
            No active rooms. Create or join one!
          </li>
        ) : (
          activeRooms.map((room) => (
            <li
              key={room.id}
              className={`room-item ${currentRoom === room.id ? "active" : ""}`}
              onClick={() => onRoomClick(room.id)}
            >
              <div>
                <div style={{ fontWeight: "bold", marginBottom: "3px" }}>
                  {room.name}
                </div>
                <div style={{ fontSize: "9px", opacity: 0.7 }}>
                  {room.id}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {room.unreadCount > 0 && (
                  <div className="room-badge">{room.unreadCount}</div>
                )}
                <button
                  className="close-room-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseRoom(room.id);
                  }}
                >
                  ×
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      <div className="join-room-section">
        <h3 style={{ fontSize: "12px", marginBottom: "10px" }}>Join Existing Room</h3>
        <div className="room-controls">
          <input
            type="text"
            placeholder="Enter room ID..."
            value={roomIdToJoin}
            onChange={(e) => setRoomIdToJoin(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleJoinRoom();
              }
            }}
          />
          <button onClick={handleJoinRoom}>Join</button>
        </div>
      </div>
    </div>
  );
}

export default RoomManager;
