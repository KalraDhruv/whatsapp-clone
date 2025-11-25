const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Store rooms and their members
const rooms = new Map(); // roomId -> Set of socket IDs
const socketToUser = new Map(); // socket.id -> { username, rooms: Set }

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Handle user joining a room
  socket.on("join_room", (data) => {
    const { username, room } = data;
    
    // Join the socket.io room
    socket.join(room);

    // Track the room
    if (!rooms.has(room)) {
      rooms.set(room, new Set());
    }
    rooms.get(room).add(socket.id);

    // Track the user
    if (!socketToUser.has(socket.id)) {
      socketToUser.set(socket.id, { username, rooms: new Set() });
    }
    socketToUser.get(socket.id).rooms.add(room);

    // Notify others in the room
    socket.to(room).emit("user_joined", {
      username,
      message: `${username} has joined the room`,
      time: new Date().toLocaleTimeString(),
    });

    console.log(`User ${username} (${socket.id}) joined room: ${room}`);
    console.log(`Room ${room} now has ${rooms.get(room).size} members`);
  });

  // Handle sending messages
  socket.on("send_message", (data) => {
    const { room, author, message, time } = data;
    
    // Broadcast to all other users in the room
    socket.to(room).emit("receive_message", {
      room,
      author,
      message,
      time,
    });

    console.log(`Message in room ${room} from ${author}: ${message}`);
  });

  // Handle leaving a specific room
  socket.on("leave_room", (room) => {
    socket.leave(room);

    // Remove from room tracking
    if (rooms.has(room)) {
      rooms.get(room).delete(socket.id);
      if (rooms.get(room).size === 0) {
        rooms.delete(room);
      }
    }

    // Remove from user tracking
    if (socketToUser.has(socket.id)) {
      socketToUser.get(socket.id).rooms.delete(room);
    }

    const userData = socketToUser.get(socket.id);
    if (userData) {
      socket.to(room).emit("user_left", {
        username: userData.username,
        message: `${userData.username} has left the room`,
        time: new Date().toLocaleTimeString(),
      });
    }

    console.log(`User ${socket.id} left room: ${room}`);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);

    // Get user data before cleanup
    const userData = socketToUser.get(socket.id);

    // Clean up all rooms this user was in
    if (userData) {
      userData.rooms.forEach((room) => {
        if (rooms.has(room)) {
          rooms.get(room).delete(socket.id);
          if (rooms.get(room).size === 0) {
            rooms.delete(room);
          }
        }

        // Notify room members
        socket.to(room).emit("user_left", {
          username: userData.username,
          message: `${userData.username} has disconnected`,
          time: new Date().toLocaleTimeString(),
        });
      });
    }

    // Remove user from tracking
    socketToUser.delete(socket.id);
  });

  // Optional: Get room list (for future features)
  socket.on("get_rooms", (callback) => {
    const roomList = Array.from(rooms.keys()).map((roomId) => ({
      id: roomId,
      members: rooms.get(roomId).size,
    }));
    callback(roomList);
  });
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING ON PORT 3001");
});
