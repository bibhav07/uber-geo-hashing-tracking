const redis = require('../config/redis');
const ngeohash = require('ngeohash');

// Precision 6 = ~1.2km x 0.6km buckets
const GEO_PRECISION = 6;

class LocationService {

    /**
     * UPDATES a driver's location.
     * Handles the complex logic of moving them between Grid Buckets.
     */
    async updateDriverLocation(driverId, lat, lon) {
        // 1. Calculate new Geohash
        const newGeohash = ngeohash.encode(lat, lon, GEO_PRECISION);
        
        const driverKey = `driver:${driverId}`;

        // 2. Fetch old location to check if they crossed a boundary
        const oldData = await redis.hgetall(driverKey);
        const oldGeohash = oldData.geohash;

        const pipeline = redis.pipeline();

        // 3. THE "BUCKET SWITCH" LOGIC
        if (oldGeohash && oldGeohash !== newGeohash) {
            // Driver crossed the line!
            console.log(`[GRID] Driver ${driverId} moved ${oldGeohash} -> ${newGeohash}`);
            
            // Remove from old bucket
            pipeline.srem(`grid:${oldGeohash}`, driverId);
            // Add to new bucket
            pipeline.sadd(`grid:${newGeohash}`, driverId);
        } else if (!oldGeohash) {
            // New driver just appeared
            console.log(`[GRID] New Driver ${driverId} added to ${newGeohash}`);
            pipeline.sadd(`grid:${newGeohash}`, driverId);
        }

        // 4. Update the precise location (State)
        pipeline.hset(driverKey, {
            lat,
            lon,
            geohash: newGeohash,
            lastUpdate: Date.now()
        });

        // Set expiry (Auto-offline after 60s of inactivity)
        pipeline.expire(driverKey, 60);

        await pipeline.exec();
        
        return { geohash: newGeohash };
    }

    /**
     * FINDS nearby drivers for a Rider.
     * Queries the Rider's bucket + 8 neighbors.
     */
    async findNearbyDrivers(lat, lon) {
        const centerHash = ngeohash.encode(lat, lon, GEO_PRECISION);
        
        // Get the 8 neighbors (North, South, East, West, Diagonals)
        const neighbors = ngeohash.neighbors(centerHash);
        const searchKeys = [centerHash, ...neighbors].map(k => `grid:${k}`);

        // Get all Driver IDs from these 9 buckets
        // pipeline.sunion combines multiple sets into one list
        const driverIds = await redis.sunion(...searchKeys);

        if (driverIds.length === 0) return [];

        // Fetch details for found drivers
        const drivers = [];
        const pipeline = redis.pipeline();
        
        driverIds.forEach(id => {
            pipeline.hgetall(`driver:${id}`);
        });

        const results = await pipeline.exec();

        results.forEach(([err, data], index) => {
            if (data && data.lat) {
                drivers.push({
                    id: driverIds[index],
                    lat: parseFloat(data.lat),
                    lon: parseFloat(data.lon),
                    geohash: data.geohash
                });
            }
        });

        return drivers;
    }
    
    // Helper to clear data (for restarting demo)
    async clearAll() {
        await redis.flushall();
    }
}

module.exports = new LocationService();