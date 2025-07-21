import { io } from "socket.io-client";

const socket = io("https://gigo-tracker.onrender.com"); // Update with your backend URL

export default socket;
