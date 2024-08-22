const express = require('express');
const cors = require('cors');
const fetch = require('cross-fetch');

const app = express();
const port = process.env.PORT || 3000;

// Initialize cache
const cache = new Map();
const CACHE_EXPIRY = 5 * 60 * 1000; // Cache expiry time in milliseconds (e.g., 5 minutes)

app.use(cors());

// Function to fetch and cache data
async function fetchData(url) {
    if (cache.has(url)) {
        const cachedData = cache.get(url);
        if (Date.now() - cachedData.timestamp < CACHE_EXPIRY) {
            return cachedData.data; // Return cached data if not expired
        } else {
            cache.delete(url); // Remove expired data from cache
        }
    }

    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
        }
    });

    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();
    cache.set(url, { data, timestamp: Date.now() }); // Cache the response
    return data;
}

// For Restaurant API
app.get('/api/restaurants', async (req, res) => {
    try {
        const { lat, lng, page_type } = req.query;
        const url = `https://www.swiggy.com/dapi/restaurants/list/v5?lat=${lat}&lng=${lng}&page_type=${page_type}`;
        const data = await fetchData(url);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching restaurant data');
    }
});

// For Menu API
app.get('/api/menu', async (req, res) => {
    try {
        const { 'page-type': page_type, 'complete-menu': complete_menu, lat, lng, submitAction, restaurantId } = req.query;
        const url = `https://www.swiggy.com/dapi/menu/pl?page-type=${page_type}&complete-menu=${complete_menu}&lat=${lat}&lng=${lng}&submitAction=${submitAction}&restaurantId=${restaurantId}`;
        const data = await fetchData(url);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching menu data');
    }
});

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ "message": "Welcome to FoodFire! Server is running." });
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
