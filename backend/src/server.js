// require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/UserRoute');
const employeeRoutes = require('./routes/EmployeeRoute');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/emp', employeeRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'COMP3123 Assignment 2 - backend is running' });
});

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/comp3123_assignment2';

mongoose
    .connect(mongoUri)
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch((err) => console.log('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
module.exports = app;
app.listen(PORT, () => console.log('Backend running on port ' + PORT));