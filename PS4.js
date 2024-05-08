const express = require('express');
const redis = require('redis');
const axios = require('axios');
const app = express();
const port = 3000;

// Connect to Redis
const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
});
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();

// Middleware to parse JSON bodies
app.use(express.json());


// POST route with Redis caching
app.post('/data', async (req, res) => {
    const apiUrl = 'https://api.thirdparty.com/data'; // URL of the third-party API
    const cacheKey = 'apiData';

    try {
        // Check cache first
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            console.log('Serving from cache');
            return res.json({ data: JSON.parse(cachedData), fromCache: true });
        }

        // Fetch from API if not cached
        const apiResponse = await axios.get(apiUrl);
        await redisClient.setEx(cacheKey, 15, JSON.stringify(apiResponse.data)); // Cache with a 15-second timeout
        console.log('Serving from API and caching the response');
        res.json({ data: apiResponse.data, fromCache: false });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
