const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// API routes would go here in a real application
// Example product API endpoint
app.get('/api/products', (req, res) => {
    res.json([
        {
            id: 1,
            name: 'Ultra Slim Laptop',
            price: 899.99,
            category: 'Electronics',
            image: 'https://source.unsplash.com/random/300x300/?laptop'
        },
        {
            id: 2,
            name: 'Wireless Headphones',
            price: 199.99,
            category: 'Electronics',
            image: 'https://source.unsplash.com/random/300x300/?headphones'
        }
    ]);
});

// Handle 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
});