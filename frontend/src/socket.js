import { io } from "socket.io-client";

// const URL = "https://casino-6w78.onrender.com"; // eskills
const URL = "https://casino-pet4.onrender.com"; // Roulette worlds
// const URL = "http://localhost:8080"; // your backend URL
export const socket = io(URL, { autoConnect: false });
