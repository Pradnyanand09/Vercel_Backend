require('dotenv').config();
const express = require('express');
const mongoose = require('./config/db');
const cors = require('cors');
const app = express();

// Update CORS configuration
app.use(cors({
  origin: ['https://vercel-frontend-roan.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Add this root route handler
app.get('/', (req, res) => {
  res.json({ 
    message: 'API server is running', 
    endpoints: [
      '/api/songs - GET all songs',
      '/api/songs/:id - GET, PUT, DELETE specific song'
    ]
  });
});

const songRoutes = require('./routes/songRoutes');
app.use('/api/songs', songRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));