const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const axios = require('axios');

// Load environment variables from .env file
dotenv.config();

// Log .env status (do not log secrets)
console.log('--- ENV CHECK ---');
console.log('PORT:', process.env.PORT);
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'set' : 'NOT SET');
console.log('AI_SERVICE_URL:', process.env.AI_SERVICE_URL ? 'set' : 'NOT SET');
console.log('AI_API_KEY:', process.env.AI_API_KEY ? 'set' : 'NOT SET');
console.log('BLOCKCHAIN_RPC_URL:', process.env.BLOCKCHAIN_RPC_URL ? 'set' : 'NOT SET');
console.log('MARKETPLACE_CONTRACT_ADDRESS:', process.env.MARKETPLACE_CONTRACT_ADDRESS ? 'set' : 'NOT SET');
console.log('CW20_CONTRACT_ADDRESS:', process.env.CW20_CONTRACT_ADDRESS ? 'set' : 'NOT SET');
console.log('CW721_CONTRACT_ADDRESS:', process.env.CW721_CONTRACT_ADDRESS ? 'set' : 'NOT SET');
console.log('SPLITTER_CONTRACT_ADDRESS:', process.env.SPLITTER_CONTRACT_ADDRESS ? 'set' : 'NOT SET');
console.log('------------------');

// MongoDB connection
if (process.env.DATABASE_URL) {
  mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.warn('DATABASE_URL not set in .env');
}

// Test AI API connection
if (process.env.AI_SERVICE_URL && process.env.AI_API_KEY) {
  axios.post(process.env.AI_SERVICE_URL, { inputs: "Test" }, {
    headers: { Authorization: `Bearer ${process.env.AI_API_KEY}` }
  })
    .then(() => console.log('AI API reachable'))
    .catch(() => console.warn('AI API not reachable or invalid key'));
} else {
  console.warn('AI_SERVICE_URL or AI_API_KEY not set in .env');
}

// Test Blockchain RPC connection
if (process.env.BLOCKCHAIN_RPC_URL) {
  axios.get(process.env.BLOCKCHAIN_RPC_URL)
    .then(() => console.log('Blockchain RPC reachable'))
    .catch(() => console.warn('Blockchain RPC not reachable'));
} else {
  console.warn('BLOCKCHAIN_RPC_URL not set in .env');
}

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/properties', require('./routes/properties'));
app.use('/api/marketplace', require('./routes/marketplace'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/user', require('./routes/user'));
app.use('/api/revenue', require('./routes/revenue'));

app.get('/', (req, res) => {
  res.send('PropChain Backend API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
