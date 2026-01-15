// src/services/socket.js
import { io } from 'socket.io-client';

// We point to port 4000 (where our backend will run)
const URL = 'http://localhost:4000';

export const socket = io(URL, {
  autoConnect: false // We connect manually in App.jsx
});