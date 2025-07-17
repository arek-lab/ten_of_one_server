const axios = require('axios');

const { QDRANT_API_KEY, QDRANT_URL } = process.env;

const qdrantClient = axios.create({
  baseURL: QDRANT_URL,
  headers: QDRANT_API_KEY ? { Authorization: `Bearer ${QDRANT_API_KEY}` } : {},
  //timeout: 5000, // opcjonalnie
});

module.exports = qdrantClient;
