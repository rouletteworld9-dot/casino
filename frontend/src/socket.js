import { io } from "socket.io-client";

const URL = "https://casino-6w78.onrender.com"; // your backend URL
export const socket = io(URL, { autoConnect: false });
