// src/socket.js
import { io } from "socket.io-client";

// connect to backend
const socket = io("https://casino-6w78.onrender.com", {
  autoConnect: true,
  transports: ["websocket"],
});

export default socket;
