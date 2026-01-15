const Redis = require('ioredis');

// Connect to localhost:6379 (standard Redis port)
const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: 6379,
});

redis.on('connect', () => console.log('✅ Connected to Redis'));
redis.on('error', (err) => console.error('❌ Redis Error:', err));

module.exports = redis;