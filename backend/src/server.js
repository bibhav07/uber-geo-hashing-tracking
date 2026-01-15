const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const LocationService = require('./services/LocationService');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow Frontend to connect
        methods: ["GET", "POST"]
    }
});

// Reset Redis on startup so we start fresh every time
LocationService.clearAll();

io.on('connection', (socket) => {
    console.log(`🔌 Client Connected: ${socket.id}`);

    // --- 1. DRIVER SENDS LOCATION ---
    socket.on('driver_update', async (data) => {
        const { id, lat, lon } = data;
        
        // Save to Redis
        const result = await LocationService.updateDriverLocation(id, lat, lon);
        
        // Broadcast to ALL clients (so Riders can see the car move)
        io.emit('driver_moved', {
            id,
            lat,
            lon,
            geohash: result.geohash
        });
    });

    // --- 2. RIDER LOOKS FOR DRIVERS ---
    socket.on('find_drivers', async (data) => {
        console.log("find_drivers");
        
        const { lat, lon } = data;
        const drivers = await LocationService.findNearbyDrivers(lat, lon);
        
        // Send results ONLY to the requesting rider
        socket.emit('nearby_drivers', drivers);
    });


    // --- 3. RIDER REQUESTS A DRIVER ---
    socket.on('request_ride', ({ driverId, riderLoc }) => {
        console.log(`[RIDE] Request for Driver ${driverId}`);
        // Broadcast to everyone (simplified) or specific driver
        io.emit('ride_requested', { driverId, riderLoc });
    });

    socket.on('disconnect', () => {
        console.log(`❌ Client Disconnected: ${socket.id}`);
    });
});

const PORT = 4000;
server.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
});