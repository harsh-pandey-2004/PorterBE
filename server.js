// app.js
require("dotenv").config();

const express = require('express');
const connectDB = require('./config/db'); // Import the database connection
const authRoutes = require('./routes/authRoutes');

const app = express();

// Connect to the database
connectDB();

app.use(express.json());
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
