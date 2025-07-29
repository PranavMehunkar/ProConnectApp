// src/utils/axios.js
import axios from 'axios';

const clientServer = axios.create({
  baseURL: 'http://localhost:9090',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default clientServer;
