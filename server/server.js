const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const contactRoutes = require('./routes/contactRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', contactRoutes);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/contactmanager')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));