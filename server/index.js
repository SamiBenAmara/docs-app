require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;

db.on('error', (error) => console.log(error));

db.once('open', () => console.log('Connected to Database'));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());
app.use(cors());

const userRoutes = require('./routes/user');
const fileRoutes = require('./routes/file');
app.use('/docs/user', userRoutes);
app.use('/docs/file', fileRoutes);

// const docRoutes = require('./routes/doc');
// app.use('/doc', docRoutes);

app.listen(5000, () => console.log('Server Started'));