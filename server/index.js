const express = require('express');
const connectDB = require('./database/db');

require('dotenv').config();

const app = express();

app.use(express.json());

// Connect to the database
connectDB();


app.listen(process.env.PORT, () => {
    console.log(`Server is running on Port ${process.env.PORT}`);
});