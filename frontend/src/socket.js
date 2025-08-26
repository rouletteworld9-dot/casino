import { io } from "socket.io-client";

// const URL = "https://casino-6w78.onrender.com"; // your backend URL
const URL = "http://localhost:8080"; // your backend URL
export const socket = io(URL, { autoConnect: false });
