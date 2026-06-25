const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db.js');

// import route files
const authRoutes = require('./src/routes/authRoutes.js');
const itineraryRoutes = require('./src/routes/itineraryRoutes.js');

// load environment variables
dotenv.config();

// connect to mongodb atlas database
connectDB();

const app = express();

// standard middlewares
app.use(cors());
app.use(express.json());

// link routes to express application
app.use('/api/auth', authRoutes);
app.use('/api/itinerary', itineraryRoutes);

// basic route to test server health
app.get('/', (req, res) => {
  res.send('Trip AI Backend API is running successfully...');
});

// define port and start listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});