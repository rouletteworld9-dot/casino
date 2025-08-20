import { io } from "socket.io-client";

const URL = "http://localhost:8080"; // your backend URL
export const socket = io(URL, { autoConnect: false });
