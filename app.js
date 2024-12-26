const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const borrowerRoutes = require('./routes/borrowerRoutes');

dotenv.config(); // Load environment variables from .env file
connectDB(); // Connect to MongoDB

const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests

// Routes
app.use('/api/borrower', borrowerRoutes);

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
