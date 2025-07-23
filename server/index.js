require('dotenv').config();
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const citiesRoutes = require('./routes/cities');

// Connect to Database
connectDB();

const app = express();

// Init Middleware
app.use(cors({
  origin: 'https://t-finder-ani.vercel.app',
  credentials: true
}));
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

// Test route
app.get('/test', (req, res) => res.send('test ok'));


// Define Routes
app.use('/api/categories', require('./routes/categories'));
app.use('/api/technicians', require('./routes/technicians'));
app.use('/api/users', require('./routes/users'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/cities', citiesRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
