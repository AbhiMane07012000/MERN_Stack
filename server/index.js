const express = require('express');
const {connectDB} = require('./database/db');
const cors = require('cors');
const transactionRoute = require('./routes/transactionRoute');

require('dotenv').config();


const app = express();
app.use(cors()); 
app.use(express.json());

// Connect to the database
connectDB();

app.use('/api', transactionRoute);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on Port ${process.env.PORT}`);
});