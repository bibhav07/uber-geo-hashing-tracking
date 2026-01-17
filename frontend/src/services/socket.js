// src/services/socket.js
import { io } from 'socket.io-client';

// If you are on localhost, this becomes http://localhost:4000
// If you are on AWS 54.123.45.67, this becomes http://54.123.45.67:4000
// We point to port 4000 (where our backend will run)
const URL =  `${window.location.protocol}//${window.location.hostname}:4000`;

export const socket = io(URL, {
  autoConnect: false // We connect manually in App.jsx
});