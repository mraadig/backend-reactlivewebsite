const express = require('express');
const cors = require('cors');
const fetch = require('cross-fetch');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

// For Restaurant API
app.get('/dapi/restaurants/list/v5', async (req, res) => {
    const { lat, lng, page_type } = req.query;
    console.log(req.query);

    const url = `https://www.swiggy.com/dapi/restaurants/list/v5?lat=${lat}&lng=${lng}&page_type=${page_type}`;

    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

// For Menu API
app.get('/dapi/menu/pl', async (req, res) => {
    const { 'page-type': page_type, 'complete-menu': complete_menu, lat, lng, submitAction, restaurantId } = req.query;
    console.log(req.query);

    const url = `https://www.swiggy.com/dapi/menu/pl?page-type=${page_type}&complete-menu=${complete_menu}&lat=${lat}&lng=${lng}&submitAction=${submitAction}&restaurantId=${restaurantId}`;

    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

app.get('/', (req, res) => {
    res.json({ "test": "Welcome to ApnaKitchen! - See Live Web URL for this Server - https://apnakitchenlive.onrender.com" });
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
